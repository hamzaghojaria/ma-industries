import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
for (const file of ['catalogue-data.js', 'catalogue-utils.js']) {
  vm.runInContext(await readFile(new URL('../assets/js/' + file, import.meta.url), 'utf8'), context);
}
const { papers, categories } = context.window.MACatalogueData;
const utils = context.window.MACatalogueUtils;

test('catalogue validates groups and rejects duplicate IDs', () => {
  assert.doesNotThrow(() => utils.validateCatalogue(papers, categories));
  assert.throws(() => utils.validateCatalogue([papers[0], papers[0]], categories), /Duplicate/);
  assert.throws(() => utils.validateCatalogue([{ ...papers[0], group: 'missing' }], categories), /Unknown/);
});

test('category and application search combine without mutating collection order', () => {
  const original = papers.map(paper => paper.id).join(',');
  const results = utils.filterPapers(papers, { category: 'labels', query: ' THERMAL ' });
  assert.equal(results.length, 2);
  assert.ok(results.every(paper => paper.group === 'labels'));
  assert.equal(utils.filterPapers(papers, { category: 'office', query: 'thermal' }).length, 0);
  assert.equal(utils.filterPapers(papers, { query: 'zz-no-match' }).length, 0);
  utils.filterPapers(papers, { sort: 'az' });
  assert.equal(papers.map(paper => paper.id).join(','), original);
});

test('pagination clamps pages after filtering and supports empty results', () => {
  const page = utils.paginate(papers, 999, 6);
  assert.equal(page.currentPage, page.totalPages);
  assert.ok(page.items.length <= 6);
  assert.equal(page.offset + page.items.length, papers.length);
  assert.equal(utils.paginate(papers.slice(0, 3), 6, 6).currentPage, 1);
  const empty = utils.paginate([], 6, 6);
  assert.equal(empty.currentPage, 1);
  assert.equal(empty.totalPages, 1);
  assert.equal(empty.items.length, 0);
});

test('compact page navigation always includes the current page and valid endpoints', () => {
  assert.deepEqual(Array.from(utils.paginationPages(6, 1)), [1, 2, 3, '…', 6]);
  for (const total of [2, 6, 15]) {
    for (let current = 1; current <= total; current++) {
      const pages = Array.from(utils.paginationPages(total, current));
      assert.ok(pages.includes(current));
      assert.equal(pages[0], 1);
      assert.equal(pages.at(-1), total);
      assert.ok(pages.filter(page => typeof page === 'number').every(page => page >= 1 && page <= total));
    }
  }
});

test('enquiry contains entered details, handles general enquiries and does not claim sending', () => {
  const values = new Map([
    ['name', 'Test visitor'], ['email', 'visitor@example.com'],
    ['paper', 'Help me choose'], ['quantity', ''], ['details', 'Carry bags']
  ]);
  const text = utils.enquiryText(values);
  assert.match(text, /Paper: Help me choose/);
  assert.match(text, /Quantity: Not specified/);
  assert.match(text, /Project details: Carry bags/);
  assert.doesNotMatch(text, /Company:|Required by:|enquiry has been sent/i);
});
