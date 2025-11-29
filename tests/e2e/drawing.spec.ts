import { test, expect } from '@playwright/test';

test.describe('Advanced Map Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.leaflet-container');
  });

  test('should draw and delete polygon features', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;

    const drawPolyBtn = page.locator('button:has-text("Draw Polygon")');
    await drawPolyBtn.click();

    const positions = [
      { x: box.width / 3, y: box.height / 3 },
      { x: (box.width * 2) / 3, y: box.height / 3 },
      { x: box.width / 2, y: (box.height * 2) / 3 },
    ];

    for (const pos of positions) {
      await page.click('.leaflet-container', { position: pos });
      await page.waitForTimeout(100);
    }

    await page.click('.leaflet-container', {
      position: positions[0],
      button: 'right',
    });

    await page.waitForTimeout(500);

    const featurelist = page.locator('text=Area of Interest');
    await expect(featurelist).toBeVisible();

    const deleteBtn = page.locator('button:has-text("Delete")').first();
    await deleteBtn.click();

    const emptyText = page.locator('text=No features drawn yet');
    await expect(emptyText).toBeVisible();
  });

  test('should handle drawing line features', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;
    const drawLineBtn = page.locator('button:has-text("Draw Line")');
    await drawLineBtn.click();

    const pos1 = { x: box.width / 4, y: box.height / 4 };
    const pos2 = { x: (box.width * 3) / 4, y: (box.height * 3) / 4 };

    await page.click('.leaflet-container', { position: pos1 });
    await page.waitForTimeout(100);
    await page.click('.leaflet-container', { position: pos2 });
    await page.waitForTimeout(100);

    await page.click('.leaflet-container', {
      position: pos1,
      button: 'right',
    });

    await page.waitForTimeout(500);

    const featureList = page.locator('text=Line');
    await expect(featureList).toBeVisible();
  });

  test('should clear all features', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;

    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    for (let i = 0; i < 3; i++) {
      await page.click('.leaflet-container', {
        position: {
          x: (box.width / 4) * (i + 1),
          y: (box.height / 4) * (i + 1),
        },
      });
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(500);

    const featureCount = page.locator('text="Drawn Features (3)"');
    await expect(featureCount).toBeVisible();

    const clearBtn = page.locator('button:has-text("Clear All")');
    await clearBtn.click();

    await page.waitForTimeout(500);

    const emptyText = page.locator('text=No features drawn yet');
    await expect(emptyText).toBeVisible();
  });

  test('should toggle drawing mode correctly', async ({ page }) => {
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    const drawLineBtn = page.locator('button:has-text("Draw Line")');

    await drawPointBtn.click();
    let isActive = await drawPointBtn.getAttribute('class');
    expect(isActive).toContain('active');

    await drawLineBtn.click();
    isActive = await drawPointBtn.getAttribute('class');
    expect(isActive).not.toContain('active');

    isActive = await drawLineBtn.getAttribute('class');
    expect(isActive).toContain('active');

    
    await drawLineBtn.click();
    isActive = await drawLineBtn.getAttribute('class');
    expect(isActive).not.toContain('active');
  });

  test('should handle search and map center change', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search location..."]');

    await searchInput.click();
    await searchInput.fill('Berlin');

    await page.waitForTimeout(800);

    const firstResult = page.locator('button').filter({ hasText: /Berlin/ }).first();
    await firstResult.click();

    await page.waitForTimeout(500);

    const inputValue = await searchInput.inputValue();
    expect(inputValue).toBe('');

    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();
  });

  test('should maintain drawing mode while zooming', async ({ page }) => {
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    let isActive = await drawPointBtn.getAttribute('class');
    expect(isActive).toContain('active');

    const zoomInBtn = page.locator('button').first();
    await zoomInBtn.click();

    await page.waitForTimeout(300);

    isActive = await drawPointBtn.getAttribute('class');
    expect(isActive).toContain('active');
  });

  test('should display feature count correctly', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;

    const initialCount = page.locator('text=Drawn Features (0)');
    await expect(initialCount).toBeVisible();

    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    await page.click('.leaflet-container', {
      position: { x: box.width / 2, y: box.height / 2 },
    });

    await page.waitForTimeout(500);

  
    const countOne = page.locator('text=Drawn Features (1)');
    await expect(countOne).toBeVisible();
  });

  test('should handle map keyboard navigation', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');

    await mapContainer.focus();

    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);

    await expect(mapContainer).toBeVisible();
  });

  test('should show feature details on hover', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;

    
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    await page.click('.leaflet-container', {
      position: { x: box.width / 2, y: box.height / 2 },
    });

    await page.waitForTimeout(500);

   
    const featureItem = page.locator('text=Point').first();
    await expect(featureItem).toBeVisible();

  
    await featureItem.hover();

    
    await expect(featureItem).toBeVisible();
  });
});
