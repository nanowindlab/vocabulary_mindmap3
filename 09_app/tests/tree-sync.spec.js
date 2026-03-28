import { test, expect } from "@playwright/test";

test("mindmap scene click syncs sidebar selection", async ({ page }) => {
  await page.goto("/");

  const sceneNode = page.locator('[data-node-type="scene"]').first();
  await expect(sceneNode).toBeVisible();

  const sceneId = await sceneNode.getAttribute("data-node-id");
  expect(sceneId).toBeTruthy();

  await sceneNode.evaluate((node) => {
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const sidebarRow = page.locator(`[data-sidebar-node-id="${sceneId}"]`);
  await expect(sidebarRow).toBeVisible();
  await expect(sidebarRow).toHaveAttribute("data-sidebar-selected", "true");
});

test("mindmap category click syncs sidebar selection and expansion", async ({ page }) => {
  await page.goto("/");

  const categoryNode = page.locator('[data-node-type="category"]').first();
  await expect(categoryNode).toBeVisible();

  const categoryId = await categoryNode.getAttribute("data-node-id");
  expect(categoryId).toBeTruthy();

  await categoryNode.evaluate((node) => {
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const sidebarRow = page.locator(`[data-sidebar-node-id="${categoryId}"]`);
  await expect(sidebarRow).toBeVisible();
  await expect(sidebarRow).toHaveAttribute("data-sidebar-selected", "true");
});

test("mindmap category click after term selection re-syncs sidebar and clears detail context", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("바퀴");
  await expect(page.locator(".search-dropdown-shell")).toBeVisible();
  await page.locator("[data-search-result='true']").first().click();

  await expect(page.getByTestId("detail-word")).toBeVisible();

  const categoryNode = page.locator('[data-node-type="category"]').first();
  await expect(categoryNode).toBeVisible();
  const categoryId = await categoryNode.getAttribute("data-node-id");
  expect(categoryId).toBeTruthy();

  await categoryNode.evaluate((node) => {
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  await expect(page.getByTestId("detail-word")).toHaveCount(0);
  await expect(page.locator(`[data-sidebar-node-id="${categoryId}"]`)).toHaveAttribute("data-sidebar-selected", "true");
});
