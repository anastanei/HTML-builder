const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('process');

(() => {
  const EXIT_COMMAND = 'exit';

  const greeting = '👋Please enter text. Type "exit" or press Ctrl+C to quit.';
  const farewell = 'See you!🙌';

  const fileName = 'text.txt';
  const pathName = path.join(__dirname, fileName);
  const writeStream = fs.createWriteStream(pathName, { flags: 'a' });
  const rl = readline.createInterface({ input, output });

  console.log(greeting);

  rl.on('line', (line) => {
    if (line === EXIT_COMMAND) {
      rl.close();
    } else {
      writeStream.write(`${line}\n`);
    }
  });

  rl.on('close', () => {
    writeStream.end(() => {
      console.log(farewell);
    });
  });
})();
