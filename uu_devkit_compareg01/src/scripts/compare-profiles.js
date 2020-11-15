const { UuAppModelKit, UuCommand } = require("../core/uu-app-model-kit");

class CompareProfiles {
  async process() {
    // await UuAppModelKit.getSubAppAttributes();

    let cmd = await UuCommand.getByName("hexagon/create");
    console.log(await cmd.getProfiles());
  }
}

module.exports = CompareProfiles;
