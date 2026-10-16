# SEO implementation and next steps

## October 16, 2026 update

- Refined homepage and directory search titles and descriptions around the existing paper, packaging and Mumbai supply content. Removed a hard-coded product count from catalogue metadata so it cannot drift when products change.
- Canonicals, sitemap URLs and structured-data identifiers now share one normalized public origin. The build defaults to maindustries.in instead of a hosting-provider alias; set SITE_URL explicitly for a different public domain.
- Added page descriptions to WebPage structured data and linked product pages to their Product entities through mainEntity.
- Deployment verification now rejects duplicate or missing titles/descriptions, incorrect heading counts, missing or mismatched canonicals, incomplete sitemaps and inconsistent social URLs.
- A live-domain fetch returned a 502 response through the browsing tool. This does not establish the site's availability for other visitors; live indexing and performance still need verification after deployment.

The build now generates 66 product pages and 12 category guides alongside the four original pages. These contain static catalogue content, unique metadata, canonical URLs, related product links, enquiry actions and structured data. All 82 pages are included in the sitemap and linked from the directories. Edit catalogue data or scripts/site/seo-pages.mjs and rebuild; preview dist to review generated pages.

Product schema contains no invented prices, stock, reviews or certifications. Without genuine offers or reviews, it does not qualify for Google's product rich results.

Validation for this update: source syntax and catalogue synchronization passed; the production build and deployment verifier passed across 82 pages and 2,689 local links/assets. The full test suite passed 22 of 30 tests. Eight catalogue/interaction assertions fail on current names, counts or specifications; those application files and tests were not changed in this SEO update.

## Priorities after deployment

Follow-up: the code/performance cleanup refreshed stale catalogue assertions and the full 30-test suite now passes. See PERFORMANCE.md for the live PageSpeed baseline and local verification.

1. Verify HTTPS and preferred-host redirects, /index.html to / redirection where hosting supports it, generated page responses and genuine 404 responses for unknown URLs.
2. Verify the domain in Google Search Console. Submit https://maindustries.in/sitemap.xml and inspect representative product and category URLs, rendered content and selected canonicals.
3. Validate structured data with Rich Results Test and Schema Markup Validator. Run mobile PageSpeed Insights on home, category and product pages; optimize images and fonts based on measured LCP, INP and CLS bottlenecks.
4. Configure consent-appropriate analytics if desired. Track WhatsApp clicks, email clicks, catalogue downloads and qualified enquiries separately. Clicks are not confirmed leads. Review Search Console queries, landing pages and enquiry quality monthly.
5. Confirm the public address, hours, delivery regions, minimum quantities, sample policy, sourcing/stock status and material documentation. Publish only verified business details. Establish an eligible Google Business Profile and consistent genuine trade listings.

## Keyword and content strategy

Research product + supplier, product + application and relevant Mumbai queries using Search Console and a keyword research tool. Kraft paper, duplex paper, white bag paper, thermal paper, release liners and bagasse products are starting hypotheses, not validated search-volume findings. Prioritize demand and qualified leads. Compare currently ranking pages for actual content gaps.

Develop expert-reviewed guides covering MG versus MF kraft paper, GSM versus packaging strength, carton board selection, bagasse versus Bio-PE, and thermal paper/release liner selection. Use original photos, verified specifications and customer-approved examples. Link guides to relevant product pages. Add useful item-specific details to weak pages as evidence becomes available.

Do not generate every city or keyword permutation. Add location pages only when genuine distinct service information supports them. Do not buy backlinks or manufacture reviews. Earn references through supplier partnerships, trade associations, useful technical content and authentic case studies.

## Verification limits

The live domain could not be retrieved during this work. Live rankings, indexing, backlinks, traffic, conversion data and Core Web Vitals remain unverified. The generated site needs deployment before Google can discover these changes. No ranking outcome is guaranteed.

## Primary references

- https://developers.google.com/search/docs/fundamentals/get-started-developers
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
