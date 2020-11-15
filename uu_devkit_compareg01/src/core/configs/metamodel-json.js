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
};

module.exports = MetamodelJson;
