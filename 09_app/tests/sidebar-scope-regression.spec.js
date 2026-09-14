import { test, expect } from "@playwright/test";

test("sidebar keeps all scene nodes after selecting a scene", async ({ page }) => {
  await page.goto("/");

  const sceneNodes = page.locator('.sidebar-shell [data-sidebar-node-type="scene"]');
  let before = 0;
  await expect.poll(async () => {
    before = await sceneNodes.count();
    return before;
  }).toBeGreaterThan(1);

  await sceneNodes.first().click();
  await expect.poll(() => sceneNodes.count()).toBe(before);
});
