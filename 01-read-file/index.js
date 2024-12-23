const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

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
