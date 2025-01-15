const path = require('node:path');
const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');

const srcDir = 'files';
const destDir = 'files-copy';

async function makeDirectory(dirName) {
  const projectFolder = path.join(__dirname, dirName);
  const dirCreation = await mkdir(projectFolder);
  return dirCreation;
}

async function getFiles(dirName) {
  const pathName = path.join(__dirname, dirName);
  const dirEntries = await readdir(pathName, { withFileTypes: true });
  return dirEntries.filter((dirEntry) => dirEntry.isFile());
}

async function copyDir(srcDir, destDir) {
  const destPath = path.join(__dirname, destDir);
  await rm(destPath, { recursive: true, force: true });
  await makeDirectory(destDir);
  const files = await getFiles(srcDir);
  await Promise.all(
    files.map(async (file) => {
      const srcPath = path.join(__dirname, srcDir, file.name);
      const destPath = path.join(__dirname, destDir, file.name);
      await copyFile(srcPath, destPath);
    }),
  );
}

copyDir(srcDir, destDir);
