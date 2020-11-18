const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const PossibleFilePaths = [
  ["app", "config", "metamodel"],
  ["env", "metamodel"],
];

function processUcProfileMap(ucMap, appType, appCode, mmdProfiles) {
  Object.entries(appType.useCaseProfileMap).forEach(([fullUc, profileStrings]) => {
    if (!fullUc.includes(appCode)) return;

    const uc = fullUc.replace(appCode + "/", "");
    const ucProfiles = [];
    let profileString = profileStrings;
    if (Array.isArray(profileStrings)) {
      profileString = profileStrings[0];
    }
    profileString.split("").forEach((char, i) => char === "1" && ucProfiles.push(mmdProfiles[i]));
    ucMap[uc] = ucProfiles;
  });
  return ucMap;
}

class MetamodelJson {
  constructor() {
    this._mmdFldPath = null;
    this._mmd = null;
    this._appTypes = null;
  }

  loadMmdPath() {
    if (this._mmdFldPath) return this._mmdFldPath;
    for (let mmdPath of PossibleFilePaths) {
      let metamodelPath = path.join(ServerRoot.root, ...mmdPath);
      if (fs.existsSync(metamodelPath)) {
        this._mmdFldPath = metamodelPath;
        return this._mmdFldPath;
      }
    }
  }

  load() {
    if (this._mmd) return this._mmd;
    let mmdFldPath = this.loadMmdPath();
    if (mmdFldPath) {
      const mmdFiles = fs.readdirSync(mmdFldPath);
      this._appTypes = [];
      mmdFiles.forEach((file) => {
        let parsedFile = JSON.parse(fs.readFileSync(path.join(mmdFldPath, file)));
        if (!file.startsWith("type-")) {
          this._mmd = parsedFile;
        } else {
          this._appTypes.push(parsedFile);
        }
      });
      return this._mmd;
    }
  }

  loadAppTypes() {
    if (this._appTypes) return this._appTypes;
    this.load();
    return this._appTypes;
  }

  getUcProfileMap() {
    let mmdJson = this.load();
    if (!mmdJson) return;

    let ucMap = {};
    const appCode = mmdJson.code;
    const mmdProfiles = mmdJson.profileList.map((prof) => prof.code);
    ucMap = processUcProfileMap(ucMap, mmdJson, appCode, mmdProfiles);
    this.loadAppTypes().forEach((appType) => {
      ucMap = processUcProfileMap(ucMap, appType, appCode, mmdProfiles);
    });
    return ucMap;
  }
}

module.exports = new MetamodelJson();
