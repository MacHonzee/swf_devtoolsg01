const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const WarningsPath = ["app", "api", "warnings"];

const UnsupportedKeysWarnCode = "unsupportedKeys";
const DefaultUnsupportedKeysWarnMsg = "DtoIn contains unsupported keys.";

function addWarningToMap(warningMap, warning, warningFile, warningFilePath) {
  let code = warning.code || warning.CODE;
  let message = warning.message || warning.MESSAGE;
  if (!message && code.endsWith(UnsupportedKeysWarnCode)) {
    message = DefaultUnsupportedKeysWarnMsg;
  }
  warningMap[code] = {
    source: { path: warningFilePath, name: warningFile, sourceType: "file" },
    message,
  };
  return warningMap;
}

// TODO prepare this for the old way of defining warnings too, in the Abls in WARNING constant
class Warnings {
  constructor() {
    this._warnings = null;
  }

  load() {
    if (this._warnings) return this._warnings;
    let warningsPath = path.join(ServerRoot.root, ...WarningsPath);
    this._warnings = {};
    if (!fs.existsSync(warningsPath)) return this._warnings;

    fs.readdirSync(warningsPath).forEach((warningFile) => {
      let warningFilePath = path.join(warningsPath, warningFile);
      let warnings = require(warningFilePath);

      // currently, we check only first two levels of nestings to match
      Object.keys(warnings).forEach((firstWarnName) => {
        let firstLevel = warnings[firstWarnName];
        if (firstLevel.code || firstLevel.CODE) {
          this._warnings = addWarningToMap(this._warnings, firstLevel, warningFile, warningFilePath);
        } else {
          Object.keys(firstLevel).forEach((secondWarnName) => {
            let secondLevel = firstLevel[secondWarnName];
            this._warnings = addWarningToMap(this._warnings, secondLevel, warningFile, warningFilePath);
          });
        }
      });
    });
    return this._warnings;
  }
}

module.exports = new Warnings();
