import { expect, test } from "@playwright/test";

async function readVisibleCount(page) {
  const text = await page.getByTestId("filter-visible-count").textContent();
  const match = text?.match(/([\d,]+)\s*\//);
  return match ? Number(match[1].replaceAll(",", "")) : null;
}

test("search and facet wiring smoke", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("어휘 마인드맵")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("search-input")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("필터")).toBeVisible();
  await expect(page.getByRole("button", { name: /의미 범주/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /주제 및 상황/ })).toBeVisible();

  const search = page.getByTestId("search-input");
  await search.fill("요리하다");

  const firstResult = page.locator("[data-search-result='true']").first();
  await expect(firstResult).toContainText("요리하다");
  await firstResult.click();

  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await expect(page.getByTestId("detail-definition")).toHaveText("음식을 만들다.");
  await expect(page.getByRole("heading", { name: "번역" })).toBeVisible();
  await page.getByRole("button", { name: /^관계/ }).click();
  await page.getByText("유의어: 조리하다").click();
  await expect(page.getByTestId("detail-word")).toHaveText("조리하다");

  await search.fill("밥");
  const riceResult = page.locator("[data-search-result='true']").first();
  await expect(riceResult).toContainText("밥");
  await riceResult.click();
  await expect(page.getByTestId("detail-word")).toHaveText("밥");
  await page.getByRole("button", { name: /^표현/ }).click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
  await expect(page.getByText("부모 표제어 · 밥").first()).toBeVisible();

  await page.getByRole("button", { name: /주제 및 상황/ }).click();
  await expect(page.getByRole("button", { name: /주제 및 상황/ })).toBeVisible();

  await expect(page.getByText("난이도")).toBeVisible();
  await expect(page.getByText("번역 언어")).toBeVisible();
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

  const firstScene = page.locator("[data-sidebar-node-type='scene']").first();
  await expect(firstScene).toBeVisible();
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
