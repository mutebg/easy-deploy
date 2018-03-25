const util = require("util");
const writeFile = util.promisify(require("fs").writeFile);
const path = require("path");
const inquirer = require("inquirer");
const utils = require("../utils");

const questions = [
  {
    type: "input",
    name: "project",
    message: "What is name of your project"
  },
  {
    type: "input",
    name: "public",
    message: "What's public folder",
    default: "public"
  },
  {
    type: "input",
    name: "server",
    message: "What's your server IP/Domain (root@server)"
  },
  {
    type: "input",
    name: "path",
    message: "Path"
  }
];

const askQuestions = () => inquirer.prompt(questions);

const createConfig = config => {
  config = utils.validateConfig(config);
  const pathRes = path.resolve(process.cwd(), utils.CONFIG_NAME);
  return writeFile(pathRes, JSON.stringify(config, null, "\t"), "utf8");
};

const flow = () =>
  askQuestions()
    .then(createConfig)
    .then(end => {
      console.log(`Configuration has been created at ${utils.CONFIG_NAME}`);
    })
    .catch(err => {
      console.log(`Can't create a config file`);
    });

module.exports = {
  flow
};
