import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createPageFixture } from './page-fixture.mjs';

const source = await readFile(new URL('../assets/js/studio.js', import.meta.url), 'utf8');

test('application choices update one recommendation, its destination and the image candidate', () => {
  const page = createPageFixture();
  const studio = page.get('studio');
  const result = page.get('result');
  const image = page.get('image');
  const link = page.get('link');
  const choices = ['serve', 'store', 'organise', 'pack'].map(key => {
    const button = page.get(key);
    button.dataset.materialChoice = key;
    button.setAttribute('aria-pressed', String(key === 'serve'));
    return button;
  });
  const parts = {
    '.studio-result': result, '[data-studio-image]': image,
    '.studio-choices': page.get('choices'), '[data-studio-number]': page.get('number'),
    '[data-studio-range]': page.get('range')
  };
  studio.querySelector = selector => parts[selector];
  studio.querySelectorAll = () => choices;
  result.querySelector = selector => selector === 'a' ? link : page.get(selector);
  link.querySelector = () => page.get('label');
  page.document.querySelector = selector => selector === '.material-studio' ? studio : null;
  vm.runInNewContext(source, page.globals);
  assert.equal(page.get('choices').hidden, false);
  for (const [key, destination, imagePart] of [
    ['store', 'sugarcane-bags', 'sugarcane-bags'],
    ['organise', 'recycled-household', 'recycled-household'],
    ['pack', 'categories.html#paper-packaging', 'packaging'],
    ['serve', 'sugarcane-kitchenware', 'sugarcane-kitchenware']
  ]) {
    image.setAttribute('srcset', 'previous-image.webp 640w');
    page.get(key).click();
    assert.equal(choices.filter(button => button.getAttribute('aria-pressed') === 'true').length, 1);
    assert.equal(page.get(key).getAttribute('aria-pressed'), 'true');
    assert.ok(link.href.includes(destination));
    assert.ok(image.src.includes(imagePart));
    assert.equal(image.getAttribute('srcset'), null, 'old responsive image cannot override the selected material');
    assert.ok(image.alt && page.get('h3').textContent && page.get('p').textContent);
  }
});

test('pointer effects clear immediately when reduced motion is enabled', () => {
  const page = createPageFixture();
  const card = page.get('card');
  const properties = new Map();
  let preferenceChanged;
  const reduced = { matches: false, addEventListener(_event, callback) { preferenceChanged = callback; } };
  page.window.matchMedia = query => query.includes('reduced-motion') ? reduced : {matches: true, addEventListener() {}};
  page.document.querySelector = () => null;
  card.getBoundingClientRect = () => ({left: 0, top: 0, width: 100, height: 100});
  card.style = {setProperty: (key, value) => properties.set(key, value), removeProperty: key => properties.delete(key)};
  vm.runInNewContext(source, page.globals);
  page.document.listeners.pointermove[0]({target: {closest: () => card}, clientX: 75, clientY: 25, pointerType: 'mouse'});
  assert.equal(properties.get('--pointer-x'), '75%');
  assert.equal(properties.get('--tilt-x'), '1.25deg');
  assert.equal(card.classList.contains('is-pointer-active'), true);
  reduced.matches = true;
  preferenceChanged();
  assert.equal(properties.size, 0);
  assert.equal(card.classList.contains('is-pointer-active'), false);
});
