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
  await expect(page.locator('.hero-description')).toContainText('New to City of Birds?');
  await expect(page.locator('.footer-bottom')).toContainText('Shared by City of Birds members.');
  await expect(page.locator('body')).not.toContainText('Sources checked');
  await expect(page.locator('body')).not.toContainText('not a tour operator');
  await expect(page.locator('body')).not.toContainText('Rajasthan Tourism');
  await expect(page.locator('body')).not.toContainText('not been verified');
  await expect(page.locator('[data-spot] .checked-date')).toHaveCount(0);
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
  await page.evaluate(() => { location.hash = 'credits'; });
  await expect(page).toHaveURL(/#credits$/);
  await expect(page.locator('#credits')).toBeVisible();
  await expect(page.locator('#credits-toggle')).toHaveAttribute('aria-expanded', 'true');
});

test('one footer credits button toggles content and plus/minus icons by pointer and keyboard', async ({ page }) => {
  const credits = page.locator('#credits');
  const button = page.getByRole('button', { name: 'About our group & photo credits', exact: true });
  await expect(button).toHaveCount(1);
  await expect(credits.locator('summary')).toHaveCount(0);
  await expect(page.locator('#credits-fallback')).toBeHidden();
  await expect(credits).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button.locator('.credits-plus')).toBeVisible();
  await expect(button.locator('.credits-minus')).toBeHidden();
  await button.click();
  await expect(credits).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(button.locator('.credits-plus')).toBeHidden();
  await expect(button.locator('.credits-minus')).toBeVisible();
  await expect(button).toBeFocused();
  await button.click();
  await expect(credits).toBeHidden();
  await expect(button.locator('.credits-plus')).toBeVisible();
  await expect(button.locator('.credits-minus')).toBeHidden();
  await page.goto('/#credits');
  await expect(credits).toBeVisible();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(credits).toBeHidden();
  await page.keyboard.press('Space');
  await expect(credits).toBeVisible();
  await expect(button).toBeFocused();
});

test('has no horizontal overflow, missing photos, or browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  // Visit each lazy image; jumping straight to the footer can skip its load range.
  for (const image of await page.locator('img:not(.observation-photo)').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect.poll(() => page.locator('img:not(.observation-photo)').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('serves all ten photographs as actual WebP images', async ({ page }) => {
  await expect(page.locator('img:not(.observation-photo)')).toHaveCount(10);
  for (const image of await page.locator('img:not(.observation-photo)').all()) {
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

test('shows up to three nearby observations inside each disclosure with fixed-radius links and photo credits', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== new URL(page.url()).origin) externalRequests.push(request.url());
  });
  await page.reload();
  await expect(page.locator('.nearby-observations')).toHaveCount(9);
  for (const card of await page.locator('[data-spot]').all()) {
    await card.locator('summary').click();
    await expect(card.getByRole('heading', { name: 'Observed nearby', exact: true })).toBeVisible();
    expect(await card.locator('.observation-list li').count()).toBeLessThanOrEqual(3);
    if (await card.getAttribute('id') === 'roop-sagar') {
      await expect(card.locator('.observation-context').first()).toHaveText('Selected by our members · iNaturalist');
      await expect(card.locator('.observation-search')).toHaveCount(0);
    } else {
      const url = new URL((await card.locator('.observation-search').getAttribute('href'))!);
      expect(url.origin).toBe('https://www.inaturalist.org');
      expect(url.searchParams.get('radius')).toBe('1');
      expect(url.searchParams.get('taxon_id')).toBe('3');
      expect(url.searchParams.has('quality_grade')).toBe(false);
      expect(url.searchParams.get('photo_license')).toContain('cc-by-nc');
    }
    const dates = [];
    for (const row of await card.locator('.observation-list li').all()) {
      await expect(row.locator('.observation-link')).toHaveAttribute('href', /^https:\/\/www\.inaturalist\.org\/observations\/\d+$/);
      await expect(row.locator('.observation-link')).toHaveAttribute('target', '_blank');
      await expect(row.locator('.observation-credit')).not.toBeEmpty();
      await expect(row.locator('.observation-quality')).toHaveText(/^(Research grade|Needs ID|Casual)$/);
      const gradeLabels: Record<string, string> = { research: 'Research grade', needs_id: 'Needs ID', casual: 'Casual' };
      const grade = await row.locator('.observation-quality').getAttribute('data-grade');
      expect(grade).not.toBeNull();
      await expect(row.locator('.observation-quality')).toHaveText(gradeLabels[grade!]);
      const image = row.locator('img');
      if (await image.count()) {
        await expect(row.locator('.observation-credit a')).toHaveAttribute('href', /^https:\/\/creativecommons\.org\//);
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(element => (element as HTMLImageElement).decode());
        await expect(image).toHaveAttribute('src', /^\/observations\/\d+\.webp$/);
      } else {
        await expect(row.locator('.observation-photo-placeholder')).toHaveCount(1);
        await expect(row.locator('.observation-credit')).toHaveText('View photo on the linked iNaturalist record.');
      }
      dates.push(await row.locator('time').getAttribute('datetime'));
    }
    if (!['udaan-park', 'roop-sagar'].includes((await card.getAttribute('id'))!)) expect(dates).toEqual([...dates].sort().reverse());
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(externalRequests).toEqual([]);
});

test('Udaan Park preserves the three member-selected records without copying restricted photos', async ({ page }) => {
  const card = page.locator('#udaan-park');
  await card.locator('summary').click();
  await expect(card.locator('.observation-context').first()).toContainText('Selected by our members');
  await expect(card.locator('.observation-link').first()).toHaveAttribute('target', '_blank');
  expect(await card.locator('.observation-link').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual([
    'https://www.inaturalist.org/observations/214460528',
    'https://www.inaturalist.org/observations/369120265',
    'https://www.inaturalist.org/observations/369120277',
  ]);
  await expect(card.locator('.observation-photo')).toHaveCount(1);
  await expect(card.locator('.observation-photo-placeholder')).toHaveCount(2);
});

test('Roop Sagar uses its three member-selected photo records without a guessed radius or changing its Maps link', async ({ page }) => {
  const card = page.locator('#roop-sagar');
  await card.locator('summary').click();
  expect(await card.locator('.observation-link').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual([
    'https://www.inaturalist.org/observations/298008472',
    'https://www.inaturalist.org/observations/297980147',
    'https://www.inaturalist.org/observations/297841259',
  ]);
  await expect(card.locator('.observation-photo')).toHaveCount(3);
  await expect(card.locator('.nearby-observations')).not.toContainText('1 km');
  await expect(card.locator('.observation-search')).toHaveCount(0);
  await expect(card.locator('.map-button')).toHaveAttribute('href', 'https://maps.app.goo.gl/ZnQGr5wXia8hKuvT8');
});

test('passes WCAG AA accessibility checks including expanded notes', async ({ page }) => {
  for (const summary of await page.locator('article summary').all()) await summary.click();
  await page.locator('#credits-toggle').click();
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
  await expect(page.locator('#credits-toggle')).toBeHidden();
  await expect(page.locator('#credits-fallback')).toBeVisible();
  await page.locator('#credits-fallback').click();
  await expect(page.locator('#credits')).toBeVisible();
  await expect(page.locator('#credits summary')).toHaveCount(0);
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
