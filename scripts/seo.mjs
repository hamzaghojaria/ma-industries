/** Generate crawlable pages from the same catalogue used by the interactive site. */
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
export const productPath = paper => `paper-${paper.id}.html`;

export async function cataloguePages(root, template) {
  const context = { window: {} };
  runInNewContext(await readFile(new URL('assets/js/catalogue-data.js', root), 'utf8'), context);
  runInNewContext(await readFile(new URL('assets/js/catalogue-utils.js', root), 'utf8'), context);
  const { papers, categories } = context.window.MACatalogueData;
  const pages = new Map();
  for (const paper of papers) {
    const category = categories.find(item => item.id === paper.group);
    const whatsappUrl = 'https://wa.me/919769681761?text=' + encodeURIComponent(context.window.MACatalogueUtils.productWhatsAppText(paper, category.name));
    const title = `${paper.name} Supplier in Mumbai | M&A Industries`;
    const description = `Explore ${paper.name.toLowerCase()} from M&A Industries, Mumbai. ${paper.desc} Enquire about specifications, pricing and availability.`;
    const related = papers.filter(item => item.group === paper.group && item.id !== paper.id);
    const gsm = paper.gsm ? `${paper.gsm.min}–${paper.gsm.max} GSM` : 'Varies by grade';
    const main = `<main id="main-content" tabindex="-1">
      <section class="about-hero">
        <div class="about-hero-copy">
          <p><a href="index.html">Home</a> / <a href="categories.html">Product categories</a> / ${escapeHtml(paper.name)}</p>
          <p class="eyebrow">${escapeHtml(category.name)} / M&amp;A INDUSTRIES</p>
          <h1>${escapeHtml(paper.name)}</h1>
          <p class="about-lead">${escapeHtml(paper.desc)}</p>
          <p>${paper.sourcingOnly ? 'Additional sourcing range. Contact our Mumbai team to discuss options, availability, material composition and your intended application.' : 'Supplied from Mumbai, India to customers worldwide. Contact our team to discuss your application, quantity, size and finish.'}</p>
          <div class="product-enquiry-actions"><a class="button" href="index.html?paper=${encodeURIComponent(paper.id)}#enquiry">Enquire about ${escapeHtml(paper.name.toLowerCase())}</a><a class="button whatsapp-button" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer">WhatsApp connect ↗</a></div>
        </div>
        <figure class="about-hero-image"><img src="${escapeHtml(paper.image)}" alt="${paper.illustration ? 'Collection: ' + escapeHtml(category.name) : escapeHtml(paper.name)}" width="800" height="800" decoding="async"></figure>
      </section>
      <section class="about-section"><h2>Applications and specifications</h2>
        <ul>${paper.uses.map(use => `<li>${escapeHtml(use)}</li>`).join('')}</ul>
        <p><strong>${paper.material ? 'Material:' : 'Typical weight guide:'}</strong> ${escapeHtml(paper.material || gsm)}. ${paper.material ? 'Confirm composition for the selected item.' : 'Reference values describe the paper family and are not confirmed stock specifications.'}</p>
        ${paper.details ? `<p>${escapeHtml(paper.details)}</p>` : ''}
        <p>Pricing, availability and suitability depend on the specific grade and requirement. Share your quantity, dimensions, material requirements and intended use with our team.</p>
      </section>
      <section class="about-section"><h2>More ${escapeHtml(category.name.toLowerCase())} products</h2>
        <ul>${related.map(item => `<li><a href="${productPath(item)}">${escapeHtml(item.name)}</a></li>`).join('')}</ul>
        <a href="products.html#collection">Browse all products</a>
      </section>
    </main>`;
    let html = template.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, main)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*(">)/g,
        (_, before, after) => before + escapeHtml(description) + after)
      .replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*(">)/g,
        (_, before, after) => before + escapeHtml(title) + after)
      .replace(' aria-current="page"', '');
    pages.set(productPath(paper), html);
  }
  return { pages, papers };
}
