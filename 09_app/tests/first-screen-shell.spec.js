import { test, expect } from "@playwright/test";

test("first screen renders meaning tree shell without empty state", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("search-input")).toBeVisible();
  await expect(page.getByText("표시할 계층 데이터가 없습니다")).toHaveCount(0);
  await expect(page.locator('.sidebar-shell [data-sidebar-node-id="scene:의미 범주:교육"]')).toBeVisible();
  await expect(page.getByText("필터와 번역 언어")).toHaveCount(0);
});
