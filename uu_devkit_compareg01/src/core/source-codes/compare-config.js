const path = require("path");
const fs = require("fs");
const ServerRoot = require("./server-root");

const CompareConfigPathParts = ["env", "compare-config.js"];

function loadConfigFile() {
  let configPath = path.join(ServerRoot.root, ...CompareConfigPathParts);
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = require(configPath);
    } catch (e) {
      console.warn("Unable to load compare config from path: " + configPath);
      console.warn(e);
    }
  }
  return config;
}

// TODO add some default configuration parameters (overriding of default behaviour)
function getDefaults() {
  return {
    isUsed: () => {},
    defaultLanguage: "en",
  };
}

// TODO it needs recursive merge of objects
function mergeConfigs(appConfig, defaultConfig) {
  return Object.assign({}, defaultConfig, appConfig);
}

const CompareConfig = {
  _config: false, // just for caching

  load(reload) {
    if (this._config && !reload) return this._config;

    let appConfig = loadConfigFile();
    let defaultConfig = getDefaults();
    this._config = mergeConfigs(appConfig, defaultConfig);
    if (typeof this._config.isUsed === "function") this._config.isUsed();
    return this._config;
  },
};

module.exports = CompareConfig;
