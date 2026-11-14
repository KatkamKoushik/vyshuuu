import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Pillar 3: Active Theory Optical Microscopic Weave Loupe', () => {
  test('should open monograph modal and weave loupe with optical controls', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // Scroll down to the Spatial Collection Exhibition (#collection-wall)
    const collectionWall = page.locator('#collection-wall');
    await collectionWall.scrollIntoViewIfNeeded();
    await expect(collectionWall).toBeVisible();

    // Find the examine monograph CTA
    const examineBtn = page.locator('button:has-text("EXAMINE MONOGRAPH")').first();
    await expect(examineBtn).toBeVisible();
    await examineBtn.click();

    // Saree Monograph Modal should open
    const monographDialog = page.locator('[role="dialog"][aria-modal="true"]').first();
    await expect(monographDialog).toBeVisible({ timeout: 6000 });

    // Trigger Weave Loupe by clicking on the weave examine button
    const openLoupeBtn = page.locator('button:has-text("LAUNCH SCIENTIFIC LOUPE"), [aria-label*="Microscopic Weave Loupe"]').first();
    await expect(openLoupeBtn).toBeVisible();
    await openLoupeBtn.click();

    // Microscopic Weave Loupe should be displayed
    const loupeHeader = page.locator('text=MICROSCOPIC WEAVE LOUPE').first();
    await expect(loupeHeader).toBeVisible();

    // Verify optical reticle controls
    const zoomInBtn = page.locator('button[aria-label="Increase Magnification"]');
    const zoomOutBtn = page.locator('button[aria-label="Decrease Magnification"]');
    const resetBtn = page.locator('button[aria-label="Reset Scale and Pan"]');

    await expect(zoomInBtn).toBeVisible();
    await expect(zoomOutBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();

    // Click Zoom In
    await zoomInBtn.click();
    await page.waitForTimeout(100);

    // Magnification should now show higher scale
    const scaleIndicator = page.locator('footer span:has-text("SCALE:")');
    await expect(scaleIndicator).toContainText('SCALE: 1.');

    // Click Zoom In again
    await zoomInBtn.click();
    await page.waitForTimeout(100);

    // Click Reset
    await resetBtn.click();
    await page.waitForTimeout(100);
    await expect(scaleIndicator).toContainText('SCALE: 1.0');

    // Close the loupe
    const closeLoupeBtn = page.locator('button[aria-label="Exit Microscopic Examination"]');
    await closeLoupeBtn.click();
    await page.waitForTimeout(200);

    await expect(loupeHeader).not.toBeVisible();

    expect(errors).toEqual([]);
  });
});
