const path = require('node:path');
const { mkdir, readdir, copyFile, rm } = require('node:fs/promises');

async function clearDirectory(destPath) {
  const entries = await readdir(destPath, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(destPath, entry.name);
      await rm(fullPath, { recursive: true, force: true });
    }),
  );
}

async function copyDirRecursive({ srcPath, destPath }) {
  await mkdir(destPath, { recursive: true });
  const entries = await readdir(srcPath, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const srcNextPath = path.join(srcPath, entry.name);
      const destNextPath = path.join(destPath, entry.name);
      if (entry.isDirectory()) {
        await copyDirRecursive({
          srcPath: srcNextPath,
          destPath: destNextPath,
        });
      } else {
        await copyFile(srcNextPath, destNextPath);
      }
    }),
  );
}

async function copyDir({ srcPath, destPath }) {
  const mkdirAnswer = await mkdir(destPath, { recursive: true });
  if (!mkdirAnswer) {
    await clearDirectory(destPath);
  }
  await copyDirRecursive({ srcPath, destPath });
}

const srcDir = 'files';
const destDir = 'files-copy';
const destPath = path.join(__dirname, destDir);
const srcPath = path.join(__dirname, srcDir);

copyDir({ srcPath, destPath });

module.exports = {
  copyDir,
};
