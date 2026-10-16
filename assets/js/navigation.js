/* Shared header behavior for every page, including generated SEO pages. */
(() => {
  'use strict';
  const dom = {
    header: document.querySelector('header'),
    menu: document.querySelector('.menu'),
    navigation: document.getElementById('site-navigation')
  };
  if (!dom.header || !dom.menu || !dom.navigation) return;

  function setNavigationOpen(open) {
    dom.navigation.classList.toggle('open', open);
    dom.menu.setAttribute('aria-expanded', String(open));
    dom.menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  function initializeNavigation() {
    dom.menu.addEventListener('click', () => setNavigationOpen(!dom.navigation.classList.contains('open')));
    dom.navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNavigationOpen(false)));
    document.addEventListener('click', event => { if (!event.target.closest('header')) setNavigationOpen(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dom.navigation.classList.contains('open')) {
        setNavigationOpen(false);
        dom.menu.focus();
      }
    });
    window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
      if (event.matches) setNavigationOpen(false);
    });
    // One scheduled update per frame, shared across every page's header.
    const updateHeader = () => dom.header.classList.toggle('scrolled', window.scrollY > 12);
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => { updateHeader(); scheduled = false; });
    }, { passive: true });
    updateHeader();
    if (!('IntersectionObserver' in window)) return;
    // Only in-page navigation links participate in section highlighting.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        dom.navigation.querySelectorAll('a').forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('#categories,#collection,#approach,#enquiry').forEach(section => observer.observe(section));
  }

  initializeNavigation();
})();
