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
  const count = id => papers.filter(item => item.group === id).length;
  const names = new Map(categories.map(category => [category.id, category.name]));
  // IDs stay stable: URLs and product deep links continue to resolve.
  html = html.replace(/(<button\b[^>]*data-filter="([^"]+)"[^>]*>)([\s\S]*?)(<\/button>)/g,
    (_, start, id, body, end) => start + (id === 'all'
      ? body.replace(/<small>\d+<\/small>/, `<small>${papers.length}</small>`)
      : body.replace(/<span>[\s\S]*?<\/span>/, `<span>${escapeHtml(names.get(id))}</span>`)
        .replace(/<small>\d+<\/small>/, `<small>${count(id)}</small>`)) + end);
  html = html.replace(/(<select\b[^>]*id="category-select"[^>]*>)[\s\S]*?(<\/select>)/,
    (_, start, end) => start + '\n' + [
      `              <option value="all">All products (${papers.length})</option>`,
      ...categories.map(category => `              <option value="${category.id}">${escapeHtml(category.name)} (${count(category.id)})</option>`)
    ].join('\n') + '\n            ' + end);
  html = html.replace(/(<a class="directory-card" href="products.html\?category=([^"#]+)#collection">)([\s\S]*?)(<\/a>)/g,
    (_, start, id, body, end) => start + body
      .replace(/(<span class="directory-title">)[\s\S]*?(<\/span>)/, `$1${escapeHtml(names.get(id))}$2`)
      .replace(/(\d{2} \/ )\d+( PRODUCTS)/, `$1${count(id)}$2`) + end);
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
