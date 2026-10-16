/* Page interactions. Data and pure helpers load before this deferred script. */
(() => {
  'use strict';

  const { papers, categories } = window.MACatalogueData;
  const { validateCatalogue, gsmLabel, specificationFields, filterPapers, paginate, paginationPages, enquiryText, productWhatsAppText, watermarkImages } = window.MACatalogueUtils;
  // SVG keeps action arrows consistent across iOS and desktop font rendering.
  const ACTION_ARROW = "<svg class=\"action-arrow\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 18 18 6M6 6h12v12\" /></svg>";
  const WHATSAPP_ICON = "<svg class=\"whatsapp-icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\">\n        <path d=\"M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.47 0 .12 5.35 .12 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.79 1.48h.01C18.63 23.84 24 18.49 24 11.92a11.85 11.85 0 0 0-3.48-8.44ZM12.06 21.8a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.38a9.85 9.85 0 0 1-1.51-5.25c0-5.45 4.44-9.88 9.9-9.88a9.8 9.8 0 0 1 7 2.9 9.8 9.8 0 0 1 2.89 6.99c0 5.45-4.44 9.86-9.91 9.86Zm5.42-7.39c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61l.44-.52c.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z\"/>\n      </svg>";
  const PAGE_SIZE = 6;
  const CONTACT = Object.freeze({ phone: '919769681761', email: 'info@maindustries.in' });
  const byId = id => document.getElementById(id);
  const dom = {
    grid: byId('products'), pagination: byId('pagination'), count: byId('results-count'),
    categorySelect: byId('category-select'), categoryHeading: byId('active-category'), search: byId('search'), sort: byId('sort'), reset: byId('reset-catalogue'),
    form: byId('brief'), paper: byId('paper'), options: byId('paper-options'),
    status: byId('status'), detail: byId('detail'), detailBody: byId('detail-body'),
    filters: [...document.querySelectorAll('[data-filter]')]
  };
  const requestedCategory = new URLSearchParams(location.search).get('category');
  const state = { category: categories.some(item => item.id === requestedCategory) ? requestedCategory : 'all', page: 1 };
  const paperById = new Map(papers.map(paper => [paper.id, paper]));
  const displayNumberById = new Map(papers.map((paper, index) => [paper.id, index + 1]));
  const categoryById = new Map(categories.map(category => [category.id, category]));

  validateCatalogue(papers, categories);

  // Only repository-owned text enters HTML templates. Visitor input uses FormData.
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  function syncFilterButtons() {
    if (dom.categorySelect) dom.categorySelect.value = state.category;
    if (dom.categoryHeading) dom.categoryHeading.textContent = state.category === 'all' ? 'All products' : categoryById.get(state.category).name;
    for (const button of dom.filters) {
      const active = button.dataset.filter === state.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      const sidebar = button.closest('.catalogue-sidebar');
      if (active && sidebar) sidebar.scrollTop = Math.max(0, button.offsetTop - sidebar.clientHeight / 2);

    }
  }

  function setCategory(category) {
    state.category = category;
    state.page = 1;
    syncFilterButtons();
    renderCatalogue();
    dom.categoryHeading?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function resetCatalogue() {
    dom.search.value = '';
    dom.sort.value = 'collection';
    setCategory('all');
  }

  function productWhatsAppUrl(paper) {
    return 'https://wa.me/' + CONTACT.phone + '?text=' + encodeURIComponent(productWhatsAppText(paper, categoryById.get(paper.group).name));
  }

  function productCard(paper) {
    const name = escapeHtml(paper.name);
    return watermarkImages(`<article class="product" data-paper-id="${paper.id}" tabindex="0" role="link" aria-label="Explore ${name}">
      <a href="#paper-${paper.id}" class="product-visual" style="--paper:${paper.color};--bg:${paper.bg}" aria-label="Explore ${name}">
        <span class="index">${String(displayNumberById.get(paper.id)).padStart(2, '0')} / M&A</span>
        <img class="product-photo" src="${escapeHtml(paper.cardImage || paper.image)}" alt="${paper.illustration ? 'Collection: ' + escapeHtml(categoryById.get(paper.group).name) : name}" width="800" height="800" loading="lazy" decoding="async"><span class="type">${escapeHtml(paper.tag)}</span>
      </a>
      <div class="product-top"><h3><a href="#paper-${paper.id}">${name}</a></h3>
        <a class="detail-button" href="#paper-${paper.id}" aria-label="View ${name}">${ACTION_ARROW}</a></div>
      <div class="product-gsm"><span>${paper.material ? 'Material' : 'GSM guide'}</span><strong>${escapeHtml(paper.material ? 'View material details' : gsmLabel(paper))}</strong></div>
      <p>${escapeHtml(paper.desc)}</p><div class="product-actions"><a class="text-button" href="#paper-${paper.id}">Explore product</a><a class="card-whatsapp" href="${escapeHtml(productWhatsAppUrl(paper))}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp about ${name}">${WHATSAPP_ICON}<span class="card-whatsapp-label">WhatsApp</span></a></div>
    </article>`);
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
      '<div class="empty-state"><h3>No matching products</h3><p>Try a different name or application.</p>' +
      '<button class="button" type="button" data-reset-search>Reset search ' + ACTION_ARROW + '</button></div>';
    dom.grid.scrollLeft = 0;
    renderPagination(page.totalPages);
    dom.count.textContent = page.total ?
      `Showing ${page.offset + 1}–${page.offset + page.items.length} of ${page.total} ${page.total === 1 ? 'product' : 'products'} · Page ${state.page} of ${page.totalPages}` :
      'No products found';
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
    const specifications = specificationFields(paper);
    dom.detailBody.innerHTML = watermarkImages(`
      <span class="dialog-tag">${escapeHtml(category.name)}</span>
      <h2 id="detail-title">${escapeHtml(paper.name)}</h2>
      <figure class="detail-photo"><img src="${escapeHtml(paper.image)}" alt="${paper.illustration ? 'Representative collection: ' + escapeHtml(category.name) : escapeHtml(paper.name)}" width="800" height="800" decoding="async"></figure>
      <p>${escapeHtml(paper.desc)}</p>
      <div class="detail-gsm"><span>${paper.material ? 'Material' : 'GSM guide'}</span><strong>${escapeHtml(paper.material || gsmLabel(paper))}</strong>${paper.gsm ? '<small>Indicative range; confirm your required grade.</small>' : ''}</div>
      <p class="detail-uses"><strong>Uses:</strong> ${paper.uses.map(escapeHtml).join(' · ')}</p>
      <details class="product-extra-details"><summary>More details</summary>
        ${paper.details ? '<p>' + escapeHtml(paper.details) + '</p>' : ''}
        <h3>Specifications</h3><dl class="product-specifications">${specifications.map(item => '<div><dt>' + escapeHtml(item.label) + '</dt><dd>' + escapeHtml(item.value) + '</dd></div>').join('')}</dl>
        <p><strong>What to share:</strong> ${paper.material ? 'Size, capacity, colour, material, pack quantity and delivery location.' : 'Sheet or reel size, GSM, finish, printing needs, quantity and delivery location.'}</p>
      </details>
      <p class="detail-note">${paper.sourcingOnly ? 'Additional sourcing range — confirm availability. Specifications confirmed on enquiry.' : 'Specifications and availability confirmed on enquiry.'}${paper.group === 'wrapping' ? ' Confirm food-contact and temperature suitability.' : ''}</p>
      <div class="product-enquiry-actions product-modal-actions"><button class="button" type="button" data-choose-paper="${paper.id}" aria-label="Enquire about this product"><span class="action-copy enquiry-full-label">Enquire about this product</span><span class="action-copy enquiry-short-label">Enquire product</span></button><a class="button whatsapp-button" href="${escapeHtml(productWhatsAppUrl(paper))}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp connect">${WHATSAPP_ICON}<span class="action-copy">WhatsApp<span class="connect-word"> connect</span></span></a></div>`);
    if (!dom.detail.open) {
      lockPageScroll();
      dom.detail.showModal();
      window.MAExperience?.enterDialog(dom.detail);
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
    if (dom.categorySelect) {
      const options = document.createDocumentFragment();
      options.append(new Option('All products (' + papers.length + ')', 'all'));
      for (const category of categories) {
        const count = papers.filter(paper => paper.group === category.id).length;
        options.append(new Option(category.name + ' (' + count + ')', category.id));
      }
      dom.categorySelect.replaceChildren(options);
      dom.categorySelect.value = state.category;
    }
    for (const button of dom.filters) button.addEventListener('click', () => setCategory(button.dataset.filter));
    dom.categorySelect?.addEventListener('change', () => setCategory(dom.categorySelect.value));
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
    if (requestedCategory) dom.categoryHeading?.scrollIntoView({ block: 'start', behavior: 'instant' });
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
          encodeURIComponent('Product enquiry — ' + dom.paper.value) + '&body=' + encodeURIComponent(text);
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
    const heroCount = document.querySelector('.hero-foot span');
    if (heroCount) heroCount.textContent = papers.length + ' PRODUCTS / ' + categories.length + ' CATEGORIES';
    const artCount = document.querySelector('.art-tag b');
    if (artCount) artCount.textContent = '01 — ' + papers.length;
  }


  initializeCounts();
  initializeEnquiry();
  if (dom.grid) {
    initializeCatalogue();
    initializeProductDetails();
  } else if (location.hash.startsWith('#paper-') || location.hash === '#collection' || requestedCategory) {
    location.replace('products.html' + location.search + location.hash);
  }
})();
