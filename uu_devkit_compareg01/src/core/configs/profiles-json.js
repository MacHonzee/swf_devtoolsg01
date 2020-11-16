const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FilePath = ["app", "config", "profiles.json"];

const SkippedUcProfiles = ["defaultUve", "sys/uuAppWorkspace/initUve"];

const ProfilesJson = {
  load() {
    let profileJsonPath = path.join(ServerRoot.root, ...FilePath);
    return JSON.parse(fs.readFileSync(profileJsonPath));
  },

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
  },
};

module.exports = ProfilesJson;
