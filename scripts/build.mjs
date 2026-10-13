/** Prepare a clean static deployment and resolve public share-preview URLs. */
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { cataloguePages, escapeHtml } from './seo.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUTPUT = resolve(ROOT, 'dist');
const JAVASCRIPT_FILES = [
  'assets/js/catalogue-data.js',
  'assets/js/catalogue-utils.js',
  'assets/js/app.js',
  'assets/js/about.js'
];
const PRODUCT_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/product-images.json'), 'utf8'));
const CATEGORY_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/category-images.json'), 'utf8'));
// An allowlist keeps docs, local caches and credentials out of the hosted site.
const PUBLIC_FILES = [
  'index.html', 'about.html', 'assets/css/style.css', ...JAVASCRIPT_FILES,
  'assets/images/brand-logo.png', 'assets/images/favicon-32.png',
  'assets/images/favicon-192.png', 'assets/images/apple-touch-icon.png',
  'assets/images/share-preview.png',
  'assets/catalogues/MA-Industries-Paper-Catalogue.pdf',
  'assets/images/founders/aadil-dhukka.jpg',
  'assets/images/founders/maaz-dawa.jpg',
  'assets/images/founders/mohammed-dhukka.jpg',
  'assets/images/gallery/paper-mill-line.jpg',
  'assets/images/gallery/malu-production-reference.webp',
  'assets/images/gallery/malu-gallery-03.webp',
  'assets/images/gallery/malu-gallery-04.webp',
  'assets/images/gallery/paper-mill-reels.jpg',
  ...PRODUCT_IMAGES.map(file => 'assets/images/products/' + file),
  ...CATEGORY_IMAGES.map(file => 'assets/images/categories/' + file)
];

for (const file of JAVASCRIPT_FILES) {
  new Script(await readFile(resolve(ROOT, file), 'utf8'), { filename: file });
}

function applyPublicUrl(html, origin, pagePath = '') {
  if (!origin) return html;
  const url = new URL(origin);
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error('SITE_URL must be an HTTP(S) address');
  }
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  const imageUrl = new URL('assets/images/share-preview.png', url).href;
  const pageUrl = new URL(pagePath, url).href;
  return html
    .replaceAll('content="assets/images/share-preview.png"', 'content="' + escapeHtml(imageUrl) + '"')
    .replace('</head>', '<link rel="canonical" href="' + escapeHtml(pageUrl) + '">\n' +
      '<meta property="og:url" content="' + escapeHtml(pageUrl) + '">\n</head>');
}

const pages = new Map();
const siteOrigin = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || 'https://maindustries.in/';
const catalogue = await cataloguePages(new URL('../', import.meta.url), await readFile(resolve(ROOT, 'about.html'), 'utf8'));
PUBLIC_FILES.push(...catalogue.pages.keys());
const publicFiles = new Set(PUBLIC_FILES);
for (const file of ['index.html', 'about.html', ...catalogue.pages.keys()]) {
  let html = catalogue.pages.get(file) || await readFile(resolve(ROOT, file), 'utf8');
  if (file === 'index.html') html = html.replace('<!-- Material-selection process. -->', catalogue.directory + '\n<!-- Material-selection process. -->');
  for (const [, asset] of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    if (!publicFiles.has(asset)) throw new Error(`${file}: asset missing from build allowlist: ${asset}`);
  }
  pages.set(file, applyPublicUrl(
    html,
    siteOrigin,
    file === 'index.html' ? '' : file
  ));
}
const baseUrl = new URL('/', siteOrigin);
const organisation = {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': new URL('#organization', baseUrl).href,
  name: 'M&A Industries', url: baseUrl.href,
  logo: new URL('assets/images/brand-logo.png', baseUrl).href,
  email: 'info@maindustries.in', telephone: '+91 97696 81761',
  address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
  areaServed: 'Worldwide'
};
for (const [file, html] of pages) {
  const pageUrl = new URL(file === 'index.html' ? '' : file, baseUrl).href;
  const name = html.match(/<title>\s*([\s\S]*?)\s*<\/title>/)[1].replaceAll('&amp;', '&');
  const graph = [organisation, {
    '@type': file === 'about.html' ? 'AboutPage' : 'WebPage', '@id': pageUrl + '#webpage',
    url: pageUrl, name, inLanguage: 'en',
    publisher: { '@id': organisation['@id'] },
    isPartOf: { '@id': new URL('#website', baseUrl).href }
  }, { '@type': 'WebSite', '@id': new URL('#website', baseUrl).href,
    url: baseUrl.href, name: organisation.name, publisher: { '@id': organisation['@id'] } }];
  if (catalogue.pages.has(file)) graph.push({
    '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl.href },
      { '@type': 'ListItem', position: 2, name: catalogue.papers.find(paper => file === `paper-${paper.id}.html`).name, item: pageUrl }
    ]
  });
  pages.set(file, html.replace('</head>', '<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c') + '</script>\n</head>'));
}

// Delete only this generated directory, never the checkout or source assets.
if (dirname(OUTPUT) !== resolve(ROOT) || basename(OUTPUT) !== 'dist') {
  throw new Error('Unexpected build output directory');
}
await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });

for (const file of PUBLIC_FILES) {
  const destination = resolve(OUTPUT, file);
  await mkdir(dirname(destination), { recursive: true });
  if (pages.has(file)) {
    await writeFile(destination, pages.get(file));
  } else if (file.endsWith('.css')) {
    // Source remains readable; deployment removes comments and indentation.
    const css = await readFile(resolve(ROOT, file), 'utf8');
    const compact = css.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(line => line.trim()).join('');
    await writeFile(destination, compact);
  } else {
    await copyFile(resolve(ROOT, file), destination);
  }
}
const sitemapUrls = ['', 'about.html', ...catalogue.pages.keys()].map(file => new URL(file, baseUrl).href);
const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
await writeFile(resolve(OUTPUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapUrls.map(url => '  <url><loc>' + xmlEscape(url) + '</loc></url>').join('\n') + '\n</urlset>\n');
await writeFile(resolve(OUTPUT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + new URL('sitemap.xml', baseUrl).href + '\n');
console.log('Validated ' + JAVASCRIPT_FILES.length + ' scripts and prepared ' + PUBLIC_FILES.length + ' public assets.');
