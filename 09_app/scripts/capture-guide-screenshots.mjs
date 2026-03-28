import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(appRoot, "..");
const outDir = path.join(projectRoot, "08_planning", "guide_assets", "20260325_mm3_in_app_guide_v1");
const baseURL = "http://127.0.0.1:5173";

mkdirSync(outDir, { recursive: true });

async function pickSearchResult(page, query, matcher) {
  const search = page.getByTestId("search-input");
  await search.fill(query);
  const results = page.locator("[data-search-result='true']");
  await results.first().waitFor({ state: "visible" });
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

async function capture(page, name, locator = null) {
  const target = locator ?? page;
  await target.screenshot({
    path: path.join(outDir, name),
    fullPage: locator === null,
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });

await page.goto(baseURL);
await capture(page, "01_main_explorer.png");

await page.getByTestId("search-input").fill("버리다");
await page.locator("[data-search-result='true']").first().waitFor({ state: "visible" });
await capture(page, "02_search_results_helper.png");

await pickSearchResult(page, "가게", (text) => text.includes("가게"));
await page.getByRole("button", { name: /^예문/ }).click();
await capture(page, "03_examples_topik_first.png");

await pickSearchResult(page, "돈", (text) => text.includes("돈"));
await page.getByTestId("detail-tab-expressions").click();
await capture(page, "04_expression_tab.png");

await pickSearchResult(page, "보다", (text) => text.includes("눈으로 대상의 존재나 겉모습을 알다."));
await capture(page, "05_situation_none_detail.png");

await pickSearchResult(page, "버리다", (text) => text.includes("앞말이 나타내는 행동이 완전히 끝났음을"));
await capture(page, "06_unclassified_detail.png");

await page.getByTestId("filter-toggle-번역 언어").click();
await page.getByTestId("filter-option-번역 언어-베트남어").click();
await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
await capture(page, "07_translation_selector_detail.png");

await browser.close();
