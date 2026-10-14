# Project guidance

## Overview

M&A Industries is a static website with four root HTML pages. Product data and browser behavior are shared across the catalogue. Render runs `scripts/site/build.mjs` and publishes generated `dist/`.

## Commands

- `npm run check`: validate browser JavaScript syntax.
- `npm test`: run catalogue and page-interaction checks.
- `npm run build`: prepare the deployment site.
- `npm run catalogue`: regenerate the downloadable PDF catalogue.

Node.js 20 or newer is required. No npm packages are used.

## Source map

- Root HTML files contain page structure, metadata, copy, navigation, and form markup.
- `assets/js/catalogue-data.js` contains product and category records. Keep IDs stable and product groups valid.
- `assets/js/catalogue-utils.js` contains filtering, paging, validation, and enquiry-message helpers.
- `assets/js/app.js` renders the catalogue, handles filters and product dialogs, and prepares enquiry actions.
- `assets/js/about.js` and `assets/js/experience.js` provide shared navigation and motion behavior.
- `assets/css/style.css` contains the shared design system and responsive layout. Inspect the cascade before adding overrides.
- `scripts/site/` contains the deployment build, browser-script checker, and public asset manifests.
- `scripts/catalogue/`, `scripts/cards/`, and `scripts/images/` contain the PDF, business-card, and image tools.
- `scripts/references/` contains image prompts and source notes; it is not published.
- `tests/` contains catalogue and browser-interaction checks.
- `render.yaml` configures the static deployment. `dist/` and `tmp/` are generated or local-only directories.

## Implementation conventions

- Preserve M&A Industries branding, business contact details, and the current concise form/footer unless requested otherwise.
- Counts are calculated from data. Keep static fallback totals and descriptions consistent when editing the catalogue.
- Load classic scripts in data, utilities, app order so direct-file previews continue to work.
- Prefer delegated event handlers for dynamically rendered cards and paging controls.
- Preserve the `paper`, `brief`, `products`, `pagination`, and `status` element IDs; JavaScript uses them.
- Enquiry actions open WhatsApp or email drafts. Do not send messages or claim a message was sent.
- Do not invent biographies, certifications, availability, prices, minimum quantities, or performance claims.
- Use `textContent` for visitor-supplied content. Catalogue HTML may use trusted repository data with escaping where needed.
- Keep mobile touch targets at least 44px and form inputs at least 16px. Preserve keyboard focus and reduced-motion behavior.
- Keep public files in the build allowlists. Do not publish documentation, prompts, credentials, or local caches.
- Do not edit generated `dist/` directly; rebuild it from source.

## Verification and handoff

Run checks that fit the change. Inspect desktop and mobile rendering when browser access is available, and state any unverified behavior. Exercise catalogue filtering, search, pagination, product dialogs, and enquiry links when relevant. Avoid sending test enquiries.

## Deployment

Render publishes `dist/` using the build command in `render.yaml`. Canonical and share-preview URLs use `SITE_URL` or `RENDER_EXTERNAL_URL`. Keep credentials out of source and logs.