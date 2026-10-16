# M&A Industries website

A static catalogue led by sugarcane-based essentials and recycled household goods, supported by traditional paper and packaging. The current catalogue has **66 products in 12 categories**. No database, checkout, backend form submission, or npm dependencies are required.

The shared merchandising order is sugarcane household goods, sugarcane food packaging, sugarcane paper, recycled household products, then traditional paper categories. `assets/js/catalogue-data.js` defines that order for products, filters, enquiry suggestions and generated pages. Product IDs and original reference numbers remain stable; card display numbers follow the current browsing order. The existing PDF catalogue is unchanged and will be revised separately.

After adding or replacing a JPEG product photo, run `python scripts/images/create-responsive-images.py` before building. It creates the card previews and responsive candidates; use source photos at least 640 pixels wide. The build rejects missing card-preview entries. Commit the generated files and image manifest together.

See [PERFORMANCE.md](PERFORMANCE.md) for the PageSpeed baseline, performance changes, image/font maintenance, and measurement limits. Range/directory/gallery styles live in `assets/css/ranges.css`; motion refinements live in `assets/css/motion.css`. Keep their import order in `style.css`. Gallery controls live in `assets/js/gallery.js` and load only on the homepage. Local fonts and responsive images are checked in, so deployments need no network downloads or image-processing dependencies.

## Pages and visitor flow

The homepage Material Studio lets visitors choose an application and updates a material preview, recommendation and catalogue link. Its behavior lives in `assets/js/studio.js` and styles in `assets/css/studio.css`. The default recommendation remains usable without JavaScript. Shared pointer lighting and subtle card tilt activate only for fine pointers with motion allowed; switching to reduced motion clears them immediately. Keep hero text visible on its first paint when adding motion.

| Page | Purpose |
| --- | --- |
| `index.html` | Homepage, range introductions, gallery, enquiry form, and two brand cards |
| `categories.html` | Sugarcane & Recycled categories first, followed by Paper & Packaging, with crawlable material-guide links |
| `products.html` | Category filters, search, sorting, six products per page, dialogs, enquiries |
| `about.html` | Company information and founders |
| `dist/category-*.html` | Generated, crawlable category guides |
| `dist/product-*.html` | Generated, crawlable product details |

Category cards open `products.html?category=<category-id>#collection`. Desktop visitors use the sidebar; at 900px and below, a category dropdown appears above search. Both controls share the same category state and counts. Selecting a category or changing search/sort returns to page one. Reset clears category, search, and sorting.

Product cards open a native dialog at `#paper-<product-id>`. Choosing a product fills the enquiry form. WhatsApp and email actions prepare drafts in the visitor's app for review and sending. The website itself never sends a message.

The homepage brand cards have separate website/profile actions. M&A Engineerings uses the supplied Google Business Profile link. The Industries profile remains grey and disabled until its URL is supplied; preserve `aria-disabled="true"` while inactive.

## Directory map

```text
.
|-- index.html, about.html, categories.html, products.html
|-- assets/
|   |-- css/
|   |   |-- style.css          Entry point; imports the component CSS modules
|   |   |-- shared.css         Tokens, header, page sections, products, dialogs, motion
|   |   |-- catalogue.css      Sidebar, category dropdown, search, sort, reset, layout
|   |   |-- footer.css         Footer links, contact actions, responsive layout
|   |   |-- brands.css         Homepage brand cards and their actions
|   |   `-- watermarks.css     Logo/name overlays on content photography
|   |-- js/
|   |   |-- catalogue-data.js  Product/category data; canonical names and stable IDs
|   |   |-- catalogue-utils.js Filtering, pagination, validation, enquiry helpers
|   |   |-- app.js             Catalogue, gallery, dialogs, enquiry behavior
|   |   |-- navigation.js      Shared header/menu behavior on every page
|   |   `-- experience.js      Progressive animation and reading progress
|   |-- images/                Brand, product, category, founder, mill photos
|   `-- catalogues/            Published PDF catalogue
|-- scripts/
|   |-- site/
|   |   |-- config.mjs         Shared page and browser-script lists
|   |   |-- check.mjs          Browser JavaScript syntax checks
|   |   |-- catalogue-markup.mjs Synchronize static catalogue labels and counts
|   |   |-- styles.mjs         Bundle local CSS modules in declared order
|   |   |-- build.mjs          Deployment, metadata, sitemap, robots.txt
|   |   |-- seo-pages.mjs      Generated category/product pages
|   |   |-- verify-build.mjs   Deployed local links, assets, anchors, structured data
|   |   `-- manifests/        Public product/category image allowlists
|   |-- catalogue/             PDF data export and generation
|   |-- cards/                 Visiting-card generator
|   |-- images/                Image optimization utilities
|   `-- references/            Prompts and research notes; not deployed
|-- tests/                     Data, interaction, motion, page-integrity checks
|-- output/pdf/                Generated catalogue/visiting-card artifacts
|-- tmp/                       Local source images, migration scripts, caches; ignored
|-- dist/                      Generated deployment; ignored
|-- render.yaml                Render static-site configuration
`-- SEO-PLAN.md                SEO rollout and post-deployment tasks
```

## Requirements and commands

Use **Node.js 20 or newer**, with npm on your PATH. No `npm install` is needed. Python is needed for preview serving, image tools, and PDF/card generation. PDF tools use Pillow, ReportLab, and PyMuPDF.

| Command | Purpose |
| --- | --- |
| `npm run check` | Browser-script syntax and stale source category names/counts |
| `npm run sync:catalogue` | Refresh source HTML category labels, dropdown options, and counts |
| `npm test` | All automated regression tests |
| `npm run build` | Generate deployment into `dist/` |
| `npm run verify:build` | Check existing deployment links, assets, anchors, IDs, and JSON-LD |
| `npm run validate` | Run check, tests, build, and deployment verification in sequence |
| `npm run catalogue` | Regenerate the downloadable PDF catalogue |
| `npm run catalogue -- --preview` | Also render the PDF cover and contents pages |

Preview production output locally:

```powershell
npm run build
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:8000`. Serve the root without `--directory dist` for source preview. Classic browser scripts also support directly opening root HTML files. Source preview loads the CSS modules; deployment bundles them into one stylesheet.

If a runtime command is not recognized, install/configure it and restart the VS Code terminal. VS Code can run different shells. Windows PowerShell 5 does not support `&&`; npm's scripts still run through npm's command shell.

## Editing catalogue content

1. Edit `assets/js/catalogue-data.js`. Category `name` is the canonical label. Preserve existing category and product IDs: filters, URLs, dialogs, PDF links, and enquiries depend on them.
2. Products need unique `id`, `name`, valid category `group`, `tag`, `desc`, `uses`, `image`, `index`, colours, and `gsm`. Use `gsm: null` without a verified paper-weight guide. Non-paper products use `material`. Do not invent composition, measurements, certification, stock, prices, or minimum quantities.
3. Add actual photos under `assets/images/products/` and filenames to `scripts/site/manifests/product-images.json`. Category images use the category folder and manifest. Identify representative imagery as such.
4. Run `npm run sync:catalogue` to refresh category cards, desktop filters, mobile options, and totals. The build also synchronizes deployed HTML in memory from the data.
5. Run `npm run validate`. Regenerate and review the PDF separately when products change.

The PDF generator reads current website data, writes `output/pdf/MA-Industries-Catalogue.pdf`, and updates `assets/catalogues/MA-Industries-Paper-Catalogue.pdf`. This public filename is retained for existing links. PDF product links select the matching website dialog.

## Editing layout safely

Edit the existing rule in the owning CSS module. Avoid appending competing overrides. Keep breakpoint refinements with their component. `style.css` declares the module order; production preserves that order and strips comments/indentation. Explain non-obvious behavior in comments instead of commenting every declaration.

Shared vertical spacing uses `--section-space` and `--section-space-compact` in `shared.css`: 40px/32px on desktop and 30px/26px at 800px and below. Change these tokens to adjust section spacing together; banner and brand-card spacing is defined in the owning component rules.

| Width | Expected behavior |
| --- | --- |
| 900px and below | Category dropdown visible; sidebar hidden |
| 901px and above | Sidebar visible; mobile category dropdown hidden |
| 901–1100px | Search occupies its own toolbar row |
| 600px and below | Footer has two equal columns; products and brands retain swipe layouts |
| 800px and below | Header uses the mobile menu |

Preserve the `products`, `pagination`, `results-count`, `active-category`, `category-select`, `search`, `sort`, `reset-catalogue`, `detail`, `detail-body`, `brief`, `paper`, `paper-options`, and `status` IDs. Maintain visible keyboard focus, 44px minimum touch targets, 16px mobile inputs, and reduced-motion behavior.

Menu behavior belongs in `navigation.js`, shared by all pages. Catalogue scripts load in data → utilities → app order. Navigation initializes independently. Motion must enhance content without blocking access to it.

Content photos display the M&A Industries logo/name watermark through `watermarks.css`. The shared `watermarkImages()` helper wraps product, category, range, gallery, and founder images in static pages, generated pages, product cards, and dialogs. It skips logos/icons and existing wrappers. These are website overlays; original image files and downloadable PDFs remain unchanged.

Contributor conventions:

- Preserve branding, business contact details, and the concise form/footer unless a change is requested.
- Prefer delegated event handlers for dynamically rendered product cards and pagination controls.
- Use `textContent` for visitor-supplied content. Escape trusted catalogue data when inserting it into HTML templates.
- Publish only verified biographies, product specifications, availability, prices, minimum quantities, certifications, and performance claims.
- Keep credentials out of source files and logs. Document anything that could not be verified at handoff.

## Verification before pushing

Run `npm run validate`. Tests cover catalogue validity, all category selections, search, sorting, pagination, reset, dialogs, enquiry drafts, menu behavior, reduced motion, static labels/counts, assets, and generated page details. Deployment verification checks every generated HTML page and its local targets. Tests do not replace visual review.

After shared CSS changes, review **all four pages** at phone, tablet, and desktop widths. Also check the 900px category-control boundary and 1100px toolbar boundary:

- No page-wide overflow; intended product, brand, and gallery swipe areas still scroll.
- Search, sort, and reset align; mobile category labels fit.
- Category cards preselect the right filter and heading.
- Search, empty results, sorting, pagination, and reset work together.
- Dialogs support mouse/keyboard, Escape, and scroll restoration.
- Product selection fills the enquiry. Inspect draft URLs without sending test messages.
- Brand cards align; Engineerings profile works; Industries profile remains disabled.
- Footer, mobile menu, focus, and reduced motion still work.

The cleanup was compared against preceding layout measurements for all four pages at 390px, 900px, and 1440px. Additional browser checks covered all four pages at 320, 600, 800, 900, 901, 1100, 1101, and 1440px, all mobile category choices, desktop search/sort/reset/pagination, the mobile menu, and the sugarcane category → product → enquiry flow. Automated tests use a simplified DOM; future layout changes still require real-browser checks.

## Deployment

Render runs `node scripts/site/build.mjs` and publishes `dist/`. `SITE_URL` sets the canonical origin; production is `https://maindustries.in`. The build resolves share-image URLs, adds canonical URLs/structured data, and generates sitemap/robots files. Currently it produces 82 HTML pages: four root pages, 12 category guides, and 66 product pages.

Only allowlisted public files are deployed. Keep image manifests and the build public-file list current. CSS source modules are bundled into `dist/assets/css/style.css`. Documentation, internal tools, prompts, temporary files, and credentials are not published. Never edit generated `dist/` directly.

## Other utilities

Image tools read local inputs under `tmp/product-images/` or `tmp/category-images/` and write optimized public assets. Review filenames and manifests afterward.

Generate a visiting card:

```powershell
python scripts/cards/create-visiting-card.py --website https://maindustries.in/ --person maaz
```

Supported people: `maaz`, `aadil`, `mohammed`, `yahya`.

After validation, this Windows PowerShell 5 one-liner stages, commits, and pushes only if each preceding command succeeds:

```powershell
git add .; if ($LASTEXITCODE -eq 0) { git commit -m "Refactor shared website styles and checks"; if ($LASTEXITCODE -eq 0) { git push } }
```
