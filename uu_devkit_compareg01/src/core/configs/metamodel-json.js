const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const PossibleFilePaths = [
  ["app", "config", "metamodel"],
  ["app", "env", "metamodel"],
];

const MetamodelJson = {
  load() {
    for (let mmdPath of PossibleFilePaths) {
      let metamodelPath = path.join(ServerRoot.root, ...mmdPath);
      if (fs.existsSync(metamodelPath)) {
        const mmdFiles = fs.readdirSync(metamodelPath);
        let awscFile = mmdFiles.find((file) => !file.startsWith("type-"));
        return JSON.parse(fs.readFileSync(path.join(metamodelPath, awscFile)));
      }
    }
  },

  getUcProfileMap() {
    let mmdJson = this.load();
    if (!mmdJson) return;

    const appCode = mmdJson.code;
    const mmdProfiles = mmdJson.profileList.map((prof) => prof.code);
    let ucMap = {};
    Object.entries(mmdJson.useCaseProfileMap).forEach(([fullUc, profileString]) => {
      if (!fullUc.includes(appCode)) return;

      const uc = fullUc.replace(appCode + "/", "");
      const ucProfiles = [];
      profileString.split("").forEach((char, i) => char === "1" && ucProfiles.push(mmdProfiles[i]));
      ucMap[uc] = ucProfiles;
    });
    return ucMap;
  },
};

module.exports = MetamodelJson;
