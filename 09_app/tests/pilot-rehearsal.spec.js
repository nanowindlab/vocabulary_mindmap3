import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const guideAssetDir = "/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/guide_assets/20260325_mm3_in_app_guide_v1";
mkdirSync(guideAssetDir, { recursive: true });

async function pickSearchResult(page, query, matcher) {
  const search = page.getByTestId("search-input");
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

test("pilot rehearsal path: 돈 core and expression preview", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await expect(page.getByTestId("detail-definition")).toBeVisible();
  await expect(page.getByText("번역 언어 · 영어")).toBeVisible();

  await page.getByTestId("detail-tab-expressions").click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
  await expect(page.getByText("상세 연결 없음")).toHaveCount(0);
  await expect(page.getByText("예문").first()).toBeVisible();
});

test("pilot rehearsal path: 요리하다 translation selector and examples", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("filter-toggle-번역 언어").click();
  await page.getByTestId("filter-option-번역 언어-베트남어").click();

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await expect(page.getByText("번역 언어 · 베트남어")).toBeVisible();
  await page.screenshot({ path: path.join(guideAssetDir, "07_translation_selector_detail.png"), fullPage: true });

  await page.getByRole("button", { name: /^예문/ }).click();
  await expect(page.getByTestId("examples-workflow-helper")).toHaveCount(0);
  await expect(page.getByTestId("example-card-0")).toBeVisible();
});

test("pilot rehearsal path: 보다 and 버리다 semantics surfaces", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "보다", (text) => text.includes("눈으로 대상의 존재나 겉모습을 알다."));
  await expect(page.getByTestId("detail-word")).toHaveText("보다");
  await expect(page.getByTestId("detail-path")).toHaveText("주제 및 상황 > 상황 미지정 > 일반 어휘");
  await page.screenshot({ path: path.join(guideAssetDir, "05_situation_none_detail.png"), fullPage: true });
  await expect(page.getByTestId("detail-context-helper")).toHaveCount(0);

  await pickSearchResult(page, "버리다", (text) => text.includes("앞말이 나타내는 행동이 완전히 끝났음을"));
  await expect(page.getByTestId("detail-word")).toHaveText("버리다");
  await expect(page.getByTestId("detail-path")).toContainText("분류 밖 항목");
  await expect(page.getByTestId("detail-context-helper")).toContainText("문법 기능 중심 항목");
});
