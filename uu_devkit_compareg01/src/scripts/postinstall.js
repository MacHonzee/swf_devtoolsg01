const PackageJson = require("../core/source-codes/package-json");

const ScriptId = "compareDoc";
const ScriptBin = "uu_devkit_compareg01";

function postinstall() {
  if (process.cwd().endsWith(ScriptBin)) return null; // do not do self-install

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

  // TODO generate compare-config.js from some template
}

postinstall();
