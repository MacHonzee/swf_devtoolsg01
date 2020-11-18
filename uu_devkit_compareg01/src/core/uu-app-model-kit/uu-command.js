const UuAppModelKit = require("./uu-app-model-kit");
const CompareConfig = require("../source-codes/compare-config");

// TODO add possiblity ty override in CompareConfig
const ListUc = "uuCommand/list";

class UuCommand {
  constructor(attributes) {
    // caches for UuCommand instances
    this._attributes = attributes;
    this._errors = null;
    this._validation = null;
  }

  // TODO check if current Jest config supports this syntax, it might not
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

    // TODO
    // načte stránku z bookkitu (cached)
    // zparsuje algorithm komponentu
    // vrátí errory a warningy
  }

  async getValidationType() {
    if (this._validation) return this._validation;

    // TODO
    // načte stránku z bookkitu (cached)
    // zparsuje validation type
    // vrátí validation type
  }
}

module.exports = UuCommand;
