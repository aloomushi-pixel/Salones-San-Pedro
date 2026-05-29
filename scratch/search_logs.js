import fs from 'fs';
import readline from 'readline';

const logPath = 'C:\\Users\\info\\.gemini\\antigravity\\brain\\b899c0e4-5ea4-4cfc-98f1-a9edbe7feaae\\.system_generated\\logs\\transcript.jsonl';

async function getLines() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (lineCount >= 92 && lineCount <= 108) {
      console.log(`Line ${lineCount}: ${line.substring(0, 500)}`);
    }
  }
}

getLines();
