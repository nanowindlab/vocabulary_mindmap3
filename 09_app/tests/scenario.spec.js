import { expect, test } from "@playwright/test";

async function pickSearchResult(page, query, matcher) {
  const search = page.getByTestId("search-input");
  await expect(search).toBeVisible({ timeout: 10000 });
  await search.fill(query);
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  const count = await results.count();
  for (let i = 0; i < count; i += 1) {
    const item = results.nth(i);
    const text = await item.textContent();
    if (matcher(text || "")) {
      await item.click();
      return;
    }
  }
  throw new Error(`No matching search result for query: ${query}`);
}

test("word-first + expression-assist scenario", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "두다", (text) => text.includes("표현"));
  await expect(page.getByTestId("detail-word")).toHaveText("두다");
  await page.getByRole("button", { name: /^표현/ }).click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();

  await page.getByTestId("subword-card-두고 보다").click();
  await expect(page.getByTestId("detail-word")).toHaveText("두고 보다");
  await expect(page.getByTestId("detail-definition")).toContainText("일정한 기간 동안");
});

test("situation-first scenario", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /주제 및 상황/ }).click();
  await expect(page.getByRole("button", { name: /주제 및 상황/ })).toBeVisible();
  await page.getByRole("button", { name: /리스트/ }).click();
  const firstListTerm = page.locator("[data-list-term-id]").first();
  await expect(firstListTerm).toBeVisible();
  await firstListTerm.click();

  await expect(page.getByTestId("detail-word")).toBeVisible();
  await expect(page.getByTestId("detail-definition")).toBeVisible();
});

test("filter-first scenario", async ({ page }) => {
  await page.goto("/");

  const beforeText = await page.getByTestId("filter-visible-count").textContent();
  await page.getByTestId("filter-toggle-난이도").click();
  await page.locator("[data-testid='filter-option-난이도-초급']").click();
  const afterText = await page.getByTestId("filter-visible-count").textContent();

  const before = Number((beforeText?.match(/([\d,]+)\s*\//)?.[1] || "0").replaceAll(",", ""));
  const after = Number((afterText?.match(/([\d,]+)\s*\//)?.[1] || "0").replaceAll(",", ""));
  expect(after).toBeLessThanOrEqual(before);

  await pickSearchResult(page, "밥", (text) => text.includes("밥"));
  await expect(page.getByTestId("detail-word")).toHaveText("밥");
  await page.getByRole("button", { name: /^표현/ }).click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
});
