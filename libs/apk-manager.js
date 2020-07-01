const config = require('../config');
const fs = require('fs-extra');
const path = require('path');
const ApkParser = require('app-info-parser/src/apk');
const base64Img = require('base64-img');
const exec = require('child_process').exec;

const uploadDir = config.uploadDir;

fs.ensureDir(uploadDir);

// store data
// const appListFile = path.join(uploadDir, 'appList.json');
const appList = require('./ipa-manager').appList;

// init appList
// if (fs.pathExistsSync(appListFile)) {
//   const list = fs.readJsonSync(appListFile);
//   list.map((row) => appList.push(row));
// }

const add = async (file, oldFileName) => {
  const tmpDir = '/tmp/cn.ineva.upload/unzip-tmp'; // temp dir

  //parse APK
  const parser = new ApkParser(file);
  const result = await parser.parse();

  const channel = await new Promise((resolve, reject) =>
    exec(`python packer-ng-v2.py ${file}`, function (error, stdout, stderr) {
      // console.log(stdout.split('\n'));
      let l = stdout.split('\n').forEach(function (item, index) {
        if (item == '') {
          return;
        }
        let s = item.split(':');
        if (item != undefined) {
          if (s[0] == 'Channel') {
            const data = s[1].replace('\t', '').replace(' ', '');
            // console.log(data);
            resolve(data);
          }
        }
      });
    })
  );

  // const channel = /(?=official).*?(?=.apk)/.exec(oldFileName)[0];

  const app = {
    id: path.basename(file, '.apk'),
    name: result.application.label[0],
    version: result.versionName,
    identifier: result.package,
    build: result.versionCode,
    date: new Date(),
    size: (await fs.lstat(file)).size,
    noneIcon: !result.icon,
    channel: channel,
    platform: 'Android',
  };

  appList.unshift(app);
  await fs.writeJson(appListFile, appList);

  // save files to target dir
  // TODO: upload dir configable
  const targetDir = path.join(uploadDir, app.identifier, app.id);

  await fs.move(file, path.join(targetDir, 'apk.apk'));

  base64Img.img(result.icon, targetDir, 'icon', function (err, filepath) {});

  // delete temp files
  await fs.remove(tmpDir);
};

module.exports = {
  add,
};
