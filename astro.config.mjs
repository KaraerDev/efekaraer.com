import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://efekaraer.com',
  output: 'static',
  // Both forms resolve in local preview. Vercel canonicalizes with trailingSlash.
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
