const path = require('node:path');
const { readdir, writeFile, readFile } = require('node:fs/promises');

async function getDirEntries(dirName) {
  const pathName = path.join(__dirname, dirName);
  const dirEntries = await readdir(pathName, { withFileTypes: true });
  console.log(typeof dirEntries);
  return dirEntries;
}

const filterFiles = (entries) => entries.filter((entry) => entry.isFile());

const filterExtension = (files, ext) =>
  files.filter((file) => path.extname(file.name) === ext);

async function readFileFunc(dir, file) {
  const filePath = path.join(__dirname, dir, file.name);
  const data = await readFile(filePath, 'utf8');
  return data;
}
async function writeFileFunc(destDir, destName, data) {
  const destSrcPath = path.join(__dirname, destDir, destName);
  await writeFile(destSrcPath, data);
}

async function mergeFiles({
  ext = '.css',
  srcDir = 'styles',
  destName = 'bundle.css',
  destDir = 'project-dist',
}) {
  const entries = await getDirEntries(srcDir);
  const files = filterFiles(entries);
  const styles = filterExtension(files, ext);
  const filesData = await Promise.all(
    styles.map(async (file) => readFileFunc(srcDir, file)),
  );
  const separator = '\n';
  const mergedFiles = filesData.join(separator);
  await writeFileFunc(destDir, destName, mergedFiles);
}

mergeFiles({});
