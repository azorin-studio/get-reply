

import { test, expect } from '@playwright/test'
import { type Data } from "../../lib/generate"

test('should run a demo from the demo page', async ({ page }) => {
  await page.route('http://localhost:3000/api/*', async route => {
    const json: Data = {
      data: ["Dear Hiring Manager,", "Dear Hiring Manager,"],
      prompt: ""
    };
    await route.fulfill({ json });
  });

  await page.goto('/')
  await page.getByRole('link', { name: 'Try the demo' }).click();
  await expect(page).toHaveURL('/demo')
  await page.getByRole('button', { name: 'Generate' }).click();

  await expect(page.getByTestId('followup1')).toHaveText(/Dear Hiring Manager,*/, { timeout: 15000 })
  await expect(page.getByTestId('followup2')).toHaveText(/Dear Hiring Manager,*/, { timeout: 15000 })
})

