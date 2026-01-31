import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Juan/);
  });

  test('should display the main content', async ({ page }) => {
    // Check that main element exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display the header', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should display the home section', async ({ page }) => {
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeVisible();
  });

  test('should display the technologies section', async ({ page }) => {
    const techSection = page.locator('#technologies');
    await expect(techSection).toBeVisible();
  });

  test('should display the about section', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
  });

  test('should display the experience section', async ({ page }) => {
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display the logo image', async ({ page }) => {
    const logo = page.locator('header img[alt="Logo"]');
    await expect(logo).toBeVisible();
  });

  test('should display navigation items', async ({ page }) => {
    // Check navigation text exists somewhere in header
    const header = page.locator('header');
    await expect(header).toContainText('Home');
    await expect(header).toContainText('Technologies');
    await expect(header).toContainText('About Me');
    await expect(header).toContainText('Experience');
  });

  test('should display timeline content', async ({ page }) => {
    // Check for timeline company names
    const experience = page.locator('#experience');
    await expect(experience).toContainText('Contal Services');
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should scroll to experience section when clicking Experience link', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    // Find the desktop nav and click Experience link
    const experienceLink = page.locator('header nav li', { hasText: 'Experience' });
    await expect(experienceLink).toBeVisible();
    await experienceLink.click();

    // Wait for scroll animation
    await page.waitForTimeout(1000);

    // Check the experience section is in viewport
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeInViewport();
  });
});

test.describe('Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have mobile menu icon visible', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
  });

  test('should open mobile menu when clicking menu icon', async ({ page }) => {
    // Click hamburger menu
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Close icon should now be visible
    const closeIcon = page.locator('i.bi-x');
    await expect(closeIcon).toBeVisible();
  });
});

test.describe('Scroll Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have scroll arrow button in home section', async ({ page }) => {
    const arrow = page.locator('#home button i.bi-arrow-down-circle');
    await expect(arrow).toBeVisible();
  });

  test('should scroll when clicking arrow button', async ({ page }) => {
    const arrowButton = page.locator('#home button:has(i.bi-arrow-down-circle)');
    await expect(arrowButton).toBeVisible();
    await arrowButton.click();
    await page.waitForTimeout(1000);

    // Should have scrolled (scrollY > 0)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });
});

test.describe('Responsive Design', () => {
  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Desktop nav should be visible
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mobile menu icon should be visible
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
  });
});
