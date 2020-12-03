const chalk = require("chalk");

function compareLists(useCaseMap, msgConfig, msgHeader) {
  let ucLists = {};
  Object.keys(useCaseMap).forEach((ucTypeMap) => {
    ucLists[ucTypeMap] = Object.keys(useCaseMap[ucTypeMap]).sort();
  });
  let ucInequals = Tools.getArraysDiff(...Object.values(ucLists));

  if (ucInequals.length > 0) {
    console.log(chalk.red.underline.bold(msgHeader + " does not match!"));
    Object.keys(useCaseMap).forEach((ucTypeMap) => {
      console.log(msgConfig[ucTypeMap] + Tools.highlightDiff(ucLists[ucTypeMap], ucInequals));
    });
    console.log("\n");
  } else {
    console.log(chalk.green(msgHeader + " matches."));
  }
}

const Tools = {
  getArraysDiff(...arrays) {
    let differences = new Set();
    for (let i = 0; i < arrays.length; i++) {
      let secondIndex = i === arrays.length - 1 ? 0 : i + 1; // compare with next array, or last array with first
      let firstArr = arrays[i];
      let secondArr = arrays[secondIndex];
      firstArr.forEach((val) => secondArr.indexOf(val) === -1 && differences.add(val));
    }
    return Array.from(differences);
  },

  highlightDiff(array, inequals) {
    return array
      .map((item) => {
        if (inequals.includes(item)) {
          return chalk.red(item);
        } else {
          return chalk.green(item);
        }
      })
      .join(", ");
  },

  compareUseCaseLists(useCaseMap, msgConfig) {
    compareLists(useCaseMap, msgConfig, "Use case list");
  },

  compareValidationTypeLists(valTypesMap, msgConfig) {
    compareLists(valTypesMap, msgConfig, "Validation types list");
  },

  compareErrorLists(errorsMap, msgConfig) {
    compareLists(errorsMap, msgConfig, "Errors list");
  },

  compareWarningLists(warningsMap, msgConfig) {
    compareLists(warningsMap, msgConfig, "Warnings list");
  },

  compareDaoLists(daoMap, msgConfig) {
    compareLists(daoMap, msgConfig, "Dao list");
  },

  getAllUcList(ucProfileMap) {
    let allUcList = new Set();
    Object.values(ucProfileMap).forEach((ucMap) => {
      Object.keys(ucMap).forEach((uc) => allUcList.add(uc));
    });
    return Array.from(allUcList);
  },
};

module.exports = Tools;
