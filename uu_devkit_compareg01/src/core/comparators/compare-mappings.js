const chalk = require("chalk");
const MappingsJson = require("../source-codes/mappings-json");
const { UuCommand } = require("../uu-app-model-kit");
const CompareTools = require("./compare-tools");

const UcMapMessages = {
  mappingsJson: "Mappings.json use cases:    ",
  appModelKit: "uuAppModelKit use cases:    ",
};

async function mapAppModelKit() {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  for (let uc of Object.keys(mmdCommands)) {
    ucMap[uc] = mmdCommands[uc].getAttributes().type;
  }
  return ucMap;
}

function compareUcMethods(ucMethodMap) {
  const allUcList = CompareTools.getAllUcList(ucMethodMap);
  let { mappingsJson, appModelKit } = ucMethodMap;

  allUcList.forEach((appUc) => {
    let mappingsMethod = mappingsJson[appUc];
    let appModelKitMethod = appModelKit[appUc];
    if (mappingsMethod !== appModelKitMethod) {
      console.log(chalk.red.underline.bold("Differences found for use case: " + appUc));
      console.log("Mappings.json use case method:  " + (mappingsMethod || ""));
      console.log("uuAppModelKit use case method:  " + (appModelKitMethod || ""));
      console.log("");
    }
  });
}

class CompareMappings {
  async process() {
    console.log("Checking mappings differences.");

    // read all method maps from sources
    let ucMethodMap = {
      mappingsJson: MappingsJson.getUcMethodMap(),
      appModelKit: await mapAppModelKit(),
    };

    // compare use case lists
    CompareTools.compareUseCaseLists(ucMethodMap, UcMapMessages);

    // compare command methods
    compareUcMethods(ucMethodMap);

    console.log("Mappings differences processed.");
  }
}

module.exports = CompareMappings;
