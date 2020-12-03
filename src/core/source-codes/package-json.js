const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FileName = "package.json";

// TODO test this if it stillworks from the post-install script
const PackageJson = {
  findPkgJsonPath() {
    let serverRoot = ServerRoot.root;
    let pkgJsonPath = path.join(serverRoot, FileName);
    if (!fs.existsSync(pkgJsonPath)) {
      pkgJsonPath = undefined;
    }
    return pkgJsonPath;
  },

  updatePkgJson(pkgJsonPath, callback) {
    if (!pkgJsonPath) pkgJsonPath = this.findPkgJsonPath();
    let pkgJson = this.load(pkgJsonPath);

    callback(pkgJsonPath);

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n", "utf-8");
  },

  load(pkgJsonPath) {
    if (!pkgJsonPath) pkgJsonPath = this.findPkgJsonPath();
    return JSON.parse(fs.readFileSync(pkgJsonPath));
  },
};

module.exports = PackageJson;
