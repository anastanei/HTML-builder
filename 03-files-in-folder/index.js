// const fs = require('node:fs');
const path = require('node:path');
const { readdir } = require('node:fs/promises');
const { stat } = require('node:fs/promises');

const folderName = 'secret-folder';

(async () => {
  try {
    const pathName = path.join(__dirname, folderName);
    const dirEntries = await readdir(pathName, { withFileTypes: true });
    const files = dirEntries.filter((dirEntry) => dirEntry.isFile());
    const data = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(pathName, file.name);
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        const slicedExt = ext.slice(1);
        const fileStat = await stat(filePath);
        const size = fileStat.size;
        return `${name} - ${slicedExt} - ${size}b`;
      }),
    );

    console.log(data.join('\n'));
  } catch (err) {
    console.error(err);
  }
})();
