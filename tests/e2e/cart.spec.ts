import { test, expect } from '@playwright/test';

test.describe('Shopping cart', () => {
	test('empty cart shows an empty state with a call to action', async ({ page }) => {
		await page.goto('/cart');
		await expect(page.getByText('Your cart is empty')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Browse Flowers' })).toBeVisible();
	});

	test('adding a flower to the cart updates the header cart badge', async ({ page }) => {
		await page.goto('/flowers');
		const firstFlowerLink = page.locator('a[href^="/flowers/"]').first();
		await firstFlowerLink.click();

		await page.getByRole('button', { name: 'Add to Cart' }).click();
		const cartBadge = page.locator('a[aria-label="Shopping cart"] span');
		await expect(cartBadge).toHaveText('1');
	});

	test('cart page reflects an added item and shows order summary', async ({ page }) => {
		await page.goto('/flowers');
		const firstFlowerLink = page.locator('a[href^="/flowers/"]').first();
		await firstFlowerLink.click();
		await page.getByRole('button', { name: 'Add to Cart' }).click();

		await page.goto('/cart');
		await expect(page.getByText('Order Summary')).toBeVisible();
		await expect(page.getByText('Proceed to Checkout')).toBeVisible();
	});
});

test.describe('Flower weight engine', () => {
	test('submit-flower page redirects unauthenticated users to login', async ({ page }) => {
		await page.goto('/submit-flower');
		await expect(page).toHaveURL(/\/login/);
	});
});
