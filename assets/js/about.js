/* Shared navigation for the standalone About and categories pages. */
(() => {
  'use strict';
  const dom = {
    header: document.querySelector('header'),
    menu: document.querySelector('.menu'),
    navigation: document.getElementById('site-navigation')
  };
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
    const updateHeader = () => dom.header.classList.toggle('scrolled', window.scrollY > 12);
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => { updateHeader(); scheduled = false; });
    }, { passive: true });
    updateHeader();

  }


  initializeNavigation();
})();
