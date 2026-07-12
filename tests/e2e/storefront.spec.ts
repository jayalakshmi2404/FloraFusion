import { test, expect } from '@playwright/test';

test.describe('Public storefront', () => {
	test('home page loads with hero and brand name', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Flora Fusion/i);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		await expect(page.getByText('Flora Fusion').first()).toBeVisible();
	});

	test('footer shows only the official contact email, no phone or address', async ({ page }) => {
		await page.goto('/');
		const footer = page.locator('footer');
		await expect(footer.getByText('florafusion11@gmail.com')).toBeVisible();
		await expect(footer.getByText(/\+?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)).toHaveCount(0);
	});

	test('flowers listing page shows available flower count out of 30', async ({ page }) => {
		await page.goto('/flowers');
		await expect(page.getByText(/Available Flowers: \d+ \/ 30/)).toBeVisible();
	});

	test('can navigate from home to flower detail page', async ({ page }) => {
		await page.goto('/flowers');
		const firstFlowerLink = page.locator('a[href^="/flowers/"]').first();
		await firstFlowerLink.click();
		await expect(page).toHaveURL(/\/flowers\/.+/);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('products catalog page loads keepsakes', async ({ page }) => {
		await page.goto('/products');
		await expect(page.getByRole('heading', { name: 'Keepsakes' })).toBeVisible();
	});

	test('about page is reachable from navigation', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: 'About' }).click();
		await expect(page).toHaveURL(/\/about/);
	});

	test('404 page renders for unknown routes', async ({ page }) => {
		const response = await page.goto('/this-route-does-not-exist');
		expect(response?.status()).toBe(404);
		await expect(page.getByText('Page Not Found')).toBeVisible();
	});
});
