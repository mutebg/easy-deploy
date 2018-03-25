#!/usr/bin/env node

// https://developer.atlassian.com/blog/2015/11/scripting-with-node/

const program = require("commander");
const inquirer = require("inquirer");

const init = require("./commands/init");
const deploy = require("./commands/deploy");

program.version("0.1.0");

// INIT
program.command("init").action(() => {
  init.flow();
});

// CREATE TOKEN
program.command("create-token").action(cmd => {
  log("create-token", "3131231231");
});

program
  .command("deploy")
  .option("--token [value]", "supply an auth token for this command")
  .option("--ssh [value]", "supply an SSH for this command")
  .option("--config [value]", "path to config")
  .option("--server [value]", "server name")
  .option("--path [value]", "path on the server")
  .action(cmd => {
    const options = {
      token: cmd.token,
      ssh: cmd.ssh,
      config: cmd.config,
      server: cmd.server,
      path: cmd.path
    };
    deploy.flow(options);
  });

program.parse(process.argv);

function log(...args) {
  console.log(...args);
}
