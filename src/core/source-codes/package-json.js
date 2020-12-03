const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FileName = "package.json";

const PackageJson = {
  findPkgJsonPath() {
    let serverRoot = ServerRoot.root;
    let pkgJsonPath = path.join(serverRoot, FileName);
    return fs.existsSync(pkgJsonPath) && pkgJsonPath;
  },

  updatePkgJson(pkgJsonPath, callback) {
    if (!pkgJsonPath) pkgJsonPath = this.findPkgJsonPath();
    let pkgJson = this.load(pkgJsonPath);

    callback(pkgJson);

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n", "utf-8");
  },

  load(pkgJsonPath) {
    if (!pkgJsonPath) pkgJsonPath = this.findPkgJsonPath();
    return JSON.parse(fs.readFileSync(pkgJsonPath));
  },
};

module.exports = PackageJson;
