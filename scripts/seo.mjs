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
  const { papers, categories } = context.window.MACatalogueData;
  const pages = new Map();
  for (const paper of papers) {
    const category = categories.find(item => item.id === paper.group);
    const title = `${paper.name} Supplier in Mumbai | M&A Industries`;
    const description = `Explore ${paper.name.toLowerCase()} from M&A Industries, Mumbai. ${paper.desc} Enquire about specifications, pricing and availability.`;
    const related = papers.filter(item => item.group === paper.group && item.id !== paper.id);
    const gsm = paper.gsm ? `${paper.gsm.min}–${paper.gsm.max} GSM` : 'Varies by grade';
    const main = `<main id="main-content" tabindex="-1">
      <section class="about-hero">
        <div class="about-hero-copy">
          <p><a href="/">Home</a> / <a href="/#collection">Paper range</a> / ${escapeHtml(paper.name)}</p>
          <p class="eyebrow">${escapeHtml(category.name)} / M&amp;A INDUSTRIES</p>
          <h1>${escapeHtml(paper.name)}</h1>
          <p class="about-lead">${escapeHtml(paper.desc)}</p>
          <p>Supplied from Mumbai, India to customers worldwide. Contact our team to discuss your application, quantity, size and finish.</p>
          <a class="button" href="/#enquiry">Enquire about ${escapeHtml(paper.name.toLowerCase())}</a>
        </div>
        <figure class="about-hero-image"><img src="${escapeHtml(paper.image)}" alt="Illustrative ${escapeHtml(paper.name.toLowerCase())} sample" width="800" height="800" decoding="async"><figcaption>Illustrative paper-family sample; confirm the supplied grade and finish with our team.</figcaption></figure>
      </section>
      <section class="about-section"><h2>Applications and specifications</h2>
        <ul>${paper.uses.map(use => `<li>${escapeHtml(use)}</li>`).join('')}</ul>
        <p><strong>Typical weight guide:</strong> ${escapeHtml(gsm)}. Reference values describe the paper family and are not confirmed stock specifications.</p>
        ${paper.details ? `<p>${escapeHtml(paper.details)}</p>` : ''}
        <p>Pricing, availability and suitability depend on the specific grade and requirement. Share your quantity, dimensions, GSM and intended use with our team.</p>
      </section>
      <section class="about-section"><h2>More ${escapeHtml(category.name.toLowerCase())} papers</h2>
        <ul>${related.map(item => `<li><a href="${productPath(item)}">${escapeHtml(item.name)}</a></li>`).join('')}</ul>
        <a href="/#collection">Browse all paper families</a>
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
