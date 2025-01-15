const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');

(async () => {
  try {
    const fileName = 'text.txt';
    const pathName = path.join(__dirname, fileName);
    const stream = fs.createReadStream(pathName, 'utf8');
    await pipeline(stream, process.stdout);
  } catch (err) {
    throw new Error(err.message);
  }
})();
