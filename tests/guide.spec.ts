import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('shows nine spots and functional map destinations', async ({ page }) => {
  await expect(page).toHaveTitle(/City of Birds/);
  await expect(page.locator('[data-spot]:visible')).toHaveCount(9);
  const maps = page.locator('.map-button');
  await expect(maps).toHaveCount(9);
  for (const link of await maps.all()) {
    const url = new URL((await link.getAttribute('href'))!);
    if (url.hostname === 'maps.app.goo.gl') {
      expect(url.href).toBe('https://maps.app.goo.gl/ZnQGr5wXia8hKuvT8');
      await expect(link).toHaveAttribute('target', '_blank');
      continue;
    }
    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/maps/search/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('query')).toMatch(/^24\.\d+,7[34]\.\d+$/);
    await expect(link).toHaveAttribute('target', '_blank');
  }
  await expect(page.locator('#fateh-sagar .map-button')).toHaveAttribute('href', /24\.6012962%2C73\.6796795/);
  await expect(page.locator('#pichola .map-button')).toHaveAttribute('href', /24\.5799237%2C73\.6819255/);
  const addedPins = {
    'jungle-safari-park': '24.5626744,73.6653277',
    'udaan-park': '24.5901086,73.6836062',
    'menar-wetland': '24.5931707,74.113049',
    'nela-talab': '24.5361875,73.6995469',
    'jogi-talab': '24.5076586,73.6969969',
  };
  for (const [id, coordinates] of Object.entries(addedPins)) {
    const url = new URL((await page.locator(`#${id} .map-button`).getAttribute('href'))!);
    expect(url.searchParams.get('query')).toBe(coordinates);
  }
  await expect(page.locator('.card-image-placeholder')).toHaveCount(0);
  await expect(page.locator('#roop-sagar h3')).toHaveText('Roop Sagar');
  await expect(page.locator('#roop-sagar .card-image img')).toHaveAttribute('alt', /Roop Sagar lake.*palm tree/);
  await expect(page.locator('#roop-sagar .map-button')).toHaveAttribute('href', 'https://maps.app.goo.gl/ZnQGr5wXia8hKuvT8');
  await expect(page.locator('#jogi-talab .card-image img')).toHaveAttribute('alt', /Palm trees.*Jogi Talab/);
  await expect(page.locator('#nela-talab .card-image img')).toHaveAttribute('alt', /promenade.*Nela Talab/);
  await expect(page.locator('#jungle-safari-park .card-image img')).toHaveAttribute('alt', /pavilion.*Jungle Safari Park/);
  await expect(page.locator('#udaan-park .card-image img')).toHaveAttribute('alt', /bird-shaped decorations.*Udaan Park/);
  await expect(page.locator('#menar-wetland .card-image img')).toHaveAttribute('alt', /spoonbill.*Menar Lake/);
  await expect(page.locator('#jogi-talab h3')).toHaveText('Jogi Talab');
  await expect(page.locator('#jungle-safari-park .closure-note')).toHaveText('Closed on Sundays');
  await expect(page.locator('#jungle-safari-park .closure-note')).toBeVisible();
  await expect(page.locator('#jungle-safari-park .card-image .closure-note')).toHaveCount(1);
  await expect(page.locator('#jungle-safari-park .card-body .closure-note')).toHaveCount(0);
  await expect(page.locator('#menar-wetland .card-area')).toContainText('outside Udaipur city');
  await expect(page.locator('[data-spot] .visit-meta')).toHaveCount(0);
  await expect(page.locator('#spot-grid')).not.toContainText('Suggested time');
  await expect(page.locator('#spot-grid')).not.toContainText('Suggested season');
});

test('combines filters and case-insensitive trimmed search; clear restores all', async ({ page }) => {
  await page.getByRole('button', { name: 'Lakes & wetlands', exact: true }).click();
  await expect(page.locator('[data-spot]:visible')).toHaveCount(6);
  await page.getByRole('searchbox').fill('  GANGAUR  ');
  await expect(page.locator('[data-spot]:visible')).toHaveCount(1);
  await expect(page.locator('#result-count')).toHaveText('1 spot found');
  await page.getByRole('button', { name: 'Parks & wooded areas', exact: true }).click();
  await expect(page.locator('#empty-state')).toBeVisible();
  await expect(page.locator('[data-spot]:visible')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.locator('[data-spot]:visible')).toHaveCount(9);
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(page.getByRole('button', { name: 'All spots', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('details work by keyboard and allow multiple open cards', async ({ page }) => {
  const first = page.locator('#fateh-sagar summary');
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#fateh-sagar details')).toHaveAttribute('open', '');
  await expect(first).toBeFocused();
  await page.locator('#pichola summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('article details[open]')).toHaveCount(2);
});

test('deep links reveal hidden spots and open credits', async ({ page }) => {
  await page.getByRole('button', { name: 'Parks & wooded areas', exact: true }).click();
  await expect(page.locator('#fateh-sagar')).toBeHidden();
  await page.evaluate(() => { location.hash = 'fateh-sagar'; });
  await expect(page.locator('#fateh-sagar')).toBeVisible();
  await page.locator('.footer-bottom a').click();
  await expect(page.locator('#credits')).toHaveAttribute('open', '');
});

test('has no horizontal overflow, missing photos, or browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  // Visit each lazy image; jumping straight to the footer can skip its load range.
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('serves all ten photographs as actual WebP images', async ({ page }) => {
  await expect(page.locator('img')).toHaveCount(10);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => (element as HTMLImageElement).decode());
    const url = await image.evaluate(element => (element as HTMLImageElement).currentSrc);
    const response = await page.request.get(url);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/webp');
    const bytes = await response.body();
    expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
    expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
  }
});

test('passes WCAG AA accessibility checks including expanded notes', async ({ page }) => {
  for (const summary of await page.locator('article summary').all()) await summary.click();
  await page.locator('#credits summary').click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('retains the full useful guide with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('[data-spot]')).toHaveCount(9);
  await expect(page.locator('#discovery-controls')).toBeHidden();
  await page.locator('#pichola summary').click();
  await expect(page.locator('#pichola details')).toHaveAttribute('open', '');
  await expect(page.locator('#pichola .map-button')).toBeVisible();
  await context.close();
});

test('respects reduced motion and leaves keyboard presses unscaled', async ({ page }) => {
  const button = page.getByRole('button', { name: 'All spots', exact: true });
  await button.focus();
  await page.keyboard.down('Space');
  expect(await button.evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await page.keyboard.up('Space');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.dispatchEvent('pointerdown', { isPrimary: true, button: 0 });
  expect(await button.evaluate(element => getComputedStyle(element).transform)).toBe('none');
});
