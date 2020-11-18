const fs = require("fs");
const path = require("path");
const { Validator } = require("uu_appg01_core-validation");
const ServerRoot = require("./server-root");

const ValidationTypesPath = ["app", "api", "validation_types"];

class ValidationTypes {
  constructor() {
    this._types = null;
  }

  load() {
    if (this._types) return this._types;
    let valTypesPath = path.join(ServerRoot.root, ...ValidationTypesPath);
    this._types = {};
    fs.readdirSync(valTypesPath).forEach((valType) => {
      let valTypePath = path.join(valTypesPath, valType);
      let validator = new Validator(valTypePath);
      Object.keys(validator.validationTypes).forEach((dtoInType) => {
        this._types[dtoInType] = validator.validationTypes[dtoInType].matchers[0].qualifiedName;
      });
    });
    return this._types;
  }
}

module.exports = new ValidationTypes();
