/** Keep static fallbacks and deployed category labels/counts tied to catalogue data. */
import { readFile, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { pathToFileURL } from 'node:url';
import { ROOT, PAGES } from './config.mjs';

export { ROOT, PAGES };
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export async function loadCatalogue() {
  const context = { window: {} };
  runInNewContext(await readFile(new URL('assets/js/catalogue-data.js', ROOT), 'utf8'), context);
  return context.window.MACatalogueData;
}

export function syncCatalogueMarkup(html, { papers, categories }) {
  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  const counts = new Map(categories.map(category => [category.id, 0]));
  for (const product of papers) counts.set(product.group, counts.get(product.group) + 1);
  const count = id => counts.get(id);
  const names = new Map(categories.map(category => [category.id, category.name]));
  const positions = new Map(categories.map((category, index) => [category.id, index + 1]));
  const groups = [
    { id: 'sugarcane-recycled', name: 'Sugarcane & Recycled', categories: categories.filter(category => category.collection === 'sugarcane-recycled') },
    { id: 'paper-packaging', name: 'Paper & Packaging', categories: categories.filter(category => category.collection !== 'sugarcane-recycled') }
  ];
  // Keep product information available on the catalogue itself without JavaScript.
  html = html.replace(/<!-- catalogue-fallback:start -->[\s\S]*?<!-- catalogue-fallback:end -->/,
    '<!-- catalogue-fallback:start --><noscript><section class="catalogue-fallback"><h2>Product information</h2><p>Browse applications and specifications below. Enable JavaScript to use product popups and filters.</p>' +
    categories.map(category => `<h3>${escapeHtml(category.name)}</h3>` +
      papers.filter(product => product.group === category.id).map(product =>
        `<article id="fallback-${product.id}"><h4>${escapeHtml(product.name)}</h4><p>${escapeHtml(product.desc)}</p>` +
        `<p><strong>Material:</strong> ${escapeHtml(product.material || 'Paper / board; confirm grade and composition.')}</p>` +
        `<p><strong>Uses:</strong> ${product.uses.map(escapeHtml).join('; ')}</p>` +
        (product.gsm ? `<p><strong>Paper weight:</strong> ${product.gsm.min}-${product.gsm.max} GSM (indicative)</p>` : '') +
        (product.specifications?.length ? '<ul>' + product.specifications.map(spec => `<li>${escapeHtml(typeof spec === 'object' ? spec.label + ': ' + spec.value : spec)}</li>`).join('') + '</ul>' : '') +
        `<p><a href="index.html#enquiry">Enquire about ${escapeHtml(product.name)}</a></p></article>`).join('')).join('') +
    '</section></noscript><!-- catalogue-fallback:end -->');
  // Own the entire grouped control so desktop order cannot drift from mobile/data.
  html = html.replace(/(<aside class="catalogue-sidebar"[^>]*>)[\s\S]*?(<\/aside>)/,
    (_, start, end) => start + '<div class="category-desktop"><h2>Browse categories</h2>' +
      `<button type="button" class="category-all active" data-filter="all">Show all products <small>${papers.length}</small></button>` +
      groups.map(group => `<div class="category-group"><h3>${escapeHtml(group.name)}</h3>` +
        group.categories.map(category => `<button type="button" data-filter="${category.id}"><span>${escapeHtml(category.name)}</span><small>${count(category.id)}</small></button>`).join('') + '</div>').join('') + '</div>' + end);
  // IDs stay stable: URLs and product deep links continue to resolve.
  html = html.replace(/(<select\b[^>]*id="category-select"[^>]*>)[\s\S]*?(<\/select>)/,
    (_, start, end) => start + newline + [
      `              <option value="all">All products (${papers.length})</option>`,
      ...categories.map(category => `              <option value="${category.id}">${escapeHtml(category.name)} (${count(category.id)})</option>`)
    ].join(newline) + newline + '            ' + end);
  html = html.replace(/(<a class="directory-card" href="products.html\?category=([^"#]+)#collection">)([\s\S]*?)(<\/a>)/g,
    (_, start, id, body, end) => start + body
      .replace(/(<span class="directory-title">)[\s\S]*?(<\/span>)/, `$1${escapeHtml(names.get(id))}$2`)
      .replace(/\d{2} \/ \d+( PRODUCTS)/, `${String(positions.get(id)).padStart(2, '0')} / ${count(id)}$1`) + end);
  // Reorder the cards in each collection while keeping the original destinations.
  html = html.replace(/<section class="directory-section[^>]*>[\s\S]*?<\/section>/g, section => {
    const cards = [...section.matchAll(/<a class="directory-card" href="products.html\?category=([^"#]+)#collection">[\s\S]*?<\/a>/g)]
      .sort((a, b) => positions.get(a[1]) - positions.get(b[1]));
    let index = 0;
    return section.replace(/<a class="directory-card" href="products.html\?category=[^"#]+#collection">[\s\S]*?<\/a>/g, () => cards[index++][0]);
  });
  for (const group of groups) {
    const total = group.categories.reduce((sum, category) => sum + count(category.id), 0);
    const jump = new RegExp(`(href="#${group.id}"[\\s\\S]*?<span class="collection-jump-count">)[\\s\\S]*?(<\\/span>)`);
    html = html.replace(jump, `$1${total} products &middot; ${group.categories.length} categories$2`);

  }
  html = html.replace(/\b\d+ PRODUCTS \/ \d+ CATEGORIES/g, `${papers.length} PRODUCTS / ${categories.length} CATEGORIES`)
    .replace(/Browse all \d+ paper, packaging/g, `Browse all ${papers.length} paper, packaging`);
  const paperCategories = categories.filter(category => category.collection !== 'sugarcane-recycled');
  const otherCategories = categories.filter(category => category.collection === 'sugarcane-recycled');
  for (const [ids, anchor] of [[paperCategories, 'paper-packaging'], [otherCategories, 'sugarcane-recycled']]) {
    const total = ids.reduce((sum, category) => sum + count(category.id), 0);
    const pattern = new RegExp(`(href="categories.html#${anchor}"[\\s\\S]*?<span class="range-link">)\\d+ categories · \\d+ products`);
    html = html.replace(pattern, `$1${ids.length} categories · ${total} products`);
  }
  return html;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const catalogue = await loadCatalogue();
  const write = process.argv.includes('--write');
  let stale = 0;
  for (const page of PAGES) {
    const url = new URL(page, ROOT);
    const before = await readFile(url, 'utf8');
    const after = syncCatalogueMarkup(before, catalogue);
    if (before !== after) {
      stale++;
      if (write) await writeFile(url, after);
      else console.error(`${page}: catalogue labels/counts are stale; run npm run sync:catalogue`);
    }
  }
  if (stale && !write) process.exitCode = 1;
  else console.log(write ? `Synchronized ${stale} source pages.` : 'Catalogue page labels and counts are synchronized.');
}
