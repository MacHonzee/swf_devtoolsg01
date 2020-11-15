const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FileName = "uuapp.json";

const UuAppJson = {
  load() {
    let uuAppJsonPath = path.join(ServerRoot.root, "..", FileName);
    return JSON.parse(fs.readFileSync(uuAppJsonPath));
  },
};

module.exports = UuAppJson;
