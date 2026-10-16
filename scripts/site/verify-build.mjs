/** Check every deployed HTML asset, page link and static anchor without network requests. */
import { access, readFile, readdir } from 'node:fs/promises';
import { ROOT } from './config.mjs';

const output = new URL('dist/', ROOT);
const files = (await readdir(output)).filter(file => file.endsWith('.html'));
const pages = new Map(await Promise.all(files.map(async file => [file, await readFile(new URL(file, output), 'utf8')])));
let links = 0;
for (const [file, html] of pages) {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) throw new Error(`${file}: duplicate element ID`);
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const url = new URL(value, `https://local.test/${file}`);
    const path = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
    await access(new URL(path, output)).catch(() => { throw new Error(`${file}: missing local target ${value}`); });
    // Product hashes are rendered by app.js; static section hashes must exist in HTML.
    if (url.hash && !url.hash.startsWith('#paper-') && pages.has(path)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !pages.get(path).includes(`id="${id}"`)) throw new Error(`${file}: missing anchor ${value}`);
    }
    links++;
  }
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
}
const css = await readFile(new URL('assets/css/style.css', output), 'utf8');
if (/@import\s+url\(['"](?!https?:)/.test(css)) throw new Error('Deployment CSS contains unbundled local imports');
console.log(`Verified ${files.length} deployed pages, ${links} local links/assets and structured data.`);
