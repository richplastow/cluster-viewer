import { expect, Page, test } from '@playwright/test'

/** ### Tests each of the three ClusterMode buttons
 * 
 * The start and end screenshots are given the same filename, which tests that
 * all meshes return to their starting position when 'Original' is clicked.
 * 
 * @param page
 *    The GLTFViewer page to test.
 * @param route
 *    Part of the URL after /cluster-viewer/, eg "apartment/".
 */
const testScreenshots = async (
  page: Page,
  route: string,
) => {
  await page.goto(`./${route}`)
  await expect(page.locator('p')).toHaveClass('loaded')
  const slashesToHyphens = route.replace(/\//g, '-')
  await expect(page).toHaveScreenshot(`${slashesToHyphens}original.png`)
  await page.getByText('Cluster by Shape').click()
  await page.locator('h1').click() // avoid webkit hover persistance issue
  await page.waitForTimeout(2000) // @TODO maybe the app can signal tween is done
  await expect(page).toHaveScreenshot(`${slashesToHyphens}cluster-by-shape.png`)
  await page.getByText('Cluster by Colour').click()
  await page.locator('h1').click()
  await page.waitForTimeout(2000)
  await expect(page).toHaveScreenshot(`${slashesToHyphens}cluster-by-color.png`)
  await page.getByText('Original').click()
  await page.locator('h1').click()
  await page.waitForTimeout(2000)
  await expect(page).toHaveScreenshot(`${slashesToHyphens}original.png`)
}

test('compares screenshots of the Apartment page', async ({ page }) => {
  await testScreenshots(page, 'apartment/')
})

test('compares screenshots of the Building page', async ({ page }) => {
  await testScreenshots(page, 'building/')
})
