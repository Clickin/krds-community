import { useState } from 'react';

export type PatternExampleProps = { patternId: string };

export default function ReactPatternExample({ patternId }: PatternExampleProps) {
  const id = `react-${patternId}`;
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [push, setPush] = useState(true);
  const [sort, setSort] = useState('최신순');

  const submit = (event: { preventDefault: () => void }, text: string) => {
    event.preventDefault();
    setMessage(text);
  };

  switch (patternId) {
    case 'visit':
      return (
        <section aria-labelledby={`${id}-title`}>
          <p className="pattern-eyebrow">정부서비스</p>
          <h3 id={`${id}-title`}>필요한 서비스를 빠르게 찾아보세요.</h3>
          <nav aria-label="주요 서비스">
            <a href="#application">민원 신청</a>
            <a href="#policy">정책 정보</a>
          </nav>
        </section>
      );
    case 'search':
      return (
        <form
          role="search"
          onSubmit={(event) =>
            submit(event, query ? `‘${query}’ 검색 결과 3건` : '검색어를 입력하세요.')
          }
        >
          <label htmlFor={`${id}-query`}>서비스 검색</label>
          <div className="pattern-inline">
            <input
              id={`${id}-query`}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">검색</button>
          </div>
          <output aria-live="polite">
            {message || '검색어를 입력하면 결과를 확인할 수 있습니다.'}
          </output>
        </form>
      );
    case 'login':
      return (
        <form
          aria-labelledby={`${id}-title`}
          onSubmit={(event) => submit(event, '로그인되었습니다.')}
        >
          <h3 id={`${id}-title`}>로그인</h3>
          <label htmlFor={`${id}-user`}>아이디</label>
          <input id={`${id}-user`} name={`${id}-user`} autoComplete="username" required />
          <label htmlFor={`${id}-password`}>비밀번호</label>
          <input
            id={`${id}-password`}
            name={`${id}-password`}
            type="password"
            autoComplete="current-password"
            required
          />
          <button type="submit">로그인</button>
          <a href="#find-id">아이디·비밀번호 찾기</a>
          {message && <output role="status">{message}</output>}
        </form>
      );
    case 'application':
      return (
        <form
          aria-labelledby={`${id}-title`}
          onSubmit={(event) => submit(event, '신청 내용이 저장되었습니다.')}
        >
          <h3 id={`${id}-title`}>서비스 신청</h3>
          <label htmlFor={`${id}-name`}>신청인</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required />
          <label htmlFor={`${id}-purpose`}>신청 내용</label>
          <textarea id={`${id}-purpose`} name="purpose" required />
          <button type="submit">신청하기</button>
          {message && <output role="status">{message}</output>}
        </form>
      );
    case 'policy':
      return (
        <article aria-labelledby={`${id}-title`}>
          <p className="pattern-eyebrow">정책 정보</p>
          <h3 id={`${id}-title`}>디지털 포용 계획</h3>
          <p>정책의 목적과 주요 내용을 정확하고 최신 상태로 확인합니다.</p>
          <a href="#download">정책 자료 내려받기</a>
        </article>
      );
    case 'personal-information':
      return (
        <fieldset>
          <legend>개인 식별 정보</legend>
          <p id={`${id}-hint`}>본인 확인에 필요한 정보만 입력하세요.</p>
          <label htmlFor={`${id}-name`}>이름</label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            aria-describedby={`${id}-hint`}
            required
          />
          <label htmlFor={`${id}-birth`}>생년월일</label>
          <input id={`${id}-birth`} name="birth" inputMode="numeric" required />
        </fieldset>
      );
    case 'help':
      return (
        <section aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>도움말</h3>
          <details>
            <summary>신청 방법을 알고 싶어요</summary>
            <p>신청서를 작성하고 내용을 확인한 뒤 제출하세요.</p>
          </details>
          <a href="#guide">이용 안내 보기</a>
        </section>
      );
    case 'consent':
      return (
        <form onSubmit={(event) => submit(event, '동의 내용을 확인했습니다.')}>
          <fieldset>
            <legend>약관 동의</legend>
            <details>
              <summary>서비스 이용약관</summary>
              <p>서비스 이용에 필요한 약관 전문입니다.</p>
            </details>
            <label>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                required
              />{' '}
              이용약관에 동의합니다.
            </label>
            <button type="submit">다음</button>
            {message && <output role="status">{message}</output>}
          </fieldset>
        </form>
      );
    case 'list':
      return (
        <section aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>공지사항</h3>
          <ul className="pattern-list">
            <li>
              <a href="#notice-1">서비스 이용 안내</a>
              <time dateTime="2026-07-01">2026.07.01</time>
            </li>
            <li>
              <a href="#notice-2">시스템 점검 안내</a>
              <time dateTime="2026-06-28">2026.06.28</time>
            </li>
          </ul>
          <nav aria-label="페이지 이동">
            <a href="#previous">이전</a>
            <a href="#next">다음</a>
          </nav>
        </section>
      );
    case 'feedback':
      return (
        <form onSubmit={(event) => submit(event, '의견을 보내주셔서 감사합니다.')}>
          <fieldset>
            <legend>서비스 이용 의견</legend>
            <div className="pattern-inline">
              <label>
                <input type="radio" name={`${id}-satisfaction`} value="good" required /> 만족
              </label>
              <label>
                <input type="radio" name={`${id}-satisfaction`} value="normal" /> 보통
              </label>
              <label>
                <input type="radio" name={`${id}-satisfaction`} value="bad" /> 불만족
              </label>
            </div>
            <label htmlFor={`${id}-message`}>의견</label>
            <textarea id={`${id}-message`} />
            <button type="submit">의견 보내기</button>
            {message && <output role="status">{message}</output>}
          </fieldset>
        </form>
      );
    case 'detail':
      return (
        <article aria-labelledby={`${id}-title`}>
          <p className="pattern-eyebrow">정책 자료</p>
          <h3 id={`${id}-title`}>디지털 정부서비스 이용 안내</h3>
          <p>서비스의 대상과 이용 방법, 처리 절차를 자세히 안내합니다.</p>
          <h4>처리 절차</h4>
          <ol>
            <li>정보 확인</li>
            <li>신청서 작성</li>
            <li>결과 확인</li>
          </ol>
        </article>
      );
    case 'error':
      return (
        <section role="alert" aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>요청을 처리하지 못했습니다.</h3>
          <p>잠시 후 다시 시도하거나 입력 내용을 확인해 주세요.</p>
          <button type="button" onClick={() => setMessage('다시 시도하는 중입니다.')}>
            다시 시도
          </button>
          <a href="#help">도움말</a>
          {message && <output role="status">{message}</output>}
        </section>
      );
    case 'form':
      return (
        <form
          aria-labelledby={`${id}-title`}
          onSubmit={(event) => submit(event, '입력 내용이 저장되었습니다.')}
        >
          <h3 id={`${id}-title`}>정보 입력</h3>
          <label htmlFor={`${id}-subject`}>제목</label>
          <input id={`${id}-subject`} required />
          <label htmlFor={`${id}-category`}>분류</label>
          <select id={`${id}-category`} defaultValue="">
            <option value="" disabled>
              선택하세요
            </option>
            <option>민원</option>
            <option>정책</option>
          </select>
          <button type="submit">저장</button>
          {message && <output role="status">{message}</output>}
        </form>
      );
    case 'attachment':
      return (
        <section aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>첨부 파일</h3>
          <ul>
            <li>
              <a href="#file" download>
                서비스 안내서.pdf <span>(2.4MB)</span>
              </a>
            </li>
          </ul>
        </section>
      );
    case 'filter-sort':
      return (
        <form
          aria-labelledby={`${id}-title`}
          onSubmit={(event) => submit(event, `${sort}으로 정렬했습니다.`)}
        >
          <h3 id={`${id}-title`}>검색 결과</h3>
          <fieldset>
            <legend>필터와 정렬</legend>
            <label>
              <input type="checkbox" name={`${id}-type`} value="civil" /> 민원
            </label>
            <label>
              <input type="checkbox" name={`${id}-type`} value="policy" /> 정책
            </label>
            <label htmlFor={`${id}-sort`}>정렬</label>
            <select
              id={`${id}-sort`}
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option>최신순</option>
              <option>관련도순</option>
            </select>
            <button type="submit">적용</button>
          </fieldset>
          <output aria-live="polite">{message || '결과 12건'}</output>
        </form>
      );
    case 'confirm':
      return (
        <details>
          <summary>제출 전 확인 열기</summary>
          <section aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
            <h3 id={`${id}-title`}>신청을 제출할까요?</h3>
            <p id={`${id}-description`}>제출한 뒤에는 내용을 수정할 수 없습니다.</p>
            <div className="pattern-inline">
              <button type="button" onClick={() => setMessage('제출을 취소했습니다.')}>
                취소
              </button>
              <button type="button" onClick={() => setMessage('신청을 제출했습니다.')}>
                제출
              </button>
            </div>
            {message && <output role="status">{message}</output>}
          </section>
        </details>
      );
    case 'mobile-notification':
      return (
        <section aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>알림</h3>
          <p role="status">신청 결과가 준비되었습니다.</p>
          <button type="button" onClick={() => setMessage('알림함을 열었습니다.')}>
            알림함 열기
          </button>
          {message && <output role="status">{message}</output>}
        </section>
      );
    case 'mobile-settings':
      return (
        <form aria-labelledby={`${id}-title`}>
          <h3 id={`${id}-title`}>앱 설정</h3>
          <label htmlFor={`${id}-push`}>푸시 알림</label>
          <input
            id={`${id}-push`}
            type="checkbox"
            role="switch"
            checked={push}
            onChange={(event) => setPush(event.target.checked)}
          />
          <a href="#security">보안 설정</a>
          <output role="status">푸시 알림 {push ? '켜짐' : '꺼짐'}</output>
        </form>
      );
    default:
      return <p>알 수 없는 패턴입니다.</p>;
  }
}
