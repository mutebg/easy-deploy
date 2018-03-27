#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");

const init = require("./commands/init");
const deploy = require("./commands/deploy");
const txt = require("./txt");

program.version("0.1.0");

// INIT
program
  .command("init")
  .alias("i")
  .description(txt.INIT_CMD_DESCRIPTION)
  .action(() => {
    init.flow();
  });

program
  .command("deploy")
  .description(txt.DEPLOY_CMD_DESCRIPTION)
  .alias("d")
  .option("--token [value]", txt.TOKEN_ARG_TITLE)
  .option("--ssh [value]", txt.SSH_ARG_TITLE)
  .option("--config [value]", txt.CONFIG_ARG_TITLE)
  .option("--server [value]", txt.SERVER_ARG_TITLE)
  .option("--path [value]", txt.PATH_ARG_TITLE)
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
