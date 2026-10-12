import { expect, test, type Page } from '@playwright/test'

// End-to-end checks that every demo control actually works (no fake UI).

async function fresh(page: Page, path: string) {
  await page.goto(path)
  await page.evaluate(() => localStorage.clear())
  await page.goto(path, { waitUntil: 'networkidle' })
}

test.describe('marketing', () => {
  test('primary CTA opens the guided tour, which walks the dashboard', async ({ page }) => {
    await fresh(page, '/')
    await page.getByRole('link', { name: /Explore Live Demo/ }).first().click()
    await expect(page).toHaveURL(/\/app\/overview\?tour=1/)
    const tour = page.getByRole('region', { name: 'Welcome to the Nexa demo' })
    await expect(tour).toBeVisible()
    await tour.getByRole('button', { name: 'Next' }).click()
    await expect(page).toHaveURL(/\/app\/projects\?tour=2/)
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()
  })

  test('secondary CTA opens the dashboard', async ({ page }) => {
    await fresh(page, '/')
    await page.getByRole('link', { name: 'View Dashboard' }).first().click()
    await expect(page).toHaveURL(/\/app\/overview$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Maya')
  })

  test('sample automation run completes and analytics period switches', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'interaction logic is viewport independent')
    await fresh(page, '/')
    await page.getByRole('button', { name: 'Run sample flow' }).click()
    await expect(page.getByText(/flow completed/)).toBeVisible({ timeout: 8000 })

    const panel = page.locator('#mk-period-panel')
    const before = await panel.locator('dd').first().textContent()
    await page.getByRole('tab', { name: '12 months' }).click()
    await expect(page.getByRole('tab', { name: '12 months' })).toHaveAttribute('aria-selected', 'true')
    await expect(panel.locator('dd').first()).not.toHaveText(before ?? '')
  })
})

test.describe('dashboard', () => {
  test.skip(({ viewport }) => viewport?.width === 820, 'tablet is covered by desktop + mobile')

  test('task status change persists across reloads and triggers the automation', async ({ page }) => {
    await fresh(page, '/app/tasks')
    await page.getByRole('tab', { name: 'List' }).click()
    const select = page.getByRole('combobox', { name: 'Status of “Storefront product page wireframes”' })
    await select.selectOption('review')
    await expect(page.getByRole('status')).toContainText('Moved to Review')
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('tab', { name: 'List' }).click()
    await expect(page.getByRole('combobox', { name: 'Status of “Storefront product page wireframes”' })).toHaveValue('review')
    await page.goto('/app/overview', { waitUntil: 'networkidle' })
    await expect(page.getByText(/notify approver ran for “Storefront product page wireframes”/)).toBeVisible()
  })

  test('filters narrow the task list', async ({ page }) => {
    await fresh(page, '/app/tasks')
    await page.getByRole('tab', { name: 'List' }).click()
    await page.getByRole('combobox', { name: 'Filter by priority' }).selectOption('urgent')
    await expect(page.getByRole('tabpanel').getByRole('listitem')).toHaveCount(2)
    await page.getByRole('button', { name: 'Clear' }).click()
    await page.getByRole('searchbox', { name: 'Search tasks' }).fill('logo')
    await expect(page.getByRole('tabpanel').getByRole('listitem')).toHaveCount(1)
  })

  test('new task dialog validates and creates a task', async ({ page }) => {
    await fresh(page, '/app/tasks')
    await page.getByRole('button', { name: 'New task' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'New task' })
    await dialog.getByRole('button', { name: 'Create task' }).click()
    await expect(dialog.getByRole('alert')).toContainText('at least 3 characters')
    await dialog.getByLabel('Title').fill('Prepare launch checklist')
    await dialog.getByRole('button', { name: 'Create task' }).click()
    await expect(dialog).toBeHidden()
    await page.getByRole('tab', { name: 'List' }).click()
    await expect(page.getByRole('tabpanel').getByText('Prepare launch checklist')).toBeVisible()
  })

  test('project selection updates the detail panel', async ({ page }) => {
    await fresh(page, '/app/projects')
    await page.getByRole('button', { name: /Orbit mobile app/ }).click()
    await expect(page).toHaveURL(/p=orbit/)
    await expect(page.getByRole('heading', { level: 2, name: 'Orbit mobile app' })).toBeVisible()
    await page.getByRole('tab', { name: /Blocked/ }).click()
    await expect(page.getByRole('tabpanel').getByRole('button')).toHaveCount(1)
  })

  test('automation toggle and simulated test run', async ({ page }) => {
    await fresh(page, '/app/automations')
    const sw = page.getByRole('switch', { name: /^Overdue task triage/ })
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await sw.click()
    await expect(sw).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('button', { name: 'Open flow: Weekly client status digest' }).click()
    const dialog = page.getByRole('dialog', { name: 'Weekly client status digest' })
    await dialog.getByRole('button', { name: 'Run test' }).click()
    await expect(page.getByRole('status')).toContainText('Test run completed', { timeout: 8000 })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('analytics period and data table', async ({ page }) => {
    await fresh(page, '/app/analytics')
    await page.getByRole('tab', { name: '7 days' }).click()
    await expect(page.getByRole('heading', { name: 'Throughput · 7 days' })).toBeVisible()
    await page.getByRole('button', { name: /Show data table/ }).click()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(7)
  })

  test('integration connector toggles (simulated)', async ({ page }) => {
    await fresh(page, '/app/integrations')
    const sw = page.getByRole('switch', { name: 'CRM connector' })
    await sw.click()
    await expect(sw).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('tab', { name: /Connected/ }).click()
    await expect(page.getByRole('heading', { name: 'CRM' })).toBeVisible()
  })

  test('assistant answers from live data and can enable a flow', async ({ page }) => {
    await fresh(page, '/app/assistant')
    await page.getByRole('button', { name: 'Where can automation save us time?' }).click()
    const enable = page.getByRole('button', { name: 'Enable Overdue task triage' })
    await expect(enable).toBeVisible()
    await enable.click()
    await expect(page.getByRole('button', { name: 'Enabled' })).toBeDisabled()
    await page.getByLabel('Ask the assistant').fill('Which projects are at risk?')
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByRole('link', { name: 'Open Orbit mobile app' })).toBeVisible()
  })

  test('command palette jumps to a project', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'keyboard shortcut is a desktop affordance')
    await fresh(page, '/app/overview')
    await page.keyboard.press('ControlOrMeta+k')
    const input = page.getByRole('combobox', { name: /Search projects/ })
    await expect(input).toBeFocused()
    await input.fill('fieldnote')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/app\/projects\?p=fieldnote/)
  })

  test('mobile navigation drawer and bottom tabs', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'mobile-only navigation')
    await fresh(page, '/app/overview')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    const drawer = page.getByRole('dialog', { name: 'Navigation' })
    await drawer.getByRole('link', { name: 'Integrations' }).click()
    await expect(page).toHaveURL(/\/app\/integrations/)
    await expect(drawer).toBeHidden()
    await page.getByRole('navigation', { name: 'Quick navigation' }).getByRole('link', { name: 'Flows' }).click()
    await expect(page).toHaveURL(/\/app\/automations/)
  })

  test('reset restores demo data', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'once')
    await fresh(page, '/app/automations')
    await page.getByRole('switch', { name: /^Overdue task triage/ }).click()
    await page.getByRole('button', { name: 'Reset demo data' }).click()
    await page.getByRole('dialog', { name: 'Reset demo data?' }).getByRole('button', { name: 'Reset demo' }).click()
    await expect(page.getByRole('switch', { name: /^Overdue task triage/ })).toHaveAttribute('aria-checked', 'false')
  })
})
