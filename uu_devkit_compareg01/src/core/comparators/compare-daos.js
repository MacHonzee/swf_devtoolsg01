const Daos = require("../source-codes/daos");
const { UuSchema } = require("../uu-app-model-kit");

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

class CompareDaos {
  async process() {
    console.log("Checking Dao differences.");

    let daosMap = {
      appSource: Daos.load(),
      appModelKit: await mapAppModelKit(),
    };
    debugger;
  }
}

module.exports = CompareDaos;
