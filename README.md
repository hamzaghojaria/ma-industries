# M&A Industries website

A responsive product catalogue for M&A Industries, with 62 products across 12 categories, product enquiry dialogs, WhatsApp contact links and a printable catalogue.

## Project map

```text
.
├── index.html                 Home page and enquiry form
├── about.html                 Company and founder information
├── categories.html            Category directory
├── products.html              Searchable, paginated product catalogue
├── assets/
│   ├── catalogues/            Current public PDF catalogue
│   ├── css/style.css           Shared layout, responsive styles and motion
│   ├── js/
│   │   ├── catalogue-data.js   Product and category source data
│   │   ├── catalogue-utils.js  Filtering, paging and message helpers
│   │   ├── app.js              Product rendering and interactions
│   │   ├── about.js            Shared page navigation
│   │   └── experience.js       Shared motion and reading progress
│   └── images/
│       ├── categories/         Paper category photography
│       ├── founders/           Founder portraits
│       ├── gallery/            Factory and production photography
│       ├── products/            Individual product images
│       └── ranges/              Collection images
├── scripts/
│   ├── build.mjs               Static deployment build and asset allowlist
│   ├── create-catalogue.mjs    PDF catalogue entry point
│   ├── create-range-catalogue.py PDF catalogue layout and export
│   ├── create-visiting-card.py Print-ready business cards
│   ├── optimize-*.py           Image conversion helpers
│   └── *.json                  Image manifests, prompts and source notes
├── tests/                      Catalogue and interaction checks
├── output/pdf/                 Generated catalogue and visiting-card files
├── tmp/                         Local image sources, caches and work files
├── dist/                        Generated website for deployment
├── render.yaml                  Render Static Site configuration
├── CLAUDE.md                    Contributor guidance
└── package.json                 Project commands and Node version
```

`dist/` is rebuilt from source and should not be edited directly. The build copies only the files named in its public asset manifests. Keep original image inputs and PDF image caches under the ignored `tmp/` directory; generated QA screenshots can be discarded. Print-ready PDFs are written to `output/pdf/`, while the website downloads its catalogue from `assets/catalogues/`.

## Local preview

Open `index.html` directly, or serve the project root over HTTP:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Google Fonts require internet access; local fallback fonts are configured.

## Build and checks

The website requires Node.js 20 or newer and has no npm dependencies.

```sh
npm run check
npm test
npm run build
```

The check command validates browser JavaScript syntax. Tests cover catalogue data and browser interactions. The build prepares the four main pages and public assets in `dist/`. Product details open in the catalogue dialog; PDF product links return to the matching product.

## Catalogue and business cards

On Windows, `npm run catalogue` generates the 18-page PDF catalogue from `assets/js/catalogue-data.js`. It expects the local Python environment in `tmp/pdf-venv/`; alternatively, set `PYTHON` to a Python executable with Pillow, ReportLab and PyMuPDF installed. The generator caches resized photos so later builds run faster and skips per-page preview rendering by default. Use `npm run catalogue -- --preview` to render the cover and category index for visual review. It writes the PDF to `output/pdf/` and refreshes `assets/catalogues/MA-Industries-Paper-Catalogue.pdf`. Run `npm run build` after updating the PDF so the website copy in `dist/` is current.

Generate one of the visiting cards with:

```sh
python scripts/create-visiting-card.py --website https://maindustries.in/ --person maaz
```

Available people are `maaz`, `aadil`, `mohammed` and `yahya`. The card generator needs ReportLab, pypdf, PyMuPDF and Pillow. It saves print-ready PDFs and visual previews in `output/pdf/`.

## Deploy

The Render Static Site uses `render.yaml`:

| Setting | Value |
| --- | --- |
| Build command | `node scripts/build.mjs` |
| Publish directory | `dist` |

`SITE_URL` supplies canonical and social-preview URLs. The configured production address is `https://maindustries.in`. The build creates `sitemap.xml`, `robots.txt` and structured data for the four main pages.

## Updating the site

- Edit product names, descriptions, materials, categories and image paths in `assets/js/catalogue-data.js`.
- Keep product IDs stable and make sure each product's category ID exists in the same file.
- Add new public images to `scripts/product-images.json` or `scripts/category-images.json`; the build uses these manifests as an explicit allowlist.
- Edit page text and structure in the matching root HTML file. Shared styles belong in `assets/css/style.css`.
- Product images and material descriptions are illustrative. Confirm specifications, composition, price, stock and application suitability with the team before quoting.
- Enquiry buttons prepare WhatsApp or email drafts for the visitor. The website does not send messages or process form submissions on a server.

Before publishing, run the build and review desktop and mobile layouts, category filters, search, pagination, product dialogs and enquiry links. Do not send test enquiries to the business.
