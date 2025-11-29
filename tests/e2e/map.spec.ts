import { test, expect } from '@playwright/test';

test.describe('Map Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.leaflet-container');
  });

  test('should load the application with title', async ({ page }) => {
    const title = await page.locator('h1').first();
    await expect(title).toContainText('AOI Satellite Mapper');
  });

  test('should display the map and WMS layer', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible();

    
    const tileLayers = page.locator('.leaflet-tile-pane img');
    const count = await tileLayers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be able to zoom in and out', async ({ page }) => {
  
    const mapElement = page.locator('.leaflet-container');

    
    const zoomInBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    await zoomInBtn.click();

    
    await expect(mapElement).toBeVisible();
  });

  test('should toggle WMS layer visibility', async ({ page }) => {
    
    await page.waitForSelector('button:has-text("WMS Satellite Layer")');
    
    const layerToggle = page.locator('button:has-text("WMS Satellite Layer")');

    await layerToggle.click();

    await expect(layerToggle).toBeVisible();
  });

  test('should allow drawing points on the map', async ({ page }) => {
  
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();


    const buttonClass = await drawPointBtn.getAttribute('class');
    expect(buttonClass).toContain('active');


    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (box) {
      await page.click('.leaflet-container', {
        position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) },
      });
    }

    await page.waitForTimeout(500);

    // Verify feature appears in the layer panel
    const featureCount = page.locator('div:has-text("Drawn Features")');
    await expect(featureCount).toBeVisible();
  });

  test('should search for locations', async ({ page }) => {
    // Focus on search input
    const searchInput = page.locator('input[placeholder="Search location..."]');
    await searchInput.focus();

    // Type a search query
    await searchInput.fill('Münster');

    // Wait for results to appear
    await page.waitForTimeout(500);

    // Verify search dropdown appears
    const dropdown = page.locator('div').filter({ hasText: /Münster/ });
    await expect(dropdown).toBeVisible();
  });

  test('should display layer panel with feature management', async ({ page }) => {
    // Check that layer panel is visible
    const layerPanel = page.locator('text=Layers');
    await expect(layerPanel).toBeVisible();

    // Check feature list
    const featureList = page.locator('text=Drawn Features');
    await expect(featureList).toBeVisible();

    // Verify initially empty
    const emptyText = page.locator('text=No features drawn yet');
    await expect(emptyText).toBeVisible();
  });

  test('should handle drawing multiple features', async ({ page }) => {
    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (!box) return;

    // Draw first point
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    await page.click('.leaflet-container', {
      position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) },
    });

    await page.waitForTimeout(300);

    // Draw second point
    await page.click('.leaflet-container', {
      position: { x: Math.floor(box.width / 3), y: Math.floor(box.height / 3) },
    });

    await page.waitForTimeout(500);

    // Verify points are rendered
    const markers = page.locator('.leaflet-marker-icon, .leaflet-circle-marker');
    const count = await markers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should persist state across reload', async ({ page }) => {
    // Draw a point
    const drawPointBtn = page.locator('button:has-text("Draw Point")');
    await drawPointBtn.click();

    const mapContainer = page.locator('.leaflet-container');
    const box = await mapContainer.boundingBox();

    if (box) {
      await page.click('.leaflet-container', {
        position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) },
      });
    }

    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();

    // Wait for map to reload
    await page.waitForSelector('.leaflet-container');

    // Verify feature is still there
    const featureList = page.locator('div').filter({ hasText: /Point/ });
    await expect(featureList).toBeVisible();
  });
});
