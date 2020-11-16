const chalk = require("chalk");
const ProfileJson = require("../configs/profiles-json");
const MetamodelJson = require("../configs/metamodel-json");
const { UuCommand } = require("../uu-app-model-kit");
const CompareTools = require("./compare-tools");

const NonProfileItems = new Set(["AwidLicenseOwner", "Public", "AwidOwner"]);

async function mapAppModelKit() {
  let mmdCommands = await UuCommand.getCommandMap();
  let ucMap = {};
  Object.keys(mmdCommands).forEach((uc) => {
    ucMap[uc] = mmdCommands[uc].getProfiles();
  });
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

  let profileInequals = CompareTools.getArraysDiff(profilesJsonList, appModelKitList, metamodelList);
  if (profileInequals.length > 0) {
    console.log(chalk.red.underline.bold("Profile list does not match!"));
    console.log("Application profiles:      " + CompareTools.highlightDiff(profilesJsonList, profileInequals));
    console.log("uuAppModelKit profiles:    " + CompareTools.highlightDiff(appModelKitList, profileInequals));
    if (metamodelList) {
      console.log("Metamodel profiles:      " + CompareTools.highlightDiff(metamodelList, profileInequals));
    }
    console.log("\n");
  } else {
    console.log(chalk.green("Profile list matches."));
  }
}

function compareUseCaseLists(ucProfileMap) {
  let profilesJsonList = Object.keys(ucProfileMap.profilesJson).sort();
  let appModelKitList = Object.keys(ucProfileMap.appModelKit).sort();
  let metamodelList = Object.keys(ucProfileMap.metamodel).sort();

  let ucInequals = CompareTools.getArraysDiff(profilesJsonList, appModelKitList, metamodelList);
  if (ucInequals.length > 0) {
    console.log(chalk.red.underline.bold("Use case list does not match!"));
    console.log("Application use cases:      " + CompareTools.highlightDiff(profilesJsonList, ucInequals));
    console.log("uuAppModelKit use cases:    " + CompareTools.highlightDiff(appModelKitList, ucInequals));
    if (metamodelList) {
      console.log("Metamodel use cases:      " + CompareTools.highlightDiff(metamodelList, ucInequals));
    }
    console.log("\n");
  } else {
    console.log(chalk.green("Use case list matches."));
  }
}

function getAllUcList(ucProfileMap) {
  let allUcList = new Set();
  Object.values(ucProfileMap).forEach((ucMap) => {
    Object.keys(ucMap).forEach((uc) => allUcList.add(uc));
  });
  return Array.from(allUcList);
}

function compareUcProfileLists(ucProfileMap) {
  const allUcList = getAllUcList(ucProfileMap);
  let { profilesJson, appModelKit, metamodel } = ucProfileMap;
  allUcList.forEach((appUc) => {
    let appUcProfiles = profilesJson[appUc] ? profilesJson[appUc].profileList : [];
    let mmdUcProfiles = metamodel[appUc] ? metamodel[appUc].profileList : [];
    let appKitUcProfiles = appModelKit[appUc] ? appModelKit[appUc].profileList : [];
    let ucInequals = CompareTools.getArraysDiff(appUcProfiles, mmdUcProfiles, appKitUcProfiles);
    if (ucInequals.length > 0) {
      console.log(chalk.red.underline.bold("Differences found for use case: " + appUc));
      console.log("Application use case profiles:    " + CompareTools.highlightDiff(appUcProfiles, ucInequals));
      if (metamodel) {
        console.log("Metamodel use case profiles:      " + CompareTools.highlightDiff(mmdUcProfiles, ucInequals));
      }
      console.log("uuAppModelKit use case profiles:  " + CompareTools.highlightDiff(appKitUcProfiles, ucInequals));
      console.log("");
    }
  });
}

class CompareProfiles {
  async process() {
    // read all of profiles from all sources
    let ucProfileMap = {
      profilesJson: ProfileJson.getUcProfileMap(),
      appModelKit: await mapAppModelKit(),
      metamodel: MetamodelJson.getUcProfileMap(),
    };

    // compare profile lists
    compareProfileLists(ucProfileMap);

    // compare use case lists
    compareUseCaseLists(ucProfileMap);

    // compare profiles for each usecase
    compareUcProfileLists(ucProfileMap);

    console.log("Profiles differences processed.");
  }
}

module.exports = CompareProfiles;
