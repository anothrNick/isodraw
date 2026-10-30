import { expect, test, type Page } from '@playwright/test';

/**
 * Smoke tests for the demo site: the editor, view mode and published docs,
 * driven the way a person would use them.
 */

const DIAGRAM_KEY = 'isodraw-demo:diagram';

/** Fail the test on uncaught errors and console errors (icon images from the CDN may fail offline). */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

const canvas = (page: Page) => page.locator('.isd-canvas');
const status = (page: Page) => page.locator('.isd-status');
const storedDiagram = (page: Page) =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), DIAGRAM_KEY) as Promise<{
    view?: string;
    nodes: { id: string; x: number; y: number }[];
  }>;

let errors: string[];

test.beforeEach(async ({ page }) => {
  errors = watchErrors(page);
  await page.goto('/');
  await expect(canvas(page)).toBeVisible();
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('opens with the sample diagram', async ({ page }) => {
  await expect(canvas(page).locator('[data-node-id]')).toHaveCount(15);
  // Animated connections draw an extra overlay with the same id.
  const edgeIds = await canvas(page).locator('[data-edge-id]').evaluateAll((els) => new Set(els.map((e) => e.getAttribute('data-edge-id'))).size);
  expect(edgeIds).toBe(9);
  await expect(status(page)).toContainText('15 nodes · 9 connections');
});

test('loads every example', async ({ page }) => {
  const select = page.getByLabel('Load an example diagram');
  const options = await select.locator('option:not([disabled])').all();
  expect(options.length).toBeGreaterThanOrEqual(4);
  for (const option of options) {
    const value = (await option.getAttribute('value'))!;
    await select.selectOption(value);
    const nodes = await canvas(page).locator('[data-node-id]').count();
    expect(nodes, value).toBeGreaterThan(5);
    await expect(status(page)).toContainText(`${nodes} nodes`);
  }
});

test('the 2D / 2.5D setting is saved with the diagram and survives undo', async ({ page }) => {
  await expect(status(page)).toContainText('2.5D');

  // Add a block, switch to flat, then undo the block.
  await page.locator('.isd-tile', { hasText: 'Block' }).click();
  await expect(status(page)).toContainText('16 nodes');
  await page.getByRole('button', { name: 'Flat view (Tab)' }).click();
  await expect(status(page)).toContainText('Flat');
  await page.getByRole('button', { name: 'Undo (⌘Z)' }).click();
  await expect(status(page)).toContainText('Flat · 15 nodes');
  await expect.poll(async () => (await storedDiagram(page)).view).toBe('2d');

  // The view is part of the diagram, so View and Published use it too.
  await page.getByRole('radio', { name: 'View' }).click();
  await expect(status(page)).toContainText('Flat');
  await page.reload();
  await expect(status(page)).toContainText('Flat');
});

test('dragging a node moves it and undo puts it back', async ({ page }) => {
  const box = (await canvas(page).locator('[data-node-id="rds"] path, [data-node-id="rds"] polygon').first().boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2 + 60, { steps: 8 });
  await page.mouse.up();

  // The demo saves to localStorage after each render, so wait for it.
  const rds = async () => {
    const n = (await storedDiagram(page)).nodes.find((x) => x.id === 'rds')!;
    return { x: n.x, y: n.y };
  };
  await expect.poll(rds).not.toEqual({ x: 17, y: 2 });

  await page.getByRole('button', { name: 'Undo (⌘Z)' }).click();
  await expect.poll(rds).toEqual({ x: 17, y: 2 });
});

test('view mode is read-only', async ({ page }) => {
  await page.getByRole('radio', { name: 'View' }).click();
  await expect(page.getByRole('button', { name: 'Undo (⌘Z)' })).toHaveCount(0);
  await expect(page.locator('.isd-palette')).toHaveCount(0);
  await expect(canvas(page).locator('[data-node-id]')).toHaveCount(15);
});

test('the theme toggle switches and remembers dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.isd-root')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('.isd-root')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('.isd-root')).toHaveAttribute('data-theme', 'light');
});

test('hovering an @ mention in the docs outlines the item on the canvas', async ({ page }) => {
  await page.getByRole('button', { name: 'Show docs (D)' }).click();
  const mention = page.locator('.isd-docs .isd-mention').first();
  await expect(mention).toBeVisible();
  await expect(canvas(page).locator('.isd-target-highlight')).toHaveCount(0);
  await mention.hover();
  await expect(canvas(page).locator('.isd-target-highlight')).toHaveCount(1);
  await page.locator('.isd-docs-head').hover();
  await expect(canvas(page).locator('.isd-target-highlight')).toHaveCount(0);
});

test('side panels resize by dragging and reset on double-click', async ({ page }) => {
  const palette = page.locator('.isd-palette');
  const handle = page.getByLabel('Resize shapes panel');
  const start = (await palette.boundingBox())!.width;
  const h = (await handle.boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2 + 120, h.y + h.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => (await palette.boundingBox())!.width).toBeGreaterThan(start + 100);

  // Never narrower than the default.
  const h2 = (await handle.boundingBox())!;
  await page.mouse.move(h2.x + h2.width / 2, h2.y + h2.height / 2);
  await page.mouse.down();
  await page.mouse.move(h2.x - 400, h2.y + h2.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => Math.round((await palette.boundingBox())!.width)).toBe(Math.round(start));

  await page.mouse.move(h.x + h.width / 2 + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2 + 160, h.y + h.height / 2, { steps: 6 });
  await page.mouse.up();
  // The handle is a zero-width line with a wider invisible hit area, so click by position.
  const h3 = (await handle.boundingBox())!;
  await page.mouse.dblclick(h3.x + h3.width / 2, h3.y + h3.height / 2);
  await expect.poll(async () => Math.round((await palette.boundingBox())!.width)).toBe(Math.round(start));
});

test.describe('cloud icon tabs', () => {
  // Serve the icon sets locally so the tests don't depend on the CDN.
  test.beforeEach(async ({ page }) => {
    await page.route('**/@f5-sales-demo/icons-gcp@*/icons.json', (r) =>
      r.fulfill({ json: { width: 24, height: 24, icons: { 'cloud-run': { body: '<rect width="24" height="24"/>' }, 'cloud-sql': { body: '<circle r="9" cx="12" cy="12"/>' } } } }),
    );
    await page.route('**/gcp-icons@*/dist/icons-metadata.json', (r) => r.fulfill({ json: [{ key: 'bigquery-512-color', source: 'product' }] }));
    await page.route('**/@squinch/pack-azure@*/pack.json', (r) =>
      r.fulfill({ json: { icons: { vm: { file: 'vm.svg', title: 'Virtual Machine', category: 'Compute' } } } }),
    );
    await page.route(/\.(svg)$/, (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>' }));
  });

  test('load on first open and place an icon on the canvas', async ({ page }) => {
    const tiles = page.locator('.isd-palette .isd-icon-tile');
    await page.getByRole('tab', { name: 'GCP' }).click();
    await expect(tiles).toHaveCount(3);
    await expect(tiles.first()).toHaveAttribute('title', 'BigQuery');

    await page.getByRole('tab', { name: 'Azure' }).click();
    await expect(tiles).toHaveCount(1);
    await tiles.first().click();
    await expect(status(page)).toContainText('16 nodes');
  });

  test('show an error with a retry when loading fails', async ({ page }) => {
    let fail = true;
    await page.route('**/@squinch/pack-azure@*/pack.json', (r) =>
      fail ? r.fulfill({ status: 503, body: 'down' }) : r.fulfill({ json: { icons: { vm: { file: 'vm.svg', title: 'Virtual Machine', category: 'Compute' } } } }),
    );
    // The failed fetch logs a console error; that's expected here.
    page.removeAllListeners('console');

    await page.getByRole('tab', { name: 'Azure' }).click();
    await expect(page.getByText("Couldn't load Azure icons")).toBeVisible();
    fail = false;
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.locator('.isd-palette .isd-icon-tile')).toHaveCount(1);
  });
});

test.describe('published docs', () => {
  test('have a page per component, linked by URL', async ({ page }) => {
    await page.getByRole('radio', { name: 'Published' }).click();
    const toc = page.getByRole('complementary', { name: 'Table of contents' });
    await expect(page.locator('.isd-pub-page h1')).toBeVisible();

    await toc.getByRole('link', { name: 'RDS primary' }).click();
    await expect(page).toHaveURL(/#\/node\/rds$/);
    await expect(page.locator('.isd-pub-page h1')).toHaveText('RDS primary');
    await expect(page.locator('.isd-pub-figure.is-component svg')).toBeVisible();

    // A shared link opens straight into that page.
    await page.reload();
    await expect(page.locator('.isd-pub-page h1')).toHaveText('RDS primary');
    await toc.getByRole('link', { name: 'Overview' }).click();
    await expect(page).toHaveURL(/#\/$/);
  });

  test('outline an item when hovering its mention', async ({ page }) => {
    await page.getByRole('radio', { name: 'Published' }).click();
    const mention = page.locator('.isd-pub-doc .isd-mention').first();
    await expect(mention).toBeVisible();
    await mention.hover();
    await expect(page.locator('.isd-pub-figure .isd-target-highlight').first()).toBeVisible();
  });
});

test.describe('detail diagrams', () => {
  const levels = (page: Page) => page.locator('.isd-levels');
  const center = async (page: Page, selector: string) => {
    const b = (await canvas(page).locator(selector).first().boundingBox())!;
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };

  test.beforeEach(async ({ page }) => {
    await page.getByLabel('Load an example diagram').selectOption('serverless');
    await expect(status(page)).toContainText('12 nodes');
  });

  test('double-click goes into a component; Esc, crumbs and Back come out', async ({ page }) => {
    await expect(canvas(page).locator('[data-detail-badge="orders"]')).toBeVisible();
    const p = await center(page, '[data-node-id="orders"]');
    await page.mouse.dblclick(p.x, p.y);
    await expect(levels(page)).toContainText('Diagram›orders-api');
    await expect(status(page)).toContainText('6 nodes · 5 connections');
    expect(new URL(page.url()).hash).toBe('#in/orders');

    // Esc with nothing selected goes up and selects the component you came from.
    await page.keyboard.press('Escape');
    await expect(levels(page)).toHaveCount(0);
    await expect(status(page)).toContainText('12 nodes');
    await expect(page.locator('.isd-inspector input').first()).toHaveValue('orders-api');

    // Enter on the selected component goes back in; the browser's Back button comes out.
    await page.keyboard.press('Enter');
    await expect(levels(page)).toBeVisible();
    await page.goBack();
    await expect(levels(page)).toHaveCount(0);
    await page.goForward();
    await expect(status(page)).toContainText('6 nodes');
    await levels(page).getByRole('button', { name: 'Diagram' }).click();
    await expect(levels(page)).toHaveCount(0);
  });

  test("the docs show the component's doc as the overview inside it", async ({ page }) => {
    await page.getByRole('button', { name: 'Show docs (D)' }).click();
    await canvas(page).locator('[data-detail-badge="orders"]').click();
    const docs = page.locator('.isd-docs');
    await expect(docs.locator('.isd-docs-title h2')).toHaveText('orders-api');
    await expect(docs.locator('.isd-docs-title small')).toContainText('Overview · Image in Serverless backend');
    // Already inside: the doc shows the detail diagram without an Open button.
    await expect(docs.locator('.isd-embed.is-detail')).toContainText('Detail diagram · 6 items');
    await expect(docs.locator('.isd-docs-detail')).toHaveCount(0);
    // The crumb goes up to the top diagram's overview.
    await docs.locator('.isd-docs-crumbs').getByRole('button', { name: 'Diagram' }).click();
    await expect(levels(page)).toHaveCount(0);
    await expect(docs.locator('.isd-docs-title h2')).toHaveText('Diagram overview');
  });

  test('add one from the inspector; undo goes back to where each change happened', async ({ page }) => {
    const p = await center(page, '[data-node-id="cognito"]');
    await page.mouse.click(p.x, p.y);
    await page.getByRole('button', { name: 'Add detail diagram' }).click();
    await expect(levels(page)).toContainText('Diagram›Cognito');
    await expect(page.locator('.isd-level-empty')).toBeVisible();
    await page.getByRole('button', { name: /^Cylinder/ }).click();
    await expect(status(page)).toContainText('1 nodes');

    await page.keyboard.press('Escape'); // deselect
    await page.keyboard.press('Escape'); // up
    await expect(levels(page)).toHaveCount(0);
    await expect(canvas(page).locator('[data-detail-badge="cognito"]')).toBeVisible();

    const undo = page.getByRole('button', { name: 'Undo (⌘Z)' });
    await undo.click();
    await expect(levels(page)).toContainText('Cognito');
    await expect(status(page)).toContainText('0 nodes');
    await undo.click();
    await expect(levels(page)).toHaveCount(0);
    await expect(canvas(page).locator('[data-detail-badge="cognito"]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Redo (⇧⌘Z)' }).click();
    await expect(canvas(page).locator('[data-detail-badge="cognito"]')).toBeVisible();
  });

  test('published pages show a component’s detail diagram', async ({ page }) => {
    await page.getByRole('radio', { name: 'Published' }).click();
    await page.locator('.isd-pub-toc').getByRole('link', { name: 'orders-api' }).click();
    await expect(page.getByRole('img', { name: 'Detail diagram' })).toBeVisible();
    await expect(page.locator('.isd-pub-doc .isd-embed.is-detail')).toContainText('Detail diagram · 6 items');
  });
});

test.describe('Terraform import', () => {
  const openInput = (page: Page) => page.locator('input[type="file"][accept*=".tfstate"]');

  test('opens a state file as a laid-out diagram with docs', async ({ page }) => {
    await page.getByRole('button', { name: 'New blank' }).click();
    await expect(status(page)).toContainText('0 nodes');

    await openInput(page).setInputFiles('src/demo/terraform/shop.tfstate.json');
    await expect(page.locator('.isd-toast')).toContainText('Imported 17 components and 14 connections from 49 Terraform resources');
    await expect(status(page)).toContainText('20 nodes · 14 connections');
    await expect(canvas(page).locator('[data-node-id="aws_ecs_service.api"]')).toBeVisible();

    // The import is one undoable step.
    await page.getByRole('button', { name: 'Undo (⌘Z)' }).click();
    await expect(status(page)).toContainText('0 nodes');
    await page.getByRole('button', { name: 'Redo (⇧⌘Z)' }).click();

    await page.getByRole('radio', { name: 'Published' }).click();
    await page.getByRole('complementary', { name: 'Table of contents' }).getByRole('link', { name: 'shop-fulfil' }).click();
    await expect(page.locator('.isd-pub-doc')).toContainText('Lambda function, managed by Terraform as aws_lambda_function.fulfil.');
    await expect(page.locator('.isd-pub-doc')).toContainText('nodejs20.x');
  });

  test('reports files it cannot read', async ({ page }) => {
    await openInput(page).setInputFiles({ name: 'broken.tfstate', mimeType: 'application/json', buffer: Buffer.from('{ not json') });
    await expect(page.locator('.isd-toast')).toHaveText('broken.tfstate is not valid JSON');
    await openInput(page).setInputFiles({ name: 'empty.tfstate', mimeType: 'application/json', buffer: Buffer.from('{"version":4,"resources":[]}') });
    await expect(page.locator('.isd-toast')).toHaveText('No managed resources found in this Terraform file');
    await expect(status(page)).toContainText('15 nodes');
  });
});
