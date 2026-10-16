/** Syntax checks for every browser script; no dependency installation needed. */
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { ROOT, JAVASCRIPT_FILES } from './config.mjs';

for (const file of JAVASCRIPT_FILES) {
  const source = await readFile(new URL(file, ROOT), 'utf8');
  new Script(source, { filename: file });
}
console.log('JavaScript syntax checks passed for ' + JAVASCRIPT_FILES.length + ' files.');
