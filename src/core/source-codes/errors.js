const fs = require("fs");
const path = require("path");
const ServerRoot = require("./server-root");

const ErrorsPath = ["app", "api", "errors"];

class Errors {
  constructor() {
    this._errors = null;
  }

  load() {
    if (this._errors) return this._errors;
    let errorsPath = path.join(ServerRoot.root, ...ErrorsPath);
    this._errors = {};
    fs.readdirSync(errorsPath).forEach((errorFile) => {
      let errorFilePath = path.join(errorsPath, errorFile);
      let errorsModule = require(errorFilePath);
      if (typeof errorsModule === "function") return; // we skip the "UseCaseError" class
      Object.keys(errorsModule).forEach((moduleKey) => {
        let errorClasses = errorsModule[moduleKey];
        Object.keys(errorClasses).forEach((className) => {
          let classType = errorsModule[moduleKey][className];
          if (typeof classType === "string") return;
          let exceptionClass = new classType();
          // TODO add http status after there is some structured support from Algorithm component
          this._errors[exceptionClass.code] = {
            source: { path: errorFilePath, name: errorFile, sourceType: "file" },
            message: exceptionClass.message,
          };
        });
      });
    });
    return this._errors;
  }
}

module.exports = new Errors();
