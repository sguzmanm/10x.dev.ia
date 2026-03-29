import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { parseInput } from './interface/cli/parseInput';
import { generateQuestions } from './use-cases/generate-questions/generateQuestions';
import { displayOutput } from './interface/cli/displayOutput';

async function readStdin(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin });
  const lines: string[] = [];

  return new Promise((resolve) => {
    rl.on('line', (line) => lines.push(line));
    rl.on('close', () => resolve(lines.join('\n')));
  });
}

async function main(): Promise<void> {
  const raw = await readStdin();

  const tasks = parseInput(raw);
  const output = await generateQuestions({ tasks });

  displayOutput(output);
}

main().catch((err: Error) => {
  console.error('Error:', err.message);
  process.exit(1);
});
