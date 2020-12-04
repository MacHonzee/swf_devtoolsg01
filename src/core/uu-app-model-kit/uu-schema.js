const UuAppModelKit = require("./uu-app-model-kit");
const CompareConfig = require("../source-codes/compare-config");
const UuBookKit = require("../helpers/uu-book-kit");
const StringHelper = require("../helpers/string-helper");
const Uu5StringHelper = require("../helpers/uu5string-helper");

const ListObjectStoresUc = "uuAppObjectStore/list";
const ListSchemaUc = "uuSchema/list";

const Uu5ComponentNames = {
  limits: "UuApp.DesignKit.UuAppObjectStoreSchemaLimitList",
  indexes: "UuApp.DesignKit.UuAppObjectStoreSchemaIndexList",
  daoMethods: "UuApp.DesignKit.UuAppObjectStoreSchemaDaoMethodList",
};

class UuSchema {
  constructor(attributes) {
    // caches for UuSchema instances
    this._attributes = attributes;
    this._daoMethods = null;
    this._limits = null;
    this._indexes = null;
  }

  static _list = null;
  static _schemaMap = null;

  static async list() {
    if (this._list) return this._list;
    let client = await UuAppModelKit.getAppClient();
    let subAppId = await UuAppModelKit.getCurrentSubAppId();
    let listObjectstoresResponse = await client.get(ListObjectStoresUc, { uuSubAppId: subAppId });
    let objectstoreList = listObjectstoresResponse.data.itemList;
    let loadSchemaPromises = objectstoreList.map(async (objectStore) => {
      return await client.get(ListSchemaUc, { uuAppObjectStoreId: objectStore.id });
    });
    let schemaResponses = await Promise.all(loadSchemaPromises);
    this._list = [];
    this._schemaMap = {};
    let defaultLng = CompareConfig.load().defaultLanguage;
    schemaResponses.forEach((schemaResponse) => {
      schemaResponse.data.itemList.forEach((schema) => {
        this._list.push(schema);
        let schemaName = schema.name[defaultLng];
        this._schemaMap[schemaName] = new UuSchema(schema);
      });
    });
    return this._list;
  }

  static async getSchemaMap() {
    if (this._schemaMap) return this._schemaMap;
    await this.list();
    return this._schemaMap;
  }

  static async getByName(name) {
    await this.list();
    return this._schemaMap[name];
  }

  getAttributes() {
    return this._attributes;
  }

  async getLimits() {
    if (this._limits) return this._limits;
    let pageCode = this.getAttributes().pageCode;
    let pageData = await UuBookKit.loadPage(pageCode);
    let limitsTable = Uu5StringHelper.findComponentInPage(pageData, Uu5ComponentNames.limits);
    this._limits = {};
    if (limitsTable) {
      let limits = limitsTable.props.toObject().data;
      limits.forEach((limit) => {
        this._limits[limit[0]] = StringHelper.parseNumber(limit[1]);
      });
    }
    return this._limits;
  }

  async getIndexes() {
    if (this._indexes) return this._indexes;
    let pageCode = this.getAttributes().pageCode;
    let pageData = await UuBookKit.loadPage(pageCode);
    let indexesTable = Uu5StringHelper.findComponentInPage(pageData, Uu5ComponentNames.indexes);
    this._indexes = [];
    if (indexesTable) {
      let indexes = indexesTable.props.toObject().data;
      indexes.forEach((index) => {
        this._indexes.push(index[0].trim());
      });
    }
    return this._indexes;
  }

  async getDaoMethods() {
    if (this._daoMethods) return this._daoMethods;
    let pageCode = this.getAttributes().pageCode;
    let pageData = await UuBookKit.loadPage(pageCode);
    let daoMethodsTable = Uu5StringHelper.findComponentInPage(pageData, Uu5ComponentNames.daoMethods);
    this._daoMethods = [];
    if (daoMethodsTable) {
      let daoMethods = daoMethodsTable.props.toObject().data;
      daoMethods.forEach((daoMethod) => {
        let method = daoMethod[0].replace(/->.*/, "").replace(/, /g, ",").trim();
        this._daoMethods.push(method);
      });
    }
    return this._daoMethods;
  }
}

module.exports = UuSchema;
