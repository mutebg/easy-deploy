const fs = require("fs");
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
  if (!utils.validateConfig(config)) {
    return new Promise.reject("Not valid config");
  }

  return new Promise((resolve, reject) => {
    const pathRes = path.resolve(process.cwd(), utils.CONFIG_NAME);
    //console.log(process.cwd());
    fs.writeFile(pathRes, JSON.stringify(config, null, "\t"), "utf8", err => {
      if (err) {
        reject(err);
      } else {
        resolve("Config created");
      }
    });
  });
};

const flow = () =>
  askQuestions()
    .then(createConfig)
    .then(end => {
      console.log({ end });
    })
    .catch(err => {
      console.log({ err });
    });

module.exports = {
  flow
};
