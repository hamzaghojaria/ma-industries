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

test('photo watermarks cover content images once and leave brand assets unchanged', () => {
  for (const folder of ['products', 'categories', 'ranges', 'gallery', 'founders']) {
    const image = `<img src="assets/images/${folder}/example.jpg" alt="Example">`;
    const marked = utils.watermarkImages(image);
    assert.equal(marked, `<span class="watermarked-image">${image}</span>`);
    assert.equal(utils.watermarkImages(marked), marked);
  }
  for (const file of ['brand-logo.png', 'engineering-logo.svg', 'favicon-32.png']) {
    const image = `<img src="assets/images/${file}" alt="Brand">`;
    assert.equal(utils.watermarkImages(image), image);
  }
});

test('catalogue validates groups and rejects duplicate IDs', () => {
  assert.doesNotThrow(() => utils.validateCatalogue(papers, categories));
  assert.throws(() => utils.validateCatalogue([papers[0], papers[0]], categories), /Duplicate/);
  assert.throws(() => utils.validateCatalogue([{ ...papers[0], group: 'missing' }], categories), /Unknown/);
});

test('product WhatsApp drafts identify the item and ask for relevant specifications', () => {
  const paper = papers.find(item => item.id === 'kraft-paper');
  const kitchenware = papers.find(item => item.id === 'cutting-boards');
  const paperText = utils.productWhatsAppText(paper, 'Packaging & bags');
  assert.match(paperText, /I'm interested in Kraft paper/);
  assert.match(paperText, /Category: Packaging & bags/);
  assert.match(paperText, /Size \/ GSM \/ finish/);
  const kitchenText = utils.productWhatsAppText(kitchenware, 'Sugarcane Kitchenware');
  assert.ok(kitchenText.includes(kitchenware.name));
  assert.match(kitchenText, /Size \/ capacity \/ colour/);
  assert.doesNotMatch(kitchenText, /GSM/);
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

test('new collections are searchable by material and category', () => {
  const films = utils.filterPapers(papers, {category: 'sugarcane-bags', query: 'Bio-PE'});
  assert.equal(films.length, 7);
  const household = utils.filterPapers(papers, {category: 'sugarcane-kitchenware', query: 'sugarcane'});
  assert.equal(household.length, papers.filter(product => product.group === 'sugarcane-kitchenware').length);
  assert.ok(utils.filterPapers(papers, {query: 'PCR PP'}).every(product => product.group === 'recycled-household'));
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
  assert.match(text, /Product: Help me choose/);
  assert.match(text, /Quantity: Not specified/);
  assert.match(text, /Project details: Carry bags/);
  assert.doesNotMatch(text, /Company:|Required by:|enquiry has been sent/i);
});

test('GSM guides cover the catalogue and reject invalid ranges', () => {
  for (const paper of papers) {
    assert.ok(Object.hasOwn(paper, 'gsm'));
    assert.match(utils.gsmLabel(paper), paper.gsm ? /^\d+–\d+ GSM$/ : /^Varies by grade$/);
  }
  assert.equal(papers.filter(paper => paper.gsm === null && !paper.material).length, 1);
  assert.equal(papers.find(paper => paper.gsm === null).id, 'scrap-paper');
  for (const gsm of [{min: 0, max: 100}, {min: 100, max: 50}, {min: 50, max: Infinity}]) {
    assert.throws(() => utils.validateCatalogue([{...papers[0], gsm}], categories), /Invalid GSM/);
  }
});

test('every catalogue product has useful, non-fabricated specification fields', () => {
  for (const paper of papers) {
    const fields = Array.from(utils.specificationFields(paper));
    assert.ok(fields.length >= 4, paper.id + ' should expose at least four specification fields');
    assert.ok(fields.every(field => field.label && field.value));
    assert.ok(fields.some(field => /dimension|size|paper weight/i.test(field.label)), paper.id + ' should ask for size or weight');
  }
  const clingWrap = papers.find(paper => paper.id === 'easy-cut-cling-wraps');
  const exactValues = utils.specificationFields(clingWrap).map(field => field.value).join(' ');
  assert.match(exactValues, /12 μm/);
  const exactFields = utils.specificationFields(clingWrap).map(field => `${field.label}: ${field.value}`).join(' ');
  assert.match(exactFields, /20 cm roll: 12 μm; 100 m/);
});
