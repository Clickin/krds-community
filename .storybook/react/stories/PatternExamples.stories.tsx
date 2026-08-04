import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Accordion,
  Breadcrumb,
  Button,
  Checkbox,
  CriticalAlerts,
  Disclosure,
  Link,
  Modal,
  Pagination,
  Radio,
  Switch,
  Textarea,
  TextInput,
} from "@krds-community/react";

const accordionItems = [
  {
    id: "help-one",
    title: "신청 전에 무엇을 확인하나요?",
    content: "필수 서류와 처리 기간을 확인하세요.",
  },
];
const breadcrumbs = [
  { id: "home", label: "홈", href: "#" },
  { id: "current", label: "현재 화면", current: true },
];

const PatternPreview = ({ patternId }: { patternId: string }) => {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState("good");
  const [text, setText] = useState("");
  const [notifications, setNotifications] = useState(true);
  const form = (children: React.ReactNode) => (
    <form className="krds-form-group" onSubmit={(event) => event.preventDefault()}>
      {children}
    </form>
  );

  if (patternId === "visit")
    return (
      <>
        <Breadcrumb items={breadcrumbs} />
        <h2>방문 안내</h2>
        <p>운영 시간과 방문 절차를 확인하세요.</p>
        <Button>방문 예약</Button>
      </>
    );
  if (patternId === "search")
    return form(
      <>
        <TextInput
          name="query"
          label="검색어"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit">검색</Button>
      </>,
    );
  if (patternId === "login")
    return form(
      <>
        <TextInput name="userId" label="아이디" />
        <TextInput name="password" type="password" label="비밀번호" />
        <Checkbox
          name="remember"
          label="아이디 저장"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Button type="submit">로그인</Button>
        <Link href="#help">로그인 도움말</Link>
      </>,
    );
  if (patternId === "application")
    return form(
      <>
        <TextInput name="applicant" label="신청인" />
        <Textarea name="purpose" label="신청 사유" />
        <Checkbox
          name="agree"
          label="개인정보 수집에 동의합니다."
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Button type="submit">신청서 제출</Button>
      </>,
    );
  if (patternId === "policy")
    return (
      <>
        <h2>개인정보 처리방침</h2>
        <Disclosure title="처리 목적과 보유 기간" />
        <Link href="#download">전문 내려받기</Link>
      </>
    );
  if (patternId === "personal-information")
    return form(
      <>
        <TextInput name="name" label="이름" />
        <TextInput name="phone" label="휴대전화 번호" />
        <TextInput name="email" type="email" label="이메일" />
        <Button type="submit">다음</Button>
      </>,
    );
  if (patternId === "help")
    return (
      <>
        <h2>도움말</h2>
        <Accordion items={accordionItems} />
        <Link href="#support">문의하기</Link>
      </>
    );
  if (patternId === "consent")
    return form(
      <>
        <h2>개인정보 수집 동의</h2>
        <Disclosure title="수집 항목과 이용 목적" />
        <Checkbox
          name="requiredConsent"
          label="필수 항목에 동의합니다."
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Button type="submit">동의하고 계속</Button>
      </>,
    );
  if (patternId === "list")
    return (
      <>
        <h2>공지사항</h2>
        <ul>
          <li>
            <Link href="#1">서비스 점검 안내</Link>
          </li>
          <li>
            <Link href="#2">신청 절차 변경 안내</Link>
          </li>
        </ul>
        <Pagination current={page} items={[1, 2, 3, 4, 5]} onPageChange={setPage} />
      </>
    );
  if (patternId === "feedback")
    return form(
      <>
        <fieldset>
          <legend>이 페이지가 도움이 되었나요?</legend>
          <Radio
            name="rating"
            value="good"
            label="도움이 됐어요"
            checked={rating === "good"}
            onChange={() => setRating("good")}
          />
          <Radio
            name="rating"
            value="bad"
            label="도움이 안 됐어요"
            checked={rating === "bad"}
            onChange={() => setRating("bad")}
          />
        </fieldset>
        <Textarea name="comment" label="추가 의견" />
        <Button type="submit">의견 보내기</Button>
      </>,
    );
  if (patternId === "detail")
    return (
      <>
        <span className="krds-badge">접수 완료</span>
        <h2>민원 신청 상세</h2>
        <dl>
          <dt>신청 번호</dt>
          <dd>2026-00124</dd>
          <dt>처리 상태</dt>
          <dd>담당자 검토 중</dd>
        </dl>
        <Button>목록으로</Button>
      </>
    );
  if (patternId === "error")
    return (
      <>
        <CriticalAlerts items={[{ message: "요청을 처리하지 못했습니다.", tone: "danger" }]} />
        <p>잠시 후 다시 시도해 주세요.</p>
        <Button>다시 시도</Button>
        <Link href="#home">홈으로 이동</Link>
      </>
    );
  if (patternId === "form")
    return form(
      <>
        <TextInput name="title" label="제목" />
        <TextInput name="contact" label="연락처" />
        <Checkbox
          name="notification"
          label="처리 결과 알림 받기"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <Button type="submit">저장</Button>
      </>,
    );
  if (patternId === "attachment")
    return form(
      <>
        <label htmlFor="attachment">첨부 파일</label>
        <input id="attachment" name="attachment" type="file" />
        <Button type="submit">파일 제출</Button>
      </>,
    );
  if (patternId === "filter-sort")
    return form(
      <>
        <fieldset>
          <legend>처리 상태</legend>
          <Checkbox name="status" value="open" label="처리 중" />
          <Checkbox name="status" value="done" label="완료" />
        </fieldset>
        <label htmlFor="sort">정렬</label>
        <select id="sort">
          <option>최신순</option>
          <option>오래된순</option>
        </select>
        <Button type="submit">적용</Button>
      </>,
    );
  if (patternId === "confirm")
    return (
      <>
        <h2>신청 내용 확인</h2>
        <p>제출 전에 입력한 내용을 확인하세요.</p>
        <Button onClick={() => setOpen(true)}>확인 열기</Button>
        <Modal
          title="신청서를 제출할까요?"
          open={open}
          onOpenChange={setOpen}
          confirmLabel="제출"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  if (patternId === "mobile-notification")
    return (
      <>
        <h2>알림</h2>
        <span className="krds-badge">새 알림</span>
        <p>신청한 민원의 처리 상태가 변경되었습니다.</p>
        <Link href="#request">신청 내역 확인</Link>
        <Button>모두 읽음 처리</Button>
      </>
    );
  return (
    <>
      <h2>앱 설정</h2>
      <Switch
        name="notification"
        label="알림 받기"
        checked={notifications}
        onChange={(event) => setNotifications(event.target.checked)}
      />
      <Disclosure title="접근성 설정" />
      <Link href="#permissions">앱 권한 관리</Link>
    </>
  );
};

const meta = {
  title: "React/Patterns",
  component: PatternPreview,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <main style={{ maxWidth: 720, margin: "0 auto" }}>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof PatternPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
const story = (patternId: string): Story => ({ args: { patternId } });
export const Visit = story("visit");
export const Search = story("search");
export const Login = story("login");
export const Application = story("application");
export const Policy = story("policy");
export const PersonalInformation = story("personal-information");
export const Help = story("help");
export const Consent = story("consent");
export const List = story("list");
export const Feedback = story("feedback");
export const Detail = story("detail");
export const Error = story("error");
export const Form = story("form");
export const Attachment = story("attachment");
export const FilterSort = story("filter-sort");
export const Confirm = story("confirm");
export const MobileNotification = story("mobile-notification");
export const MobileSettings = story("mobile-settings");
