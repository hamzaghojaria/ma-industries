/** Syntax checks for every browser script; no dependency installation needed. */
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';

const files = ['catalogue-data.js', 'catalogue-utils.js', 'app.js', 'about.js', 'experience.js'];
for (const file of files) {
  const source = await readFile(new URL('../../assets/js/' + file, import.meta.url), 'utf8');
  new Script(source, { filename: file });
}
console.log('JavaScript syntax checks passed for ' + files.length + ' files.');
