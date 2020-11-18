const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FilePath = ["app", "config", "profiles.json"];

const SkippedUcProfiles = ["defaultUve", "sys/uuAppWorkspace/initUve"];

class ProfilesJson {
  constructor() {
    this._profilesJson = null;
  }

  load() {
    if (this._profilesJson) return this._profilesJson;
    let profileJsonPath = path.join(ServerRoot.root, ...FilePath);
    this._profilesJson = JSON.parse(fs.readFileSync(profileJsonPath));
    return this._profilesJson;
  }

  getUcProfileMap() {
    let profileJson = this.load();
    let ucMap = {};
    Object.keys(profileJson["*"].useCaseMap).forEach((uc) => {
      if (SkippedUcProfiles.includes(uc)) return;

      let profileUc = profileJson["*"].useCaseMap[uc];
      if (profileUc.profileList) {
        ucMap[uc] = profileUc.profileList;
      } else {
        ucMap[uc] = profileUc;
      }
    });
    return ucMap;
  }
}

module.exports = new ProfilesJson();
