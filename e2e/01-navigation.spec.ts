import { expect, Page, test } from '@playwright/test'

test('lands on a non-existent route, then navigates to the home page', async ({ page }) => {
  await page.goto('./no/such/route/')
  await expect(page.locator('h2')).toHaveText('Not Found')
  await page.getByText('Return to the homepage').click()
  await expect(page).toHaveURL('./')
  await expect(page.locator('h1')).toHaveText('Welcome to Cluster Viewer')
  await expect(page.locator('a[href$="apartment/"] canvas')).toBeInViewport()
  await expect(page.locator('a[href$="building/"] canvas')).toBeInViewport()
  // @TODO figure out a way to test canvas content, not just screenshots
})

/**
 * ### Tests navigating from the home page to a GLTFViewer page, and back
 *
 * The `info` assertion is especially interesting, because it shows that the app
 * has loaded the glTF model, and correctly analyzed its meshes.
 * 
 * @param heading
 *    Displayed in an H1 element in the InfoBox, eg "Apartment".
 * @param info
 *    Displayed in a P element in the InfoBox, eg "3 Shapes · 4 Colours".
 * @param page
 *    The GLTFViewer page to test.
 * @param route
 *    Part of the URL after /cluster-viewer/, eg "apartment/".
 */
const testNavigation = async (
  heading: string,
  info: string,
  page: Page,
  route: string,
) => {
  await page.goto('./')
  const headerButton = page.locator(`nav a[href$="${route}"]`)
  await expect(headerButton).toHaveText(heading)
  await headerButton.click()
  await expect(page).toHaveURL(`./${route}`)
  await expect(page.locator('h1')).toHaveText(heading)
  await expect(page.locator('p')).toHaveText(info)
  await page.locator('nav a[href$="cluster-viewer/"] svg').click() // should bubble up to <a> element
  await expect(page).toHaveURL('./')
}

test('navigates from the home page to the Apartment page, and back', async ({ page }) => {
  await testNavigation('Apartment', '3 Shapes · 4 Colours', page, 'apartment/')
})

test('navigates from the home page to the Building page, and back', async ({ page }) => {
  await testNavigation('Building', '4 Shapes · 5 Colours', page, 'building/')
})
