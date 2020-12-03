const path = require("path");

const ServerSuffix = "-server";
const PossiblePaths = [["."], [".."], ["..", ".."], ["..", "..", ".."]];

// TODO enable setting server root as a parameter from console, for example
// npm run compareDoc --root=../..
const ServerRoot = {
  _serverRoot: null,

  get root() {
    if (this._serverRoot) return this._serverRoot;

    let current = process.cwd();
    if (current.endsWith(ServerSuffix)) {
      this._serverRoot = current;
      return this._serverRoot;
    }

    for (let pathPart of PossiblePaths) {
      let fullPath = path.join(current, ...pathPart);
      let dirName = path.resolve(fullPath);
      if (dirName.endsWith(ServerSuffix)) {
        this._serverRoot = dirName;
        return this._serverRoot;
      }
    }

    throw new Error(`Invalid working directory (${current}) -> application server root was not found.`);
  },
};

module.exports = ServerRoot;
