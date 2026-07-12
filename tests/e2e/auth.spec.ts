import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
	test('login page offers both User and Admin login modes', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByRole('tab', { name: 'Login as User' })).toBeVisible();
		await expect(page.getByRole('tab', { name: 'Login as Admin' })).toBeVisible();
	});

	test('register page rejects a meaningless full name', async ({ page }) => {
		await page.goto('/register');
		await page.getByLabel('Full Name').fill('test');
		await page.getByLabel('Email Address').fill('newuser@example.com');
		await page.getByLabel('Password', { exact: true }).fill('Str0ng!Pass');
		await page.getByLabel('Confirm Password').fill('Str0ng!Pass');
		await page.getByRole('checkbox').check();
		await page.getByRole('button', { name: 'Create Account' }).click();
		await expect(page.getByText(/real full name/i)).toBeVisible();
	});

	test('register page rejects a weak password', async ({ page }) => {
		await page.goto('/register');
		await page.getByLabel('Full Name').fill('Ananya Rao');
		await page.getByLabel('Email Address').fill('newuser@example.com');
		await page.getByLabel('Password', { exact: true }).fill('weak');
		await page.getByLabel('Confirm Password').fill('weak');
		await page.getByRole('checkbox').check();
		await page.getByRole('button', { name: 'Create Account' }).click();
		await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
	});

	test('forgot password page accepts a valid email format', async ({ page }) => {
		await page.goto('/forgot-password');
		await page.getByLabel('Email Address').fill('someone@example.com');
		await page.getByRole('button', { name: 'Send Reset Link' }).click();
		await expect(page.getByText(/password reset link has been sent/i)).toBeVisible({ timeout: 10000 });
	});

	test('accessing dashboard while signed out redirects to login', async ({ page }) => {
		await page.goto('/dashboard');
		await expect(page).toHaveURL(/\/login/);
	});

	test('accessing admin while signed out redirects to admin login', async ({ page }) => {
		await page.goto('/admin');
		await expect(page).toHaveURL(/\/login/);
		await expect(page).toHaveURL(/as=admin/);
	});
});
