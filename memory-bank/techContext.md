# Technical context

Windows PowerShell workspace, with no Node/npm initially on PATH. An official portable Node 22.20.0 runtime was downloaded under ignored `tools/node-v22.20.0-win-x64/`. Prefix local commands with that directory in PATH and call `npm.cmd` to avoid PowerShell's blocked script shims. Set `ASTRO_TELEMETRY_DISABLED=1` in restricted environments so Astro does not try to write its global telemetry config.

Astro 7, TypeScript 6, ordinary CSS, Fontsource Barlow Condensed/DM Sans/IBM Plex Mono. Dev tools: Astro check, ESLint with Astro/TypeScript support, Sharp, Node test runner with JSDOM, Playwright and axe. package-lock.json is present and must be committed with package.json when the user initializes Git.

Commands: `npm run dev`, `npm run build`, `npm run preview`, `npm run check`, `npm run lint`, `npm test`, `npm run optimize`. Build before tests: tests execute the production client bundle against generated HTML.

Network calls and npm installs needed sandbox escalation. No external writes or site publishing were performed. The local Git origin is https://github.com/KaraerDev/efekaraer.com.git; use an explicit request before committing or pushing.

The connector remains unavailable, but the user authorized lightweight dev-only browser tooling. Playwright Test and axe-core/playwright are now dev dependencies. Downloaded Chromium is in ignored tools/browsers; set PLAYWRIGHT_BROWSERS_PATH to that directory in this workspace. `npm run test:browser` runs four viewport projects with screenshots, real clipboard/modal/navigation behavior and axe checks. Build first. Screenshot/trace/HTML report outputs are ignored. Lighthouse, Firefox/Safari and physical devices were not tested.

The browser suite starts Astro preview in-process through tests/browser/preview.ts and stops it after the run. This avoids an observed Windows Playwright shell/process-tree shutdown hang. Port 4322 must be free; unexpected fallback ports fail explicitly. The preview API is dev-only and covered by the locked Astro version. Native dialog close cleanup is asynchronous; browser assertions poll its resulting state.

Dependency audit currently reports upstream advisories in `http-cache-semantics` and `braces` plus parents. No compatible patched dependency versions offered; do not force a downgrade to Astro 2. Static production has no server or runtime npm dependencies. See docs/validation.md for the exact scope.
