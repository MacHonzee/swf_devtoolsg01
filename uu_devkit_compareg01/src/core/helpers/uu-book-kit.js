const OidcToken = require("../../../node_modules/uu_appg01_devkit-common/src/scripts/oidc-token");
const { AppClient } = require("uu_appg01_core-appclient");
const { UriBuilder } = require("uu_appg01_core-uri");
const ServerRoot = require("../configs/server-root");
const PackageJson = require("../configs/package-json");
const UuAppJson = require("../configs/uuapp-json");
const CompareConfig = require("../configs/compare-config");

const DocumentationKey = "documentation";

const LoadPageUc = "loadPage";

class UuBookKit {
  constructor() {
    this._docUri = null;
    this._pageDataCache = {};
  }

  getDocUri() {
    if (this._docUri) return this._docUri;
    let compareConfig = CompareConfig.load();
    let bookkitUri =
      compareConfig[DocumentationKey] || UuAppJson.load()[DocumentationKey] || PackageJson.load()[DocumentationKey];

    if (!bookkitUri) {
      throw new Error(
        `Documentation Uri (key ${DocumentationKey} was not found in uuapp.json, package.json nor in compare-config.js`
      );
    }

    try {
      bookkitUri = UriBuilder.parse(bookkitUri).setUseCase().clearParameters().toUri();
    } catch (e) {
      throw new Error(`Documentation Uri is not in valid Uri format: ${bookkitUri}`);
    }

    this._docUri = bookkitUri;
    return this._docUri;
  }

  async getAppClient() {
    let token = await new OidcToken(ServerRoot.root).get();
    let baseUri = await this.getDocUri();
    return new AppClient({
      headers: { Authorization: token },
      baseUri,
    });
  }

  async loadPage(pageCode) {
    if (this._pageDataCache[pageCode]) return this._pageDataCache[pageCode];
    let client = await this.getAppClient();
    let loadPageReponse = await client.get(LoadPageUc, { code: pageCode });
    this._pageDataCache[pageCode] = loadPageReponse.data;
    return this._pageDataCache[pageCode];
  }
}

module.exports = new UuBookKit();
