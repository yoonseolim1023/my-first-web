import { test, expect } from '@playwright/test';

/**
 * Chapter 13: AI Outcome Verification - E2E Testing
 * Mission: Automate core user scenarios (Login -> CRUD -> Protection)
 */

test.describe('Authentication & CRUD Flow', () => {
  const TEST_EMAIL = process.env.TEST_EMAIL;
  const TEST_PASSWORD = process.env.TEST_PASSWORD;

  test.beforeEach(async ({ page }) => {
    // Ensure we have test credentials
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      console.warn('TEST_EMAIL or TEST_PASSWORD not set in environment variables.');
    }
  });

  test('Happy Path: Login and Create Post', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Test credentials missing');

    // 1. /login에서 로그인
    await page.goto('/login');
    await page.getByLabel('이메일').fill(TEST_EMAIL!);
    await page.getByLabel('비밀번호').fill(TEST_PASSWORD!);
    await page.getByRole('button', { name: '로그인' }).click();

    // /posts로 이동 확인
    await expect(page).toHaveURL(/\/posts/);

    // 2. /posts/new에서 제목/내용 입력 후 저장
    await page.goto('/posts/new');
    const title = `E2E Test Post - ${Date.now()}`;
    const content = 'This post was created by an automated E2E test.';
    
    await page.getByLabel('제목').fill(title);
    await page.getByLabel('내용').fill(content);
    await page.getByRole('button', { name: '저장' }).click();

    // 3. /posts 목록에서 새 글 제목 확인
    await expect(page).toHaveURL(/\/posts/);
    await expect(page.getByText(title)).toBeVisible();
  });

  test('Denial Path: Redirect unauthenticated user from /posts/new', async ({ page }) => {
    // 1. 로그아웃 상태 확인 (세션 초기화 상태로 시작됨)
    // 2. /posts/new 접속 시도
    await page.goto('/posts/new');

    // 3. /login으로 리다이렉트되는지 확인 (middleware 동작 검증)
    await expect(page).toHaveURL(/\/login/);
  });
});
