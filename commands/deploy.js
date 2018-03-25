const fs = require("fs");
const tar = require("tar");
const tmp = require("tmp");
const glob = require("glob").sync;
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const pipe = require("lodash/fp/pipe");
const last = require("lodash/last");

const utils = require("../utils");

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
  try {
    const config = pipe(
      utils.getConfig,
      utils.applyOptions(options),
      utils.validateConfig
    )(options.config);

    console.log(config);

    compressFiles(config)
      .then(zip => uploadFiles(options, config, zip.file))
      .then(res => {
        console.log("Deploy finished:", res);
      });
  } catch (err) {
    console.log("ERROR:" + err.message);
  }
};

module.exports = {
  flow
};
