/** Prepare a clean static deployment and resolve public share-preview URLs. */
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUTPUT = resolve(ROOT, 'dist');
const JAVASCRIPT_FILES = [
  'assets/js/catalogue-data.js',
  'assets/js/catalogue-utils.js',
  'assets/js/app.js'
];
const PRODUCT_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/product-images.json'), 'utf8'));
const CATEGORY_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/category-images.json'), 'utf8'));
// An allowlist keeps docs, local caches and credentials out of the hosted site.
const PUBLIC_FILES = [
  'index.html', 'assets/css/style.css', ...JAVASCRIPT_FILES,
  'assets/images/brand-logo.png', 'assets/images/favicon-32.png',
  'assets/images/favicon-192.png', 'assets/images/apple-touch-icon.png',
  'assets/images/share-preview.png',
  ...PRODUCT_IMAGES.map(file => 'assets/images/products/' + file),
  ...CATEGORY_IMAGES.map(file => 'assets/images/categories/' + file)
];

for (const file of JAVASCRIPT_FILES) {
  new Script(await readFile(resolve(ROOT, file), 'utf8'), { filename: file });
}

function applyPublicUrl(html, origin) {
  if (!origin) return html;
  const url = new URL(origin);
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error('SITE_URL must be an HTTP(S) address');
  }
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  const imageUrl = new URL('assets/images/share-preview.png', url).href;
  return html
    .replaceAll('content="assets/images/share-preview.png"', 'content="' + imageUrl + '"')
    .replace('</head>', '<link rel="canonical" href="' + url.href + '">\n' +
      '<meta property="og:url" content="' + url.href + '">\n</head>');
}

const html = applyPublicUrl(
  await readFile(resolve(ROOT, 'index.html'), 'utf8'),
  process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL
);

// Delete only this generated directory, never the checkout or source assets.
if (dirname(OUTPUT) !== resolve(ROOT) || basename(OUTPUT) !== 'dist') {
  throw new Error('Unexpected build output directory');
}
await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });

for (const file of PUBLIC_FILES) {
  const destination = resolve(OUTPUT, file);
  await mkdir(dirname(destination), { recursive: true });
  if (file === 'index.html') {
    await writeFile(destination, html);
  } else if (file.endsWith('.css')) {
    // Source remains readable; deployment removes comments and indentation.
    const css = await readFile(resolve(ROOT, file), 'utf8');
    const compact = css.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(line => line.trim()).join('');
    await writeFile(destination, compact);
  } else {
    await copyFile(resolve(ROOT, file), destination);
  }
}
console.log('Validated ' + JAVASCRIPT_FILES.length + ' scripts and prepared ' + PUBLIC_FILES.length + ' public assets.');
