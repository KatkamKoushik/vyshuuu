import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Pillar 1: Active Theory & Santioni 5-Chamber Scenography', () => {
  test('should mount 5 spatial chambers and .GLA11y accessibility mirror', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // 1. Verify Active Theory .GLA11y mirror landmarks
    const gla11y = page.locator('.GLA11y');
    await expect(gla11y).toBeAttached();

    const chamberLinks = gla11y.locator('nav a');
    await expect(chamberLinks).toHaveCount(5);

    await expect(chamberLinks.nth(0)).toHaveAttribute('href', '#threshold');
    await expect(chamberLinks.nth(1)).toHaveAttribute('href', '#unfurling');
    await expect(chamberLinks.nth(2)).toHaveAttribute('href', '#collection-wall');
    await expect(chamberLinks.nth(3)).toHaveAttribute('href', '#atelier');
    await expect(chamberLinks.nth(4)).toHaveAttribute('href', '#seal');

    // 2. Verify physical DOM chambers exist
    await expect(page.locator('#threshold')).toBeVisible();
    await expect(page.locator('#unfurling')).toBeAttached();
    await expect(page.locator('#collection-wall')).toBeAttached();
    await expect(page.locator('#atelier')).toBeAttached();
    await expect(page.locator('#seal')).toBeAttached();

    // 3. Verify Canvas or fallback is mounted
    const canvasOrFallback = page.locator('canvas, [aria-hidden="true"]');
    await expect(canvasOrFallback.first()).toBeAttached();

    expect(errors).toEqual([]);
  });

  test('should smoothly scroll and update narrative yardage cadence', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // Initial yardage indicator at the threshold
    const thresholdIndicator = page.locator('text=/0.00.*6.00 YARDS/i');
    await expect(thresholdIndicator.first()).toBeVisible();

    // Scroll into the unfurling sequence
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'instant' });
    });

    // Wait for scroll progress update
    await page.waitForTimeout(300);

    // Verify 6-Yard Unfurling section header is rendered and visible on current viewport
    const unfurlingHeading = page.locator('h2:has-text("THE 6-YARD UNFURLING"):visible');
    await expect(unfurlingHeading).toBeVisible();

    // Scroll further into the collection wall
    const collectionWall = page.locator('#collection-wall');
    await collectionWall.scrollIntoViewIfNeeded();
    await expect(collectionWall).toBeVisible();

    // Scroll to the atelier and seal
    const seal = page.locator('#seal');
    await seal.scrollIntoViewIfNeeded();
    await expect(seal).toBeVisible();

    expect(errors).toEqual([]);
  });
});
