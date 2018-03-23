const path = require("path");

const CONFIG_NAME = "deployconfig.json";
const CURRENT_DIR = "current";

const validateConfig = config => true;

const getConfig = name => {
  config = require(path.resolve(process.cwd(), name || CONFIG_NAME));
  return config;
};

module.exports = {
  CONFIG_NAME,
  CURRENT_DIR,
  validateConfig,
  getConfig
};
