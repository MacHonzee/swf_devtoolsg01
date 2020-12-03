const chalk = require("chalk");
const MappingsJson = require("../source-codes/mappings-json");
const { UuCommand } = require("../uu-app-model-kit");
const Tools = require("./tools");

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
  const allUcList = Tools.getAllUcList(ucMethodMap);
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
    console.log("Checking mappings differences.\n");

    // read all method maps from sources
    let ucMethodMap = {
      mappingsJson: MappingsJson.getUcMethodMap(),
      appModelKit: await mapAppModelKit(),
    };

    // compare use case lists
    Tools.compareUseCaseLists(ucMethodMap, UcMapMessages);

    // compare command methods
    compareUcMethods(ucMethodMap);

    console.log("Mappings differences processed.\n");
  }
}

module.exports = CompareMappings;
