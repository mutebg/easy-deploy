const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const txt = require("./txt");

const CONFIG_NAME = "deployconfig.json";
const CURRENT_DIR = "current";

const validateConfig = config => {
  const needs = ["project", "public", "server", "path"];
  const missing = [];
  needs.forEach(key => {
    if (!config[key]) {
      missing.push(key);
    }
  });
  if (missing.length) {
    throw Error(txt.ERROR_WRONG_CONFIG + missing.join(","));
  }
  return config;
};

const getConfig = name => {
  const configName = name || CONFIG_NAME;
  try {
    config = require(path.resolve(process.cwd(), configName));
    return config;
  } catch (e) {
    throw Error(txt.ERROR_MISSING_CONFIG + configName);
  }
};

const applyOptions = (options, config) => {
  if (options.server) {
    config.server = options.server;
  }
  if (options.path) {
    config.path = options.path;
  }
  return config;
};

const logError = error => {
  console.log(chalk.bold.red("Error:"), chalk(error.message));
};

module.exports = {
  CONFIG_NAME,
  CURRENT_DIR,
  validateConfig,
  getConfig,
  logError,
  applyOptions: _.curry(applyOptions)
};
