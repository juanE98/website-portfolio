import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Juan/);
  });

  test('should display the main content', async ({ page }) => {
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
    const header = page.locator('header');
    await expect(header).toContainText('Home');
    await expect(header).toContainText('Technologies');
    await expect(header).toContainText('About Me');
    await expect(header).toContainText('Experience');
  });

  test('should display timeline content', async ({ page }) => {
    const experience = page.locator('#experience');
    await expect(experience).toContainText('Contal Services');
  });
});

test.describe('Header and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should have clickable logo that scrolls to home', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    // Scroll down first to a position where header is still visible
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(300);

    // Scroll up slightly to make header visible again
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    // Click the logo using force to bypass viewport check
    const logo = page.locator('header img[alt="Logo"]');
    await logo.click({ force: true });

    // Wait for scroll
    await page.waitForTimeout(1000);

    // Should be at or near top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should scroll to experience section when clicking Experience link', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    const experienceLink = page.locator('header nav li', { hasText: 'Experience' });
    await expect(experienceLink).toBeVisible();
    await experienceLink.click();

    await page.waitForTimeout(1000);

    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeInViewport();
  });

  test('should scroll to technologies section when clicking Technologies link', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    const techLink = page.locator('header nav li', { hasText: 'Technologies' });
    await expect(techLink).toBeVisible();
    await techLink.click();

    await page.waitForTimeout(1000);

    const techSection = page.locator('#technologies');
    await expect(techSection).toBeInViewport();
  });

  test('should scroll to about section when clicking About Me link', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    const aboutLink = page.locator('header nav li', { hasText: 'About Me' });
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should hide header on scroll down and show on scroll up', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Header hide behavior differs on mobile');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // Header should be hidden (transformed out of view)
    const transform = await header.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    expect(transform).not.toBe('none');

    // Scroll up
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Header should be visible again
    await expect(header).toBeVisible();
  });
});

test.describe('Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should have mobile menu icon visible', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
  });

  test('should hide desktop nav on mobile', async ({ page }) => {
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();
  });

  test('should open mobile menu when clicking menu icon', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
    await menuIcon.click();
    await page.waitForTimeout(300);

    const closeIcon = page.locator('i.bi-x');
    await expect(closeIcon).toBeVisible();
  });

  test('should close mobile menu when clicking close icon', async ({ page }) => {
    // Open menu
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Close menu
    const closeIcon = page.locator('i.bi-x');
    await expect(closeIcon).toBeVisible();
    await closeIcon.click();
    await page.waitForTimeout(300);

    // Menu should be closed - hamburger icon should be clickable again
    await expect(menuIcon).toBeVisible();
    // The mobile panel should not have the active class
    const mobilePanel = page.locator('header [class*="mobileMenuPanel"]');
    const hasActiveClass = await mobilePanel.evaluate((el) =>
      el.classList.contains('active') || Array.from(el.classList).some(c => c.includes('active'))
    );
    expect(hasActiveClass).toBe(false);
  });

  test('should display navigation items in mobile menu', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Check mobile menu has all navigation items
    const mobileMenu = page.locator('header').locator('ul', { has: page.locator('li') }).last();
    await expect(mobileMenu).toContainText('Home');
    await expect(mobileMenu).toContainText('Technologies');
    await expect(mobileMenu).toContainText('About Me');
    await expect(mobileMenu).toContainText('Experience');
  });

  test('should navigate and close menu when clicking mobile nav item', async ({ page }) => {
    const menuIcon = page.locator('header i.bi-list');
    await menuIcon.click();
    await page.waitForTimeout(300);

    // Click Experience in mobile menu
    const mobileNavItem = page.locator('li', { hasText: 'Experience' }).last();
    await mobileNavItem.click();
    await page.waitForTimeout(1000);

    // Should have scrolled to experience section
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeInViewport();

    // Menu should be closed - mobile panel should not be active
    const mobilePanel = page.locator('header [class*="mobileMenuPanel"]');
    const hasActiveClass = await mobilePanel.evaluate((el) =>
      el.classList.contains('active') || Array.from(el.classList).some(c => c.includes('active'))
    );
    expect(hasActiveClass).toBe(false);
  });
});

test.describe('Home Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should display profile image', async ({ page }) => {
    const profileImage = page.locator('#home img[alt="Juan Espares"]');
    await expect(profileImage).toBeVisible();
  });

  test('should display name badge', async ({ page }) => {
    const nameBadge = page.locator('#home').getByText('Juan Espares');
    await expect(nameBadge).toBeVisible();
  });

  test('should display greeting', async ({ page }) => {
    const greeting = page.locator('#home h1');
    await expect(greeting).toContainText("Hi, I'm Juan");
  });

  test('should have typing animation container', async ({ page }) => {
    // The typing animation shows various texts
    const homeSection = page.locator('#home');
    // Check that at least one of the typing texts is present or the container exists
    await expect(homeSection).toContainText(/I (write code|build software|fix software|optimise systems|design system architecture|solve problems|secure systems)/);
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

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });

  test('should hide scroll arrow after scrolling', async ({ page }) => {
    // Scroll down significantly to trigger the hidden state
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    const arrowButton = page.locator('#home button:has(i.bi-arrow-down-circle)');
    // Arrow should have hidden class or be visually hidden (opacity: 0)
    const isHidden = await arrowButton.evaluate((el) => {
      const classList = Array.from(el.classList);
      const hasHiddenClass = classList.some(c => c.includes('hidden'));
      const opacity = window.getComputedStyle(el).opacity;
      return hasHiddenClass || opacity === '0';
    });
    expect(isHidden).toBe(true);
  });
});

test.describe('Technologies Section (Image Carousel)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should display technology icons carousel', async ({ page }) => {
    const carousel = page.locator('#technologies');
    await expect(carousel).toBeVisible();
  });

  test('should have multiple technology icons', async ({ page }) => {
    const icons = page.locator('#technologies img[alt="Technology icon"]');
    const count = await icons.count();
    // Should have multiple icons (3 copies of 17 icons = 51)
    expect(count).toBeGreaterThan(10);
  });

  test('should have technology icons with proper alt text', async ({ page }) => {
    const firstIcon = page.locator('#technologies img[alt="Technology icon"]').first();
    await expect(firstIcon).toBeVisible();
    await expect(firstIcon).toHaveAttribute('alt', 'Technology icon');
  });
});

test.describe('About Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
    // Scroll to about section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display about section title', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toContainText('About myself');
  });

  test('should display about text content', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toContainText('software engineer');
    await expect(aboutSection).toContainText('AWS Solutions Architect');
    await expect(aboutSection).toContainText('University of Queensland');
  });

  test('should display facts list', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toContainText('Brisbane, AU');
    await expect(aboutSection).toContainText('Backend Engineer');
  });
});

test.describe('Experience Section (Timeline)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('should display experience section title', async ({ page }) => {
    const title = page.locator('#experience h2');
    await expect(title).toContainText('Experience');
  });

  test('should display all timeline events', async ({ page }) => {
    const experience = page.locator('#experience');

    // Check for all companies/events
    await expect(experience).toContainText('Contal Services');
    await expect(experience).toContainText('Dye and Durham');
    await expect(experience).toContainText('Scriptsoft');
    await expect(experience).toContainText('Bachelor of Computer Science');
    await expect(experience).toContainText('University of Queensland');
  });

  test('should display timeline event details', async ({ page }) => {
    const experience = page.locator('#experience');

    // Check for job titles/subtitles
    await expect(experience).toContainText('Backend Software Engineer');
    await expect(experience).toContainText('Junior Software Engineer');
    await expect(experience).toContainText('Software Developer');
  });

  test('should display job descriptions', async ({ page }) => {
    const experience = page.locator('#experience');

    await expect(experience).toContainText('Jetstar API integrations');
    await expect(experience).toContainText('.NET microservices');
    await expect(experience).toContainText('Angular frontend');
  });

  test('should have timeline items with visual indicators', async ({ page }) => {
    // Check for timeline item structure (circles as visual indicators)
    const timelineItems = page.locator('#experience h3');
    const count = await timelineItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
    await page.locator('footer').scrollIntoViewIfNeeded();
  });

  test('should display copyright text', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('2026 Juan Espares');
    await expect(footer).toContainText('All rights reserved');
  });

  test('should display LinkedIn social link', async ({ page }) => {
    const linkedinLink = page.locator('footer a[href*="linkedin"]');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should display GitHub social link', async ({ page }) => {
    const githubLink = page.locator('footer a[href*="github"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have correct LinkedIn URL', async ({ page }) => {
    const linkedinLink = page.locator('footer a[href*="linkedin"]');
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/juan-espares/');
  });

  test('should have correct GitHub URL', async ({ page }) => {
    const githubLink = page.locator('footer a[href*="github"]');
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/juanE98');
  });

  test('should display social icons', async ({ page }) => {
    const linkedinIcon = page.locator('footer i.bi-linkedin');
    const githubIcon = page.locator('footer i.bi-github');

    await expect(linkedinIcon).toBeVisible();
    await expect(githubIcon).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeHidden();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    // At exactly 768px, should show mobile menu
    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    const menuIcon = page.locator('header i.bi-list');
    await expect(menuIcon).toBeVisible();

    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();
  });

  test('should work on small mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    // Page should still be usable
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const homeSection = page.locator('#home');
    await expect(homeSection).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
  });

  test('should have alt text on all images', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 20); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Should have h2 headings
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Check for semantic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('nav')).toBeAttached();
  });

  test('should have external links with proper attributes', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});

test.describe('Performance and Loading', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like favicon 404)
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('URL and Navigation State', () => {
  test('should update URL hash when navigating', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation test');

    await page.goto('/website-portfolio/');
    await page.waitForLoadState('networkidle');

    const experienceLink = page.locator('header nav li', { hasText: 'Experience' });
    await experienceLink.click();
    await page.waitForTimeout(1000);

    const url = page.url();
    expect(url).toContain('#experience');
  });

  test('should navigate to section from URL hash', async ({ page }) => {
    await page.goto('/website-portfolio/#experience');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeInViewport();
  });
});
