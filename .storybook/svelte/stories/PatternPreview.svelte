<script lang="ts">
  import { Accordion, Breadcrumb, Button, Checkbox, CriticalAlerts, Disclosure, Link, Modal, Pagination, Radio, Switch, Textarea, TextInput } from '@krds-community/svelte';
  let { patternId }: { patternId: string } = $props();
  const accordionItems = [{ id: 'help-one', title: '신청 전에 무엇을 확인하나요?', content: '필수 서류와 처리 기간을 확인하세요.' }];
  const breadcrumbs = [{ id: 'home', label: '홈', href: '#' }, { id: 'current', label: '현재 화면', current: true }];
  let open = $state(true);
  let checked = $state(false);
  let page = $state(1);
  let rating = $state('good');
  let text = $state('');
  let notifications = $state(true);
  const prevent = (event: SubmitEvent) => event.preventDefault();
</script>

<main class="pattern-preview">
{#if patternId === 'visit'}<Breadcrumb items={breadcrumbs} /><h2>방문 안내</h2><p>운영 시간과 방문 절차를 확인하세요.</p><Button>방문 예약</Button>
{:else if patternId === 'search'}<form class="krds-form-group" onsubmit={prevent}><TextInput name="query" label="검색어" bind:value={text} /><Button type="submit">검색</Button></form>
{:else if patternId === 'login'}<form class="krds-form-group" onsubmit={prevent}><TextInput name="userId" label="아이디" /><TextInput name="password" type="password" label="비밀번호" /><Checkbox name="remember" label="아이디 저장" bind:checked /><Button type="submit">로그인</Button><Link href="#help">로그인 도움말</Link></form>
{:else if patternId === 'application'}<form class="krds-form-group" onsubmit={prevent}><TextInput name="applicant" label="신청인" /><Textarea name="purpose" label="신청 사유" /><Checkbox name="agree" label="개인정보 수집에 동의합니다." bind:checked /><Button type="submit">신청서 제출</Button></form>
{:else if patternId === 'policy'}<h2>개인정보 처리방침</h2><Disclosure title="처리 목적과 보유 기간" /><Link href="#download">전문 내려받기</Link>
{:else if patternId === 'personal-information'}<form class="krds-form-group" onsubmit={prevent}><TextInput name="name" label="이름" /><TextInput name="phone" label="휴대전화 번호" /><TextInput name="email" type="email" label="이메일" /><Button type="submit">다음</Button></form>
{:else if patternId === 'help'}<h2>도움말</h2><Accordion items={accordionItems} /><Link href="#support">문의하기</Link>
{:else if patternId === 'consent'}<form class="krds-form-group" onsubmit={prevent}><h2>개인정보 수집 동의</h2><Disclosure title="수집 항목과 이용 목적" /><Checkbox name="requiredConsent" label="필수 항목에 동의합니다." bind:checked /><Button type="submit">동의하고 계속</Button></form>
{:else if patternId === 'list'}<h2>공지사항</h2><ul><li><Link href="#1">서비스 점검 안내</Link></li><li><Link href="#2">신청 절차 변경 안내</Link></li></ul><Pagination current={page} onPageChange={(next) => page = next} />
{:else if patternId === 'feedback'}<form class="krds-form-group" onsubmit={prevent}><fieldset><legend>이 페이지가 도움이 되었나요?</legend><Radio name="rating" value="good" label="도움이 됐어요" checked={rating === 'good'} onChange={() => rating = 'good'} /><Radio name="rating" value="bad" label="도움이 안 됐어요" checked={rating === 'bad'} onChange={() => rating = 'bad'} /></fieldset><Textarea name="comment" label="추가 의견" /><Button type="submit">의견 보내기</Button></form>
{:else if patternId === 'detail'}<span class="krds-badge">접수 완료</span><h2>민원 신청 상세</h2><dl><dt>신청 번호</dt><dd>2026-00124</dd><dt>처리 상태</dt><dd>담당자 검토 중</dd></dl><Button>목록으로</Button>
{:else if patternId === 'error'}<CriticalAlerts items={[{ message: '요청을 처리하지 못했습니다.', tone: 'danger' }]} /><p>잠시 후 다시 시도해 주세요.</p><Button>다시 시도</Button><Link href="#home">홈으로 이동</Link>
{:else if patternId === 'form'}<form class="krds-form-group" onsubmit={prevent}><TextInput name="title" label="제목" /><TextInput name="contact" label="연락처" /><Checkbox name="notification" label="처리 결과 알림 받기" bind:checked /><Button type="submit">저장</Button></form>
{:else if patternId === 'attachment'}<form class="krds-form-group" onsubmit={prevent}><label for="attachment">첨부 파일</label><input id="attachment" name="attachment" type="file" /><Button type="submit">파일 제출</Button></form>
{:else if patternId === 'filter-sort'}<form class="krds-form-group" onsubmit={prevent}><fieldset><legend>처리 상태</legend><Checkbox name="status" value="open" label="처리 중" /><Checkbox name="status" value="done" label="완료" /></fieldset><label for="sort">정렬</label><select id="sort"><option>최신순</option><option>오래된순</option></select><Button type="submit">적용</Button></form>
{:else if patternId === 'confirm'}<h2>신청 내용 확인</h2><p>제출 전에 입력한 내용을 확인하세요.</p><Button onclick={() => open = true}>확인 열기</Button><Modal bind:open title="신청서를 제출할까요?" confirmLabel="제출" onConfirm={() => open = false} />
{:else if patternId === 'mobile-notification'}<h2>알림</h2><span class="krds-badge">새 알림</span><p>신청한 민원의 처리 상태가 변경되었습니다.</p><Link href="#request">신청 내역 확인</Link><Button>모두 읽음 처리</Button>
{:else}<h2>앱 설정</h2><Switch name="notification" label="알림 받기" bind:checked={notifications} /><Disclosure title="접근성 설정" /><Link href="#permissions">앱 권한 관리</Link>{/if}
</main>

<style>
  .pattern-preview { max-width: 45rem; margin: 0 auto; }
  .pattern-preview :global(.krds-form-group), .pattern-preview form { display: grid; gap: 1rem; }
  .pattern-preview h2 { margin-top: 0; }
</style>
