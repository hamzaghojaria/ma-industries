/* Pure catalogue helpers: shared by the browser and Node regression tests. */
(() => {
  'use strict';

  function validateCatalogue(papers, categories) {
    const categoryIds = new Set(categories.map(category => category.id));
    const productIds = new Set();
    for (const paper of papers) {
      if (productIds.has(paper.id)) throw new Error('Duplicate product ID: ' + paper.id);
      if (!categoryIds.has(paper.group)) throw new Error('Unknown category: ' + paper.group);
      if (paper.gsm !== null && (!paper.gsm || !Number.isFinite(paper.gsm.min) ||
          !Number.isFinite(paper.gsm.max) || paper.gsm.min <= 0 || paper.gsm.max < paper.gsm.min)) {
        throw new Error('Invalid GSM guide: ' + paper.id);
      }
      productIds.add(paper.id);
    }
  }

  function gsmLabel(paper) {
    return paper.gsm ? paper.gsm.min + '–' + paper.gsm.max + ' GSM' : 'Varies by grade';
  }

  function filterPapers(papers, { category = 'all', query = '', sort = 'collection' } = {}) {
    const search = query.trim().toLowerCase();
    const matches = papers.filter(paper =>
      (category === 'all' || paper.group === category) &&
      [paper.name, paper.desc, paper.tag || '', paper.material || '', ...paper.uses].join(' ').toLowerCase().includes(search)
    );
    // Sort a filtered copy so the original collection order remains unchanged.
    return sort === 'az' ? matches.sort((a, b) => a.name.localeCompare(b.name)) : matches;
  }

  function paginate(items, page, pageSize) {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const offset = (currentPage - 1) * pageSize;
    return {
      items: items.slice(offset, offset + pageSize),
      currentPage,
      totalPages,
      offset,
      total: items.length
    };
  }

  function paginationPages(total, current) {
    const visible = new Set([1, total]);
    const first = current <= 2 ? 1 : Math.max(1, current - 1);
    const last = current <= 2 ? Math.min(3, total) : Math.min(total, current + 1);
    for (let page = first; page <= last; page++) visible.add(page);
    if (current >= total - 1) {
      for (let page = Math.max(1, total - 2); page <= total; page++) visible.add(page);
    }
    const pages = [];
    let previous = 0;
    for (const page of [...visible].sort((a, b) => a - b)) {
      if (previous && page - previous > 1) pages.push('…');
      pages.push(page);
      previous = page;
    }
    return pages;
  }

  function enquiryText(formData) {
    const labels = {
      name: 'Name', email: 'Email', paper: 'Product',
      quantity: 'Quantity', details: 'Project details'
    };
    return [
      'M&A INDUSTRIES — PRODUCT ENQUIRY',
      'To: Maaz Dawa, Director', '',
      ...Object.entries(labels)
        .filter(([key]) => formData.has(key))
        .map(([key, label]) => label + ': ' + (formData.get(key) || 'Not specified')),
      '', 'Please confirm availability.',
      'Please confirm product specifications and suitability for the intended application.'
    ].join('\n');
  }

  function productWhatsAppText(product, categoryName) {
    return [
      'Hello M&A Industries,', '',
      "I'm interested in " + product.name + '.',
      'Category: ' + categoryName, '',
      'Please share available options, specifications, pricing, minimum order quantity and availability.', '',
      'Quantity: ',
      product.material ? 'Size / capacity / colour: ' : 'Size / GSM / finish: ',
      'Delivery location: ', '',
      'Thank you.'
    ].join('\n');
  }

  // A display watermark preserves original photos and is shared by static and dynamic markup.
  // Skip existing wrappers so source previews and deployment builds remain idempotent.
  function watermarkImages(html) {
    return html.replace(/<span class="watermarked-image"><img\b[^>]*><\/span>|<img\b[^>]*>/g, markup => {
      if (markup.startsWith('<span') || !/src="assets\/images\/(?:products|categories|ranges|gallery|founders)\//.test(markup)) return markup;
      return '<span class="watermarked-image">' + markup + '</span>';
    });
  }

  // Classic scripts retain compatibility with opening index.html directly.
  window.MACatalogueUtils = Object.freeze({
    validateCatalogue, gsmLabel, filterPapers, paginate, paginationPages, enquiryText, productWhatsAppText, watermarkImages
  });
})();
