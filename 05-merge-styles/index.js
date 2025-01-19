const path = require('node:path');
const { readdir, writeFile, readFile } = require('node:fs/promises');

async function mergeFiles({
  ext = '.css',
  srcDir = 'styles',
  destName = 'bundle.css',
  destDir = 'project-dist',
}) {
  const srcPath = path.join(__dirname, srcDir);
  const separator = '\n';
  const destPath = path.join(__dirname, destDir, destName);
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
  await writeFile(destPath, mergedFiles);
}

mergeFiles({});
