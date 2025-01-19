const path = require('node:path');
const { readdir, writeFile, readFile } = require('node:fs/promises');

async function mergeStyles({ ext = '.css', srcPath, destName, destPath }) {
  const separator = '\n';
  const destFilePath = path.join(destPath, destName);
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

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');

mergeStyles({ srcPath, destPath, destName: 'bundle.css' });

module.exports = { mergeStyles };
