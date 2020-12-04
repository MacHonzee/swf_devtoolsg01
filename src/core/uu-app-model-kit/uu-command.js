const UuAppModelKit = require("./uu-app-model-kit");
const CompareConfig = require("../source-codes/compare-config");
const UuBookKit = require("../helpers/uu-book-kit");
const Algorithm = require("../helpers/uu5-algorithm-helper");

const ListUc = "uuCommand/list";

const ValidationTypesRegex = /Validation \(dtoInType\)/;
const Uu5StringPreRegex = new RegExp("<uu5string.pre>(.*)</uu5string.pre>", "s");

const ValidationNamePrefix = "const ";

class UuCommand {
  constructor(attributes) {
    // caches for UuCommand instances
    this._attributes = attributes;
    this._errors = null;
    this._warnings = null;
    this._validation = null;
  }

  static _list = null;
  static _commandMap = null;

  static async list() {
    if (this._list) return this._list;
    let client = await UuAppModelKit.getAppClient();
    let subAppId = await UuAppModelKit.getCurrentSubAppId();
    let listResponse = await client.get(ListUc, { uuSubAppId: subAppId });
    this._list = listResponse.data.itemList;

    let defaultLng = CompareConfig.load().defaultLanguage;
    this._commandMap = this._list.reduce((map, cmd) => {
      map[cmd.name[defaultLng]] = new UuCommand(cmd);
      return map;
    }, {});
    return this._list;
  }

  static async getCommandMap() {
    if (this._commandMap) return this._commandMap;
    await this.list();
    return this._commandMap;
  }

  static async getByName(name) {
    await this.list();
    return this._commandMap[name];
  }

  getAttributes() {
    return this._attributes;
  }

  getProfiles() {
    return this._attributes.uuAppProfileRelatedList;
  }

  async getErrors() {
    if (this._errors) return this._errors;
    this._errors = await this._getErrorsOrWarnings("error");
    return this._errors;
  }

  async getWarnings() {
    if (this._warnings) return this._warnings;
    this._warnings = await this._getErrorsOrWarnings("warning");
    return this._warnings;
  }

  async getValidationTypes() {
    if (this._validation) return this._validation;
    let pageCode = this.getAttributes().pageCode;
    let pageData = await UuBookKit.loadPage(pageCode);

    let foundSection = pageData.body.find((section) => section.content.match(ValidationTypesRegex));
    if (foundSection) {
      // TODO uu5string does not parse uu5string.pre content properly, verify this
      const matches = foundSection.content.match(Uu5StringPreRegex);
      if (matches && matches[1]) {
        this._validation = {
          full: matches[1], // there might be multiple validation schema constants
          parts: {},
        };

        let validationParts = matches[1].split(ValidationNamePrefix);
        validationParts.forEach((validationPart) => {
          if (!validationPart.trim()) return;

          let indexOfEqual = validationPart.indexOf("=");
          if (indexOfEqual === -1) return;

          let validationName = validationPart.slice(0, indexOfEqual - 1).trim();
          let validationSchema = validationPart.slice(indexOfEqual + 1, validationPart.length).trim();
          let trimmedValidation = validationSchema
            .replace(/[\n\t ]/g, "")
            .replace(/;$/, "")
            .trim();
          this._validation.parts[validationName] = { full: validationSchema, trimmed: trimmedValidation };
        });
      }
    }

    return this._validation;
  }

  // private

  async _getErrorsOrWarnings(type) {
    let pageCode = this.getAttributes().pageCode;
    let pageData = await UuBookKit.loadPage(pageCode);
    let algorithm = Algorithm.findInPage(pageData);
    if (algorithm) {
      return Algorithm.getErrorsOrWarnings(algorithm, type);
    }
  }
}

module.exports = UuCommand;
