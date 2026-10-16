# Performance and code maintenance

## Live baseline — October 16, 2026

Reviewed the existing [PageSpeed Insights report](https://pagespeed.web.dev/analysis/https-maindustries-in/ca1t4j9pev?form_factor=mobile), captured at 7:39 PM IST with Lighthouse 13.5.0.

| Metric | Mobile | Desktop |
| --- | --- | --- |
| Performance | 79 | 99 |
| Accessibility | 97 | 97 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 2.9 s | 0.8 s |
| Largest contentful paint | 4.1 s | 0.9 s |
| Total blocking time | 20 ms | 0 ms |
| Cumulative layout shift | 0 | 0.018 |

The report had no real-user field data. These are lab results for the deployed homepage before these local changes. They are not new scores for this build.

## Changes made locally

Collection repositioning: sugarcane-based and recycled products lead the site, followed by traditional paper and packaging. The first six catalogue cards now use WebP previews totaling 68,392 bytes instead of 520,296 bytes for their JPEG originals (about 87% smaller). Full-size originals remain available in product dialogs and pages; generated product pages also receive responsive candidates. The image generator now covers 47 source images, including 23 JPEG product photos. This is a file-size comparison, not a new live PageSpeed score. All 35 tests pass; the 82-page build and local target checks pass. The existing PDF catalogue remains byte-for-byte unchanged.

Creative interaction follow-up: the Material Studio application finder adds a recommendation preview, a decorative rotating SVG seal, and optional pointer lighting/tilt. It uses existing local imagery and no animation library. Hero text remains visible; touch and reduced-motion visitors can use the same application controls without pointer effects. The live PageSpeed baseline above predates these additions; deployment and fresh measurements are needed to quantify their impact. All 32 tests pass after this addition, including application selection and clearing pointer effects on a motion-preference change. Browser checks covered all four root pages at 320, 800 and 1440 pixels, plus mobile keyboard selection of an application.

- Replaced the nested Google Fonts request with locally hosted Latin WOFF2 subsets and their OFL licenses. Two normal fonts preload in production. `font-display: optional` keeps fallback text readable immediately and avoids late font swaps on slow connections; a first visit may use the fallback font.
- Removed entrance animations from the hero text and images. The report identified `.hero-copy .intro` as the mobile LCP element, with substantial render delay.
- Added WebP variants and responsive source hints for range, category, gallery, founder and logo images. Originals remain untouched. The build publishes only variants in the manifest; source files continue to work when opened directly.
- Darkened hero footnotes, brand kickers and the footer heading identified by the contrast audit, including the mobile footer override.
- Split range/directory/gallery styling into `ranges.css` and motion refinements into `motion.css`, retaining the original cascade order. Extracted gallery controls to `gallery.js`, loaded only on the homepage.
- Reused bundled CSS during the build and skipped specification text generation during searches with an empty query.
- Refreshed stale catalogue test expectations against the current data, retaining interaction and specification checks.
- Extended deployment checks to verify responsive image candidates and local font files, and reject external Google Fonts requests.

The existing local stylesheet still blocks first paint. Keeping it synchronous preserves a styled first render; the nested third-party font stylesheet has been removed. Splitting source CSS improves maintenance without claiming to reduce the downloaded CSS bundle. Further page-specific CSS removal should be based on measured coverage across all pages and interactive states.

## Maintenance

- Edit component CSS in its owning module. `style.css` defines the cascade; production bundles local imports into one file.
- After replacing source imagery, install Pillow in your development environment and run `python scripts/images/create-responsive-images.py`. Commit the generated variants and `scripts/site/manifests/responsive-images.json` together. Production needs no Python or Pillow.
- To refresh fonts, run `python scripts/site/fetch-fonts.py`. This maintenance command downloads from Google Fonts and the official Google Fonts repository. Commit fonts, licenses, `fonts.css` and `scripts/site/manifests/fonts.json` together.
- Run `npm run validate`. Preview `dist/` through an HTTP server for browser testing.

## After deployment

Run fresh mobile and desktop PageSpeed reports for the homepage and representative catalogue, category and product pages. Check image delivery, text rendering and contrast again; compare multiple runs under the same settings. No post-change live score is claimed until the new build is deployed and measured. Search ranking and real-user Core Web Vitals cannot be inferred from this lab baseline.

## Local verification

- All 30 regression tests pass, along with source syntax checks and catalogue synchronization.
- Production builds 82 pages; deployment verification checks local links, structured data, responsive candidates, metadata and fonts.
- Browser checks covered all four root pages at 390, 900 and 1440 pixel viewport settings, with no page-wide overflow or broken loaded images. A mobile product dialog opened and filled the enquiry with the selected product without sending anything. The corrected mobile footer heading color was verified in computed styles.
- Across 24 optimized source images, the candidates nearest 640 pixels total 658,002 bytes versus 2,367,735 bytes for the originals: approximately 72% smaller. This is an asset-size comparison, not a measured reduction in total page transfer. Actual downloads depend on viewport width, device pixel ratio and lazy loading.
