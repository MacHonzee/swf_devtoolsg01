const chalk = require("chalk");
const ValidationTypes = require("../source-codes/validation-types");
const { UuCommand } = require("../uu-app-model-kit");
const Tools = require("./tools");

const ValTypesMapMessages = {
  appSource: "Application validation types:     ",
  appModelKit: "uuAppModelKit validation types:   ",
};

async function mapAppModelKit() {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  for (let uc of Object.keys(mmdCommands)) {
    let valType = await mmdCommands[uc].getValidationTypes();
    if (valType) {
      Object.keys(valType.parts).forEach((validationName) => {
        ucMap[validationName] = valType.parts[validationName].trimmed;
      });
    }
  }
  return ucMap;
}

function compareValidationTypes(valTypesMap) {
  const allValidationsList = Tools.getAllUcList(valTypesMap);
  let { appSource, appModelKit } = valTypesMap;

  allValidationsList.forEach((validation) => {
    let appSourceValidation = appSource[validation];
    let appModelKitValidation = appModelKit[validation];
    if (appSourceValidation !== appModelKitValidation) {
      console.log(chalk.red.underline.bold("Differences found for validation type: " + validation));
      console.log("Validation from source code:    " + (appSourceValidation || ""));
      console.log("Validation from uuAppModelKit:  " + (appModelKitValidation || ""));
      console.log("");
    }
  });
}

class CompareValidations {
  async process() {
    console.log("Checking validation types differences.");

    let valTypesMap = {
      appSource: ValidationTypes.load(),
      appModelKit: await mapAppModelKit(),
    };

    Tools.compareValidationTypeLists(valTypesMap, ValTypesMapMessages);

    compareValidationTypes(valTypesMap);

    console.log("Validation types differences processed.");
  }
}

module.exports = CompareValidations;
