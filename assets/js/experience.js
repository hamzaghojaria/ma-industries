/* Progressive motion: content stays visible if animation support is absent. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  let observer;
  let ambientObserver;

  function enter(element, delay = 0, distance = 20) {
    if (reducedMotion.matches || !element?.animate) return;
    const animation = element.animate([
      { opacity: 0, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 620, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }

  function enterDialog(dialog) {
    enter(dialog, 0, 12);
  }
  function confirmEnquiry(status) {
    status.classList.add('enquiry-ready');
    enter(status, 0, 6);
  }
  window.MAExperience = Object.freeze({ enterDialog, confirmEnquiry });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let framePending = false;
  function updateProgress() {
    framePending = false;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const value = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
    progress.style.transform = `scaleX(${value})`;
  }
  function scheduleProgress() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();

  // A media preference change cancels active motion immediately.
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    observer?.disconnect();
    ambientObserver?.disconnect();
    document.querySelectorAll('.motion-in-view').forEach(element => element.classList.remove('motion-in-view'));
    for (const animation of running) animation.cancel();
  });
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  // The same gentle motion runs on desktop and mobile, only while visible.
  ambientObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('motion-in-view', entry.isIntersecting);
  }, { threshold: 0 });
  document.querySelectorAll('.range-mosaic,.studio-art,.approach').forEach(element => ambientObserver.observe(element));

  const watched = new WeakSet();
  observer = new IntersectionObserver(entries => {
    let stagger = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (entry.target.id === 'home-products-title') {
        entry.target.querySelectorAll('[data-heading-line]').forEach((line, index) => enter(line, index * 130, 12));
      } else {
        enter(entry.target, Math.min(stagger++ * 65, 195));
      }
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  const selectors = '.range-gateway,.directory-card,.offering-grid>a,.founder-card,.steps article,' +
    '.material-story>*,.about-story-grid>*,.about-value-grid article,.enquiry>div,' +
    '.about-cta>*,.paper-guide-grid article,.product,.brand-card,.studio-copy,.home-product,#home-products-title';
  function observeWithin(root) {
    for (const element of root.querySelectorAll(selectors)) {
      if (watched.has(element)) continue;
      watched.add(element);
      observer.observe(element);
    }
  }
  observeWithin(document);
  // Keep above-the-fold copy and images visible on their first paint: opacity
  // entrance animations delay LCP even when the content is already downloaded.
  const products = document.getElementById('products');
  if (products && 'MutationObserver' in window) {
    new MutationObserver(() => observeWithin(products)).observe(products, { childList: true });
  }
  document.addEventListener('toggle', event => {
    if (event.target.tagName === 'DETAILS' && event.target.open) enter(event.target.querySelector('p'), 0, 6);
  }, true);
  const dialog = document.querySelector('dialog[open]');
  if (dialog) enterDialog(dialog);
})();
