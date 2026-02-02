import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign in and sign up buttons when not authenticated', async ({ page }) => {
    // Assuming these are in the header navigation
    const header = page.getByRole('navigation').first().or(page.locator('header'));
    // If no header, just check if they exist on the page generally but be specific if duplicates exist
    // For now, let's assume they are unique enough or use first() if we just want to verify existence
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i }).first()).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).first().click();
    await expect(page).toHaveURL('/signin');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).first().click();
    await expect(page).toHaveURL('/signup');
    await expect(page.getByText('Create an account')).toBeVisible();
  });

  test('should show validation error for invalid email on sign in', async ({ page }) => {
    await page.goto('/signin');
    
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /login/i }).click();

    // Check for validation error (Zod default: "Invalid email", or our fallback "Invalid credentials")
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('should show validation error for short password on sign up', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('short');
    
    // Scoped to form to avoid header button conflict if any
    await page.locator('form').getByRole('button', { name: /sign up/i }).click();

    // Zod default for min(8): "String must contain at least 8 character(s)"
    await expect(page.getByText(/at least 8/i)).toBeVisible();
  });

  test('should have link from sign in to sign up', async ({ page }) => {
    await page.goto('/signin');
    
    // The link is usually in the footer of the card
    const signUpLink = page.getByRole('link', { name: /sign up/i }).last(); 
    await expect(signUpLink).toBeVisible();
    
    await signUpLink.click();
    await expect(page).toHaveURL('/signup');
  });

  test('should have link from sign up to sign in', async ({ page }) => {
    await page.goto('/signup');
    
    const signInLink = page.getByRole('link', { name: /log in/i }).last();
    await expect(signInLink).toBeVisible();
    
    await signInLink.click();
    await expect(page).toHaveURL('/signin');
  });

  test('should display form fields correctly on sign in page', async ({ page }) => {
    await page.goto('/signin');
    
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    await expect(page.getByText(/forgot your password/i)).toBeVisible();
  });

  test('should display form fields correctly on sign up page', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Scoped to form
    await expect(page.locator('form').getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('should have proper input types', async ({ page }) => {
    await page.goto('/signin');
    
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should mark required fields', async ({ page }) => {
    await page.goto('/signin');
    
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });
});
