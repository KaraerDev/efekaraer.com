import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/arsiv/', '/rank/', '/baglantilar/', '/olmayan-sayfa/'];

test('all routes render without overflow, broken assets, script errors or accessibility violations', async ({ page }, info) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  await page.addInitScript(() => {
    let shift = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const value = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!value.hadRecentInput) shift += value.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    Object.defineProperty(window, '__qaLayoutShift', { get: () => shift });
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4322/') && !request.url().startsWith('data:')) externalRequests.push(request.url());
  });
  for (const route of routes) {
    const response = await page.goto(route);
    expect.soft(response?.status(), route).toBe(route.includes('olmayan') ? 404 : 200);
    await page.evaluate(() => document.fonts.ready);
    // Real scrolling loads the gallery's native lazy images before the full-page capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }
      await Promise.all([...document.images].filter(img => img.getAttribute('src') && !img.closest('details:not([open]), dialog:not([open])')).map(img => img.decode().catch(() => {})));
      scrollTo({ top: 0, behavior: 'instant' });
    });
    const name = route === '/' ? 'cover' : route.split('/')[1];
    await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true, animations: 'disabled' });
    expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow: ${route}`).toBe(true);
    const layoutShift = await page.evaluate(() => Reflect.get(window, '__qaLayoutShift') as number);
    await info.attach(`${name}-layout-shift`, { body: String(layoutShift), contentType: 'text/plain' });
    expect.soft(layoutShift, `layout shift: ${route}`).toBeLessThanOrEqual(0.1);
    expect.soft(await page.locator('img[src]:visible').evaluateAll(images => images.filter(image => !(image as HTMLImageElement).naturalWidth).map(image => image.getAttribute('src'))), `broken images: ${route}`).toEqual([]);
    if (info.project.name === 'laptop' || info.project.name === 'mobile') {
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await info.attach(`${name}-accessibility.json`, { body: JSON.stringify(audit.violations, null, 2), contentType: 'application/json' });
      expect.soft(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), `a11y: ${route}`).toEqual([]);
    }
    expect.soft(await page.locator('body').innerText()).not.toMatch(/eski site|önceki site|previous site|old site|former website/i);
  }
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('navigation, archive search, random selection and native lightbox keyboard behavior', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: /Arşiv/ }).click();
  await expect(page).toHaveURL(/\/arsiv\/$/);
  await page.getByRole('button', { name: 'Portre', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Arşivde ara' }).fill('MÜHENDİS');
  await expect(page.locator('.archive-grid .exhibit:visible')).toHaveCount(2);
  await page.getByRole('searchbox').fill('olmayan kayıt');
  await expect(page.getByRole('heading', { name: 'Kayıt yok.' })).toBeVisible();
  await page.getByRole('button', { name: 'Hepsini göster' }).click();
  await expect(page.locator('.archive-grid .exhibit:visible')).toHaveCount(17);
  await page.getByRole('button', { name: 'Rastgele kayıt' }).click();
  await expect(page.locator('#lightbox')).toBeVisible();
  const before = await page.locator('#lightbox-title').innerText();
  await page.keyboard.press('ArrowRight');
  // Duplicate original titles exist, so the permalink is the navigation assertion.
  const nextHash = new URL(page.url()).hash;
  expect(nextHash).toMatch(/^#eser-\d+$/);
  expect(before.length).toBeGreaterThan(0);
  await page.locator('#exhibit-copy').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`/arsiv/${nextHash}`);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(audit.violations.map(v => v.id)).toEqual([]);
  // Focus must remain inside a genuine modal; JSDOM cannot verify this.
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#lightbox'))).toBe(true);
  }
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#lightbox'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toBeVisible();
  await expect(page.locator('#random-exhibit')).toBeFocused();
  // Native dialog close dispatches its cleanup event asynchronously.
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  await page.goto('/arsiv/#eser-7');
  await expect(page.locator('#lightbox-title')).toHaveText('Çakma Mühendis Karaer');
  await page.getByRole('button', { name: 'Fotoğrafı kapat' }).click();
});

test('rank evidence and statements work without invented live data', async ({ page }, info) => {
  await page.goto('/rank/');
  await page.locator('.evidence summary').click();
  await expect(page.locator('.evidence img')).toBeVisible();
  await expect(page.locator('.evidence img')).toHaveJSProperty('complete', true);
  await page.locator('.megabonk-record').screenshot({ path: info.outputPath('megabonk-open.png') });
  await page.locator('#excuse-button').click();
  await expect(page.locator('#excuse')).toHaveText('“Devam.”');
  await expect(page.getByText('İlk 100 geçmişi var.', { exact: false })).toBeVisible();
  await expect(page.getByText('Arkadaş lobisi. Genelde galibiyet.')).toBeVisible();
});

test('stamp, coffee note, footer incident, escape and reduced motion', async ({ page }, info) => {
  const incidentRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('efek.com-')) incidentRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.getByText('çok iyi site yaptım.', { exact: true })).toBeVisible();
  await page.locator('#seal').click();
  await expect(page.locator('#toast')).toHaveText('Onaylandı.');
  for (let i = 0; i < 4; i++) await page.locator('#seal').click();
  await expect(page.locator('#toast')).toHaveText('alr brom');
  await page.locator('.margin-note summary').click();
  await expect(page.getByText(/Referans: Sam Çeviköz/)).toBeVisible();
  await page.locator('#ticker-toggle').click();
  await expect(page.locator('#ticker-toggle')).toHaveAttribute('aria-pressed', 'true');
  expect(incidentRequests).toEqual([]);
  await page.locator('#footer-secret').click();
  await expect(page.locator('#incident')).toBeVisible();
  await expect(page.locator('#incident-close')).toBeFocused();
  await expect.poll(() => page.locator('#incident-image').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath('incident.png'), animations: 'disabled' });
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(audit.violations.map(v => v.id)).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(page.locator('#incident-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#incident')).not.toBeVisible();
  await expect(page.locator('#footer-secret')).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.ticker > div').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('#footer-secret').click();
  await expect(page.locator('#incident')).toBeVisible();
  await page.locator('#incident-close').click();
  await expect(page.locator('#incident')).not.toBeVisible();
});

test('profile destinations, email copy, direct routes and assets', async ({ page, request, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/baglantilar/');
  await expect(page.locator('.listening-count strong')).toHaveText('193');
  await expect(page.getByText('Canlı sayaç değil.', { exact: false })).toBeVisible();
  await page.locator('#copy-email').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('efekaraer00@gmail.com');
  await expect(page.locator('.directory a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:efekaraer00@gmail.com');
  for (const path of ['/arsiv', '/rank', '/baglantilar']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    // Astro preview accepts both forms; Vercel owns the production slash redirect.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://hmmokeydog.com.tr${path}/`);
    await expect(page.locator('h1')).toBeVisible();
  }
  for (const path of ['/favicon.svg', '/social-card.png', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).status()).toBe(200);
  }
  await page.goto('/does-not-exist/nested');
  await expect(page.getByRole('heading', { name: 'BURADA BİR ŞEY YOK.' })).toBeVisible();
  await page.getByRole('link', { name: 'Ana sayfa ↗' }).click();
  await expect(page).toHaveURL('/');
});
