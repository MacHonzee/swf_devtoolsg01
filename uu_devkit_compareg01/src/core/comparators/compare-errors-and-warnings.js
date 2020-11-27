const chalk = require("chalk");
const Errors = require("../source-codes/errors");
const Warnings = require("../source-codes/warnings");
const { UuCommand } = require("../uu-app-model-kit");
const CompareTools = require("./compare-tools");

const ErrorsMapMessages = {
  appSource: "Application errors:     ",
  appModelKit: "uuAppModelKit errors:   ",
};

const WarningsMapMessages = {
  appSource: "Application warnings:     ",
  appModelKit: "uuAppModelKit warnings:   ",
};

async function mapAppModelKit(type) {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  for (let uc of Object.keys(mmdCommands)) {
    let loadMethod = type === "error" ? "getErrors" : "getWarnings";
    let cmdErrMap = await mmdCommands[uc][loadMethod]();
    Object.assign(ucMap, cmdErrMap);
  }
  return ucMap;
}

function compareMessages(errorsMap, msgPrefix) {
  const allUcList = CompareTools.getAllUcList(errorsMap);
  let { appSource, appModelKit } = errorsMap;

  allUcList.forEach((appUc) => {
    let appSourceMsg = appSource[appUc];
    let appModelKitMsg = appModelKit[appUc];
    if (appSourceMsg !== appModelKitMsg) {
      console.log(chalk.red.underline.bold("Differences found for use case: " + appUc));
      console.log(msgPrefix + " from source code:    " + (appSourceMsg || ""));
      console.log(msgPrefix + " from uuAppModelKit:  " + (appModelKitMsg || ""));
      console.log("");
    }
  });
}

class CompareErrorsAndWarnings {
  async process() {
    console.log("Checking errors and warnings differences.");

    let errorsMap = {
      appSource: Errors.load(),
      appModelKit: await mapAppModelKit("error"),
    };
    let warningsMap = {
      appSource: Warnings.load(),
      appModelKit: await mapAppModelKit("warning"),
    };

    CompareTools.compareErrorLists(errorsMap, ErrorsMapMessages);
    CompareTools.compareWarningLists(warningsMap, WarningsMapMessages);

    compareMessages(errorsMap, "Errors");
    compareMessages(warningsMap, "Warnings");

    console.log("Error and warning differences processed.");
  }
}

module.exports = CompareErrorsAndWarnings;
