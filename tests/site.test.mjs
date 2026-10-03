import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { setImmediate } from 'node:timers/promises';

const routes = ['index.html', 'arsiv/index.html', 'rank/index.html', 'baglantilar/index.html', '404.html'];
const clientFile = (await readdir('dist/_astro')).find(file => file.endsWith('.js'));
assert.ok(clientFile, 'The production client bundle must exist before tests run.');
const clientCode = await readFile(join('dist/_astro', clientFile), 'utf8');

async function page(route = 'arsiv/index.html', hash = '') {
  const path = route === 'index.html' ? '/' : `/${route.replace(/index\.html$/, '')}`;
  const html = await readFile(join('dist', route), 'utf8');
  const dom = new JSDOM(html, { url: `https://efekaraer.com${path}${hash}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
  Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async text => { window.copiedText = text; } } });
  window.eval(clientCode);
  return dom;
}

test('all static routes have distinct titles, language, canonical, a main landmark and one h1', async () => {
  const titles = new Set();
  for (const route of routes) {
    const dom = new JSDOM(await readFile(join('dist', route), 'utf8'));
    const doc = dom.window.document;
    assert.equal(doc.documentElement.lang, 'tr');
    assert.equal(doc.querySelectorAll('main').length, 1);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert.ok(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.startsWith('https://efekaraer.com/'));
    titles.add(doc.title);
    dom.window.close();
  }
  assert.equal(titles.size, routes.length);
});

test('every local link and image in production output resolves; images have alt and dimensions', async () => {
  for (const route of routes) {
    const dom = new JSDOM(await readFile(join('dist', route), 'utf8'));
    for (const image of dom.window.document.querySelectorAll('img')) {
      assert.ok(image.hasAttribute('alt'));
      assert.ok(Number(image.getAttribute('width')) > 0);
      assert.ok(Number(image.getAttribute('height')) > 0);
      const src = image.getAttribute('src');
      if (src) { assert.ok(src.startsWith('/')); await access(join('dist', src)); }
    }
    for (const link of dom.window.document.querySelectorAll('a[href],link[href]')) {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const target = href.endsWith('/') ? `${href}index.html` : href;
      await access(join('dist', target));
    }
    dom.window.close();
  }
});

test('all 17 original captions and original public profile URLs are preserved', async () => {
  const original = new JSDOM(await readFile('docs/original/index.html', 'utf8'));
  const archive = await page();
  const current = archive.window.document;
  const exhibits = JSON.parse(current.querySelector('#exhibit-data').textContent);
  const captions = [...original.window.document.querySelectorAll('.photo span')].map(node => node.textContent.trim());
  assert.equal(exhibits.length, 17);
  assert.deepEqual(exhibits.map(item => item.title), captions);
  const directory = new JSDOM(await readFile('dist/baglantilar/index.html', 'utf8'));
  const links = [...directory.window.document.querySelectorAll('a')].map(link => link.getAttribute('href'));
  for (const link of original.window.document.querySelectorAll('.signal-card')) {
    const href = link.getAttribute('href');
    if (href === 'http://efekaraer.com') continue; // Deliberately normalized to our root.
    assert.ok(links.includes(href), `Missing original link ${href}`);
  }
  archive.window.close(); original.window.close(); directory.window.close();
});

test('category filters combine with Turkish-aware search and expose an empty state/reset', async () => {
  const dom = await page(); const { document, Event } = dom.window;
  document.querySelector('[data-filter="Portre"]').click();
  const visible = () => [...document.querySelectorAll('.archive-grid .exhibit')].filter(item => !item.hidden);
  assert.ok(visible().length > 0);
  assert.ok(visible().every(item => item.dataset.category === 'Portre'));
  const search = document.querySelector('#archive-search');
  search.value = 'MÜHENDİS'; search.dispatchEvent(new Event('input'));
  assert.equal(visible().length, 2);
  search.value = 'this does not exist'; search.dispatchEvent(new Event('input'));
  assert.equal(visible().length, 0);
  assert.equal(document.querySelector('#archive-empty').hidden, false);
  document.querySelector('#reset-search').click();
  assert.equal(visible().length, 17);
  assert.equal(search.value, '');
  dom.window.close();
});

test('lightbox opens a real exhibit, navigates cyclically and restores focus/scroll on close', async () => {
  const dom = await page(); const { document, KeyboardEvent } = dom.window;
  const trigger = document.querySelector('[data-exhibit="1"]');
  trigger.focus(); trigger.click();
  const modal = document.querySelector('#lightbox');
  assert.equal(modal.open, true);
  assert.equal(document.querySelector('#lightbox-title').textContent, 'Jahrein Karaer');
  assert.equal(document.documentElement.style.overflow, 'hidden');
  modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
  assert.equal(document.querySelector('#lightbox-title').textContent, 'hmm nt happen');
  assert.equal(dom.window.location.hash, '#eser-17');
  document.querySelector('.photo-next').click();
  assert.equal(document.querySelector('#lightbox-title').textContent, 'Jahrein Karaer');
  document.querySelector('[data-close]').click();
  assert.equal(modal.open, false);
  assert.equal(document.documentElement.style.overflow, '');
  assert.equal(document.activeElement, trigger);
  assert.equal(dom.window.location.hash, '');
  dom.window.close();
});

test('direct exhibit URLs open correctly and copy an archive permalink', async () => {
  const dom = await page('index.html', '#eser-7'); const { document } = dom.window;
  assert.equal(document.querySelector('#lightbox').open, true);
  assert.equal(document.querySelector('#lightbox-title').textContent, 'Çakma Mühendis Karaer');
  document.querySelector('#exhibit-copy').click();
  await setImmediate();
  assert.equal(dom.window.copiedText, 'https://efekaraer.com/arsiv/#eser-7');
  assert.ok(document.querySelector('#lightbox #toast')); // Announcement must remain in the active modal.
  dom.window.close();
});

test('invalid deep links do not open an empty dialog', async () => {
  const dom = await page('arsiv/index.html', '#eser-999');
  assert.equal(dom.window.document.querySelector('#lightbox').open, false);
  dom.window.close();
});

test('random exhibit action always opens a valid, different consecutive exhibit', async () => {
  const dom = await page(); const { document } = dom.window;
  let previous;
  for (let i = 0; i < 25; i++) {
    document.querySelector('#random-exhibit').click();
    const title = document.querySelector('#lightbox-title').textContent;
    const hash = dom.window.location.hash;
    assert.ok(title.length > 0);
    assert.notEqual(hash, previous);
    previous = hash;
    document.querySelector('[data-close]').click();
  }
  dom.window.close();
});

test('statement generator changes text and copy-email uses the original contact', async () => {
  const rank = await page('rank/index.html'); const doc = rank.window.document;
  const initial = doc.querySelector('#excuse').textContent;
  doc.querySelector('#excuse-button').click();
  assert.notEqual(doc.querySelector('#excuse').textContent, initial);
  const links = await page('baglantilar/index.html');
  links.window.document.querySelector('#copy-email').click();
  await setImmediate();
  assert.equal(links.window.copiedText, 'efekaraer00@gmail.com');
  rank.window.close(); links.window.close();
});

test('archived rank and FIDE joke cannot be mistaken for live statistics', async () => {
  const html = await readFile('dist/rank/index.html', 'utf8');
  assert.ok(html.includes('CANLI VERİ DEĞİLDİR'));
  assert.ok(html.includes('Gerçek bir FIDE derecesi değil'));
});

test('cover easter egg announces approval and moving ticker can be paused', async () => {
  const dom = await page('index.html'); const doc = dom.window.document;
  doc.querySelector('#seal').click();
  assert.match(doc.querySelector('#toast').textContent, /Onaylandı/);
  const pause = doc.querySelector('#ticker-toggle');
  pause.click();
  assert.equal(pause.getAttribute('aria-pressed'), 'true');
  assert.ok(doc.querySelector('.ticker').classList.contains('paused'));
  pause.click();
  assert.equal(pause.getAttribute('aria-pressed'), 'false');
  dom.window.close();
});

test('optimized image collection remains below 2 MB and original sources stay outside public output', async () => {
  const metadata = JSON.parse(await readFile('src/data/image-metadata.json', 'utf8'));
  let total = 0;
  for (const name of Object.keys(metadata)) for (const width of [480, 960]) total += (await stat(`dist/images/${name}-${width}.webp`)).size;
  assert.ok(total < 2_000_000, `Image total was ${total}`);
  await assert.rejects(access('dist/docs/original/index.html'));
});

test('the incident is opt-in, loads a local image and restores the visitor on close', async () => {
  const dom = await page('index.html'); const doc = dom.window.document;
  const trigger = doc.querySelector('#footer-secret');
  const incident = doc.querySelector('#incident');
  const image = doc.querySelector('#incident-image');
  assert.equal(image.getAttribute('src'), null);
  assert.equal(incident.open, false);
  trigger.focus(); trigger.click();
  assert.equal(incident.open, true);
  assert.equal(image.getAttribute('src'), '/images/efek.com-960.webp');
  assert.equal(doc.documentElement.style.overflow, 'hidden');
  doc.querySelector('#incident-close').click();
  assert.equal(incident.open, false);
  assert.equal(doc.activeElement, trigger);
  assert.equal(doc.documentElement.style.overflow, '');
  dom.window.close();
});

test('authentic copy and supplied records survive without public migration framing', async () => {
  for (const route of routes) {
    const dom = new JSDOM(await readFile(join('dist', route), 'utf8'));
    assert.doesNotMatch(dom.window.document.body.textContent, /eski site|önceki site|previous site|old site|former website/i);
    dom.window.close();
  }
  const cover = await readFile('dist/index.html', 'utf8');
  assert.ok(cover.includes('çok iyi site yaptım.'));
  const rank = await readFile('dist/rank/index.html', 'utf8');
  assert.ok(rank.includes('megabonk-237'));
  assert.ok(rank.includes('Arkadaş lobisi.'));
  const links = await readFile('dist/baglantilar/index.html', 'utf8');
  assert.ok(links.includes('tek haftalık kayıt'));
  assert.ok(links.includes('Stronger Than Pride'));
});
