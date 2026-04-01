import { test, expect } from "@playwright/test";

test("list view keeps rendered row count bounded while scrolling", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("search-input")).toBeVisible();

  await page.getByRole("button", { name: "리스트" }).click();

  const virtualWindow = page.getByTestId("list-virtual-window");
  await expect(virtualWindow).toBeVisible();

  const initialTotalCount = Number(await virtualWindow.getAttribute("data-total-count"));
  const initialRenderedCount = Number(await virtualWindow.getAttribute("data-rendered-count"));
  const firstBefore = await page.locator("[data-list-term-id]").first().getAttribute("data-list-term-id");

  console.log(JSON.stringify({
    phase: "before-scroll",
    totalCount: initialTotalCount,
    renderedCount: initialRenderedCount,
    firstId: firstBefore,
  }));

  expect(initialTotalCount).toBeGreaterThan(1000);
  expect(initialRenderedCount).toBeLessThan(80);

  await page.getByTestId("list-scroll-shell").evaluate((element) => {
    element.scrollTop = 5000;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await page.waitForTimeout(200);

  const renderedCountAfter = Number(await virtualWindow.getAttribute("data-rendered-count"));
  const firstAfter = await page.locator("[data-list-term-id]").first().getAttribute("data-list-term-id");

  console.log(JSON.stringify({
    phase: "after-scroll",
    renderedCount: renderedCountAfter,
    firstId: firstAfter,
  }));

  expect(renderedCountAfter).toBeLessThan(80);
  expect(firstAfter).not.toBe(firstBefore);
});
