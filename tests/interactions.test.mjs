import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createPageFixture } from './page-fixture.mjs';

const sources = await Promise.all(['catalogue-data.js', 'catalogue-utils.js', 'app.js', 'gallery.js', 'navigation.js'].map(file =>
  readFile(new URL('../assets/js/' + file, import.meta.url), 'utf8')
));
function boot(search = '') {
  const page = createPageFixture();
  page.location.search = search;
  const context = vm.createContext(page.globals);
  for (const source of sources) vm.runInContext(source, context);
  return page;
}

test('every card product link stays in the catalogue popup', () => {
  const page = boot();
  const html = page.get('products').innerHTML;
  assert.doesNotMatch(html, /href="product-[^"]+\.html"/);
  const product = page.window.MACatalogueData.papers[0];
  assert.equal((html.match(new RegExp(`href="#paper-${product.id}"`, 'g')) || []).length, 4);
  const card = {dataset: {paperId: product.id}};
  const target = {closest: selector => selector === '[data-paper-id]' ? card : null};
  page.get('products').dispatch('click', {target});
  assert.equal(page.location.hash, '#paper-' + product.id);
  page.window.listeners.hashchange[0]();
  assert.equal(page.get('detail').open, true);
});

test('every mobile category option can select products and reset to the full catalogue', () => {
  const page = boot();
  const data = page.window.MACatalogueData;
  const options = page.get('category-select').children;
  assert.equal(options.length, data.categories.length + 1);
  for (const category of data.categories) {
    const count = data.papers.filter(product => product.group === category.id).length;
    assert.equal(options.find(option => option.value === category.id).textContent, `${category.name} (${count})`);
    page.get('category-select').value = category.id;
    page.get('category-select').dispatch('change');
    assert.equal(page.get('active-category').textContent, category.name);
    assert.equal(page.get('category-description').textContent, category.desc);
    assert.ok(page.get('results-count').textContent.includes(`of ${count} products`));
    assert.equal(page.get('filter-' + category.id).getAttribute('aria-pressed'), 'true');
  }
  page.get('reset-catalogue').click();
  assert.equal(page.get('category-select').value, 'all');
  assert.equal(page.get('active-category').textContent, 'All products');
  assert.match(page.get('category-description').textContent, /sugarcane-based and recycled/);
});

test('every product has the same expandable details and enquiry controls', () => {
  const page = boot();
  for (const product of page.window.MACatalogueData.papers) {
    page.location.hash = '#paper-' + product.id;
    page.window.listeners.hashchange[0]();
    const html = page.get('detail-body').innerHTML;
    for (const heading of ['Material', 'Uses &amp; applications', 'Specifications']) assert.ok(html.includes(`<h3>${heading}</h3>`), product.id);
    assert.ok(html.indexOf('<h3>Specifications</h3>') < html.indexOf('<details'), product.id);
    assert.doesNotMatch(html, /View full product page|href="product-[^"]+\.html"/, product.id);
    assert.match(html, /<details class="product-extra-details"><summary>More details<\/summary>/, product.id);
    assert.match(html, /<strong>What to share:<\/strong>/, product.id);
    assert.ok(html.includes(`data-choose-paper="${product.id}"`), product.id);
    if (product.details) assert.ok(html.includes(product.details.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')), product.id);
  }
});

test('home page works without catalogue and product-dialog elements', () => {
  const page = createPageFixture();
  const originalGet = page.document.getElementById;
  page.document.getElementById = id => ['products', 'pagination', 'search', 'sort', 'reset-catalogue', 'detail', 'detail-body'].includes(id) ? null : originalGet(id);
  const context = vm.createContext(page.globals);
  assert.doesNotThrow(() => { for (const source of sources) vm.runInContext(source, context); });
  assert.equal(page.get('paper-options').children.length, page.window.MACatalogueData.papers.length + 1);
  assert.ok(page.get('brief').listeners.submit.length);
});

test('catalogue initializes and delegated paging/filter/reset controls stay functional', () => {
  const page = boot();
  assert.equal((page.get('products').innerHTML.match(/<article /g) || []).length, 6);
  assert.equal(page.get('paper-options').children.length, page.window.MACatalogueData.papers.length + 1);
  assert.equal((page.get('products').innerHTML.match(/class="product-photo"/g) || []).length, 6);
  assert.match(page.get('products').innerHTML, /loading="lazy"/);
  assert.match(page.get('products').innerHTML, /alt="Sugarcane cutting boards"/);
  page.get('pagination').dispatch('click', { target: page.get('pagination').children.at(-1) });
  assert.match(page.get('results-count').textContent, /7–12/);
  page.get('filter-labels').click();
  assert.match(page.get('results-count').textContent, /1–6 of 6/);
  page.get('search').value = 'zz-no-match';
  page.get('search').dispatch('input');
  assert.match(page.get('products').innerHTML, /No matching products/);
  page.get('reset-catalogue').click();
  assert.equal(page.get('search').value, '');
  assert.ok(page.get('results-count').textContent.includes(`1–6 of ${page.window.MACatalogueData.papers.length}`));
});

test('new category links filter on load and non-paper products carry through to enquiry', () => {
  const page = boot('?category=sugarcane-kitchenware');
  const householdCount = page.window.MACatalogueData.papers.filter(product => product.group === 'sugarcane-kitchenware').length;
  assert.ok(page.get('results-count').textContent.includes(`1–6 of ${householdCount} products`));
  assert.match(page.get('products').innerHTML, /Sugarcane cutting boards/);
  assert.doesNotMatch(page.get('products').innerHTML, /GSM guide/);
  page.location.hash = '#paper-glass-airtight-containers';
  page.window.listeners.hashchange[0]();
  assert.match(page.get('detail-body').innerHTML, /Material/);
  assert.doesNotMatch(page.get('detail-body').innerHTML, /Paper weight \(GSM\)/);
  const choice = new page.Element(); choice.dataset.choosePaper = 'glass-airtight-containers';
  page.get('detail').dispatch('click', {target: choice});
  assert.equal(page.get('paper').value, page.window.MACatalogueData.papers.find(product => product.id === 'glass-airtight-containers').name);
  assert.equal(page.location.hash, 'enquiry');
  const fallback = boot('?category=unknown');
  assert.ok(fallback.get('results-count').textContent.includes(`1–6 of ${fallback.window.MACatalogueData.papers.length} products`));
});

test('mobile category selection, desktop buttons and reset stay synchronized', () => {
  const page = boot('?category=sugarcane-kitchenware');
  assert.equal(page.get('category-select').value, 'sugarcane-kitchenware');
  assert.equal(page.get('active-category').textContent, page.window.MACatalogueData.categories.find(category => category.id === 'sugarcane-kitchenware').name);
  page.get('category-select').value = 'recycled-household';
  page.get('category-select').dispatch('change');
  assert.match(page.get('results-count').textContent, /1–3 of 3 products/);
  assert.equal(page.get('active-category').textContent, 'Recycled Household Products');
  assert.equal(page.get('active-category').scrolled, true);
  page.get('filter-labels').click();
  assert.equal(page.get('category-select').value, 'labels');
  assert.equal(page.get('active-category').textContent, 'Labels & liners');
  page.get('reset-catalogue').click();
  assert.equal(page.get('category-select').value, 'all');
  assert.equal(page.get('active-category').textContent, 'All products');
  assert.ok(page.get('results-count').textContent.includes(`1–6 of ${page.window.MACatalogueData.papers.length} products`));
});

test('expanded sugarcane ranges paginate and preselect a new sourcing item', () => {
  const page = boot('?category=sugarcane-bags');
  assert.match(page.get('results-count').textContent, /1–6 of 7 products/);
  page.get('pagination').dispatch('click', {target: page.get('pagination').children.at(-1)});
  assert.match(page.get('results-count').textContent, /7–7 of 7 products/);
  assert.match(page.get('products').innerHTML, /Bio-PE bin liners/);
  page.location.hash = '#paper-bio-pe-bin-liners';
  page.window.listeners.hashchange[0]();
  assert.match(page.get('detail-body').innerHTML, /Additional sourcing range — confirm availability/);
  assert.match(page.get('detail-body').innerHTML, /bio-pe-bin-liners-photo\.jpg/);
  const choice = new page.Element(); choice.dataset.choosePaper = 'bio-pe-bin-liners';
  page.get('detail').dispatch('click', {target: choice});
  assert.equal(page.get('paper').value, 'Bio-PE bin liners');
});

test('keyboard product selection opens details and preselects the enquiry', () => {
  const page = boot();
  const card = new page.Element(); card.dataset.paperId = 'kraft-paper';
  page.get('products').dispatch('keydown', { target: card, key: 'Enter' });
  assert.equal(page.location.hash, '#paper-kraft-paper');
  page.window.listeners.hashchange[0]();
  assert.equal(page.get('detail').open, true);
  assert.match(page.get('detail-body').innerHTML, /Kraft paper/);
  const whatsappHref = page.get('detail-body').innerHTML.match(/href="(https:\/\/wa\.me\/[^\"]+)"/)[1];
  const draft = new URL(whatsappHref.replaceAll('&#39;', "'").replaceAll('&amp;', '&'));
  assert.equal(draft.pathname, '/919769681761');
  assert.match(draft.searchParams.get('text'), /I'm interested in Kraft paper/);
  assert.match(page.get('detail-body').innerHTML, /WhatsApp connect/);
  assert.ok(page.get('detail-body').innerHTML.includes('assets/images/products/kraft-paper.webp'));
  assert.doesNotMatch(page.get('detail-body').innerHTML, /AI-generated|Actual colour and finish may vary/);
  const choice = new page.Element(); choice.dataset.choosePaper = 'kraft-paper';
  page.get('detail').dispatch('click', { target: choice });
  assert.equal(page.get('paper').value, 'Kraft paper');
  assert.equal(page.get('detail').open, false);
  assert.equal(page.location.hash, 'enquiry');
});

test('enquiry prepares email and WhatsApp links without transmitting messages', () => {
  const page = boot();
  page.get('paper').value = 'Kraft paper';
  page.get('brief').dispatch('submit', { submitter: { value: 'email' } });
  assert.ok(page.location.href.startsWith('mailto:info@maindustries.in?'));
  assert.match(new URL(page.location.href).searchParams.get('body'), /Quantity: 500 kg/);
  page.get('brief').dispatch('submit', { submitter: { value: 'whatsapp' } });
  const url = new URL(page.openedLinks[0]);
  assert.equal(url.pathname, '/919769681761');
  assert.match(url.searchParams.get('text'), /Product: Kraft paper/);
});

test('mobile navigation expanded state and label reset on Escape', () => {
  const page = boot();
  page.get('menu').click();
  assert.equal(page.get('menu').attributes['aria-expanded'], 'true');
  for (const listener of page.document.listeners.keydown) listener({ key: 'Escape' });
  assert.equal(page.get('menu').attributes['aria-expanded'], 'false');
  assert.equal(page.get('menu').attributes['aria-label'], 'Open navigation');
});


test('product dialogs lock the page and restore scroll across close, Escape, backdrop and hash navigation', () => {
  const page = boot();
  page.window.scrollY = 640;
  function open() {
    page.location.hash = '#paper-kraft-paper';
    page.window.listeners.hashchange[0]();
    assert.equal(page.document.body.style.top, '-640px');
    assert.equal(page.document.body.classList.contains('product-modal-open'), true);
  }
  function restored() {
    assert.equal(page.document.body.classList.contains('product-modal-open'), false);
    assert.equal(page.document.documentElement.classList.contains('product-modal-open'), false);
    assert.equal(page.document.body.style.top, '');
    assert.equal(page.window.scrollY, 640);
  }
  open();
  // Changing products while already open must not overwrite the saved position.
  page.window.scrollY = 0;
  page.location.hash = '#paper-duplex-paper';
  page.window.listeners.hashchange[0]();
  page.get('close').click();
  restored();
  open(); page.get('detail').dispatch('cancel'); restored();
  open(); page.get('detail').dispatch('click', { clientX: 0, clientY: 0 }); restored();
  open(); page.location.hash = '#categories'; page.window.listeners.hashchange[0](); restored();
  open(); page.get('detail').close(); page.get('detail').dispatch('close'); restored();
  open();
  const choice = new page.Element(); choice.dataset.choosePaper = 'kraft-paper';
  page.get('detail').dispatch('click', { target: choice });
  restored();
  assert.equal(page.location.hash, 'enquiry');
  assert.equal(page.get('enquiry').scrolled, true);
});

test('gallery arrows use resized card widths, stop at bounds and respect reduced motion', () => {
  const page = createPageFixture();
  const track = page.get('gallery-track');
  const frames = [{offsetLeft: 0}, {offsetLeft: 360}];
  track.links = frames;
  track.clientWidth = 900;
  track.scrollWidth = 1800;
  const moves = [];
  track.scrollBy = options => {
    moves.push(options);
    track.scrollLeft = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, track.scrollLeft + options.left));
    track.dispatch('scroll');
  };
  const context = vm.createContext(page.globals);
  for (const source of sources) vm.runInContext(source, context);
  const previous = page.get('gallery-previous'), next = page.get('gallery-next');
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  next.click();
  assert.equal(moves[0].left, 360);
  assert.equal(moves[0].behavior, 'instant');
  assert.equal(previous.disabled, false);
  frames[1].offsetLeft = 440;
  for (const callback of page.window.listeners.resize) callback();
  next.click();
  assert.equal(moves[1].left, 440);
  next.click();
  assert.equal(next.disabled, true);
  previous.click();
  assert.equal(moves.at(-1).left, -440);
  assert.equal(next.disabled, false);
});
