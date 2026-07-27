import { expect, test, type Locator } from '@playwright/test';

const frameworks = [
  ['react', 'React', 'ReactPatternExample.tsx'],
  ['vue', 'Vue', 'VuePatternExample.vue'],
  ['svelte', 'Svelte', 'SveltePatternExample.svelte'],
  ['solid', 'SolidJS', 'SolidPatternExample.tsx'],
  ['angular', 'Angular', 'AngularPatternExample.ts'],
  ['astro', 'Astro', 'AstroPatternExample.astro'],
] as const;

const patterns = [
  ['service-patterns', 'visit', '방문'],
  ['service-patterns', 'search', '검색'],
  ['service-patterns', 'login', '로그인'],
  ['service-patterns', 'application', '신청'],
  ['service-patterns', 'policy', '정책 정보 확인'],
  ['basic-patterns', 'personal-information', '개인 식별 정보 입력'],
  ['basic-patterns', 'help', '도움'],
  ['basic-patterns', 'consent', '동의'],
  ['basic-patterns', 'list', '목록 탐색'],
  ['basic-patterns', 'feedback', '사용자 피드백'],
  ['basic-patterns', 'detail', '상세 정보 확인'],
  ['basic-patterns', 'error', '오류'],
  ['basic-patterns', 'form', '입력 폼'],
  ['basic-patterns', 'attachment', '첨부 파일'],
  ['basic-patterns', 'filter-sort', '필터링·정렬'],
  ['basic-patterns', 'confirm', '확인'],
  ['basic-patterns', 'mobile-notification', '모바일 알림'],
  ['basic-patterns', 'mobile-settings', '모바일 설정'],
] as const;

test('renders every pattern page with six accessible framework tabs', async ({ page }) => {
  for (const [category, slug, title] of patterns) {
    await page.goto(`/${category}/${slug}/`);
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    const tablist = page.getByRole('tablist', { name: `${title} 프레임워크 선택` });
    await expect(tablist.getByRole('tab')).toHaveCount(6);
    await expect(tablist.getByRole('tab', { name: 'React' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('tabpanel').first()).toBeVisible();
  }
});

test('framework tabs support mouse and keyboard interaction without navigation', async ({
  page,
}) => {
  await page.goto('/service-patterns/search/');
  const tablist = page.getByRole('tablist', { name: '검색 프레임워크 선택' });
  const vueTab = tablist.getByRole('tab', { name: 'Vue' });
  await vueTab.click();
  await expect(vueTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tabpanel"][data-panel="vue"]')).toBeVisible();
  await vueTab.press('ArrowRight');
  await expect(tablist.getByRole('tab', { name: 'Svelte' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page).toHaveURL(/\/service-patterns\/search\/$/);
});
test('persists the selected framework across pattern pages', async ({ page }) => {
  await page.goto('/service-patterns/search/');
  await page.getByRole('tab', { name: 'SolidJS' }).click();
  await page.goto('/service-patterns/visit/');
  const tablist = page.getByRole('tablist', { name: '방문 프레임워크 선택' });
  await expect(tablist.getByRole('tab', { name: 'SolidJS' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.locator('[role="tabpanel"][data-panel="solid"]')).toBeVisible();
});

async function exercisePattern(pattern: string, panel: Locator) {
  const view = panel.locator('.pattern-preview-content');

  switch (pattern) {
    case 'visit':
      await expect(view.getByRole('link', { name: '민원 신청' })).toBeVisible();
      break;
    case 'search': {
      const search = view.getByRole('search');
      await search.getByRole('searchbox').fill('복지');
      await search.getByRole('button', { name: '검색' }).click();
      await expect(search.locator('output')).toContainText('복지');
      await expect(search.locator('output')).toContainText('검색 결과 3건');
      break;
    }
    case 'login': {
      const form = view.locator('form');
      await form.getByLabel('아이디').fill('krds-user');
      await form.getByLabel('비밀번호').fill('safe-password');
      await form.getByRole('button', { name: '로그인' }).click();
      await expect(form.getByRole('status')).toHaveText('로그인되었습니다.');
      break;
    }
    case 'application': {
      const form = view.locator('form');
      await form.getByLabel('신청인').fill('홍길동');
      await form.getByLabel('신청 내용').fill('서비스 신청 내용');
      await form.getByRole('button', { name: '신청하기' }).click();
      await expect(form.getByRole('status')).toHaveText('신청 내용이 저장되었습니다.');
      break;
    }
    case 'policy':
      await expect(view.getByRole('link', { name: '정책 자료 내려받기' })).toBeVisible();
      break;
    case 'personal-information':
      await expect(view.getByLabel('이름')).toHaveAttribute('required', '');
      await expect(view.getByLabel('이름')).toHaveAttribute('aria-describedby');
      break;
    case 'help':
      await view.getByText('신청 방법을 알고 싶어요', { exact: true }).click();
      await expect(view.getByText('신청서를 작성하고 내용을 확인한 뒤 제출하세요.')).toBeVisible();
      break;
    case 'consent':
      await view
        .locator('label')
        .filter({ hasText: '이용약관에 동의합니다.' })
        .click();
      await expect(view.getByLabel('이용약관에 동의합니다.')).toBeChecked();
      await view.getByRole('button', { name: '다음' }).click();
      await expect(view.getByRole('status')).toHaveText('동의 내용을 확인했습니다.');
      break;
    case 'list':
      await expect(view.getByRole('link', { name: '서비스 이용 안내' })).toBeVisible();
      break;
    case 'feedback':
      await view.getByLabel('만족', { exact: true }).locator('xpath=..').click();
      await expect(view.getByLabel('만족', { exact: true })).toBeChecked();
      await view.getByRole('button', { name: '의견 보내기' }).click();
      await expect(view.getByRole('status')).toHaveText('의견을 보내주셔서 감사합니다.');
      break;
    case 'detail':
      await expect(
        view.getByRole('heading', { name: '디지털 정부서비스 이용 안내', level: 3 }),
      ).toBeVisible();
      break;
    case 'error':
      await view.getByRole('button', { name: '다시 시도' }).click();
      await expect(view.getByRole('status')).toHaveText('다시 시도하는 중입니다.');
      break;
    case 'form': {
      const form = view.locator('form');
      await form.getByLabel('제목').fill('서비스 문의');
      await form.getByLabel('분류').selectOption({ label: '민원' });
      await form.getByRole('button', { name: '저장' }).click();
      await expect(form.getByRole('status')).toHaveText('입력 내용이 저장되었습니다.');
      break;
    }
    case 'attachment':
      await expect(view.getByRole('link', { name: /서비스 안내서\.pdf/ })).toHaveAttribute(
        'download',
        '',
      );
      break;
    case 'filter-sort': {
      const form = view.locator('form');
      await form.getByLabel('정렬').selectOption({ label: '관련도순' });
      await form.getByRole('button', { name: '적용' }).click();
      await expect(form.locator('output')).toHaveText('관련도순으로 정렬했습니다.');
      break;
    }
    case 'confirm': {
      const dialog = view.locator('details').filter({ hasText: '신청을 제출할까요?' });
      await dialog.getByText('제출 전 확인 열기', { exact: true }).click();
      await dialog.getByRole('button', { name: '제출' }).click();
      await expect(dialog.getByRole('status')).toHaveText('신청을 제출했습니다.');
      break;
    }
    case 'mobile-notification':
      await view.getByRole('button', { name: '알림함 열기' }).click();
      await expect(view.getByRole('status').last()).toHaveText('알림함을 열었습니다.');
      break;
    case 'mobile-settings': {
      const setting = view.getByRole('switch');
      await expect(setting).toBeChecked();
      await view.getByText('푸시 알림', { exact: true }).click();
      await expect(setting).not.toBeChecked();
      await expect(view.getByRole('status')).toHaveText('푸시 알림 꺼짐');
      break;
    }
    default:
      throw new Error(`Missing browser exercise for ${pattern}`);
  }
}

test('hydrates and exercises every framework example for every pattern', async ({ page }) => {
  test.setTimeout(180_000);

  for (const [category, slug, title] of patterns) {
    await page.goto(`/${category}/${slug}/`);
    const islands = page.locator('astro-island');
    await expect(islands).toHaveCount(5);
    for (let index = 0; index < 5; index += 1) {
      await expect(islands.nth(index)).not.toHaveAttribute('ssr', '');
    }
    const tablist = page.getByRole('tablist', { name: `${title} 프레임워크 선택` });

    for (const [framework, label, source] of frameworks) {
      await tablist.getByRole('tab', { name: label }).click();
      const panel = page.locator(`[role="tabpanel"][data-panel="${framework}"]`);
      await expect(panel).toBeVisible();
      await expect(panel.getByRole('link', { name: source })).toBeVisible();
      await expect(panel.locator('pre code')).toContainText('patternId');
      await expect(
        panel.locator(`[data-pattern="${slug}"][data-framework="${framework}"]`),
      ).toHaveCount(1);
      await exercisePattern(slug, panel);
    }
  }
});
