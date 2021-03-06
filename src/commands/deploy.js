//
const fs = require("fs");
const tar = require("tar");
const tmp = require("tmp");
const glob = require("glob").sync;
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const pipe = require("lodash/fp/pipe");
const last = require("lodash/last");
const ora = require("ora");

const utils = require("../utils");
const txt = require("../txt");

const listFiles = (cwd, ignore = []) => {
  return glob("**/*", {
    cwd: cwd,
    ignore: ignore,
    nodir: true,
    nosort: true,
    follow: true,
    dot: true
  });
};

const compressFiles = ({ public }) => {
  const tmpFile = tmp.fileSync({ prefix: "upload-", postfix: ".tar.gz" });
  const files = listFiles(public);

  return tar
    .c(
      {
        gzip: true,
        file: tmpFile.name,
        cwd: public,
        prefix: "public",
        follow: true,
        noDirRecurse: true,
        portable: true
      },
      files.slice(0)
    )
    .then(function() {
      var stats = fs.statSync(tmpFile.name);
      return {
        file: tmpFile.name,
        //stream: fs.createReadStream(tmpFile.name),
        includedFiles: files,
        size: stats.size
      };
    });
};

const uploadFiles = (cred, { server, path }, zip) => {
  const folderName = Date.now();
  const fileName = last(zip.split("/"));
  const fullPath = path + "/" + folderName;
  const credCommand = "-i ~/.ssh/digitalo";
  const currentFolderPath = `${path}/${utils.CURRENT_DIR}`;

  const ssh = com => `ssh ${credCommand} ${server} "${com}"`;

  // ssh server using SSH key
  // create a new folder date_time
  return exec(`scp ${credCommand}  ${zip}  ${server}:${path}`).then(() => {
    // extract files to new folder
    const c = ssh(
      `
          cd ${path}
          mkdir -p ${folderName}
          tar -xf ${fileName} -C ${folderName} --strip-components=1
          rm ${fileName}
          ln -sfn ${fullPath} ${currentFolderPath}
        `
    );
    return exec(c);
  });
};

const flow = options => {
  const spinner = ora(txt.DEPLOY_START).start();

  try {
    const config = pipe(
      utils.getConfig,
      utils.applyOptions(options),
      utils.validateConfig
    )(options.config);

    compressFiles(config)
      .then(zip => uploadFiles(options, config, zip.file))
      .then(res => {
        spinner.succeed(txt.SUCCESS_DEPLOY);
      })
      .catch(err => {
        spinner.stop();
        utils.logError(err);
      });
  } catch (err) {
    spinner.stop();
    utils.logError(err);
  }
};

module.exports = {
  flow
};
