/**
 * E2E test: Log in and create a post via the frontend
 * Run: npx playwright test tests/create-post.spec.js
 * Or: npx playwright test tests/create-post.spec.js --headed (to watch)
 */

import { test, expect } from '@playwright/test'

const EMAIL = 'snehil123@gmail.com'
const PASSWORD = 'pass'
const POST_CONTENT = `Test post from automation at ${new Date().toISOString()}`

test('create post via frontend', async ({ page }) => {
  await page.goto('/auth')
  await page.waitForLoadState('networkidle')

  // Wait for auth form
  const emailInput = page.getByPlaceholder('Email')
  await emailInput.waitFor({ state: 'visible', timeout: 15000 })
  await emailInput.fill(EMAIL)
  await page.getByPlaceholder('Password').first().fill(PASSWORD)

  // Sign in
  await page.getByRole('button', { name: /sign in/i }).click()

  // Wait for redirect to feed
  await expect(page).toHaveURL(/\/feed/, { timeout: 15000 })

  // Wait for feed to load (compose area appears after loading spinner)
  const composeInput = page.locator('.compose-input, input[placeholder*="Start a post"]')
  await composeInput.waitFor({ state: 'visible', timeout: 30000 })
  await composeInput.fill(POST_CONTENT)

  // Click Post button in compose area (not the Repost buttons on each post)
  await page.locator('.compose-btn.post-btn').click()

  // Verify post appears
  await expect(page.getByText(POST_CONTENT)).toBeVisible({ timeout: 15000 })
})
