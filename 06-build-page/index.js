const path = require('node:path');
const {
  writeFile,
  readFile,
  readdir,
  copyFile,
  rm,
  mkdir,
} = require('node:fs/promises');

async function mergeStyles({ ext = '.css', srcPath, bundleName, destPath }) {
  const separator = '\n';
  const destFilePath = path.join(destPath, bundleName);
  const entries = await readdir(srcPath, { withFileTypes: true });
  const styles = entries.filter(
    (entry) => entry.isFile() && path.extname(entry.name) === ext,
  );
  const filesData = await Promise.all(
    styles.map(async (file) => {
      const filePath = path.join(srcPath, file.name);
      const data = await readFile(filePath, 'utf8');
      return data;
    }),
  );
  const mergedFiles = filesData.join(separator);
  await writeFile(destFilePath, mergedFiles);
}

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

async function buildHTML({ destPath }) {
  const srcName = 'template.html';
  const encoding = 'utf8';
  const templateDir = path.resolve(__dirname, 'components');
  const filePath = path.resolve(__dirname, srcName);
  const file = await readFile(filePath, encoding);
  const templateRegex = new RegExp(/{{.*?}}/, 'g');
  const templateTags = file.match(templateRegex);
  const srcParts = file.split(templateRegex);
  const templates = await Promise.all(
    templateTags.map(async (tagName) => {
      const templateName = `${tagName.slice(2, -2)}.html`;
      const filePath = path.resolve(templateDir, templateName);
      const template = await readFile(filePath, 'utf8');
      return template;
    }),
  );
  const resHTML = srcParts
    .reduce((res, part, index) => {
      res.push(part);
      res.push(templates[index]);
      return res;
    }, [])
    .join('\n');

  const destHTMLPath = path.resolve(destPath, 'index.html');
  await writeFile(destHTMLPath, resHTML);
}

async function buildPage({ destPath, srcPath }) {
  await mkdir(destPath, { recursive: true });
  const assetsPath = path.resolve(__dirname, 'assets');
  const assetsDestPath = path.join(destPath, 'assets');
  await mkdir(assetsDestPath, { recursive: true });
  await copyDir({ srcPath: assetsPath, destPath: assetsDestPath });
  await buildHTML({ destPath: destPath, srcPath: srcPath });
  mergeStyles({ srcPath, bundleName: 'style.css', destPath });
}

const destDir = 'project-dist';
const srcDir = 'styles';
const srcPath = path.resolve(__dirname, srcDir);
const destPath = path.resolve(__dirname, destDir);

buildPage({ destPath: destPath, srcPath: srcPath });
