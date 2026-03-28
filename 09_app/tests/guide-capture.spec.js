import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = "/Users/nanowind/Library/CloudStorage/SynologyDrive-Work/Project/AI/antigravity/vocabulary_mindmap3/08_planning/guide_assets/20260325_mm3_in_app_guide_v1";

mkdirSync(outDir, { recursive: true });

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

test("capture stable guide screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.goto("/");

  await page.screenshot({ path: path.join(outDir, "01_main_explorer.png"), fullPage: true });

  await page.getByTestId("search-input").fill("버리다");
  await expect(page.locator("[data-search-result='true']").first()).toBeVisible();
  await page.screenshot({ path: path.join(outDir, "02_search_results_helper.png"), fullPage: true });

  await pickSearchResult(page, "가게", (text) => text.includes("가게"));
  await page.getByRole("button", { name: /^예문/ }).click();
  await page.screenshot({ path: path.join(outDir, "03_examples_topik_first.png"), fullPage: true });

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await page.getByTestId("detail-tab-expressions").click();
  await page.screenshot({ path: path.join(outDir, "04_expression_tab.png"), fullPage: true });

  await pickSearchResult(page, "보다", (text) => text.includes("눈으로 대상의 존재나 겉모습을 알다."));
  await page.screenshot({ path: path.join(outDir, "05_situation_none_detail.png"), fullPage: true });

  await pickSearchResult(page, "버리다", (text) => text.includes("앞말이 나타내는 행동이 완전히 끝났음을"));
  await page.screenshot({ path: path.join(outDir, "06_unclassified_detail.png"), fullPage: true });

  await page.getByTestId("filter-toggle-번역 언어").click();
  await page.getByTestId("filter-option-번역 언어-베트남어").click();
  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await page.screenshot({ path: path.join(outDir, "07_translation_selector_detail.png"), fullPage: true });
});
