# M&A Industries

A responsive, single-page paper catalogue with 36 products across eight categories, searchable product enquiries, and WhatsApp/email contact actions.

## Project structure

```text
MA-Industries-Single-Page/
├── index.html              # Page content, navigation, form and metadata
├── assets/
│   ├── css/style.css       # Layout, mobile sliders and animations
│   ├── js/
│   │   ├── catalogue-data.js  # Products and categories
│   │   ├── catalogue-utils.js # Filtering, paging and message helpers
│   │   └── app.js             # Page rendering and event handlers
│   └── images/             # Logos, favicon sizes and social-preview image
├── scripts/
│   ├── build.mjs           # Validate and package public assets
│   └── check.mjs           # Check browser-script syntax
├── tests/                  # Catalogue and page-interaction regression checks
├── package.json            # Dependency-free build/check commands
├── render.yaml             # Render Static Site configuration
├── CLAUDE.md               # Guidance for contributors and coding assistants
├── README.md
└── .gitignore
```

## Preview locally

Open `index.html` in your browser. Keep the `assets` folder beside it.

For an HTTP preview, use any static server. For example, with Python installed:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. Google Fonts use an internet connection; serif and sans-serif fallbacks are included.

## Build and check

Requires Node.js 20 or newer. There are no runtime or build dependencies to install.

```sh
npm run check
npm test
npm run build
```

The build validates all three browser scripts, compacts CSS, and copies only public site assets into `dist/`, retaining their folder paths. Generated output is ignored by Git. Tests exercise catalogue rules and page interactions using a lightweight DOM fixture; they do not replace visual checks in a real browser.

## Deploy to Render

Connect this GitHub repository to a **Static Site**, or use `render.yaml` as a Blueprint.

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Build command | `node scripts/build.mjs` |
| Publish directory | `dist` |

The build uses Render’s `RENDER_EXTERNAL_URL` for canonical and social-preview URLs. Set `SITE_URL` to your public HTTPS address when using a custom domain. Link previews require public hosting and may be cached by sharing platforms.

## Website behaviour

- Category filters and search narrow the catalogue; six products appear per page.
- Category and product cards become horizontal swipe strips on phones.
- Clicking a product opens its details and can preselect it in the enquiry.
- Paper product uses native autocomplete suggestions; rendering varies by browser.
- WhatsApp and email buttons prepare messages for visitors to review and send.
- No server-side form processing, analytics or visitor-data storage is included.
- Animations respect reduced-motion preferences.

## Editing

- **Content / contact links / metadata:** `index.html`.
- **Products and category data:** `assets/js/catalogue-data.js`.
- **Filtering, pagination and enquiry text:** `assets/js/catalogue-utils.js`.
- **Rendering, navigation and event handlers:** `assets/js/app.js`.
- **Styles and breakpoints:** `assets/css/style.css`.
- **Branding assets:** `assets/images/`.

Counts are calculated from catalogue data at startup. If the catalogue changes, also update the static HTML fallback totals, metadata and sharing image where needed. Product descriptions describe paper families; grade specifications, pricing, stock and application suitability must be confirmed with the team.

## Validation before publishing

Run the build/check commands and inspect desktop and mobile layouts. Check category search, paging, product dialogs, enquiry selection, mobile navigation and contact links. Do not send test enquiries to the business.

## Reference material

General paper-family descriptions were informed by [Domtar office papers](https://www.domtar.com/domtar-paper/our-products/office-papers/), [Domtar thermal papers](https://www.domtar.com/domtar-paper/our-products/thermal-papers/), [Avery Dennison liners](https://label.averydennison.com/eu/en/home/products/liners.html), and [Fedrigoni specialty papers](https://specialpapers.fedrigoni.com/).

## Product photography

All 36 products use AI-generated illustrative paper-family samples in `assets/images/products/`. These do not certify the exact colour, finish, grade or stock supplied. Each image is an 800 × 800 WebP, with fixed display bounds and lazy loading in the catalogue. Product details use the same image.

The images were created with the built-in image generation tool using one prompt per product: realistic commercial studio sample photograph, warm white seamless background, three-quarter overhead view, soft upper-left daylight, natural shadows, centred material with clear margins, accurate paper-family form and texture, no text or logos. Product-specific subjects are recorded in `scripts/product-image-prompts.json`.

When replacing a photo, update its `image` path in `catalogue-data.js` and the explicit deployment allowlist in `scripts/product-images.json`.

## Category photography

The eight category cards use separate AI-generated illustrative assortments in `assets/images/categories/`, matching the product photos. Images use lazy loading and fixed 16:10 display bounds; card links, product counts and mobile swipe behavior stay intact. `scripts/category-images.json` lists deployment assets and `scripts/category-image-prompts.json` records generation subjects. Category image paths are in `index.html`.
