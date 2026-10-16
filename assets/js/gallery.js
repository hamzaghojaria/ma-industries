/* Gallery controls are independent of catalogue data and enquiry forms. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);

  function initializeGallery() {
    const track = byId('gallery-track');
    const previous = byId('gallery-previous');
    const next = byId('gallery-next');
    if (!track || !previous || !next) return;
    const frames = [...track.querySelectorAll('figure')];
    if (!frames.length) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let step = 0;
    const updateButtons = () => {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const refreshLayout = () => {
      // Measure after a resize, rather than forcing layout on each arrow click.
      step = frames[1] ? frames[1].offsetLeft - frames[0].offsetLeft : track.clientWidth;
      updateButtons();
    };
    const move = direction => {
      track.scrollBy({
        left: direction * step,
        behavior: reducedMotion.matches ? 'instant' : 'smooth'
      });
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', refreshLayout);
    refreshLayout();
  }

  initializeGallery();
})();
