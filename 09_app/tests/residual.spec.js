import { expect, test } from "@playwright/test";

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

test("expression non-standalone messaging", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "밥", (text) => text.includes("밥"));
  await expect(page.getByTestId("detail-word")).toHaveText("밥");
  await expect(page.getByTestId("expression-workflow-helper")).toContainText("표현 활용 워크플로우");
  await page.getByTestId("expression-workflow-open").click();
  await page.getByRole("button", { name: /^표현/ }).click();
  await expect(page.getByRole("heading", { name: "표현층" })).toBeVisible();
  await expect(page.getByText("부모 어휘 맥락에서 보는 표현")).toBeVisible();
  await expect(page.getByText("상세 연결 없음").first()).toBeVisible();
});

test("longer learner session path", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^관계/ }).click();
  await page.getByText("유의어: 조리하다").click();
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

test("english-first translation fallback policy", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("로브스터");
  const result = page.locator("[data-search-result='true']").first();
  await expect(result).toContainText("로브스터");
  await result.click();

  await expect(page.getByTestId("detail-word")).toHaveText("로브스터");
  await expect(page.getByRole("heading", { name: "번역" })).toBeVisible();
  await expect(page.getByText("번역 언어 · 영어")).toBeVisible();
  await expect(page.getByText("lobster")).toBeVisible();
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
  await expect(page.getByText("번역 언어 · 베트남어")).toBeVisible();
  await expect(page.locator("[data-testid='detail-definition']").locator("..").getByText("Chế biến thức ăn.").first()).toBeVisible();
});

test("examples helper explains source and ordering", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "요리하다", (text) => text.includes("요리하다"));
  await expect(page.getByTestId("detail-word")).toHaveText("요리하다");
  await page.getByRole("button", { name: /^예문/ }).click();
  await expect(page.getByTestId("examples-workflow-helper")).toContainText("현재 선택된 의미의 사전 예문을 우선");
  await expect(page.getByTestId("examples-workflow-helper")).toContainText("구/문장");
  await expect(page.getByTestId("examples-workflow-helper")).toContainText("최대 8개");
});

test("search enter triggers selection and mindmap sync", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("쌀가게");
  await search.press("Enter");

  await expect(page.getByTestId("detail-word")).toHaveText("쌀가게");
  await expect(page.locator("[data-node-type='term'][data-node-id='66110']")).toBeVisible();
});

test("closing detail keeps selected term synced in mindmap", async ({ page }) => {
  await page.goto("/");

  await pickSearchResult(page, "가게", (text) => text.includes("가게"));
  await expect(page.getByTestId("detail-word")).toHaveText("가게");
  await expect(page.locator("[data-node-type='term'][data-node-id='17287']")).toBeVisible();

  await page.getByRole("button", { name: /닫기/ }).click();
  await expect(page.getByTestId("detail-word")).toHaveCount(0);
  await expect(page.locator("[data-node-type='term'][data-node-id='17287']")).toBeVisible();
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

  await page.getByRole("button", { name: /^관계/ }).click();
  await expect(page.getByText("참고어: 가격")).toHaveCount(1);
});

test("relation labels disambiguate same surface targets", async ({ page }) => {
  await page.goto("/");

  const search = page.getByTestId("search-input");
  await search.fill("보다");
  const results = page.locator("[data-search-result='true']");
  await expect(results.first()).toBeVisible();
  await results.filter({ hasText: "눈으로 대상의 존재나 겉모습을 알다." }).first().click();

  await page.getByRole("button", { name: /^관계/ }).click();
  await expect(page.getByText(/같은 표면형으로 보여도 관계 유형 또는 대상 의미가 다르면 따로 유지합니다/)).toBeVisible();
  await expect(page.getByText(/파생어: 보이다 · 동사 · 눈으로 대상의 존재…을 알게 하다/)).toBeVisible();
  await expect(page.getByText(/파생어: 보이다 · 동사 · 눈으로 대상의 존재…을 알게 되다/)).toBeVisible();
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
  await expect(page.getByTestId("detail-context-helper")).toContainText("상황 미지정");
  await expect(page.getByTestId("detail-context-helper")).toContainText("일반 의미로 익히는 편이 적절한 어휘");
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
  await expect(page.getByTestId("detail-context-helper")).toContainText("문법/형태 항목");
  await expect(page.getByTestId("detail-context-helper")).toContainText("문법 기능이나 형태 변화로 익히는 편이 적절합니다");
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
  await page.getByTestId("expression-workflow-open").click();
  await expect(page.getByText("바로 탐색 가능한 표현")).toBeVisible();
  await expect(page.getByText("독립 표제어로 바로 이어지는 표현입니다.")).toBeVisible();
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
