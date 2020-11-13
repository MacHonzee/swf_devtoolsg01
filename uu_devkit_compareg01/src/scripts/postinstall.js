const fs = require("fs");
const path = require("path");

const PossiblePkgJsonPaths = ["../..", "..", "."];

const ScriptId = "compareDoc";
const ScriptBin = "uu_devkit_compareg01";

function findPkgJsonPath() {
  let foundPath;
  let cwd = process.cwd("");
  for (let pathPart of PossiblePkgJsonPaths) {
    let pkgJsonPath = path.join(cwd, pathPart, "package.json");
    if (fs.existsSync(pkgJsonPath)) {
      foundPath = pkgJsonPath;
      break;
    }
  }

  if (!foundPath) {
    console.error(
      `Package.json was not found, please add this script into scripts manually: "${ScriptId}": "${ScriptBin}"`
    );
  }
  return foundPath;
}

function postinstall() {
  let pkgJsonPath = findPkgJsonPath();
  if (!pkgJsonPath) return;

  let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
  if (!pkgJson.scripts[ScriptId]) {
    console.log("Updating scripts configuration in package.json.");
    pkgJson.scripts[ScriptId] = ScriptBin;
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify(pkgJson, null, 2) + "\n",
      "utf-8"
    );
    console.log(
      `Scripts successfully updated, added: "${ScriptId}": "${ScriptBin}"\n`
    );
  }
}

postinstall();
