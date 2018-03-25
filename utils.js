const path = require("path");
const _ = require("lodash");

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
    throw Error(
      `Configuration file is missing those keys: ${missing.join(",")}`
    );
  }
  return config;
};

const getConfig = name => {
  const configName = name || CONFIG_NAME;
  try {
    config = require(path.resolve(process.cwd(), configName));
    return config;
  } catch (e) {
    throw Error(`Configuration file not found: ${configName}`);
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

module.exports = {
  CONFIG_NAME,
  CURRENT_DIR,
  validateConfig,
  getConfig,
  applyOptions: _.curry(applyOptions)
};
