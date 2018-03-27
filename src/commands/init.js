const util = require("util");
const writeFile = util.promisify(require("fs").writeFile);
const path = require("path");
const inquirer = require("inquirer");
const utils = require("../utils");
const txt = require("../txt");
const ora = require("ora");

const questions = [
  {
    type: "input",
    name: "project",
    message: txt.Q_INIT_ASK_PROJECT
  },
  {
    type: "input",
    name: "public",
    message: txt.Q_INIT_ASK_PUBLIC,
    default: "public"
  },
  {
    type: "input",
    name: "server",
    message: txt.Q_INIT_ASK_SERVER
  },
  {
    type: "input",
    name: "path",
    message: txt.Q_INIT_ASK_PATH
  }
];

const askQuestions = () => inquirer.prompt(questions);

const createConfig = config => {
  config = utils.validateConfig(config);
  const pathRes = path.resolve(process.cwd(), utils.CONFIG_NAME);
  return writeFile(pathRes, JSON.stringify(config, null, "\t"), "utf8");
};

const flow = () => {
  const spinner = ora(txt.INIT_START);
  askQuestions()
    .then(q => {
      spinner.start();
      return createConfig(q);
    })
    .then(end => {
      spinner.succeed(txt.SUCCESS_INIT + utils.CONFIG_NAME);
    })
    .catch(err => {
      spinner.stop();
      utils.logError(txt.ERROR_CREATE_CONFIG);
    });
};

module.exports = {
  flow
};
