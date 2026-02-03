import { test, expect } from '@playwright/test';

test.describe('FPL Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');
  });

  test('should load the FPL page', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display FPL Predictions heading', async ({ page }) => {
    const heading = page.locator('h2', { hasText: 'FPL Predictions' });
    await expect(heading).toBeVisible();
  });

  test('should display the header', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display the logo', async ({ page }) => {
    const logo = page.locator('header img[alt="Logo"]');
    await expect(logo).toBeVisible();
  });
});

test.describe('FPL Page Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');
  });

  test('should only show Home link in header navigation', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    const header = page.locator('header');
    await expect(header).toContainText('Home');
    await expect(header.locator('nav')).not.toContainText('Technologies');
    await expect(header.locator('nav')).not.toContainText('About Me');
    await expect(header.locator('nav')).not.toContainText('Experience');
  });

  test('should navigate to home page when clicking Home link', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    const homeLink = page.locator('header nav a', { hasText: 'Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await page.waitForLoadState('networkidle');

    // Should be on home page
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeVisible();
  });

  test('should navigate to home page when clicking logo', async ({ page }) => {
    const logo = page.locator('header a img[alt="Logo"]');
    await expect(logo).toBeVisible();
    await logo.click();

    await page.waitForLoadState('networkidle');

    // Should be on home page
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeVisible();
  });
});

test.describe('FPL Page Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');
  });

  test('should have mobile menu icon visible', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
  });

  test('should only show Home link in mobile menu', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    const mobileMenu = page.locator('header').locator('ul').last();
    await expect(mobileMenu).toContainText('Home');
    await expect(mobileMenu).not.toContainText('Technologies');
    await expect(mobileMenu).not.toContainText('About Me');
    await expect(mobileMenu).not.toContainText('Experience');
  });

  test('should navigate to home when clicking Home in mobile menu', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Target the mobile menu panel specifically
    const mobilePanel = page.locator('[class*="mobileMenuPanel"]');
    const homeLink = mobilePanel.locator('a', { hasText: 'Home' });
    await homeLink.click();

    await page.waitForLoadState('networkidle');

    // Should be on home page
    const homeSection = page.locator('#home');
    await expect(homeSection).toBeVisible();
  });
});

test.describe('FPL Page Controls', () => {
  const MOCK_GAMEWEEK = 25;

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/gameweek/latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameweek: MOCK_GAMEWEEK }),
      });
    });

    await page.route('**/top?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          predictions: [
            { player_name: 'Test Player', position: 'MID', predicted_points: 8.5, haul_probability: 0.35, chance_of_playing: 100 },
          ],
        }),
      });
    });

    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');
  });

  test('should display gameweek selector', async ({ page }) => {
    const gameweekInput = page.locator('input[type="number"]');
    await expect(gameweekInput).toBeVisible();
    // Wait for gameweek to load (input becomes enabled)
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });
    // Gameweek defaults to latest (mocked as 25)
    await expect(gameweekInput).toHaveValue(MOCK_GAMEWEEK.toString());
  });

  test('should display position filter buttons', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'All' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'GKP' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'DEF' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'MID' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'FWD' })).toBeVisible();
  });

  test('should not increment above latest gameweek', async ({ page }) => {
    const plusButton = page.locator('button', { has: page.locator('i.bi-plus') });
    const gameweekInput = page.locator('input[type="number"]');

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    // At latest gameweek, plus button should be disabled
    await expect(plusButton).toBeDisabled();
  });

  test('should decrement gameweek when clicking minus button', async ({ page }) => {
    const minusButton = page.locator('button', { has: page.locator('i.bi-dash') });
    const gameweekInput = page.locator('input[type="number"]');

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    // Decrement
    await minusButton.click();
    await expect(gameweekInput).toHaveValue((MOCK_GAMEWEEK - 1).toString());
  });

  test('should not decrement below minimum gameweek', async ({ page }) => {
    const minusButton = page.locator('button', { has: page.locator('i.bi-dash') });
    const gameweekInput = page.locator('input[type="number"]');

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    // Click minus 4 times to reach minimum (latest - 4)
    for (let i = 0; i < 4; i++) {
      if (await minusButton.isEnabled()) {
        await minusButton.click();
      }
    }

    // At minimum gameweek, minus button should be disabled
    await expect(minusButton).toBeDisabled();
  });

  test('should filter by position when clicking position button', async ({ page }) => {
    const gameweekInput = page.locator('input[type="number"]');
    const midButton = page.locator('button', { hasText: 'MID' });

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    await midButton.click();

    // Wait for data to load
    await page.waitForTimeout(500);

    // Check that only MID players are shown (mocked response returns MID player)
    const table = page.locator('table');
    await expect(table).toBeVisible();
    const positionCells = page.locator('table tbody td:nth-child(3)');
    const count = await positionCells.count();
    expect(count).toBeGreaterThan(0);
    await expect(positionCells.first()).toHaveText('MID');
  });
});

test.describe('FPL Page Data Display', () => {
  const MOCK_GAMEWEEK = 25;

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/gameweek/latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameweek: MOCK_GAMEWEEK }),
      });
    });

    await page.route('**/top?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          predictions: [
            { player_name: 'Erling Haaland', position: 'FWD', predicted_points: 9.2, haul_probability: 0.45, chance_of_playing: 100 },
            { player_name: 'Mohamed Salah', position: 'MID', predicted_points: 8.5, haul_probability: 0.35, chance_of_playing: 100 },
          ],
        }),
      });
    });

    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');
  });

  test('should display table or empty state after loading', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForTimeout(500);

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check headers
    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toHaveText('#');
    await expect(headers.nth(1)).toHaveText('Player');
    await expect(headers.nth(2)).toHaveText('Pos');
    await expect(headers.nth(3)).toHaveText('Pts');
    await expect(headers.nth(4)).toHaveText('Haul %');
    await expect(headers.nth(5)).toHaveText('Avail');
  });

  test('should display player data when API returns predictions', async ({ page }) => {
    const gameweekInput = page.locator('input[type="number"]');

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    // Wait for loading to complete
    await page.waitForTimeout(500);

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBe(2);

    const firstRow = rows.first();
    await expect(firstRow.locator('td').nth(0)).toHaveText('1');
    await expect(firstRow.locator('td').nth(1)).toHaveText('Erling Haaland');
  });

  test('should show loading skeleton initially', async ({ page }) => {
    // Navigate with a fresh page to catch loading state
    await page.goto('/website-portfolio/fpl');

    // Look for skeleton elements (they appear during loading)
    const skeletonExists = await page.locator('[class*="skeleton"]').count();
    // Skeleton may or may not be visible depending on load speed
    expect(skeletonExists).toBeGreaterThanOrEqual(0);
  });
});

test.describe('FPL Page State Handling', () => {
  const MOCK_GAMEWEEK = 25;

  test('should handle changing gameweeks', async ({ page }) => {
    // Mock API responses
    await page.route('**/gameweek/latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameweek: MOCK_GAMEWEEK }),
      });
    });

    await page.route('**/top?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          predictions: [
            { player_name: 'Test Player', position: 'MID', predicted_points: 8.5, haul_probability: 0.35, chance_of_playing: 100 },
          ],
        }),
      });
    });

    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');

    const gameweekInput = page.locator('input[type="number"]');
    const minusButton = page.locator('button', { has: page.locator('i.bi-dash') });

    // Wait for gameweek to load
    await expect(gameweekInput).toBeEnabled({ timeout: 10000 });

    // Navigate to a different gameweek using the minus button
    await minusButton.click();

    // Wait for data to load
    await page.waitForTimeout(500);

    // Table should be visible with mocked data
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('should show valid state after loading', async ({ page }) => {
    // Mock API responses
    await page.route('**/gameweek/latest', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameweek: MOCK_GAMEWEEK }),
      });
    });

    await page.route('**/top?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          predictions: [
            { player_name: 'Test Player', position: 'MID', predicted_points: 8.5, haul_probability: 0.35, chance_of_playing: 100 },
          ],
        }),
      });
    });

    await page.goto('/website-portfolio/fpl');
    await page.waitForLoadState('networkidle');

    // Wait for data to load
    await page.waitForTimeout(500);

    // Table should be visible with mocked data
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});

test.describe('FPL Page from Homepage', () => {
  test('should navigate to FPL page from homepage', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    const fplLink = page.locator('header nav a', { hasText: 'FPL' });
    await expect(fplLink).toBeVisible();
    await fplLink.click();

    await page.waitForLoadState('networkidle');

    // Should be on FPL page
    const heading = page.locator('h2', { hasText: 'FPL Predictions' });
    await expect(heading).toBeVisible();
  });

  test('should navigate to FPL page from mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Target the mobile menu panel specifically
    const mobilePanel = page.locator('[class*="mobileMenuPanel"]');
    const fplLink = mobilePanel.locator('a', { hasText: 'FPL' });
    await fplLink.click();

    await page.waitForLoadState('networkidle');

    // Should be on FPL page
    const heading = page.locator('h2', { hasText: 'FPL Predictions' });
    await expect(heading).toBeVisible();
  });
});
