# Project guidance

## Overview

M&A Industries is a dependency-free static website. Work from the repository root. The entry point is `index.html`; source assets live under `assets/`. Render publishes generated `dist/` using `scripts/build.mjs`.

## Commands

- `npm run check`: validate JavaScript syntax.
- `npm run build`: validate and prepare deployment assets.
- No dependency installation is required for the current codebase.

## Files

- `index.html`: page structure, contact links, enquiry fields, footer, favicon and social metadata.
- `assets/js/app.js`: `papers` and `categories` arrays, catalogue rendering, pagination, dialogs, native product autocomplete, enquiry message preparation and navigation.
- `assets/css/style.css`: branding, layout, responsive breakpoints and motion. Inspect the cascade before adding an override.
- `assets/images/`: supplied logo, web logo, browser icons and social-preview artwork.
- `scripts/build.mjs`: explicit public-file allowlist and deployment URL handling.
- `render.yaml`: static-site deployment settings.

## Implementation conventions

- Preserve M&A Industries branding, business contact details and the current concise form/footer unless the user requests changes.
- Keep product IDs unique and stable. Every product group must match an existing category ID.
- Keep category counts, catalogue totals and descriptions consistent when editing data.
- Preserve the `paper`, `brief`, `products`, `pagination` and `status` element IDs; JavaScript uses them.
- Enquiry actions open drafts in WhatsApp/email. Do not silently send messages or claim a message was sent.
- Do not invent certifications, stock availability, prices, minimum quantities or response-time promises.
- Use `textContent` for visitor-supplied content. Catalogue HTML should use only trusted, repository-owned data.
- Keep mobile touch targets at least 44px and form-input text at least 16px. Preserve keyboard focus states and reduced-motion behaviour.
- Mobile sliders must scroll within their containers rather than widening the page.
- Do not add frameworks or dependencies for small changes. Keep paths compatible with direct opening of `index.html` and HTTP hosting.
- Add new public assets to the build allowlist. Do not put source documentation, credentials or local caches in deployment output.

## Verification and handoff

Run checks appropriate to the change. Inspect mobile and desktop rendering when browser access is available; report any unverified visual behaviour honestly. Exercise filter/search resets, page bounds, dialog selection, mobile menu state and prepared enquiry contents when relevant. Avoid sending live test enquiries.

## Deployment

Use the user-selected GitHub repository and Render service. Keep secrets out of source and logs. Build metadata uses `SITE_URL` or `RENDER_EXTERNAL_URL`; do not guess a production domain. Do not edit generated `dist/` directly.
