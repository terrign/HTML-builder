const path = require('path');
const fp = require('fs/promises');


(async function () {
  await fp.mkdir(path.join(__dirname, 'files-copy'), {recursive:true});
  const files = await fp.readdir(path.join(__dirname,'files'), {withFileTypes: true});
  files.forEach(async function (file) {
    await fp.copyFile(path.join(__dirname,'files', file.name), path.join(__dirname,'files-copy', file.name));
  });
})();
