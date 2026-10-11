/* Page interactions. Data and pure helpers load before this deferred script. */
(() => {
  'use strict';

  const { papers, categories } = window.MACatalogueData;
  const { validateCatalogue, gsmLabel, filterPapers, paginate, paginationPages, enquiryText } = window.MACatalogueUtils;
  // SVG keeps action arrows consistent across iOS and desktop font rendering.
  const ACTION_ARROW = "<svg class=\"action-arrow\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 18 18 6M6 6h12v12\" /></svg>";
  const PAGE_SIZE = 6;
  const CONTACT = Object.freeze({ phone: '919769681761', email: 'info@maengineerings.in' });
  const byId = id => document.getElementById(id);
  const dom = {
    grid: byId('products'), pagination: byId('pagination'), count: byId('results-count'),
    search: byId('search'), sort: byId('sort'), reset: byId('reset-catalogue'),
    form: byId('brief'), paper: byId('paper'), options: byId('paper-options'),
    status: byId('status'), detail: byId('detail'), detailBody: byId('detail-body'),
    header: document.querySelector('header'), menu: document.querySelector('.menu'),
    navigation: byId('site-navigation'), filters: [...document.querySelectorAll('[data-filter]')]
  };
  const state = { category: 'all', page: 1 };
  const paperById = new Map(papers.map(paper => [paper.id, paper]));
  const categoryById = new Map(categories.map(category => [category.id, category]));

  validateCatalogue(papers, categories);

  // Only repository-owned text enters HTML templates. Visitor input uses FormData.
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  function syncFilterButtons() {
    for (const button of dom.filters) {
      const active = button.dataset.filter === state.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }

  function setCategory(category) {
    state.category = category;
    state.page = 1;
    syncFilterButtons();
    renderCatalogue();
  }

  function resetCatalogue() {
    dom.search.value = '';
    dom.sort.value = 'collection';
    setCategory('all');
  }

  function productCard(paper) {
    const name = escapeHtml(paper.name);
    return `<article class="product" data-paper-id="${paper.id}" tabindex="0" role="link" aria-label="Explore ${name}">
      <a href="#paper-${paper.id}" class="product-visual" style="--paper:${paper.color};--bg:${paper.bg}" aria-label="Explore ${name}">
        <span class="index">${String(paper.index).padStart(2, '0')} / M&A</span>
        <img class="product-photo" src="${escapeHtml(paper.image)}" alt="Illustrative ${name.toLowerCase()} sample" width="800" height="800" loading="lazy" decoding="async"><span class="type">${escapeHtml(paper.tag)}</span>
      </a>
      <div class="product-top"><h3><a href="#paper-${paper.id}">${name}</a></h3>
        <a class="detail-button" href="#paper-${paper.id}" aria-label="View ${name}">${ACTION_ARROW}</a></div>
      <div class="product-gsm"><span>GSM guide</span><strong>${escapeHtml(gsmLabel(paper))}</strong></div>
      <p>${escapeHtml(paper.desc)}</p><a class="text-button" href="#paper-${paper.id}">Explore paper</a>
    </article>`;
  }

  function pageButton(label, page, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.page = page;
    button.disabled = disabled;
    const isNumber = /^\d+$/.test(label);
    button.setAttribute('aria-label', isNumber ? 'Go to page ' + page : label + ' page');
    if (isNumber && page === state.page) {
      button.setAttribute('aria-current', 'page');
      button.setAttribute('aria-label', 'Page ' + page + ', current page');
    }
    return button;
  }

  function renderPagination(totalPages) {
    dom.pagination.replaceChildren();
    dom.pagination.hidden = totalPages < 2;
    if (totalPages < 2) return;
    const fragment = document.createDocumentFragment();
    if (state.page > 1) fragment.append(pageButton('Previous', state.page - 1));
    for (const page of paginationPages(totalPages, state.page)) {
      if (page === '…') {
        const gap = document.createElement('span');
        gap.className = 'pagination-gap';
        gap.textContent = '…';
        gap.setAttribute('aria-hidden', 'true');
        fragment.append(gap);
      } else fragment.append(pageButton(String(page), page));
    }
    fragment.append(pageButton('Next →', state.page + 1, state.page === totalPages));
    dom.pagination.append(fragment);
  }

  function renderCatalogue() {
    const matches = filterPapers(papers, {
      category: state.category, query: dom.search.value, sort: dom.sort.value
    });
    const page = paginate(matches, state.page, PAGE_SIZE);
    state.page = page.currentPage;
    // One DOM update per render; grid-level listeners survive filtering/paging.
    dom.grid.innerHTML = page.total ? page.items.map(productCard).join('') :
      '<div class="empty-state"><h3>No matching papers</h3><p>Try a different name or application.</p>' +
      '<button class="button" type="button" data-reset-search>Reset search ' + ACTION_ARROW + '</button></div>';
    dom.grid.scrollLeft = 0;
    renderPagination(page.totalPages);
    dom.count.textContent = page.total ?
      `Showing ${page.offset + 1}–${page.offset + page.items.length} of ${page.total} ${page.total === 1 ? 'paper' : 'papers'} · Page ${state.page} of ${page.totalPages}` :
      'No papers found';
  }

  function activateProduct(id) {
    const hash = '#paper-' + id;
    if (location.hash === hash) openProduct(id);
    else location.hash = hash;
  }

  let savedPageScroll = null;

  function lockPageScroll() {
    if (savedPageScroll) return;
    // Fixed positioning prevents background touch scrolling on iOS Safari too.
    savedPageScroll = { x: window.scrollX || 0, y: window.scrollY, top: document.body.style.top };
    document.body.style.top = '-' + savedPageScroll.y + 'px';
    document.documentElement.classList.add('product-modal-open');
    document.body.classList.add('product-modal-open');
  }

  function unlockPageScroll() {
    if (!savedPageScroll) return;
    const saved = savedPageScroll;
    savedPageScroll = null;
    document.body.classList.remove('product-modal-open');
    document.body.style.top = saved.top;
    // Restore before removing the root class so global smooth scrolling cannot animate it.
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
    document.documentElement.classList.remove('product-modal-open');
  }

  function closeProductDialog() {
    dom.detail.close();
    unlockPageScroll();
  }

  function openProduct(id) {
    const paper = paperById.get(id);
    if (!paper) return;
    const category = categoryById.get(paper.group);
    dom.detailBody.innerHTML = `
      <span class="dialog-tag">${escapeHtml(category.name)} / ${String(paper.index).padStart(2, '0')}</span>
      <h2 id="detail-title">${escapeHtml(paper.name)}</h2>
      <figure class="detail-photo"><img src="${escapeHtml(paper.image)}" alt="Illustrative ${escapeHtml(paper.name.toLowerCase())} sample" width="800" height="800" decoding="async"><figcaption>Illustrative sample. Actual colour and finish may vary.</figcaption></figure>
      <p>${escapeHtml(paper.desc)}</p>
      <div class="detail-gsm"><span>GSM guide</span><strong>${escapeHtml(gsmLabel(paper))}</strong><small>GSM means grams per square metre. Typical reference guide; confirm your required grade on enquiry.</small></div>
      ${paper.details ? '<p class="detail-note">' + escapeHtml(paper.details) + '</p>' : ''}
      <span class="availability">Availability on enquiry</span>
      <h3 class="detail-section-title">Applications to explore</h3>
      <ul>${paper.uses.map(use => '<li>' + escapeHtml(use) + '</li>').join('')}</ul>
      <h3 class="detail-section-title">Details to discuss</h3>
      <p>Paper weight (GSM), sheet or reel dimensions, finish, printing requirements, quantity and delivery timeline.</p>
      <p class="detail-note">Exact specifications, availability and suitability are confirmed on enquiry.${paper.group === 'wrapping' ? ' Confirm food-contact compliance and temperature suitability for the intended application.' : ''}</p>
      <button class="button" type="button" data-choose-paper="${paper.id}">Enquire about this paper <span>${ACTION_ARROW}</span></button>`;
    if (!dom.detail.open) {
      lockPageScroll();
      dom.detail.showModal();
    }
  }

  function handleProductHash() {
    if (location.hash.startsWith('#paper-')) openProduct(location.hash.slice(7));
    else if (dom.detail.open) closeProductDialog();
  }

  function closeProduct() {
    closeProductDialog();
    // Update the URL without jumping back to the start of the collection.
    window.history.replaceState(null, '', '#collection');
  }

  function initializeCatalogue() {
    for (const button of dom.filters) button.addEventListener('click', () => setCategory(button.dataset.filter));
    for (const input of [dom.search, dom.sort]) {
      input.addEventListener(input === dom.search ? 'input' : 'change', () => {
        state.page = 1;
        renderCatalogue();
      });
    }
    dom.reset.addEventListener('click', () => {
      resetCatalogue();
      dom.search.focus({ preventScroll: true });
    });
    dom.pagination.addEventListener('click', event => {
      const button = event.target.closest('button[data-page]');
      if (!button || button.disabled) return;
      state.page = Number(button.dataset.page);
      renderCatalogue();
      dom.count.scrollIntoView({ block: 'start' });
      dom.pagination.querySelector('[aria-current]')?.focus({ preventScroll: true });
    });
    dom.grid.addEventListener('click', event => {
      if (event.target.closest('[data-reset-search]')) { resetCatalogue(); return; }
      const card = event.target.closest('[data-paper-id]');
      if (!card) return;
      const link = event.target.closest('a');
      if (link) {
        // Let normal links retain modifier-click behaviour and hash navigation.
        if (location.hash === link.getAttribute('href')) openProduct(card.dataset.paperId);
      } else if (!window.getSelection()?.toString()) activateProduct(card.dataset.paperId);
    });
    dom.grid.addEventListener('keydown', event => {
      if (event.target.matches('[data-paper-id]') && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        activateProduct(event.target.dataset.paperId);
      }
    });
    document.querySelectorAll('[data-category-link]').forEach(link => link.addEventListener('click', () => {
      dom.search.value = '';
      setCategory(link.dataset.categoryLink);
      byId('collection').scrollIntoView();
    }));
    syncFilterButtons();
    renderCatalogue();
  }

  function initializeProductDetails() {
    document.querySelector('.close').addEventListener('click', closeProduct);
    dom.detail.addEventListener('cancel', event => {
      event.preventDefault();
      closeProduct();
    });
    dom.detail.addEventListener('close', () => {
      if (!dom.detail.open) unlockPageScroll();
    });
    dom.detail.addEventListener('click', event => {
      const choice = event.target.closest('[data-choose-paper]');
      if (choice) {
        dom.paper.value = paperById.get(choice.dataset.choosePaper).name;
        closeProductDialog();
        location.hash = 'enquiry';
        byId('enquiry').scrollIntoView();
        dom.paper.focus({ preventScroll: true });
        return;
      }
      // Backdrop clicks hit the dialog itself; padding clicks should not close it.
      if (event.target !== dom.detail) return;
      const bounds = dom.detail.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) closeProduct();
    });
    window.addEventListener('hashchange', handleProductHash);
    handleProductHash();
  }

  function initializeEnquiry() {
    const options = document.createDocumentFragment();
    options.append(new Option('Not sure? Help me choose', 'Help me choose'));
    for (const paper of papers) options.append(new Option(paper.name, paper.name));
    dom.options.replaceChildren(options);
    const choice = paperById.get(new URLSearchParams(location.search).get('paper'));
    if (choice) dom.paper.value = choice.name;
    dom.form.addEventListener('submit', event => {
      event.preventDefault();
      const text = enquiryText(new FormData(dom.form));
      const channel = event.submitter?.value || 'whatsapp';
      if (channel === 'email') {
        location.href = 'mailto:' + CONTACT.email + '?subject=' +
          encodeURIComponent('Paper enquiry — ' + dom.paper.value) + '&body=' + encodeURIComponent(text);
        dom.status.textContent = 'Your email app has been requested. Review the prepared enquiry and send it to ' + CONTACT.email + '.';
      } else {
        const link = document.createElement('a');
        link.href = 'https://wa.me/' + CONTACT.phone + '?text=' + encodeURIComponent(text);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        dom.status.textContent = 'WhatsApp has been requested. Review the prepared enquiry and send it to +91 97696 81761.';
      }
    });
  }

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
    if (!('IntersectionObserver' in window)) return;
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

  function initializeMotion() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const materialSections = new Set(document.querySelectorAll('.hero-art,.feature,.approach'));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (materialSections.has(entry.target)) {
          entry.target.classList.toggle('motion-in-view', entry.isIntersecting);
        } else if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.category-card,.section-heading,.steps article,.feature h2,.enquiry>div').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
    for (const section of materialSections) observer.observe(section);
  }

  // Counts come from the catalogue, avoiding drift when product data is edited.
  function initializeCounts() {
    const counts = new Map(categories.map(category => [category.id, papers.filter(paper => paper.group === category.id).length]));
    for (const button of dom.filters) {
      const badge = button.querySelector('small');
      if (badge) badge.textContent = button.dataset.filter === 'all' ? papers.length : counts.get(button.dataset.filter);
    }
    document.querySelectorAll('.category-card[data-category-link]').forEach((card, index) => {
      card.querySelector('.eyebrow').textContent = String(index + 1).padStart(2, '0') + ' / ' + counts.get(card.dataset.categoryLink) + ' PRODUCTS';
    });
    document.querySelector('.hero-foot span').textContent = papers.length + ' PAPERS / ' + categories.length + ' CATEGORIES';
    document.querySelector('.art-tag b').textContent = '01 — ' + papers.length;
  }

  initializeCounts();
  initializeEnquiry();
  initializeCatalogue();
  initializeProductDetails();
  initializeNavigation();
  initializeMotion();
})();
