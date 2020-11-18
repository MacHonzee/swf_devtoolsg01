const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const FilePath = ["app", "config", "mappings.json"];

class MappingsJson {
  constructor() {
    this._mappingsJson = null;
  }

  load() {
    if (this._mappingsJson) return this._mappingsJson;
    let mappingsJsonPath = path.join(ServerRoot.root, ...FilePath);
    this._mappingsJson = JSON.parse(fs.readFileSync(mappingsJsonPath));
    return this._mappingsJson;
  }

  // TODO backlog - add support for Spp check
  getUcMethodMap() {
    let mappings = this.load();
    let ucMethodMap = {};
    let ucMap = mappings["{vendor}-{uuApp}-{uuSubApp}"].useCaseMap;
    Object.keys(ucMap).forEach((uc) => {
      if (ucMap[uc].type === "CMD") ucMethodMap[uc] = ucMap[uc].httpMethod;
    });
    return ucMethodMap;
  }
}

module.exports = new MappingsJson();
