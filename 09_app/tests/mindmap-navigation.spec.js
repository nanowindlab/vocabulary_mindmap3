import { test, expect } from "@playwright/test";

const STUDY_TERM_ID = "23394";
const EDUCATION_SCENE_NODE_ID = "scene:의미 범주:교육";
const EDUCATION_INSTITUTION_CATEGORY_NODE_ID = "category:의미 범주:교육:교육 기관";
const STUDY_CATEGORY_NODE_ID = "category:의미 범주:교육:교수 학습 행위";

async function selectStudyTerm(page) {
  await page.goto("/");
  await expect(page.getByTestId("search-input")).toBeVisible();

  await page.getByTestId("search-input").fill("공부하다");
  const searchResult = page.locator(`[data-search-result-id="${STUDY_TERM_ID}"]`).first();
  await expect(searchResult).toBeVisible();
  await searchResult.click();

  await expect(page.locator(`[data-node-id="${STUDY_CATEGORY_NODE_ID}"]`)).toBeVisible();
  await expect(page.locator(`.sidebar-shell [data-sidebar-node-id="${STUDY_CATEGORY_NODE_ID}"]`)).toBeVisible();
}

async function expectTreeDataVisible(page) {
  await expect(page.getByText("표시할 계층 데이터가 없습니다")).toHaveCount(0);
  await expect(page.locator(`.sidebar-shell [data-sidebar-node-id="${EDUCATION_SCENE_NODE_ID}"]`)).toBeVisible();
}

async function dispatchMindmapClick(page, nodeId) {
  await expect(page.locator(`.mindmap-shell [data-node-id="${nodeId}"]`)).toBeVisible();
  await page.locator(`.mindmap-shell [data-node-id="${nodeId}"]`).evaluate((element) => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

test("mindmap category click keeps sidebar tree populated after search selection", async ({ page }) => {
  await selectStudyTerm(page);

  await dispatchMindmapClick(page, EDUCATION_INSTITUTION_CATEGORY_NODE_ID);

  await expectTreeDataVisible(page);
  await expect(page.locator(`.sidebar-shell [data-sidebar-node-id="${EDUCATION_INSTITUTION_CATEGORY_NODE_ID}"]`)).toBeVisible();
});

test("mindmap scene click keeps sidebar tree populated after search selection", async ({ page }) => {
  await selectStudyTerm(page);

  await dispatchMindmapClick(page, EDUCATION_SCENE_NODE_ID);

  await expectTreeDataVisible(page);
});

test("mindmap category collapse keeps sidebar tree populated after search selection", async ({ page }) => {
  await selectStudyTerm(page);

  await dispatchMindmapClick(page, STUDY_CATEGORY_NODE_ID);

  await expectTreeDataVisible(page);
});
