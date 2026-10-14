import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cataloguePages, escapeHtml, productPath } from '../scripts/seo.mjs';

test('every catalogue paper has crawlable content and reachable related pages', async () => {
  const root = new URL('../', import.meta.url);
  const template = await readFile(new URL('about.html', root), 'utf8');
  const { pages, papers } = await cataloguePages(root, template);
  assert.equal(pages.size, papers.length);
  const titles = new Set();
  for (const paper of papers) {
    const path = productPath(paper);
    const html = pages.get(path);
    assert.ok(html.includes(`<h1>${escapeHtml(paper.name)}</h1>`));
    assert.ok(html.includes(escapeHtml(paper.desc)));
    for (const use of paper.uses) assert.ok(html.includes(`<li>${escapeHtml(use)}</li>`));
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(!html.includes('aria-current="page"'));
    titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
    for (const [, target] of html.matchAll(/href="(paper-[^"]+\.html)"/g)) assert.ok(pages.has(target));
  }
  assert.equal(titles.size, papers.length);
});
