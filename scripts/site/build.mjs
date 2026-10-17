/** Prepare a clean static deployment and resolve public share-preview URLs. */
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';
import { createHash } from 'node:crypto';
import { bundleStyles } from './styles.mjs';
import { responsiveImages } from './images.mjs';
import { loadCatalogue, syncCatalogueMarkup } from './catalogue-markup.mjs';
import { PAGES, JAVASCRIPT_FILES } from './config.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const normalizeHomeLinks = html => html.replace(/href="index\.html(#[^"]*)?"/g, (_, fragment = '') => `href="/${fragment}"`);
const OUTPUT = resolve(ROOT, 'dist');
const PRODUCT_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/site/manifests/product-images.json'), 'utf8'));
const CATEGORY_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/site/manifests/category-images.json'), 'utf8'));
const RESPONSIVE_IMAGES = JSON.parse(await readFile(resolve(ROOT, 'scripts/site/manifests/responsive-images.json'), 'utf8'));
const FONT_FILES = JSON.parse(await readFile(resolve(ROOT, 'scripts/site/manifests/fonts.json'), 'utf8'));
// An allowlist keeps docs, local caches and credentials out of the hosted site.
const PUBLIC_FILES = [
  ...PAGES, 'assets/css/style.css', ...JAVASCRIPT_FILES,
  ...FONT_FILES,
  ...Object.values(RESPONSIVE_IMAGES).flat().map(variant => variant.src),
  'assets/images/brand-logo.png', 'assets/images/engineering-logo.svg', 'assets/images/favicon-32.png',
  'assets/images/favicon-192.png', 'assets/images/apple-touch-icon.png',
  'assets/images/share-preview-sugarcane.jpg',
  ...['sugarcane-paper', 'sugarcane-kitchenware', 'sugarcane-bags', 'recycled-household'].map(id => 'assets/images/ranges/' + id + '-photo.jpg'),
  'assets/catalogues/MA-Industries-Paper-Catalogue.pdf',
  'assets/images/founders/aadil-dhukka.jpg',
  'assets/images/founders/maaz-dawa.jpg',
  'assets/images/founders/mohammed-dhukka.jpg',
  ...['sorting', 'washing', 'pellets', 'moulding'].map(stage => 'assets/images/gallery/recycling-' + stage + '.jpg'),
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
  const pageUrl = new URL(pagePath, url).href;
  return html
    .replace('<link rel="stylesheet"', '<link rel="preload" href="assets/fonts/dm-sans-normal-latin.woff2" as="font" type="font/woff2" crossorigin>\n' +
      '<link rel="preload" href="assets/fonts/playfair-display-normal-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet"')
    .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")(assets\/[^"\s]+)(")/g,
      (_, start, image, end) => start + escapeHtml(new URL(image, url).href) + end)
    .replace('</head>', '<meta name="robots" content="index,follow,max-image-preview:large">\n<link rel="canonical" href="' + escapeHtml(pageUrl) + '">\n' +
      '<meta property="og:url" content="' + escapeHtml(pageUrl) + '">\n</head>');
}

const pages = new Map();
// Canonicals must use the public domain, never the hosting provider's alias.
const configuredUrl = new URL(process.env.SITE_URL || 'https://maindustries.in/');
if (!['https:', 'http:'].includes(configuredUrl.protocol) || configuredUrl.username || configuredUrl.password) {
  throw new Error('SITE_URL must be an HTTP(S) address without credentials');
}
const siteOrigin = configuredUrl.origin + '/';
const publicFiles = new Set(PUBLIC_FILES);
// Version assets by content so a deployment cannot mix old helpers with new renderers.
const assetVersions = new Map();
const assetContents = new Map();
for (const file of [...JAVASCRIPT_FILES, 'assets/css/style.css']) {
  const contents = file.endsWith('.css')
    ? await bundleStyles(new URL('../../' + file, import.meta.url))
    : await readFile(resolve(ROOT, file));
  assetVersions.set(file, createHash('sha256').update(contents).digest('hex').slice(0, 12));
  // Reuse the same bytes for hashing and writing instead of bundling CSS twice.
  assetContents.set(file, contents);
}
const catalogue = await loadCatalogue();
for (const product of catalogue.papers) {
  if (product.cardImage && !publicFiles.has(product.cardImage)) {
    throw new Error(`Missing preview for ${product.id}; run scripts/images/create-responsive-images.py`);
  }
}
const watermarkContext = { window: {} };
new Script(await readFile(resolve(ROOT, 'assets/js/catalogue-utils.js'), 'utf8')).runInNewContext(watermarkContext);
const { watermarkImages } = watermarkContext.window.MACatalogueUtils;
for (const file of PAGES) {
  let html = await readFile(resolve(ROOT, file), 'utf8');
  for (const [, asset] of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    if (!publicFiles.has(asset)) throw new Error(`${file}: asset missing from build allowlist: ${asset}`);
  }
  pages.set(file, applyPublicUrl(
    syncCatalogueMarkup(html, catalogue),
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
  areaServed: 'Worldwide',
  description: 'Sugarcane-based essentials and recycled household products, alongside an established paper and packaging range.',
  knowsAbout: catalogue.categories.map(category => category.name)
};
for (const [file, sourceHtml] of pages) {
  const html = responsiveImages(watermarkImages(sourceHtml), RESPONSIVE_IMAGES).replace(/((?:src|href)=")(assets\/(?:js|css)\/[^"?]+)(?:\?[^"\s]*)?(")/g,
    (_, start, file, end) => assetVersions.has(file) ? `${start}${file}?v=${assetVersions.get(file)}${end}` : `${start}${file}${end}`);
  const pageUrl = new URL(file === 'index.html' ? '' : file, baseUrl).href;
  const name = html.match(/<title>\s*([\s\S]*?)\s*<\/title>/)[1].replaceAll('&amp;', '&');
  const graph = [organisation, {
    '@type': file === 'contact.html' ? 'ContactPage' : file === 'about.html' ? 'AboutPage' : ['categories.html', 'products.html'].includes(file) ? 'CollectionPage' : 'WebPage', '@id': pageUrl + '#webpage',
    url: pageUrl, name, inLanguage: 'en',
    description: html.match(/<meta name="description" content="([^"]+)"/)[1]
      .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'"),
    publisher: { '@id': organisation['@id'] },
    isPartOf: { '@id': new URL('#website', baseUrl).href }
  }, { '@type': 'WebSite', '@id': new URL('#website', baseUrl).href,
    url: baseUrl.href, name: organisation.name, publisher: { '@id': organisation['@id'] } }];
  if (file === 'categories.html') {
    graph[1].mainEntity = { '@id': pageUrl + '#categories' };
    graph.push({ '@type': 'ItemList', '@id': pageUrl + '#categories', name: 'Product categories',
      itemListElement: catalogue.categories.map((category, index) => ({
        '@type': 'ListItem', position: index + 1, name: category.name,
        url: new URL(`products.html?category=${category.id}#collection`, baseUrl).href
      })) });
  }
  if (file === 'products.html') {
    graph[1].mainEntity = { '@id': pageUrl + '#catalogue' };
    graph.push({ '@type': 'ItemList', '@id': pageUrl + '#catalogue', name: 'M&A Industries product catalogue',
      numberOfItems: catalogue.papers.length,
      itemListElement: catalogue.papers.map((product, index) => ({
        '@type': 'ListItem', position: index + 1, name: product.name,
        url: new URL(`products.html?category=${product.group}#paper-${product.id}`, baseUrl).href
      })) });
  }
  pages.set(file, html.replace('</head>', '<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c') + '</script>\n</head>'));
}

// Delete only this generated directory, never the checkout or source assets.
if (dirname(OUTPUT) !== resolve(ROOT) || basename(OUTPUT) !== 'dist') {
  throw new Error('Unexpected build output directory');
}
await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });

for (const file of new Set([...PUBLIC_FILES, ...pages.keys()])) {
  const destination = resolve(OUTPUT, file);
  await mkdir(dirname(destination), { recursive: true });
  if (pages.has(file)) {
    await writeFile(destination, normalizeHomeLinks(pages.get(file)));
  } else if (file.endsWith('.css')) {
    // Source remains readable; deployment removes comments and indentation.
    const css = assetContents.get(file);
    const compact = css.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(line => line.trim()).join('');
    await writeFile(destination, compact);
  } else {
    await copyFile(resolve(ROOT, file), destination);
  }
}
const sitemapUrls = [...pages.keys()].map(file => new URL(file === 'index.html' ? '' : file, baseUrl).href);
const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
await writeFile(resolve(OUTPUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapUrls.map(url => '  <url><loc>' + xmlEscape(url) + '</loc></url>').join('\n') + '\n</urlset>\n');
await writeFile(resolve(OUTPUT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + new URL('sitemap.xml', baseUrl).href + '\n');
console.log('Validated ' + JAVASCRIPT_FILES.length + ' scripts and prepared ' + pages.size + ' indexable pages and ' + PUBLIC_FILES.length + ' public assets.');
