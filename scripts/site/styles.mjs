/** Inline local CSS modules while retaining external font imports and rule order. */
import { readFile } from 'node:fs/promises';

export async function bundleStyles(entry, ancestors = new Set()) {
  const url = new URL(entry);
  if (ancestors.has(url.href)) throw new Error(`Circular CSS import: ${url.pathname}`);
  const parents = new Set([...ancestors, url.href]);
  const css = await readFile(url, 'utf8');
  const imports = [...css.matchAll(/@import\s+url\(['"]([^'"]+)['"]\)\s*;/g)];
  let result = css;
  for (const match of imports) {
    if (/^https?:/.test(match[1])) continue;
    if (!/^[a-z-]+\.css$/.test(match[1])) throw new Error(`Unsupported CSS import: ${match[1]}`);
    result = result.replace(match[0], await bundleStyles(new URL(match[1], url), parents));
  }
  return result;
}
