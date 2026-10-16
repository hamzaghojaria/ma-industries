import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createPageFixture} from './page-fixture.mjs';

const source = await readFile(new URL('../assets/js/experience.js', import.meta.url), 'utf8');

test('reduced motion skips animation while retaining reading progress and controls', () => {
  const page = createPageFixture();
  page.window.innerHeight = 800;
  page.window.scrollY = 400;
  page.document.documentElement.scrollHeight = 1600;
  vm.runInNewContext(source, page.globals);
  const progress = page.document.body.children.find(element => element.className === 'reading-progress');
  assert.equal(progress.style.transform, 'scaleX(0.5)');
  assert.equal(progress.getAttribute('aria-hidden'), 'true');
  assert.doesNotThrow(() => page.window.MAExperience.enterDialog({animate() { throw new Error('Unexpected motion'); }}));
  page.window.scrollY = 800;
  page.window.listeners.scroll[0]();
  assert.equal(progress.style.transform, 'scaleX(1)');
});

test('enabling reduced motion cancels animations already in progress', () => {
  const page = createPageFixture();
  let preferenceChanged;
  let cancelled = 0;
  let disconnected = false;
  const preference = {matches: false, addEventListener(_type, callback) { preferenceChanged = callback; }};
  page.window.matchMedia = () => preference;
  const element = {animate() { return {finished: new Promise(() => {}), cancel() { cancelled++; }}; }};
  page.document.querySelectorAll = selector => selector.includes('.range-gateway') ? [element] : [];
  class Observer {
    constructor(callback) { this.callback = callback; }
    observe(target) { this.callback([{target, isIntersecting: true}]); }
    unobserve() {}
    disconnect() { disconnected = true; }
  }
  page.window.IntersectionObserver = Observer;
  vm.runInNewContext(source, {...page.globals, IntersectionObserver: Observer});
  preference.matches = true;
  preferenceChanged();
  assert.equal(cancelled, 1);
  assert.equal(disconnected, true);
});
