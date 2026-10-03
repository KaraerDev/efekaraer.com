# Efe Karaer — Kişisel Mesele

A Turkish, deliberately overproduced personal archive for **Efe Karaer**, built from the original public site. Production domain: https://hmmokeydog.com.tr. This project is about Efe, never the developer. No deployment has been performed.

The approved concept is an unnecessarily official collector’s edition of one person: warm paper, ink, vermilion, giant condensed type, numbered exhibits, and an approval seal. Copy is detached, terse and assured. Efe does not introduce himself, seek approval or explain the joke. The production does the work. See `memory-bank/voiceAndCopy.md` for the authoritative writing rules.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321/`. For the production version, run `npm run build` followed by `npm run preview`.

This workspace includes an ignored portable Node runtime because Node was not installed on PATH. In Windows PowerShell, use:

```powershell
$env:PATH = (Join-Path $PWD 'tools/node-v22.20.0-win-x64') + ';' + $env:PATH
$env:ASTRO_TELEMETRY_DISABLED = '1'
npm.cmd run dev
```

Use `npm.cmd` on systems that block PowerShell script shims. The portable runtime is a local convenience, not a project dependency or deployment artifact.

## Routes

| Route | Content |
| --- | --- |
| `/` | Editorial cover, dossier note, selected exhibits, rank ticket, profile links |
| `/arsiv/` | All 17 original exhibits, category filters, Turkish-aware search, random exhibit |
| `/rank/` | TFT history, MegaBonk #237 evidence, game ledger, joke meters, FIDE joke, statement generator |
| `/baglantilar/` | Original profile/contact links, Sade listening snapshot |
| `/404.html` | Custom missing-page experience |

Photos have shareable URLs such as `/arsiv/#eser-7`. Old `/#gallery`, `/#rank`, and `/#signals` bookmarks forward to their new routes when JavaScript is available.

## Edit content

- **`src/data/content.ts`**: all exhibit IDs, titles, descriptions, categories, comments, profile links, and joke statistics.
- **`src/pages/`**: page-specific Turkish copy and layout.
- **`src/styles/global.css`**: color/type tokens, responsive layouts, motion, reduced-motion and print behavior.
- **`src/styles/lore.css` / `qa-fixes.css`**: integrated lore details and small browser-observed corrections.
- **`src/scripts/site.ts`**: progressively enhanced interactions. No framework client runtime.
- **`docs/original/`**: original HTML/CSS, visual contact sheet, and unmodified source images. Preserved for provenance; excluded from production.
- **`docs/content-audit.md`**: exact source links, audit findings, editorial decisions, and intentionally omitted stale claims.
- **`docs/validation.md`**: actual browser QA, static-host readiness, audit findings and verification boundaries.
- **`memory-bank/lore.md`**: supplied facts incorporated into the site and deliberately unused material.

To add an exhibit, put its original image in `docs/original/images/`, add a stable numeric ID and entry to `exhibits`, and run `npm run optimize`. Keep existing IDs stable so shared links continue working. Collection counts derive from the data. The source-preservation test deliberately asserts the original 17 records; extend it to distinguish the preserved seed collection from new additions when expanding the archive.

Original exhibit captions are preserved verbatim. New exhibit notes are restrained asides, not invented biographical facts. No lorem ipsum, fake external links, API keys or unfinished UI placeholders are used. Any future Efe-specific lore should be sourced and written under the rules in `memory-bank/voiceAndCopy.md`; do not reintroduce personal-brand narration or warm visitor guidance.

## Assets and performance

All 17 gallery images, two backgrounds and the supplied MegaBonk screenshot are retained outside `public/`. Nineteen used originals generate 38 WebP variants using Sharp, without upscaling, totaling 1.50 MB. The unused second background has no runtime derivatives. `efek.com.jpg` appears only in the optional footer incident; it loads on demand.

Images have dimensions, responsive `srcset`, and lazy loading except for the cover portrait. Barlow Condensed, DM Sans, and IBM Plex Mono are self-hosted through Fontsource. There are no embeds, analytics, autoplay audio, remote fonts, or image hotlinks. Social preview artwork is also generated locally; regenerate it with `node scripts/create-social-card.mjs`.

## Validation

```sh
npm run check
npm run lint
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

Tests read the **actual production HTML and client bundle**, so build first. The original 12 DOM tests remain, with two new tests for sourced content and the opt-in incident. The 20-scenario browser suite covers four viewports, real clipboard, native dialogs, focus wrapping, Escape, navigation, lore/easter eggs, reduced motion, layout shifts, images and axe checks. Browser outputs are ignored. Port 4322 must be free; preview is started/stopped by the suite.

This workspace stores Chromium locally. Before its browser tests in PowerShell, set `$env:PLAYWRIGHT_BROWSERS_PATH = (Join-Path $PWD 'tools/browsers')`. A fresh checkout can use the default Playwright cache with the install command above. Playwright and axe are development dependencies only.

## Future Vercel deployment

The site is ready for a normal static Astro deployment at https://hmmokeydog.com.tr: install with `npm ci`, build with `npm run build`, output `dist`, Node 22.12+. `vercel.json` supplies static output settings, trailing slashes and basic security headers. Preview accepts both slash forms; Vercel performs the canonical redirect. `dist/404.html` is the custom error document. No adapter, server, database, CMS, authentication or environment secrets are needed. Do not deploy or modify DNS without a subsequent user request.

## Remaining review

Actual Chromium review covers 360×800, 768×1024, 1280×800 and 1440×1000, all routes and interactive states. Safari/Firefox, physical devices and Lighthouse were not tested. Actual Vercel edge behavior requires a smoke check after the user's manual deployment. This workspace has not yet been initialized as a Git repository.

The installation audit also reports upstream build/tooling advisories; see `docs/validation.md`. Do not apply `npm audit fix --force`: its proposed changes downgrade the framework to an incompatible old major version.
