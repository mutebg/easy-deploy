const path = require("path");

const CONFIG_NAME = "deployconfig.json";
const CURRENT_DIR = "current";

const validateConfig = config => true;

const getConfig = name => {
  try {
    config = require(path.resolve(process.cwd(), name || CONFIG_NAME));
    return config;
  } catch (e) {
    throw Error("file not fould");
  }
};

const applyOptions = (config, options) => {
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
  applyOptions
};
