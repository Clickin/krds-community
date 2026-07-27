<script lang="ts">
  let { patternId }: { patternId: string } = $props();
  let id = $derived(`svelte-${patternId}`);
  let message = $state('');
  let query = $state('');
  let accepted = $state(false);
  let push = $state(true);
  let sort = $state('최신순');

  function submit(event: SubmitEvent, text: string) {
    event.preventDefault();
    message = text;
  }
</script>

{#if patternId === 'visit'}
  <section aria-labelledby={`${id}-title`}><p class="pattern-eyebrow">정부서비스</p><h3 id={`${id}-title`}>필요한 서비스를 빠르게 찾아보세요.</h3><nav aria-label="주요 서비스"><a href="#application">민원 신청</a><a href="#policy">정책 정보</a></nav></section>
{:else if patternId === 'search'}
  <form role="search" onsubmit={(event) => submit(event, query ? `‘${query}’ 검색 결과 3건` : '검색어를 입력하세요.')}><label for={`${id}-query`}>서비스 검색</label><div class="pattern-inline"><input id={`${id}-query`} bind:value={query} type="search" /><button type="submit">검색</button></div><output aria-live="polite">{message || '검색어를 입력하면 결과를 확인할 수 있습니다.'}</output></form>
{:else if patternId === 'login'}
  <form aria-labelledby={`${id}-title`} onsubmit={(event) => submit(event, '로그인되었습니다.')}><h3 id={`${id}-title`}>로그인</h3><label for={`${id}-user`}>아이디</label><input id={`${id}-user`} name={`${id}-user`} autocomplete="username" required /><label for={`${id}-password`}>비밀번호</label><input id={`${id}-password`} name={`${id}-password`} type="password" autocomplete="current-password" required /><button type="submit">로그인</button><a href="#find-id">아이디·비밀번호 찾기</a>{#if message}<output role="status">{message}</output>{/if}</form>
{:else if patternId === 'application'}
  <form aria-labelledby={`${id}-title`} onsubmit={(event) => submit(event, '신청 내용이 저장되었습니다.')}><h3 id={`${id}-title`}>서비스 신청</h3><label for={`${id}-name`}>신청인</label><input id={`${id}-name`} name="name" autocomplete="name" required /><label for={`${id}-purpose`}>신청 내용</label><textarea id={`${id}-purpose`} name="purpose" required></textarea><button type="submit">신청하기</button>{#if message}<output role="status">{message}</output>{/if}</form>
{:else if patternId === 'policy'}
  <article aria-labelledby={`${id}-title`}><p class="pattern-eyebrow">정책 정보</p><h3 id={`${id}-title`}>디지털 포용 계획</h3><p>정책의 목적과 주요 내용을 정확하고 최신 상태로 확인합니다.</p><a href="#download">정책 자료 내려받기</a></article>
{:else if patternId === 'personal-information'}
  <fieldset><legend>개인 식별 정보</legend><p id={`${id}-hint`}>본인 확인에 필요한 정보만 입력하세요.</p><label for={`${id}-name`}>이름</label><input id={`${id}-name`} name="name" autocomplete="name" aria-describedby={`${id}-hint`} required /><label for={`${id}-birth`}>생년월일</label><input id={`${id}-birth`} name="birth" inputmode="numeric" required /></fieldset>
{:else if patternId === 'help'}
  <section aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>도움말</h3><details><summary>신청 방법을 알고 싶어요</summary><p>신청서를 작성하고 내용을 확인한 뒤 제출하세요.</p></details><a href="#guide">이용 안내 보기</a></section>
{:else if patternId === 'consent'}
  <form onsubmit={(event) => submit(event, '동의 내용을 확인했습니다.')}><fieldset><legend>약관 동의</legend><details><summary>서비스 이용약관</summary><p>서비스 이용에 필요한 약관 전문입니다.</p></details><label><input bind:checked={accepted} type="checkbox" required /> 이용약관에 동의합니다.</label><button type="submit">다음</button>{#if message}<output role="status">{message}</output>{/if}</fieldset></form>
{:else if patternId === 'list'}
  <section aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>공지사항</h3><ul class="pattern-list"><li><a href="#notice-1">서비스 이용 안내</a><time datetime="2026-07-01">2026.07.01</time></li><li><a href="#notice-2">시스템 점검 안내</a><time datetime="2026-06-28">2026.06.28</time></li></ul><nav aria-label="페이지 이동"><a href="#previous">이전</a><a href="#next">다음</a></nav></section>
{:else if patternId === 'feedback'}
  <form onsubmit={(event) => submit(event, '의견을 보내주셔서 감사합니다.')}><fieldset><legend>서비스 이용 의견</legend><div class="pattern-inline"><label><input name={`${id}-satisfaction`} value="good" type="radio" required /> 만족</label><label><input name={`${id}-satisfaction`} value="normal" type="radio" /> 보통</label><label><input name={`${id}-satisfaction`} value="bad" type="radio" /> 불만족</label></div><label for={`${id}-message`}>의견</label><textarea id={`${id}-message`}></textarea><button type="submit">의견 보내기</button>{#if message}<output role="status">{message}</output>{/if}</fieldset></form>
{:else if patternId === 'detail'}
  <article aria-labelledby={`${id}-title`}><p class="pattern-eyebrow">정책 자료</p><h3 id={`${id}-title`}>디지털 정부서비스 이용 안내</h3><p>서비스의 대상과 이용 방법, 처리 절차를 자세히 안내합니다.</p><h4>처리 절차</h4><ol><li>정보 확인</li><li>신청서 작성</li><li>결과 확인</li></ol></article>
{:else if patternId === 'error'}
  <section role="alert" aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>요청을 처리하지 못했습니다.</h3><p>잠시 후 다시 시도하거나 입력 내용을 확인해 주세요.</p><button type="button" onclick={() => (message = '다시 시도하는 중입니다.')}>다시 시도</button><a href="#help">도움말</a>{#if message}<output role="status">{message}</output>{/if}</section>
{:else if patternId === 'form'}
  <form aria-labelledby={`${id}-title`} onsubmit={(event) => submit(event, '입력 내용이 저장되었습니다.')}><h3 id={`${id}-title`}>정보 입력</h3><label for={`${id}-subject`}>제목</label><input id={`${id}-subject`} required /><label for={`${id}-category`}>분류</label><select id={`${id}-category`} bind:value={sort}><option value="" disabled>선택하세요</option><option>민원</option><option>정책</option></select><button type="submit">저장</button>{#if message}<output role="status">{message}</output>{/if}</form>
{:else if patternId === 'attachment'}
  <section aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>첨부 파일</h3><ul><li><a href="#file" download>서비스 안내서.pdf <span>(2.4MB)</span></a></li></ul></section>
{:else if patternId === 'filter-sort'}
  <form aria-labelledby={`${id}-title`} onsubmit={(event) => submit(event, `${sort}으로 정렬했습니다.`)}><h3 id={`${id}-title`}>검색 결과</h3><fieldset><legend>필터와 정렬</legend><label><input name={`${id}-type`} value="civil" type="checkbox" /> 민원</label><label><input name={`${id}-type`} value="policy" type="checkbox" /> 정책</label><label for={`${id}-sort`}>정렬</label><select id={`${id}-sort`} bind:value={sort}><option>최신순</option><option>관련도순</option></select><button type="submit">적용</button></fieldset><output aria-live="polite">{message || '결과 12건'}</output></form>
{:else if patternId === 'confirm'}
  <details><summary>제출 전 확인 열기</summary><section aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}><h3 id={`${id}-title`}>신청을 제출할까요?</h3><p id={`${id}-description`}>제출한 뒤에는 내용을 수정할 수 없습니다.</p><div class="pattern-inline"><button type="button" onclick={() => (message = '제출을 취소했습니다.')}>취소</button><button type="button" onclick={() => (message = '신청을 제출했습니다.')}>제출</button></div>{#if message}<output role="status">{message}</output>{/if}</section></details>
{:else if patternId === 'mobile-notification'}
  <section aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>알림</h3><p role="status">신청 결과가 준비되었습니다.</p><button type="button" onclick={() => (message = '알림함을 열었습니다.')}>알림함 열기</button>{#if message}<output role="status">{message}</output>{/if}</section>
{:else if patternId === 'mobile-settings'}
  <form aria-labelledby={`${id}-title`}><h3 id={`${id}-title`}>앱 설정</h3><label for={`${id}-push`}>푸시 알림</label><input id={`${id}-push`} bind:checked={push} type="checkbox" role="switch" /><a href="#security">보안 설정</a><output role="status">푸시 알림 {push ? '켜짐' : '꺼짐'}</output></form>
{:else}
  <p>알 수 없는 패턴입니다.</p>
{/if}
