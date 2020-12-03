const OidcToken = require("../../../node_modules/uu_appg01_devkit-common/src/scripts/oidc-token");
const { AppClient } = require("uu_appg01_core-appclient");
const Uu5StringHelper = require("../helpers/uu5string-helper");
const { normalizeCode } = require("../helpers/string-helper");
const ServerRoot = require("../source-codes/server-root");
const UuAppJson = require("../source-codes/uuapp-json");
const CompareConfig = require("../source-codes/compare-config");
const UuBookKit = require("../helpers/uu-book-kit");

// TODO the constants below might be needed in compare-config
const AppPageCode = "uuApp";

const AppModelKitBasicInfo = {
  tagName: "UuAppModelKit.UuApp.Bricks.BasicInfo",
  baseUriProp: "uuAppModelKitUri",
};

const ListSubAppsUc = "uuSubApp/list";
const LoadSubAppUc = "uuSubApp/load";

class UuAppModelKit {
  constructor() {
    this._docUri = null;
    this._baseUri = null;
    this._subAppId = null;
    this._attributes = null;
  }

  async getBaseUri() {
    if (this._baseUri) return this._baseUri;

    // TODO add getting uuAppModelKitBaseUri from CompareConfig

    let bookkitUri = UuBookKit.getDocUri();

    let appPage = await UuBookKit.loadPage(AppPageCode);

    // after page is loaded, find the component and read baseUri
    let basicInfoComponent = Uu5StringHelper.findComponentInPage(appPage, AppModelKitBasicInfo.tagName);
    if (!basicInfoComponent) {
      throw new Error(`No component ${AppModelKitBasicInfo.tagName} was found in page ${bookkitUri.toString()}.`);
    }

    this._baseUri = basicInfoComponent.props.toObject()[AppModelKitBasicInfo.baseUriProp];
    return this._baseUri;
  }

  async getAppClient() {
    let token = await new OidcToken(ServerRoot.root).get();
    let baseUri = await this.getBaseUri();
    return new AppClient({
      headers: { Authorization: token },
      baseUri,
    });
  }

  async getCurrentSubAppId() {
    if (this._subAppId) return this._subAppId;

    // TODO add getting subAppId from CompareConfig

    let appClient = await this.getAppClient();
    let subAppListResponse = await appClient.get(ListSubAppsUc);

    let subAppCode = CompareConfig.load().subAppCode || UuAppJson.load().product;
    let normalizedCode = normalizeCode(subAppCode);
    let foundSubApp = subAppListResponse.data.itemList.find((subApp) => {
      return normalizeCode(subApp.code) === normalizedCode;
    });

    if (!foundSubApp) {
      throw new Error(
        `No matching uuSubApp from uuAppModelKit was found for code "${subAppCode}".\n` +
          'Please include the subAppCode into compare-config.js into key "subAppCode".'
      );
    }

    this._subAppId = foundSubApp.id;
    return this._subAppId;
  }

  async getSubAppAttributes() {
    if (this._attributes) return this._attributes;
    let appClient = await this.getAppClient();
    let subAppId = await this.getCurrentSubAppId();
    let attributes = await appClient.get(LoadSubAppUc, { id: subAppId });
    this._attributes = attributes.data;
    return this._attributes;
  }
}

module.exports = new UuAppModelKit();
