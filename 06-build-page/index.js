const path = require('node:path');
const { readdir, writeFile, readFile, mkdir } = require('node:fs/promises');
const { mergeStyles } = require('../05-merge-styles/index.js');

async function buildHTML() {
  const srcName = 'template.html';
  const encoding = 'utf8';
  const templateDir = path.join(__dirname, 'components');
  const filePath = path.join(__dirname, srcName);
  const file = await readFile(filePath, encoding);
  const templateRegex = new RegExp(/{{.*?}}/, 'g');
  const templateTags = file.match(templateRegex);
  const srcParts = file.split(templateRegex);
  const templates = await Promise.all(
    templateTags.map(async (tagName) => {
      const templateName = `${tagName.slice(2, -2)}.html`;
      const filePath = path.join(templateDir, templateName);
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
  const destPath = path.join(__dirname, 'project-dist');

  const destHTMLPath = path.join(destPath, 'index.html');
  await writeFile(destHTMLPath, resHTML);
}

async function buildPage() {
  const srcPath = path.join(__dirname, 'styles');
  const destPath = path.join(__dirname, 'project-dist');
  const destName = 'styles.css';

  await mkdir(destPath, { recursive: true });
  await buildHTML();
  mergeStyles({ srcPath, destName, destPath });
}

buildPage();
