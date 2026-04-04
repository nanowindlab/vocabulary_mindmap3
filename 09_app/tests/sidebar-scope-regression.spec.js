import { test, expect } from "@playwright/test";

test("sidebar keeps all scene nodes after selecting a scene", async ({ page }) => {
  await page.goto("/");

  const sceneNodes = page.locator('.sidebar-shell [data-sidebar-node-type="scene"]');
  const before = await sceneNodes.count();
  expect(before).toBeGreaterThan(1);

  await sceneNodes.first().click();
  await page.waitForTimeout(300);

  const after = await sceneNodes.count();
  expect(after).toBe(before);
});
