/* Material studio: useful recommendations first, optional pointer effects second. */
(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const studio = document.querySelector('.material-studio');
  let changeAnimations = [];

  if (studio) {
    const recommendations = {
      serve: { title: 'Everyday, reimagined.', range: 'Sugarcane household', text: 'Explore reusable cups, bowls, cutting boards and kitchen essentials. Confirm composition and suitability for your application.', link: 'products.html?category=sugarcane-kitchenware#collection', image: 'assets/images/responsive/ranges/sugarcane-kitchenware-photo-640.webp', alt: 'Sugarcane kitchenware collection', label: 'Explore kitchen essentials', number: '01', theme: 'sage' },
      store: { title: 'Keep the good things.', range: 'Sugarcane food packaging', text: 'Discover food-storage bags, cling wraps and liners. Tell us what you need to store, the format and your required quantity.', link: 'products.html?category=sugarcane-bags#collection', image: 'assets/images/responsive/ranges/sugarcane-bags-photo-640.webp', alt: 'Bio-based bags and wraps', label: 'Explore bags & wraps', number: '02', theme: 'rose' },
      organise: { title: 'Make room for possibility.', range: 'Recycled household', text: 'Find storage boxes, hangers and cleaning tools. Ask about item-specific recycled content, sizes and available options.', link: 'products.html?category=recycled-household#collection', image: 'assets/images/responsive/ranges/recycled-household-photo-640.webp', alt: 'Recycled household products', label: 'Explore household products', number: '03', theme: 'sage' },
      pack: { title: 'A better first impression.', range: 'Paper & packaging', text: 'Start with kraft paper, carton boards and wrapping grades. Share your dimensions, printing needs and quantity.', link: 'categories.html#paper-packaging', image: 'assets/images/responsive/categories/packaging-640.webp', alt: 'Paper bags and packaging materials', label: 'Explore paper & packaging', number: '04', theme: 'paper' }
    };
    const buttons = [...studio.querySelectorAll('[data-material-choice]')];
    const output = studio.querySelector('.studio-result');
    const image = studio.querySelector('[data-studio-image]');
    studio.querySelector('.studio-choices').hidden = false;
    for (const button of buttons) button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const item = recommendations[button.dataset.materialChoice];
      for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice === button));
      studio.dataset.theme = item.theme;
      studio.querySelector('[data-studio-number]').textContent = item.number;
      studio.querySelector('[data-studio-range]').textContent = item.range;
      output.querySelector('h3').textContent = item.title;
      output.querySelector('p').textContent = item.text;
      const link = output.querySelector('a');
      link.href = item.link;
      link.querySelector('span').textContent = item.label;
      // The build supplies srcset for the default image. Remove it when choosing
      // another range so the browser cannot keep displaying the first candidate.
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
      image.src = item.image;
      image.alt = item.alt;
      changeAnimations.forEach(animation => animation.cancel());
      changeAnimations = [];
      if (!reduced.matches && output.animate) {
        changeAnimations = [
          output.animate([{ transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' }),
          image.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' })
        ];
      }
    });
  }

  // One frame at most per pointer update. A measured card is reused until exit;
  // scrolling or resizing clears it rather than measuring on every mousemove.
  const selector = '.range-mosaic figure,.range-gateway,.directory-card,.brand-card,.founder-card,.product,.studio-art';
  let active = null;
  let bounds;
  let pointer;
  let pending = false;
  function reset() {
    if (active) {
      for (const property of ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y']) active.style.removeProperty(property);
      active.classList.remove('is-pointer-active');
    }
    active = null;
  }
  document.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const target = event.target.closest(selector);
    if (target !== active) {
      reset();
      if (!target) return;
      active = target;
      bounds = target.getBoundingClientRect();
      target.classList.add('is-pointer-active');
    }
    if (!active) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(() => {
      pending = false;
      if (!active) return;
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      active.style.setProperty('--pointer-x', `${x * 100}%`);
      active.style.setProperty('--pointer-y', `${y * 100}%`);
      active.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
      active.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
    });
  }, { passive: true });
  document.addEventListener('pointerleave', reset);
  window.addEventListener('scroll', reset, { passive: true });
  window.addEventListener('resize', reset);
  reduced.addEventListener('change', () => {
    reset();
    if (reduced.matches) changeAnimations.forEach(animation => animation.cancel());
  });
  finePointer.addEventListener('change', reset);
})();
