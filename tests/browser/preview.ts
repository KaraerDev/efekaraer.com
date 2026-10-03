import { preview } from 'astro';

// In-process preview avoids Windows shell/process-tree shutdown hangs.
export default async function setup() {
  const server = await preview({ server: { host: '127.0.0.1', port: 4322 } });
  if (server.port !== 4322) {
    await server.stop();
    throw new Error('Browser QA needs port 4322 to be free.');
  }
  return () => server.stop();
}
