import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { PAGES, ROOT, loadCatalogue, syncCatalogueMarkup } from '../scripts/site/catalogue-markup.mjs';
import { bundleStyles } from '../scripts/site/styles.mjs';
import { createSeoPages } from '../scripts/site/seo-pages.mjs';

const catalogue = await loadCatalogue();
const pages = new Map(await Promise.all(PAGES.map(async name => [name, await readFile(new URL(name, ROOT), 'utf8')])));
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');

test('all source pages use one shared navigation script and valid local asset paths', async () => {
  for (const [name, html] of pages) {
    assert.equal([...html.matchAll(/src="assets\/js\/navigation.js"/g)].length, 1, name);
    assert.doesNotMatch(html, /assets\/js\/about.js/, name);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate element ID`);
    for (const [, path] of html.matchAll(/(?:src|href)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
      await access(new URL(path, ROOT));
    }
  }
});

test('all twelve category cards, desktop filters and mobile options agree with catalogue data', () => {
  for (const [name, html] of pages) assert.equal(syncCatalogueMarkup(html, catalogue), html, `${name}: run npm run sync:catalogue`);
  const products = pages.get('products.html');
  const directory = pages.get('categories.html');
  for (const category of catalogue.categories) {
    const count = catalogue.papers.filter(item => item.group === category.id).length;
    const button = products.match(new RegExp(`data-filter="${category.id}"><span>(.*?)</span><small>(\\d+)</small>`));
    assert.ok(button, category.id);
    assert.equal(decode(button[1]), category.name);
    assert.equal(Number(button[2]), count);
    const option = products.match(new RegExp(`<option value="${category.id}">(.*?)</option>`));
    assert.equal(decode(option[1]), `${category.name} (${count})`);
    const card = directory.match(new RegExp(`href="products.html\\?category=${category.id}#collection">([\\s\\S]*?)</a>`));
    assert.ok(card, category.id);
    assert.equal(decode(card[1].match(/class="directory-title">(.*?)</)[1]), category.name);
    assert.match(card[1], new RegExp(`/ ${count} PRODUCTS`));
  }
});

test('static category fallbacks update when data changes', () => {
  const updated = { ...catalogue, papers: [...catalogue.papers, { ...catalogue.papers[0], id: 'test-only-extra' }] };
  const html = syncCatalogueMarkup(pages.get('products.html'), updated);
  assert.match(html, /All products \(63\)/);
  assert.match(html, /value="boards">Boards &amp; cartons \(6\)/);
  assert.equal(syncCatalogueMarkup(html, updated), html, 'sync is idempotent');
});

test('local CSS modules compile into one stylesheet with no unresolved local imports', async () => {
  const css = await bundleStyles(new URL('assets/css/style.css', ROOT));
  assert.doesNotMatch(css, /@import\s+url\(['"](?:shared|catalogue|footer|brands)\.css/);
  for (const selector of ['.mobile-category-filter', '.product-search', '.footer-nav-links', '.brand-card-actions']) assert.ok(css.includes(selector));
  assert.match(css, /fonts.googleapis.com/);
});

test('every generated category and product page has its own title, details and working catalogue link', async () => {
  const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const seo = await createSeoPages(ROOT, new URL('https://maindustries.in/'), escape);
  assert.equal(seo.pages.size, catalogue.papers.length + catalogue.categories.length);
  for (const category of catalogue.categories) {
    const html = seo.pages.get(`category-${category.id}.html`);
    assert.ok(html.includes(`<h1>${escape(category.name)}</h1>`));
    assert.ok(html.includes('assets/js/navigation.js'));
  }
  for (const product of catalogue.papers) {
    const html = seo.pages.get(`product-${product.id}.html`);
    assert.ok(html.includes(`products.html?category=${product.group}#paper-${product.id}`));
    assert.ok(html.includes(`<h1>${escape(product.name)}</h1>`));
    assert.ok(html.includes(product.image));
  }
});

test('brand cards retain separate website/profile actions and an inactive Industries profile', () => {
  const home = pages.get('index.html');
  assert.equal([...home.matchAll(/<article class="brand-card"/g)].length, 2);
  assert.match(home, /href="https:\/\/share.google\/3tvaFA4OTGrtFLroK"[^>]*rel="noopener noreferrer"/);
  assert.match(home, /class="brand-card-link brand-card-link-disabled" role="link" aria-disabled="true"/);
  assert.doesNotMatch(home, /<a[^>]*aria-disabled="true"[^>]*href=/);
});
