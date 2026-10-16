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

  function specificationFields(paper) {
    const fields = [];
    const add = (label, value) => {
      if (value && !fields.some(field => field.label.toLowerCase() === label.toLowerCase() && field.value === value)) fields.push({ label, value });
    };
    for (const item of paper.specifications || []) {
      if (typeof item === 'object' && item.label && item.value) add(item.label, item.value);
      else {
        const text = String(item);
        const separator = text.indexOf(':');
        add(separator > 0 ? text.slice(0, separator).trim() : 'Available variant', separator > 0 ? text.slice(separator + 1).trim() : text);
      }
    }
    if (paper.gsm) {
      add('Paper weight', gsmLabel(paper) + ' indicative range');
      add('Supply format', 'Sheets or reels; confirm the required format');
      add('Dimensions', 'Confirm sheet size or reel width on enquiry');
      if (paper.group === 'boards' || paper.group === 'packaging') add('Strength / grade', 'Confirm burst factor, compression or construction requirements');
      else if (paper.group === 'labels') add('Converting details', 'Confirm face stock, adhesive, liner and print process');
      else if (paper.group === 'wrapping') add('Food-contact use', 'Confirm coating, temperature range and required certification');
      else add('Finish / colour', 'Confirm grade, shade and surface finish');
      add('Order quantity', 'Confirm pack, reel or minimum order quantity');
    } else {
      add('Material', paper.material || 'Confirm item-specific composition');
      add('Dimensions / capacity', 'Confirm the required size or selected variant');
      add('Colour / finish', 'Confirm available options on enquiry');
      if (paper.group === 'recycled-household') add('Recycled content', 'Confirm item-specific recycled percentage and composition');
      add('Pack quantity', 'Confirm pack size and minimum order quantity');
    }
    return fields;
  }

  function filterPapers(papers, { category = 'all', query = '', sort = 'collection' } = {}) {
    const search = query.trim().toLowerCase();
    const matches = papers.filter(paper =>
      (category === 'all' || paper.group === category) &&
      [paper.name, paper.desc, paper.tag || '', paper.material || '', ...paper.uses,
        ...specificationFields(paper).flatMap(field => [field.label, field.value])].join(' ').toLowerCase().includes(search)
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
    validateCatalogue, gsmLabel, specificationFields, filterPapers, paginate, paginationPages, enquiryText, productWhatsAppText, watermarkImages
  });
})();
