const chalk = require("chalk");
const ValidationTypes = require("../source-codes/validation-types");
const { UuCommand } = require("../uu-app-model-kit");
const CompareTools = require("./compare-tools");

const ValTypesMapMessages = {
  mappingsJson: "Application validation types:     ",
  appModelKit: "uuAppModelKit validation types:   ",
};

async function mapAppModelKit() {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  for (let uc of Object.keys(mmdCommands)) {
    ucMap[uc] = await mmdCommands[uc].getValidationType();
  }
  return ucMap;
}

class CompareValidations {
  async process() {
    console.log("Comparing validations from inner script");

    let valTypesMap = {
      appSource: ValidationTypes.load(),
      appModelKit: await mapAppModelKit(),
    };

    CompareTools.compareValidationTypeLists(valTypesMap, ValTypesMapMessages);
  }
}

module.exports = CompareValidations;
