const chalk = require("chalk");
const Daos = require("../source-codes/daos");
const { UuSchema } = require("../uu-app-model-kit");
const Tools = require("./tools");

const DaosMapMessages = {
  appSource: "Application Daos:     ",
  appModelKit: "uuAppModelKit Daos:   ",
};

async function mapAppModelKit() {
  let schemas = await UuSchema.getSchemaMap();
  let schemaMap = {};
  for (let schema of Object.keys(schemas)) {
    schemaMap[schema] = {
      limits: await schemas[schema].getLimits(),
      methods: await schemas[schema].getDaoMethods(),
      indexes: await schemas[schema].getIndexes(),
    };
  }
  return schemaMap;
}

function getLimitsString(dao) {
  return Object.keys(dao.limits).map((limit) => `${limit}: ${dao.limits[limit]}`);
}

function getObviousIndexes(dao) {
  return dao.indexes.map((index) => `"${index}"`);
}

function compareDaos(daosMap) {
  const allDaosList = Tools.getAllUcList(daosMap);
  let { appSource, appModelKit } = daosMap;

  allDaosList.forEach((dao) => {
    let appSourceDao = appSource[dao];
    let appModelDao = appModelKit[dao];
    if (appSourceDao && appModelDao) {
      let appSourceLimits = getLimitsString(appSourceDao);
      let appModelLimits = getLimitsString(appModelDao);

      let limitsDiff = Tools.getArraysDiff(appSourceLimits, appModelLimits);
      if (limitsDiff.length > 0) {
        console.log(chalk.red.underline.bold("Differences in limits found for dao: " + dao));
        console.log("Dao limits from source code:    " + Tools.highlightDiff(appSourceLimits, limitsDiff));
        console.log("Dao limits from uuAppModelKit:  " + Tools.highlightDiff(appModelLimits, limitsDiff));
        console.log("");
      }

      // FIXME this is strange, check this:
      // Dao indexes from source code:    unique awid, personalCardId, unique awid, uuIdentity
      // Dao indexes from uuAppModelKit:  unique awid, id, unique awid, personalCardId, uuIdentity
      let obviousAppSourceIndexes = getObviousIndexes(appSourceDao);
      let obviousAppModelIndexes = getObviousIndexes(appModelDao);
      let indexesDiff = Tools.getArraysDiff(obviousAppSourceIndexes, obviousAppModelIndexes);
      if (indexesDiff.length > 0) {
        console.log(chalk.red.underline.bold("Differences in indexes found for dao: " + dao));
        console.log("Dao indexes from source code:    " + Tools.highlightDiff(obviousAppSourceIndexes, indexesDiff));
        console.log("Dao indexes from uuAppModelKit:  " + Tools.highlightDiff(obviousAppModelIndexes, indexesDiff));
        console.log("");
      }

      let methodsDiff = Tools.getArraysDiff(appSourceDao.methods, appModelDao.methods);
      if (methodsDiff.length > 0) {
        console.log(chalk.red.underline.bold("Differences in methods found for dao: " + dao));
        console.log("Dao methods from source code:    " + Tools.highlightDiff(appSourceDao.methods, methodsDiff));
        console.log("Dao methods from uuAppModelKit:  " + Tools.highlightDiff(appModelDao.methods, methodsDiff));
        console.log("");
      }
    }
  });
}

class CompareDaos {
  async process() {
    console.log("Checking Dao differences.\n");

    let daosMap = {
      appSource: Daos.load(),
      appModelKit: await mapAppModelKit(),
    };

    Tools.compareDaoLists(daosMap, DaosMapMessages);

    compareDaos(daosMap);

    console.log("Dao differences processed.\n");
  }
}

module.exports = CompareDaos;
