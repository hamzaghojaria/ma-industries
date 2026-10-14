/** Generate the catalogue PDF using the current website catalogue data. */
import { execFileSync } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, runInNewContext } from 'node:vm';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const sourcePath = resolve(ROOT, 'assets/js/catalogue-data.js');
const dataSource = await readFile(sourcePath, 'utf8');
new Script(dataSource, { filename: sourcePath });

const context = { window: {} };
runInNewContext(dataSource, context);
const catalogue = context.window.MACatalogueData;
if (!catalogue || !Array.isArray(catalogue.papers) || !Array.isArray(catalogue.categories)) {
  throw new Error('Catalogue data is missing products or categories.');
}

const tempDirectory = resolve(ROOT, 'tmp/pdfs');
await mkdir(tempDirectory, { recursive: true });
await writeFile(resolve(tempDirectory, 'catalogue-data.json'), JSON.stringify(catalogue));

const bundledPython = resolve(ROOT, 'tmp/pdf-venv/Scripts/python.exe');
let python = process.env.PYTHON?.trim() || 'python';
try {
  await access(bundledPython, constants.X_OK);
  if (!process.env.PYTHON) python = bundledPython;
} catch {
  // Use the Python executable on PATH when the local Windows environment is absent.
}

execFileSync(python, [resolve(ROOT, 'scripts/catalogue/create-range-catalogue.py'), ...process.argv.slice(2)], {
  cwd: ROOT,
  stdio: 'inherit'
});
