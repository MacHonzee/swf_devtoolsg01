#! /usr/bin/env node
const shell = require("shelljs");
const yargs = require("yargs");
const CompareScripts = require("../src/scripts/compare-scripts");

// copy pasted from devkit
// throw error whenever shell command fails
shell.config.fatal = true;

// display error stack for unhandled Promise rejections
process.on("unhandledRejection", (r) => {
  throw r instanceof Error ? r : new Error(r);
});
Error.stackTraceLimit = 1000; // default is 10 (too low)

// disable npm update-notifier check when running child npm commands
process.env.NO_UPDATE_NOTIFIER = "true";
process.env.NPM_CONFIG_UPDATE_NOTIFIER = "0";

// all commands for yargs
const Commands = {
  profiles: "Compares profiles.json (and metamodel.json, if it exists) with uuAppModelKit command profiles.",
  errors:
    "Compares errors and warnings from api folder with uuAppModelKit command errors and warnings from algorithm component.",
  daos: "Compares persistence config, indexes, limits and dao methods with design from uuAppModelKit.",
  mappings: "Compares command use cases and method types with uuAppModelKit commands.",
  validations: "Compares validation types of uuCommands in implementation and design.",
};
let allKeys = Object.keys(Commands);
Commands.all = "Compares implementation and design of all these parts: " + allKeys.join(", ");

function runScript(scriptName) {
  return async function () {
    let ScriptClass = CompareScripts[scriptName];
    if (!ScriptClass) {
      throw new Error(`There is an implementation error, scriptName ${scriptName} was not found. Contact support.`);
    }
    await new ScriptClass().process();
  };
}

Object.keys(Commands).forEach((cmdName) => {
  yargs.command(cmdName, Commands[cmdName], {}, runScript(cmdName));
});

yargs
  .demandCommand(2, "Must provide a valid command!") // TODO Needs 2 instead of 1 due to some bug in yargs.
  .showHelpOnFail(false)
  .help("help")
  .alias("h", "help")
  .version(false)
  .wrap(160).argv;
