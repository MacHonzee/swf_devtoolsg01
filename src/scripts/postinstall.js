const PackageJson = require("../core/source-codes/package-json");
const CompareConfig = require("../core/source-codes/compare-config");

const ScriptId = "compareDoc";
const ScriptBin = "swf_devtoolsg01_compare_doc all";

function postinstall() {
  console.log("Running postinstall script from swf_devtoolsg01.");

  let pkgJsonPath = PackageJson.findPkgJsonPath();
  if (!pkgJsonPath) {
    console.error(
      `Package.json was not found, please add this script into scripts manually: "${ScriptId}": "${ScriptBin}"`
    );
    return;
  }

  let isUpdated = false;
  PackageJson.updatePkgJson(pkgJsonPath, (pkgJson) => {
    if (!pkgJson.scripts[ScriptId]) {
      isUpdated = true;
      console.log("Updating scripts configuration in package.json.");
      pkgJson.scripts[ScriptId] = ScriptBin;
    }
  });
  if (isUpdated) {
    console.log(`Scripts successfully updated, added: "${ScriptId}": "${ScriptBin}"\n`);
  }

  let newCompareConfig = CompareConfig.generate();
  if (newCompareConfig) {
    console.log(`Generated compare-config.js to path: ${newCompareConfig} \n`);
  }
}

postinstall();
