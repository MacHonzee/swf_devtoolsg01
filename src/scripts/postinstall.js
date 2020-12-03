const PackageJson = require("../core/source-codes/package-json");
const CompareConfig = require("../core/source-codes/compare-config");

const ScriptId = "compareDoc";
const ScriptBin = "swf_devtoolsg01";

function postinstall() {
  if (process.cwd().endsWith(ScriptBin)) return null; // do not do self-install

  let pkgJsonPath = PackageJson.findPkgJsonPath();
  if (!pkgJsonPath) {
    console.error(
      `Package.json was not found, please add this script into scripts manually: "${ScriptId}": "${ScriptId} all"`
    );
    return;
  }

  let isUpdated = false;
  PackageJson.updatePkgJson(pkgJsonPath, (pkgJson) => {
    if (!pkgJson.scripts[ScriptId]) {
      isUpdated = true;
      console.log("Updating scripts configuration in package.json.");
      pkgJson.scripts[ScriptId] = ScriptId + " all";
    }
  });
  if (isUpdated) {
    console.log(`Scripts successfully updated, added: "${ScriptId}": "${ScriptBin} all"\n`);
  }

  let newCompareConfig = CompareConfig.generate();
  if (newCompareConfig) {
    console.log(`Generated compare-config.js to path: "${newCompareConfig}"\n`);
  }
}

postinstall();
