const chalk = require("chalk");
const ProfileJson = require("../source-codes/profiles-json");
const MetamodelJson = require("../source-codes/metamodel-json");
const { UuCommand } = require("../uu-app-model-kit");
const Tools = require("./tools");

const NonProfileItems = new Set(["AwidLicenseOwner", "Public", "AwidOwner"]);

const UcMapMessages = {
  profilesJson: "Profiles.json use cases:    ",
  appModelKit: "uuAppModelKit use cases:    ",
  metamodel: "Metamodel use cases:        ",
};

async function mapAppModelKit() {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  for (let uc of Object.keys(mmdCommands)) {
    ucMap[uc] = mmdCommands[uc].getProfiles();
  }
  return ucMap;
}

function extractProfileList(map) {
  if (!map) return map;

  let profileList = new Set();
  Object.values(map).forEach((ucProfiles) => {
    ucProfiles.forEach((profile) => {
      if (!NonProfileItems.has(profile)) profileList.add(profile);
    });
  });
  return Array.from(profileList).sort();
}

function compareProfileLists(ucProfileMap) {
  let profilesJsonList = extractProfileList(ucProfileMap.profilesJson);
  let appModelKitList = extractProfileList(ucProfileMap.appModelKit);
  let metamodelList = extractProfileList(ucProfileMap.metamodel);

  let profileInequals = Tools.getArraysDiff(profilesJsonList, appModelKitList, metamodelList);
  if (profileInequals.length > 0) {
    console.log(chalk.red.underline.bold("Profile list does not match!"));
    console.log("Application profiles:      " + Tools.highlightDiff(profilesJsonList, profileInequals));
    console.log("uuAppModelKit profiles:    " + Tools.highlightDiff(appModelKitList, profileInequals));
    if (metamodelList) {
      console.log("Metamodel profiles:      " + Tools.highlightDiff(metamodelList, profileInequals));
    }
    console.log("\n");
  } else {
    console.log(chalk.green("Profile list matches."));
  }
}

function compareUcProfileLists(ucProfileMap) {
  const allUcList = Tools.getAllUcList(ucProfileMap);
  let { profilesJson, appModelKit, metamodel } = ucProfileMap;
  allUcList.forEach((appUc) => {
    let appUcProfiles = profilesJson[appUc] || [];
    let mmdUcProfiles = (metamodel && metamodel[appUc]) || [];
    let appKitUcProfiles = appModelKit[appUc] || [];
    let ucInequals = Tools.getArraysDiff(appUcProfiles, mmdUcProfiles, appKitUcProfiles);
    if (ucInequals.length > 0) {
      console.log(chalk.red.underline.bold("Differences found for use case: " + appUc));
      console.log("Profiles.json use case profiles:  " + Tools.highlightDiff(appUcProfiles, ucInequals));
      if (metamodel) {
        console.log("Metamodel use case profiles:      " + Tools.highlightDiff(mmdUcProfiles, ucInequals));
      }
      console.log("uuAppModelKit use case profiles:  " + Tools.highlightDiff(appKitUcProfiles, ucInequals));
      console.log("");
    }
  });
}

class CompareProfiles {
  async process() {
    console.log("Checking profile differences.\n");

    // read all of profiles from all sources
    let ucProfileMap = {
      profilesJson: ProfileJson.getUcProfileMap(),
      appModelKit: await mapAppModelKit(),
      metamodel: MetamodelJson.getUcProfileMap(),
    };

    // compare profile lists
    compareProfileLists(ucProfileMap);

    // compare use case lists
    Tools.compareUseCaseLists(ucProfileMap, UcMapMessages);

    // compare profiles for each usecase
    compareUcProfileLists(ucProfileMap);

    console.log("Profiles differences processed.\n");
  }
}

module.exports = CompareProfiles;
