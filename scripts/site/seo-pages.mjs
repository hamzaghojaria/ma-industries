import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

export async function createSeoPages(root, baseUrl, escape) {
  const context = { window: {} };
  runInNewContext(await readFile(new URL('assets/js/catalogue-data.js', root), 'utf8'), context);
  const { papers, categories } = context.window.MACatalogueData;
  const utilsContext = { window: { MACatalogueData: context.window.MACatalogueData } };
  runInNewContext(await readFile(new URL('assets/js/catalogue-utils.js', root), 'utf8'), utilsContext);
  const { specificationFields } = utilsContext.window.MACatalogueUtils;
  const template = await readFile(new URL('about.html', root), 'utf8');
  const pages = new Map();
  const productPath = item => `product-${item.id}.html`;
  const categoryPath = item => `category-${item.id}.html`;
  const url = path => new URL(path, baseUrl).href;
  const fitDescription = value => {
    const text = value.replace(/\s+/g, ' ').trim();
    if (text.length <= 158) return text;
    return text.slice(0, 155).replace(/\s+\S*$/, '').replace(/[ ,;:.]+$/, '') + '…';
  };
  const list = items => `<ul>${items.map(item => `<li><a href="${productPath(item)}">${escape(item.name)}</a> — ${escape(item.desc)}</li>`).join('')}</ul>`;
  const breadcrumbs = (category, product) => {
    const entries = [{ name: 'Home', item: baseUrl.href }, { name: 'Categories', item: url('categories.html') }, { name: category.name, item: url(categoryPath(category)) }];
    if (product) entries.push({ name: product.name, item: url(productPath(product)) });
    return { '@type': 'BreadcrumbList', itemListElement: entries.map((entry, i) => ({ '@type': 'ListItem', position: i + 1, ...entry })) };
  };
  const render = (path, title, description, body, graph) => {
    let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(">)/g, (_, start, end) => start + escape(description) + end)
      .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(">)/g, (_, start, end) => start + escape(title) + end)
      .replace(/<main[\s\S]*?<\/main>/, `<main id="main-content" tabindex="-1"><section class="about-section collection">${body}</section></main>`)
      .replace(' href="about.html" aria-current="page"', ' href="about.html"');
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>\n</head>`);
    pages.set(path, html);
  };
  for (const category of categories) {
    const items = papers.filter(item => item.group === category.id);
    const description = fitDescription(`${category.desc} Browse ${items.length} products from M&A Industries in Mumbai and enquire about your application.`);
    render(categoryPath(category), `${category.name} Supplier in Mumbai | M&A Industries`, description,
      `<div><nav aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="categories.html">Categories</a> / ${escape(category.name)}</nav><p class="eyebrow">M&amp;A INDUSTRIES · MUMBAI</p><h1>${escape(category.name)}</h1><p>${escape(category.desc)}</p><h2>Explore ${items.length} products</h2>${list(items)}<h2>Discuss your requirements</h2><p>Share your application, quantity, delivery destination and required dimensions. Confirm material composition, specifications, pricing and availability with our Mumbai team.</p><a class="button" href="index.html#enquiry">Make an enquiry</a></div>`,
      [breadcrumbs(category), { '@type': 'ItemList', name: category.name, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: url(productPath(item)) })) }]);
  }
  for (const item of papers) {
    const category = categories.find(category => category.id === item.group);
    const properties = specificationFields(item).map(specification => ({ '@type': 'PropertyValue', name: specification.label, value: specification.value }));
    const description = fitDescription(`${item.name}: ${item.desc} Enquire with M&A Industries in Mumbai about specifications and quantities.`);
    render(productPath(item), `${item.name} Supplier in Mumbai | M&A Industries`, description,
      `<div><nav aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="${categoryPath(category)}">${escape(category.name)}</a> / ${escape(item.name)}</nav><p class="eyebrow">${escape(category.name)} · MUMBAI</p><h1>${escape(item.name)}</h1><p>${escape(item.desc)}</p><img src="${escape(item.image)}" alt="${escape(item.name)}${item.illustration ? ' collection illustration' : ''}" width="800" height="800" style="width:100%;max-width:440px;height:auto" fetchpriority="high" decoding="async"><h2>Applications</h2><ul>${item.uses.map(use => `<li>${escape(use)}</li>`).join('')}</ul><h2>Specifications and sourcing</h2>${properties.map(property => `<p><strong>${escape(property.name)}:</strong> ${escape(property.value)}</p>`).join('')}${item.details ? `<p>${escape(item.details)}</p>` : ''}<p>Confirm the specific grade, dimensions, quantity, price and availability before ordering. ${item.gsm ? 'GSM ranges are indicative guides; confirm the required weight and finish for your application.' : 'Ask for item-specific composition, care and suitability documentation where relevant.'}</p><h2>Enquire about ${escape(item.name)}</h2><p>Contact M&amp;A Industries in Mumbai with your intended use, quantity and delivery destination.</p><a class="button" href="https://wa.me/919769681761?text=${encodeURIComponent(`Hello M&A Industries, I am interested in ${item.name}. Please share specifications, pricing and availability.`)}" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a> <a class="button" href="products.html?category=${item.group}#paper-${item.id}">View in catalogue</a><h2>Related products</h2>${list(papers.filter(other => other.group === item.group && other.id !== item.id))}</div>`,
      [breadcrumbs(category, item), { '@type': 'Product', '@id': url(productPath(item)) + '#product', name: item.name, description: item.desc, image: url(item.image), url: url(productPath(item)), category: category.name, ...(properties.length ? { additionalProperty: properties } : {}) }]);
  }
  return { pages, categories, papers, categoryPath, productPath };
}
