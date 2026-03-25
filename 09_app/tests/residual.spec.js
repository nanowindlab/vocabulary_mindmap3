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

async function readVisibleCount(page) {
  const text = await page.getByTestId("filter-visible-count").textContent();
  const match = text?.match(/([\d,]+)\s*\//);
  return match ? Number(match[1].replaceAll(",", "")) : null;
}

test("filter persistence across list and mindmap view", async ({ page }) => {
  await page.goto("/");
  await page.screenshot({ path: path.join(guideAssetDir, "01_main_explorer.png"), fullPage: true });

  const before = await readVisibleCount(page);
  await page.getByTestId("filter-toggle-난이도").click();
  await page.getByTestId("filter-option-난이도-초급").click();
  const afterFilter = await readVisibleCount(page);
  expect(afterFilter).not.toBeNull();
  expect(afterFilter).toBeLessThanOrEqual(before);

  await page.getByRole("button", { name: /리스트/ }).click();
  const listCount = await readVisibleCount(page);
  expect(listCount).toBe(afterFilter);

  await page.getByRole("button", { name: /마인드맵/ }).click();
  const mapCount = await readVisibleCount(page);
  expect(mapCount).toBe(afterFilter);
});

test("unclassified surface uses learner-facing label consistently", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("search-input")).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /분류 밖 항목/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^미분류$/ })).toHaveCount(0);

  await page.getByRole("button", { name: /분류 밖 항목/ }).click();
  await pickSearchResult(page, "버리다", (text) => text.includes("앞말이 나타내는 행동이 완전히 끝났음을"));
  await expect(page.getByTestId("detail-path")).toContainText("분류 밖 항목");
  await expect(page.getByText(/^미분류$/)).toHaveCount(0);
});

test("expression non-standalone messaging", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "밥", (text) => text.includes("밥"));
  await expect(page.getByTestId("detail-word")).toHaveText("밥");
  await page.getByTestId("detail-tab-expressions").click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
  await expect(page.getByText("현재 표제어에서 먼저 보는 표현")).toBeVisible();
  await expect(page.getByText("상세 연결 없음")).toHaveCount(0);
  await expect(page.getByText("현재 표제어 안에서 먼저 보는 표현입니다.")).toHaveCount(0);
});

test("longer learner session path", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await page.locator("[data-testid^='sense-relation-card-조리하다-']").first().click();
  await expect(page.getByTestId("detail-word")).toHaveText("조리하다");

  await page.getByTestId("filter-toggle-품사별").click();
  await page.locator("[data-testid^='filter-option-품사별-']").first().click();
  await expect(page.getByTestId("filter-visible-count")).toBeVisible();

  await page.getByRole("button", { name: /주제 및 상황/ }).click();
  await page.getByRole("button", { name: /리스트/ }).click();
  const firstListTerm = page.locator("[data-list-term-id]").first();
  await expect(firstListTerm).toBeVisible();
  await firstListTerm.click();

  await expect(page.getByTestId("detail-word")).toBeVisible();
  await expect(page.getByTestId("detail-definition")).toBeVisible();
});

test("search helper explains ordering and basic-item label", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("버리다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await page.screenshot({ path: path.join(guideAssetDir, "02_search_results_helper.png"), fullPage: true });
  await expect(page.getByTestId("search-result-helper")).toContainText("정렬: 정확히 일치 -> 앞부분 일치 -> 포함 일치 -> 짧은 단어 순");
  await expect(page.getByTestId("search-result-helper")).toContainText("기본 표제어");
  await expect(results.first()).not.toContainText("코어");
});

test("english-first translation fallback policy", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("로브스터");
  const result = page.locator("[data-search-result='true']").first();
  await expect(result).toContainText("로브스터");
  await result.click();

  await expect(page.getByTestId("detail-word")).toHaveText("로브스터");
  await expect(page.getByTestId("detail-primary-translation")).toHaveCount(1);
  await expect(page.getByTestId("detail-translation-language")).toHaveText("번역 언어 · 영어");
  await expect(page.getByTestId("detail-translation-word")).toHaveText("lobster");
  await expect(page.getByText(/전체 번역/)).toHaveCount(0);
});

test("vietnamese translation selector shows vietnamese surface", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("filter-toggle-번역 언어").click();
  await page.getByTestId("filter-option-번역 언어-베트남어").click();

  const search = page.getByTestId("search-input");
  await search.fill("요리하다");
  const result = page.locator("[data-search-result='true']").first();
  await expect(result).toContainText("베트남어: nấu ăn, nấu nướng");
  await result.click();

  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await expect(page.getByTestId("detail-translation-language")).toHaveText("번역 언어 · 베트남어");
  await expect(page.getByTestId("detail-translation-definition")).toHaveText("Chế biến thức ăn.");
});

test("examples surface removes helper chrome and keeps compact source tags", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^예문/ }).click();
  await expect(page.getByTestId("examples-workflow-helper")).toHaveCount(0);
  await expect(page.getByTestId("example-card-0")).toBeVisible();
});

test("examples prioritize TOPIK source when chunk examples are available", async ({ page }) => {
  await page.route("**/APP_READY_CHUNK_EXAMPLES_chunk-0004.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        chunk_id: "chunk-0004",
        data: {
          "17204": {
            attested_sentences: [
              { ko: "돈을 모아 두면 예상치 못한 상황에도 대비할 수 있다.", en: "Saving money helps with unexpected situations.", round: 47 },
              { ko: "돈을 함부로 쓰지 않으면 필요한 순간에 더 큰 도움이 된다.", en: "Careful spending helps when it matters.", round: 52 },
            ],
          },
        },
      }),
    });
  });

  await page.goto("/");

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await page.getByRole("button", { name: /^예문/ }).click();
  await expect(page.getByTestId("examples-workflow-helper")).toHaveCount(0);
  await expect(page.getByTestId("example-source-0")).toHaveText("TOPIK");
  await expect(page.getByTestId("example-card-0")).toContainText("돈을 모아 두면 예상치 못한 상황에도 대비할 수 있다.");
});

test("built example chunks surface topik examples before dictionary examples", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "가게", (text) => text.includes("가게"));
  await expect(page.getByTestId("detail-word")).toHaveText("가게");
  await page.getByRole("button", { name: /^예문/ }).click();
  await page.screenshot({ path: path.join(guideAssetDir, "03_examples_topik_first.png"), fullPage: true });
  await expect(page.getByTestId("example-source-0")).toHaveText("TOPIK");
  await expect(page.getByTestId("example-card-0")).toContainText("가게");
});

test("sense selection drives examples and uses dynamic numbering", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "기분", (text) => text.includes("불쾌, 유쾌"));
  await expect(page.getByTestId("detail-word")).toHaveText("기분");

  await expect(page.getByTestId("sense-option-20192_sense-001")).toContainText("1");
  await expect(page.getByTestId("sense-option-20192_sense-001")).not.toContainText("001");
  await expect(page.getByTestId("sense-option-20192_sense-002")).toContainText("2");
  await expect(page.getByTestId("sense-option-20192_sense-002")).not.toContainText("002");

  await page.getByTestId("sense-option-20192_sense-002").click();
  await expect(page.getByTestId("detail-definition")).toContainText("주변의 상황이나 분위기.");

  await page.getByRole("button", { name: /^예문/ }).click();
  await expect(page.getByTestId("example-card-0")).toContainText("연말 기분.");
  await expect(page.getByText("개운한 기분.")).toHaveCount(0);
  await expect(page.getByText("글쓴이의 기분을 고르십시오. (3점)")).toHaveCount(0);
});

test("unresolved related form stays non-jumpable and shows unavailable note", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "기분", (text) => text.includes("불쾌, 유쾌"));
  await expect(page.getByTestId("detail-word")).toHaveText("기분");

  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await expect(page.getByTestId("related-form-card-기분적-0")).toBeVisible();
  await expect(page.getByTestId("related-form-card-unresolved-기분적-0")).toContainText("현재 runtime에 연결 대상이 없습니다.");

  await page.getByTestId("related-form-card-기분적-0").click();
  await expect(page.getByTestId("detail-word")).toHaveText("기분");
});

test("search enter triggers selection and mindmap sync", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("쌀가게");
  await search.press("Enter");

  await expect(page.getByTestId("detail-word")).toHaveText("쌀가게");
  await expect(page.locator("[data-node-type='term'][data-node-id='66110']")).toBeVisible();
});

test("search enter ignores IME composition confirmation before final submit", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.focus();
  await search.dispatchEvent("compositionstart");
  await search.fill("버리다");
  await search.press("Enter");

  await expect(page.getByTestId("detail-word")).toHaveCount(0);

  await search.dispatchEvent("compositionend");
  await search.press("Enter");
  await expect(page.getByTestId("detail-word")).toHaveText("버리다");
});

test("closing detail keeps selected term synced in mindmap", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "가게", (text) => text.includes("가게"));
  await expect(page.getByTestId("detail-word")).toHaveText("가게");
  await expect(page.locator("[data-node-type='term'][data-node-id='17287']")).toBeVisible();

  await page.getByTestId("detail-close-button").click();
  await expect(page.getByTestId("detail-word")).toHaveCount(0);
  await expect(page.locator("[data-node-type='term'][data-node-id='17287']")).toBeVisible();
});

test("detail header keeps pronunciation inline and removes duplicate translation section", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await expect(page.getByTestId("detail-pronunciation")).toContainText("[돈ː]");
  await expect(page.getByTestId("detail-primary-translation")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "번역" })).toHaveCount(0);
  await expect(page.getByTestId("expression-workflow-helper")).toHaveCount(0);
});

test("exact duplicate search rows are collapsed", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("가중되다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await expect(results).toHaveCount(1);
});

test("unresolved duplicate relations are collapsed", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("물가");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await results.first().click();

  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await expect(page.locator("[data-testid^='sense-relation-card-가격-']")).toHaveCount(1);
});

test("relation labels disambiguate same surface targets", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("보다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await results.filter({ hasText: "눈으로 대상의 존재나 겉모습을 알다." }).first().click();

  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await expect(page.getByTestId("relation-related-forms")).toBeVisible();
  await expect(page.getByText(/같은 표면형으로 보여도 관계 유형 또는 대상 의미가 다르면 따로 유지합니다/)).toBeVisible();
  await expect(page.locator("[data-testid^='related-form-card-보이다-']")).toHaveCount(1);
  await expect(page.locator("[data-testid^='related-form-card-type-보이다-']")).toHaveCount(1);
  await expect(page.getByTestId("relation-related-forms")).toContainText("눈으로 대상의 존재나 겉모습을 알게 하다.");
  await expect(page.getByTestId("relation-related-forms")).toContainText("눈으로 대상의 존재나 겉모습을 알게 되다.");
});

test("relations tab does not render original-language section", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await expect(page.getByText("원어 정보")).toHaveCount(0);
});

test("duplicate related form pointers collapse to one learner-facing relation", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^의미 관계/ }).click();
  await expect(page.locator("[data-testid^='related-form-card-요리-']")).toHaveCount(1);
  await expect(page.getByTestId("relation-related-forms")).toContainText("음식을 만듦.");
  await expect(page.getByText(/☞\(가 보라\): 요리01/)).toHaveCount(0);
});

test("situation none path is reframed as general vocabulary", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("보다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await results.filter({ hasText: "눈으로 대상의 존재나 겉모습을 알다." }).first().click();

  await expect(page.getByTestId("detail-word")).toHaveText("보다");
  await expect(page.getByTestId("detail-path")).toHaveText("주제 및 상황 > 상황 미지정 > 일반 어휘");
  await expect(page.getByTestId("detail-context-helper")).toHaveCount(0);
});

test("unclassified helper splits grammatical items from uncategorized vocabulary", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("버리다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await results.filter({ hasText: "앞말이 나타내는 행동이 완전히 끝났음을" }).first().click();

  await expect(page.getByTestId("detail-word")).toHaveText("버리다");
  await expect(page.getByTestId("detail-path")).toHaveText("분류 밖 항목 > 학습난이도 · 중급 > 품사 · 보조 동사");
  await page.screenshot({ path: path.join(guideAssetDir, "06_unclassified_detail.png"), fullPage: true });
  await expect(page.getByTestId("detail-context-helper")).toContainText("문법 기능 중심 항목");
  await expect(page.getByTestId("detail-context-helper")).toContainText("장면보다 문법 기능과 형태 변화 중심으로 보면 됩니다");
});

test("expression tab separates jumpable expressions from preview-only expressions", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("두다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  const target = results.filter({ hasText: "다음: 표현층" }).first();
  await expect(target).toBeVisible();
  await target.click();
  await expect(page.getByTestId("detail-word")).toHaveText("두다");
  await page.getByTestId("detail-tab-expressions").click();
  await expect(page.getByText("바로 탐색 가능한 표현")).toBeVisible();
  await expect(page.getByText("독립 표제어로 바로 이어지는 표현입니다.")).toBeVisible();
  await expect(page.getByText("현재 표제어 안에서 먼저 보는 표현입니다.")).toHaveCount(0);
});

test("expression cards follow selected translation language when available", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("filter-toggle-번역 언어").click();
  await page.getByTestId("filter-option-번역 언어-중국어").click();

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await page.getByTestId("detail-tab-expressions").click();
  await page.screenshot({ path: path.join(guideAssetDir, "04_expression_tab.png"), fullPage: true });
  await expect(page.getByTestId("subword-translation-돈을 굴리다")).toContainText("번역 언어 · 중국어");
  await expect(page.getByTestId("subword-example-돈을 굴리다")).toContainText("예문:");
  await expect(page.getByTestId("subword-card-돈을 굴리다")).not.toContainText("의미 2개 연결");
  await expect(page.getByTestId("subword-card-돈을 굴리다")).not.toContainText("부모 표제어");
});

test("expression cards surface english when english selector is active", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await page.getByTestId("detail-tab-expressions").click();
  await expect(page.getByTestId("subword-translation-돈을 굴리다")).toContainText("번역 언어 · 영어");
  await expect(page.getByTestId("subword-translation-돈을 굴리다")).toContainText("roll the money");
});

test("expression cards hide translation when translation is off", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "돈", (text) => text.includes("돈"));
  await expect(page.getByTestId("detail-word")).toHaveText("돈");
  await page.getByRole("button", { name: /번역 ON/ }).click();
  await page.getByTestId("detail-tab-expressions").click();
  await expect(page.getByTestId("subword-translation-돈을 굴리다")).toHaveCount(0);
});

test("list surface keeps expression next-step signal", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /리스트/ }).click();
  const item = page.locator("[data-list-term-id='62683']").first();
  await item.scrollIntoViewIfNeeded();
  await expect(item).toContainText("다음: 표현층");
});

test("mindmap motion settles after category expansion", async ({ page }) => {
  await page.goto("/");

  await page.locator("[data-node-type='category']").first().evaluate((el) => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await page.locator("[data-node-type='term']").first().waitFor({ state: "visible", timeout: 10000 });

  const sample = async () => (
    page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-node-type='term']")).slice(0, 12).map((el) => {
        const id = el.getAttribute("data-node-id");
        const transform = el.getAttribute("transform") || "";
        const match = /translate\(([-\d.]+),([-\d.]+)\)/.exec(transform);
        return {
          id,
          x: match ? Number(match[1]) : null,
          y: match ? Number(match[2]) : null,
        };
      }).filter((item) => item.x !== null);
    })
  );

  const t0 = await sample();
  await page.waitForTimeout(1000);
  const t1 = await sample();
  await page.waitForTimeout(1000);
  const t2 = await sample();
  await page.waitForTimeout(1000);
  const t3 = await sample();
  await page.waitForTimeout(2000);
  const t5 = await sample();

  const lateMovement = t5.map((node) => {
    const previous = t3.find((item) => item.id === node.id);
    if (!previous) return null;
    return Math.hypot(node.x - previous.x, node.y - previous.y);
  }).filter((value) => value !== null);

  const avgLateMovement = lateMovement.reduce((sum, value) => sum + value, 0) / Math.max(lateMovement.length, 1);
  const maxLateMovement = Math.max(...lateMovement, 0);

  expect(t0.length).toBeGreaterThan(0);
  expect(avgLateMovement).toBeLessThan(2);
  expect(maxLateMovement).toBeLessThan(5);
});

test("mindmap hides fixed band legend", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Band 범위")).toHaveCount(0);
});
