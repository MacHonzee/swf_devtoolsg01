const chalk = require("chalk");

const CompareTools = {
  getArraysDiff(...arrays) {
    let differences = new Set();
    for (let i = 0; i < arrays.length; i++) {
      let secondIndex = i === arrays.length - 1 ? i + 1 : 0; // compare with next array, or last array with first
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
};

module.exports = CompareTools;
