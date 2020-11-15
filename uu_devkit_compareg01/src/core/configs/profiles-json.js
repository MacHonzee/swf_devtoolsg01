const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FilePath = ["app", "config", "profiles.json"];

const ProfilesJson = {
  load() {
    let profileJsonPath = path.join(ServerRoot.root, ...FilePath);
    return JSON.parse(fs.readFileSync(profileJsonPath));
  },
};

module.exports = ProfilesJson;
