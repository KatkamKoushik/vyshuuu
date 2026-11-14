import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Pillar 4: Secret Selvedge Gesture & Spring Tension Mechanics', () => {
  test('should deflect thread on pointer drag and snap back on release', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // Locate the interactive selvedge hit zone
    const selvedgeZone = page.locator('[data-selvedge-interactive="true"]').first();
    await selvedgeZone.scrollIntoViewIfNeeded();
    await expect(selvedgeZone).toBeVisible();

    const box = await selvedgeZone.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Pointer down and drag horizontally (deflecting the selvedge thread inward)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 50, startY, { steps: 5 });
    await page.waitForTimeout(100);

    // Release pointer to trigger underdamped spring snap
    await page.mouse.up();
    await page.waitForTimeout(400);

    // Locate the selvedge thread path
    const threadPath = page.locator('path[stroke*="selvedgeGoldThread"]').first();
    await expect(threadPath).toBeAttached();
    const dVal = await threadPath.getAttribute('d');
    expect(dVal).not.toBeNull();

    expect(errors).toEqual([]);
  });

  test('should toggle inscription reveal via accessible keyboard button (WCAG)', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const accessibleBtn = page.locator('#selvedge-accessible-btn').first();
    await accessibleBtn.scrollIntoViewIfNeeded();

    // Initially not expanded
    await expect(accessibleBtn).toHaveAttribute('aria-expanded', 'false');

    // Focus and activate via keyboard (as a screen-reader/keyboard user would)
    await accessibleBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    await expect(accessibleBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(accessibleBtn).toContainText('REFOLD THREAD');

    // Verify screen reader polite announcement text
    const liveRegion = page.locator('.sr-only[aria-live="polite"]').first();
    await expect(liveRegion).toContainText('Six yards of topological memory');

    // Activate again to refold
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await expect(accessibleBtn).toHaveAttribute('aria-expanded', 'false');

    expect(errors).toEqual([]);
  });
});
