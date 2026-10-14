# M&A Industries website

A static product catalogue for M&A Industries, covering paper and packaging, sugarcane-based products, and recycled household goods. The site contains four pages, 12 categories, product enquiry dialogs, WhatsApp links, and a downloadable catalogue.

## Project structure

```text
.
|-- index.html, about.html, categories.html, products.html
|-- assets/
|   |-- catalogues/          Public PDF catalogue
|   |-- css/                  Shared responsive styles
|   |-- js/                   Catalogue data, helpers, and page behavior
|   `-- images/               Brand, category, product, founder, and mill photos
|-- scripts/
|   |-- site/                 Deployment build, syntax check, and asset manifests
|   |-- catalogue/            PDF catalogue generator
|   |-- cards/                Visiting-card generator
|   |-- images/               Image optimization tools
|   `-- references/           Image prompts and source notes
|-- tests/                    Catalogue and browser-interaction checks
|-- output/pdf/               Generated catalogue and visiting cards
|-- tmp/                      Local image inputs, PDF data, and caches (ignored)
|-- dist/                     Generated deployment site (ignored)
|-- render.yaml               Render static-site configuration
|-- CLAUDE.md                 Contributor guidance
`-- package.json              Project commands and Node version
```

The four root HTML files are the website pages. Product information lives in `assets/js/catalogue-data.js`; stable product and category IDs connect filters, dialogs, enquiries, and PDF links. Keep public images listed in the manifests under `scripts/site/manifests/`. The build uses those manifests as an allowlist.

Generated files belong in `dist/` or `output/pdf/`. Do not edit `dist/` directly. Temporary source images, resized PDF images, and work files belong under `tmp/`.

## Requirements and commands

The site uses Node.js 20 or newer and has no npm dependencies. Catalogue and visiting-card generation also use the local Python environment and its imaging/PDF libraries.

```sh
npm run check
npm test
npm run build
npm run catalogue
npm run catalogue -- --preview
```

`npm run check` validates browser JavaScript syntax. `npm test` runs the catalogue and interaction checks. `npm run build` creates the four-page deployment site in `dist/`, plus its sitemap and robots file. `npm run catalogue` creates the 18-page PDF, updates `assets/catalogues/MA-Industries-Paper-Catalogue.pdf`, and writes the print-ready copy to `output/pdf/MA-Industries-Catalogue.pdf`. The optional `--preview` flag renders the cover and contents pages for review.

Product links inside the PDF open `products.html` with the relevant category and product selected. The catalogue page reads the product hash and opens its detail dialog.

To preview the site locally, open `index.html` or serve the repository root:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Render uses `render.yaml` to run `node scripts/site/build.mjs` and publish `dist/`. `SITE_URL` sets canonical and social-preview URLs; the production domain is `https://maindustries.in`.

## Catalogue and content updates

- Edit product and category records in `assets/js/catalogue-data.js`. Keep IDs stable and group IDs matched to an existing category.
- Add public product or category images to the corresponding JSON manifest under `scripts/site/manifests/`.
- Edit page content in the matching root HTML file and shared styles in `assets/css/style.css`.
- Use the tools under `scripts/images/` to convert supplied source images. They read from `tmp/product-images/` or `tmp/category-images/` and write optimized assets into `assets/images/`.
- Create a visiting card with `python scripts/cards/create-visiting-card.py --website https://maindustries.in/ --person maaz`. Valid people are `maaz`, `aadil`, `mohammed`, and `yahya`.

Descriptions and images help visitors explore the range. Confirm item specifications, composition, price, availability, certification, and application suitability with the team before quoting. Enquiry actions prepare WhatsApp or email drafts; the site does not send messages or process submissions on a server.