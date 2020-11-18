const chalk = require("chalk");

const CompareTools = {
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
    let ucLists = {};
    Object.keys(useCaseMap).forEach((ucTypeMap) => {
      ucLists[ucTypeMap] = Object.keys(useCaseMap[ucTypeMap]).sort();
    });
    let ucInequals = CompareTools.getArraysDiff(...Object.values(ucLists));

    if (ucInequals.length > 0) {
      console.log(chalk.red.underline.bold("Use case list does not match!"));
      Object.keys(useCaseMap).forEach((ucTypeMap) => {
        console.log(msgConfig[ucTypeMap] + CompareTools.highlightDiff(ucLists[ucTypeMap], ucInequals));
      });
      console.log("\n");
    } else {
      console.log(chalk.green("Use case list matches."));
    }
  },

  getAllUcList(ucProfileMap) {
    let allUcList = new Set();
    Object.values(ucProfileMap).forEach((ucMap) => {
      Object.keys(ucMap).forEach((uc) => allUcList.add(uc));
    });
    return Array.from(allUcList);
  },
};

module.exports = CompareTools;
