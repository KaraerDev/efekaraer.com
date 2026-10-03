# Validation — 3 October 2026

This final enrichment/QA record supersedes the earlier browser-unavailable status. The approved visual identity and original source captions/links remain.

## Build and tests

- npm run check: 0 errors, 0 warnings, 0 hints.
- npm run lint: clean.
- npm run build: static output, five pages: /, /arsiv/, /rank/, /baglantilar/, /404.html.
- npm test: 14 passing production-bundle/JSDOM tests. The original 12 were retained unchanged; two cover the opt-in incident and supplied records/authentic wording/no migration copy.
- npm run test:browser: **20/20 passing**, four viewport projects, final run 35.6 seconds, exit code 0. Tests and outputs described below. No application tests were weakened or removed.
- All 17 original captions and five external/contact destinations still match the original source HTML exactly. Self-link routes locally. Images have alt text and dimensions; all generated local links/assets resolve. Each route has one h1/main, Turkish language, distinct title/description and canonical URL.

## Actual browser QA

Playwright Chromium (153.0.8010.12), installed as local dev tooling after the browser connector and installed Windows browser checks were unavailable. Viewports: wide 1440×1000, laptop 1280×800, tablet 768×1024 with touch, mobile 360×800 with touch/mobile emulation. This is Chromium emulation, not physical-device testing.

All four primary routes and unknown-route custom 404 were rendered, scrolled, captured and visually reviewed. Additional screenshots cover the opened MegaBonk evidence and footer incident. Tests exercise navigation, Turkish search + category combinations, empty/reset, random exhibit, direct photo hashes, lightbox arrows and Tab/Shift+Tab containment, Escape/focus/scroll restoration, real clipboard writes/reads for email and permalinks, statement generation, repeated stamp responses, ticker pause, coffee details, MegaBonk evidence, footer lazy image request and close, and reduced motion.

No horizontal document overflow, broken visible images, page script exceptions or remote runtime requests in the route matrix. Recorded unexpected layout-shift sums stayed below 0.1 in these local runs; this is not a field Core Web Vitals score. Axe WCAG 2/2.1/2.2 A/AA automated audits report no violations for all page types at laptop/mobile, and for opened modals across all four projects. Automated checks are not a blanket accessibility certification.

Observed fixes:

- Small red type originally measured 4.38:1 against paper: darkened selected small text; large display palette preserved. Improved approval seal text contrast.
- Wide cover portrait and mobile featured portraits cropped faces awkwardly: adjusted object positions only.
- Footer actions and narrow lightbox arrows had small targets: increased hit areas to 44 px where needed.
- Native dialogs allowed Tab to reach browser chrome at the last control: explicit forward/reverse focus wrap, native Escape retained.
- Astro preview with trailingSlash=always produced its generic 404 for slashless paths: preview now accepts both forms; canonical/OG paths normalize and Vercel owns production redirects.

Test harness corrections: exclude closed-details lazy images from decoding waits; poll asynchronous native close cleanup; start preview in-process to avoid Windows shell/process-tree teardown hangs. These are test-environment fixes, not removed coverage.

Screenshots/traces in test-results/browser and HTML report in playwright-report are local ignored artifacts. No Safari/Firefox, physical device, throttled-network benchmark or Lighthouse score is claimed.

## Static Vercel readiness

Production domain: https://hmmokeydog.com.tr. Install npm ci; build npm run build; output dist; Node 22.12+ (Node 22 runtime is used locally). No adapter, backend, functions, database, CMS, authentication, secrets or remote runtime service. Local fonts/images and the incident asset need no connection to the production domain.

Direct slash and slashless navigation to /arsiv, /rank and /baglantilar works in Astro production preview. Unknown top-level and nested paths use the custom 404; it returns HTTP 404. The generated 404 is noindex with canonical /404.html. vercel.json trailingSlash=true configures host redirects; dist/404.html supplies the Vercel fallback. Vercel's edge redirect/status/header behavior has not been tested through a deployment because deployment is forbidden in this task.

Configuration checked against [Vercel Astro documentation](https://vercel.com/docs/frameworks/frontend/astro), [custom 404 guidance](https://vercel.com/kb/guide/custom-404-page), and [trailingSlash configuration](https://vercel.com/docs/project-configuration/vercel-json#trailingslash). After manual deployment to the configured production domain, smoke-check slash redirects, unknown-path status and headers.

Favicon SVG, social-card PNG, robots.txt and four-route sitemap return HTTP 200 locally. Canonical/OG URLs and sitemap use https://hmmokeydog.com.tr; robots.txt names that sitemap, and social preview is local and absolute. No localhost/developer-identity leak in output. External links retain their exact sourced destinations and appropriate rel attributes; mailto and clipboard address are correct. Third-party destination uptime/content was not re-audited as a release dependency.

## Dependency/security review

npm audit: **7 high package findings**, no critical/moderate/low. npm audit --omit=dev: **2 high findings** (Astro and its transitive http-cache-semantics). These seven are affected packages/parents, not seven independent root vulnerabilities.

- http-cache-semantics <=4.2.0, GHSA-ch52-4w7c-c8xp: cached response isolation under max-stale; inherited by Astro.
- braces <=3.0.3, GHSA-vfj7-8cjw-p6xm: deeply nested pattern denial of service; micromatch → fast-glob → astro-eslint-parser → eslint-plugin-astro.

The registry offers no compatible automatic fix. Proposed forced remedies downgrade Astro to 2.10.9 and the lint plugin to 1.5.0; not applied. Astro is classified under package dependencies, so omit-dev still reports it, but the deployment consists of static files, with no Node server/cross-user cache/untrusted-glob processing at visitor runtime. The remaining exposure is build/development/lint tooling; static delivery narrows it but does not erase the advisory. Re-audit when compatible fixes exist. Browser tooling is dev-only. Dev/preview binds to loopback.

## Hygiene, performance and copy

Reviewed deliverable source/config/output for credentials, tokens, private keys, .env files, TODO/FIXME, debug logging, localhost and incorrect developer identity. None found. Original public meme/source imagery remains intentionally retained; no new private financial/personal information added. This is a source review, not a guarantee against every possible secret pattern.

.gitignore excludes node_modules, dist, tools/browser caches, QA results/reports, logs, .env variants, .vercel and build info. .vercelignore excludes source provenance, Memory Bank, tests and QA artifacts. Originals under docs/original stay intact; only unused efek.com2 runtime derivatives removed. No Git repository exists yet; manual initialization/upload is the next workflow step, not an app blocker.

38 responsive WebP variants total **1,503,310 bytes**. Production JavaScript **5,704 bytes**, CSS **37,733 bytes**, before compression. No framework hydration, analytics, remote fonts, embeds or autoplay. The incident image is requested only when opened; evidence uses native lazy loading. All page/hidden-state copy reread together, including metadata, accessible labels, original captions, notes, toast messages, statements and footer. Authentic phrase retained exactly; public migration terms absent.

No deployment, Git push, existing-site edit, DNS or domain change was performed. No known application blocker remains for the user's manual GitHub/Vercel step; upstream advisories and browser/host verification boundaries above remain explicit.
