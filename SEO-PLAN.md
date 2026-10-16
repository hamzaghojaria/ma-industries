# SEO and product navigation

Updated: 17 October 2026

The site has four main pages: Home, About, Categories and Products. All 67 products open in the same in-page catalogue popup, with image, overview, material, uses, specifications and enquiry actions. Separate product pages and category-guide pages are not generated. Do not reintroduce product-page links or standalone detail pages.

The old product-page generator has been removed. Product URLs have been removed from the sitemap and structured-data links now point to the matching catalogue popups. The build verifier rejects any HTML pages outside the four main pages.

Product descriptions, uses and available specifications also remain in the catalogue's no-JavaScript fallback, without links to standalone product pages. Canonical URLs, main-page metadata, branded sharing images, Organization/WebSite/CollectionPage and ItemList structured data remain in place. The PDF catalogue is unchanged.

## Deployment

Publish a fresh dist build. The build clears old output before writing the four main pages, so old product files are not included. render.yaml contains exact permanent redirects for the 67 retired product URLs to their matching catalogue popups. Apply/sync the Render Blueprint routes or add those redirects in Render's dashboard if the service is not managed by this Blueprint. The route changes and removed files affect the live domain only after deployment. Other hosts need equivalent redirects.

After deployment, confirm an old URL such as /product-reusable-cups.html redirects to /products.html?category=sugarcane-kitchenware#paper-reusable-cups and opens the correct popup. Submit the updated sitemap in Google Search Console. Live deployment state, indexing and search rankings have not been verified locally.

## References

- https://render.com/docs/redirects-rewrites
- https://render.com/docs/blueprint-spec
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
