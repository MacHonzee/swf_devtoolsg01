const fs = require("fs");
const path = require("path");
const { Loader } = require("uu_appg01_core-utils");
const ServerRoot = require("./server-root");

const PersistenceJsonName = "persistence.json";
const PersistenceJsonPath = ["app", "config", PersistenceJsonName];
const DaoLimits = ["maxNoi", "maxSoi", "maxSob"];

// eslint-disable-next-line no-unused-vars
class MockDaoAbstract {
  constructor() {
    this._indexes = [];
  }

  createIndex(keys, opts) {
    let indexString = Object.keys(keys).join(", ");
    if (opts && opts.unique) indexString = "unique " + indexString;
    this._indexes.push(indexString);
  }

  get indexes() {
    return this._indexes;
  }
}

// currently there is no way to modify "super" of a method instead of Node.js V8 engine hacking or by eval
const MockDaoForEval = `class MockDao extends MockDaoAbstract {
  %s
}

let mockDao = new MockDao();
mockDao.createSchema();
mockDao.indexes`;

function getMethodArguments(func) {
  return (func + "")
    .replace(/[/][/].*$/gm, "") // strip single-line comments
    .replace(/\s+/g, "") // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
    .split("){", 1)[0]
    .replace(/^[^(]*[(]/, "") // extract the parameters
    .replace(/=[^,]+/g, "") // strip any ES6 defaults
    .split(",")
    .filter(Boolean); // split & filter [""]
}

function loadDaoMethods(realization) {
  let ownMethods = Object.getOwnPropertyDescriptors(realization.prototype);
  let methodList = [];
  Object.keys(ownMethods).forEach((methodName) => {
    if (methodName !== "constructor") {
      let daoMethod = ownMethods[methodName].value;
      let daoArguments = getMethodArguments(daoMethod);
      methodList.push(`${methodName}(${daoArguments.join(",")})`);
    }
  });
  return methodList;
}

function loadIndexes(realization) {
  let createSchemaMethod = realization.prototype.createSchema;
  if (createSchemaMethod) {
    // hijacking of the createSchema method and calling it without modifying implementation, just by
    // changing context of "super" call
    let classTemplate = MockDaoForEval.replace("%s", createSchemaMethod.toString());
    return eval(classTemplate);
  }
}

function loadDaoLimits(schemaCfg) {
  let limits = {};
  DaoLimits.forEach((limitName) => {
    if (schemaCfg[limitName]) limits[limitName] = schemaCfg[limitName];
  });
  return limits;
}

class Daos {
  constructor() {
    this._daos = null;
  }

  load() {
    if (this._daos) return this._daos;
    let persJsonPath = path.join(ServerRoot.root, ...PersistenceJsonPath);
    let persistenceJson = JSON.parse(fs.readFileSync(persJsonPath));
    this._daos = {};
    for (let dbName of Object.keys(persistenceJson.uuSubAppDataStore)) {
      let dbConfig = persistenceJson.uuSubAppDataStore[dbName];
      for (let schema of Object.keys(dbConfig.schemaMap)) {
        let schemaCfg = dbConfig.schemaMap[schema];
        let realization = Loader.loadRealization(ServerRoot.root, schemaCfg.realization);
        this._daos[schema] = {
          source: { path: persJsonPath, name: PersistenceJsonName, sourceType: "file" },
          limits: loadDaoLimits(schemaCfg),
          methods: loadDaoMethods(realization),
          indexes: loadIndexes(realization),
        };
      }
    }
    return this._daos;
  }
}

module.exports = new Daos();
