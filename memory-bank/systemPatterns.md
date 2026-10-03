# System patterns

Astro static multipage project. `src/layouts/Layout.astro` supplies metadata, shared header/footer, lightbox and small client script. Pages: `/`, `/arsiv/`, `/rank/`, `/baglantilar/`, `/404.html`.

`src/data/content.ts` is the central editable collection of profile links, exhibits and joke statistics. Stable numeric exhibit IDs drive shareable `/arsiv/#eser-N` URLs. `Photo.astro` supplies local responsive image variants, dimensions, alt text and priority. `ExhibitCard.astro` is reused by cover and archive.

`src/scripts/site.ts` handles native-dialog lightbox, arrow navigation, focus restoration, URL state, category/search filtering, random selection, clipboard feedback, approval seal, statement generator, ticker pause and legacy hash redirects. Static page content remains readable without JavaScript.

No client-side app framework, animation library, icon package, router or data-fetching layer. CSS supplies motion and responsive rules; respect reduced motion. Native `<dialog>` supplies inert backdrop/Escape; explicit Tab and Shift+Tab boundary wrapping prevents focus reaching browser chrome. Both dialogs were exercised in Chromium. Incident.astro lazily assigns its local image src only when opened and restores prior focus/scroll on close.

Copy spans page templates, Layout, content.ts (including exhibit notes), site.ts (feedback and generated statements), and scripts/create-social-card.mjs (text rasterized into public/social-card.png). A persona pass must cover all of them. Follow voiceAndCopy.md; retain explicit accessible labels and factual caveats.

Original source files live under `docs/original/`, not public output. Sharp creates WebP variants at up to 480/960 pixels without upscaling. Fonts are locally bundled via Fontsource. `vercel.json` is future configuration only, not a deployment.

`lore.css` adds marginal notes, the ruled game ledger, listening record and incident using existing design tokens. `qa-fixes.css` isolates small observed accessibility/crop changes. Native details reveal coffee and MegaBonk evidence without JavaScript. Astro trailingSlash is ignore for local route compatibility; Vercel trailingSlash=true handles canonical production redirects. Layout normalizes canonical/OG URLs and marks 404 noindex.
