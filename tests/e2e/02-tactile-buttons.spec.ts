import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Pillar 2: Noomo-Valentime Tactile Button Mechanics', () => {
  test('should track cursor coordinates (--x, --y) and dynamic specular states on hover', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const button = page.locator('button:has-text("ENTER CONTINUUM")').first();
    await expect(button).toBeVisible();

    const box = await button.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    // Hover near top-left of the button
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
    await page.waitForTimeout(100);

    // Read the inline CSS variables from style attribute
    const style1 = await button.getAttribute('style');
    expect(style1).toContain('--x');
    expect(style1).toContain('--y');
    expect(style1).toContain('--s: 1');

    // Hover near bottom-right of the button
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75);
    await page.waitForTimeout(100);

    const style2 = await button.getAttribute('style');
    expect(style2).toContain('--x');
    expect(style2).toContain('--y');
    // Ensure coordinates shifted
    expect(style2).not.toEqual(style1);

    // Leave pointer
    await page.mouse.move(box.x - 100, box.y - 100);
    await page.waitForTimeout(100);

    const style3 = await button.getAttribute('style');
    expect(style3).toContain('--s: 0');

    expect(errors).toEqual([]);
  });

  test('should trigger smooth scroll and action on click', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const button = page.locator('button:has-text("ENTER CONTINUUM")').first();
    await expect(button).toBeVisible();

    await button.click();
    await page.waitForTimeout(500);

    // Verify page scrolled down from top (scrollY > 0)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    expect(errors).toEqual([]);
  });

  test('should support keyboard navigation and focus rings', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const button = page.locator('button:has-text("ENTER CONTINUUM")').first();
    await button.focus();
    await expect(button).toBeFocused();

    expect(errors).toEqual([]);
  });
});
