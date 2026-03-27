import { expect, test } from "@playwright/test";

async function readVisibleCount(page) {
  const text = await page.getByTestId("filter-visible-count").textContent();
  const match = text?.match(/([\d,]+)\s*\//);
  return match ? Number(match[1].replaceAll(",", "")) : null;
}

test("search and facet wiring smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("어휘 마인드맵")).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId("search-input")).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("button", { name: /^필터/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /의미 범주/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /주제 및 상황/ })).toBeVisible();

  const search = page.getByTestId("search-input");
  await search.fill("엄수하다");

  const firstResult = page.locator("[data-search-result='true']").first();
  await expect(firstResult).toContainText("엄수하다");
  await firstResult.click();

  await expect(page.getByTestId("detail-word")).toHaveText("엄수하다");
  await expect(page.getByTestId("detail-definition")).toHaveText("시간이나 약속, 명령 등을 반드시 지키다.");
  await expect(page.getByTestId("detail-primary-translation")).toBeVisible();
  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await page.locator("[data-testid^='related-form-card-엄수-']").first().click();
  await expect(page.getByTestId("detail-word")).toHaveText("엄수");

  await search.fill("밥");
  const riceResult = page.locator("[data-search-result='true']").first();
  await expect(riceResult).toContainText("밥");
  await riceResult.click();
  await expect(page.getByTestId("detail-word")).toHaveText("밥");
  await page.getByRole("button", { name: /^활용 표현/ }).click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
  await expect(page.getByText("현재 표제어 맥락에서 먼저 보는 표현").first()).toBeVisible();
  await expect(page.locator("[data-testid^='subword-card-']").first()).toBeVisible();

  await page.getByRole("button", { name: /주제 및 상황/ }).click();
  await expect(page.getByRole("button", { name: /주제 및 상황/ })).toBeVisible();

  await expect(page.getByTestId("filter-toggle-난이도")).toBeVisible();
  await expect(page.getByTestId("filter-toggle-번역 언어")).toBeVisible();
});

test("tree and filter learner flow smoke", async ({ page }) => {
  await page.goto("/");

  const before = await readVisibleCount(page);
  expect(before).not.toBeNull();

  await page.getByTestId("filter-toggle-품사별").click();
  await page.locator("[data-testid^='filter-option-품사별-']").first().click();
  const after = await readVisibleCount(page);
  expect(after).not.toBeNull();
  expect(after).toBeLessThanOrEqual(before);

  await page.getByTestId("filter-toggle-품사별").click();
  await page.getByRole("button", { name: /의미 범주/ }).click();

  const firstScene = page.locator("[data-sidebar-node-type='scene']").first();
  await expect(firstScene).toBeVisible({ timeout: 20000 });
  await firstScene.click();

  const firstCategory = page.locator("[data-sidebar-node-type='category']").first();
  await expect(firstCategory).toBeVisible();
  await firstCategory.click({ force: true, timeout: 60000 });

  const firstTerm = page.locator("[data-sidebar-node-type='term']").first();
  await expect(firstTerm).toBeVisible();
  await firstTerm.click({ force: true, timeout: 60000 });

  await expect(page.getByTestId("detail-word")).toBeVisible();
  await expect(page.getByTestId("detail-definition")).toBeVisible();
});
