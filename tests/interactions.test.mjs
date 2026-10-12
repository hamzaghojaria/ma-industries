import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createPageFixture } from './page-fixture.mjs';

const sources = await Promise.all(['catalogue-data.js', 'catalogue-utils.js', 'app.js'].map(file =>
  readFile(new URL('../assets/js/' + file, import.meta.url), 'utf8')
));
function boot() {
  const page = createPageFixture();
  const context = vm.createContext(page.globals);
  for (const source of sources) vm.runInContext(source, context);
  return page;
}

test('catalogue initializes and delegated paging/filter/reset controls stay functional', () => {
  const page = boot();
  assert.equal((page.get('products').innerHTML.match(/<article /g) || []).length, 6);
  assert.equal(page.get('paper-options').children.length, 37);
  assert.equal((page.get('products').innerHTML.match(/class="product-photo"/g) || []).length, 6);
  assert.match(page.get('products').innerHTML, /loading="lazy"/);
  assert.match(page.get('products').innerHTML, /alt="Illustrative duplex paper sample"/);
  page.get('pagination').dispatch('click', { target: page.get('pagination').children.at(-1) });
  assert.match(page.get('results-count').textContent, /7–12/);
  page.get('filter-labels').click();
  assert.match(page.get('results-count').textContent, /1–6 of 6/);
  page.get('search').value = 'zz-no-match';
  page.get('search').dispatch('input');
  assert.match(page.get('products').innerHTML, /No matching papers/);
  page.get('reset-catalogue').click();
  assert.equal(page.get('search').value, '');
  assert.match(page.get('results-count').textContent, /1–6 of 36/);
});

test('keyboard product selection opens details and preselects the enquiry', () => {
  const page = boot();
  const card = new page.Element(); card.dataset.paperId = 'kraft-paper';
  page.get('products').dispatch('keydown', { target: card, key: 'Enter' });
  assert.equal(page.location.hash, '#paper-kraft-paper');
  page.window.listeners.hashchange[0]();
  assert.equal(page.get('detail').open, true);
  assert.match(page.get('detail-body').innerHTML, /Kraft paper/);
  assert.ok(page.get('detail-body').innerHTML.includes('assets/images/products/kraft-paper.webp'));
  assert.match(page.get('detail-body').innerHTML, /Actual colour and finish may vary/);
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
  assert.match(url.searchParams.get('text'), /Paper: Kraft paper/);
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
