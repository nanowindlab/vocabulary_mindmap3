import { expect, test } from "@playwright/test";

const signedIn = { configured: true, user: {
  id: "google-account-123", email: "teacher@school.example",
} };

test("signed-out visitor is sent to the Google login page before the app loads", async ({ page }) => {
  await page.route("**/api/auth/session", (route) => route.fulfill({ json: { configured: true, user: null } }));
  await page.goto("/");
  await expect(page).toHaveURL(/\/login\.html$/);
  await expect(page.getByRole("link", { name: "Google 계정으로 로그인" })).toBeVisible();
  await expect(page.getByText(/Google 계정에 연결된 확인된 이메일 주소로 로그인할 수 있습니다/)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "어휘 / 뜻 / 번역 검색" })).toHaveCount(0);
  await page.getByRole("link", { name: "앱 소개" }).click();
  await expect(page).toHaveURL(/\/about\.html$/);
  await expect(page.getByRole("heading", { name: "한국어 어휘를 연결해서 살펴보세요" })).toBeVisible();
  await page.getByRole("link", { name: "개인정보처리방침" }).first().click();
  await expect(page).toHaveURL(/\/privacy\.html$/);
  await expect(page.getByRole("heading", { name: "개인정보처리방침" })).toBeVisible();
});

test("signed-in visitor sees their account and can log out", async ({ page }) => {
  let active = true;
  await page.route("**/api/auth/session", (route) => route.fulfill({
    json: active ? signedIn : { configured: true, user: null },
  }));
  await page.route("**/api/auth/logout", (route) => {
    active = false;
    return route.fulfill({ json: { user: null } });
  });
  await page.goto("/");
  await expect(page.getByText("teacher@school.example", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page).toHaveURL(/\/login\.html$/);
  await expect(page.getByRole("link", { name: "Google 계정으로 로그인" })).toBeVisible();
});
