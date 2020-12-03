const CompareDaos = require("./compare-daos");
const CompareErrorsAndWarnings = require("./compare-errors-and-warnings");
const CompareMappings = require("./compare-mappings");
const CompareProfiles = require("./compare-profiles");
const CompareValidations = require("./compare-validations");
const CompareConfig = require("../source-codes/compare-config");

class CompareAll {
  async process() {
    console.log("Comparing differences between source codes and uuAppModelKit.");

    CompareConfig.load();

    await new CompareDaos().process();
    await new CompareErrorsAndWarnings().process();
    await new CompareMappings().process();
    await new CompareProfiles().process();
    await new CompareValidations().process();

    console.log("All differences processed.");
  }
}

module.exports = CompareAll;
