const path = require('node:path');
const { readdir } = require('node:fs/promises');
const { stat } = require('node:fs/promises');

const folderName = 'secret-folder';

async function getFiles(pathName) {
  const dirEntries = await readdir(pathName, { withFileTypes: true });
  return dirEntries.filter((dirEntry) => dirEntry.isFile());
}

async function createFileData(file, pathName) {
  const filePath = path.join(pathName, file.name);
  const ext = path.extname(file.name);
  const name = path.basename(file.name, ext);
  const slicedExt = ext.slice(1);
  const fileStat = await stat(filePath);
  const size = fileStat.size;
  return `${name} - ${slicedExt} - ${size}b`;
}

async function readFilesData() {
  const pathName = path.join(__dirname, folderName);
  const files = await getFiles(pathName);
  const data = await Promise.all(
    files.map(async (file) => await createFileData(file, pathName)),
  );
  console.log(data.join('\n'));
}

readFilesData();
