import { test, expect } from "@playwright/test";

async function expectTabReady(page) {
  await expect(page.getByText("데이터를 준비 중입니다")).toHaveCount(0);
  await expect(page.locator(".sidebar-shell [data-sidebar-node-id]")).not.toHaveCount(0);
}

test("situation tab finishes loading and renders sidebar nodes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "주제 및 상황" }).click();
  await expectTabReady(page);
});
