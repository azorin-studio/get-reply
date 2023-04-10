

import { test, expect } from '@playwright/test'

test('should run a demo from the demo page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/')
  await page.getByRole('link', { name: 'Try the demo' }).click();
  await expect(page).toHaveURL('/demo')
  await page.getByRole('button', { name: 'Generate' }).click();

  await expect(page.getByTestId('followup1')).toHaveText(/Dear Hiring Manager,*/, { timeout: 15000 })
  await expect(page.getByTestId('followup2')).toHaveText(/Dear Hiring Manager,*/, { timeout: 15000 })
})

