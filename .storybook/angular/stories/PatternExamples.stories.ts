import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import {
  KrdsAccordionComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsCriticalAlertsComponent,
  KrdsDisclosureComponent,
  KrdsLinkComponent,
  KrdsModalComponent,
  KrdsPaginationComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextareaComponent,
  KrdsTextInputComponent,
} from "@krds-community/angular";

const imports = [
  KrdsAccordionComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsCriticalAlertsComponent,
  KrdsDisclosureComponent,
  KrdsLinkComponent,
  KrdsModalComponent,
  KrdsPaginationComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextareaComponent,
  KrdsTextInputComponent,
];

const template = `
<main style="max-width:45rem;margin:0 auto">
@switch (patternId) {
  @case ('visit') { <krds-breadcrumb [items]="breadcrumbs"></krds-breadcrumb><h2>방문 안내</h2><p>운영 시간과 방문 절차를 확인하세요.</p><krds-button>방문 예약</krds-button> }
  @case ('search') { <form class="krds-form-group" (submit)="$event.preventDefault()"><krds-text-input name="query" label="검색어"></krds-text-input><krds-button type="submit">검색</krds-button></form> }
  @case ('login') { <form class="krds-form-group" (submit)="$event.preventDefault()"><krds-text-input name="userId" label="아이디"></krds-text-input><krds-text-input name="password" type="password" label="비밀번호"></krds-text-input><krds-checkbox name="remember" label="아이디 저장"></krds-checkbox><krds-button type="submit">로그인</krds-button><krds-link href="#help">로그인 도움말</krds-link></form> }
  @case ('application') { <form class="krds-form-group" (submit)="$event.preventDefault()"><krds-text-input name="applicant" label="신청인"></krds-text-input><krds-textarea name="purpose" label="신청 사유"></krds-textarea><krds-checkbox name="agree" label="개인정보 수집에 동의합니다."></krds-checkbox><krds-button type="submit">신청서 제출</krds-button></form> }
  @case ('policy') { <h2>개인정보 처리방침</h2><krds-disclosure title="처리 목적과 보유 기간"></krds-disclosure><krds-link href="#download">전문 내려받기</krds-link> }
  @case ('personal-information') { <form class="krds-form-group" (submit)="$event.preventDefault()"><krds-text-input name="name" label="이름"></krds-text-input><krds-text-input name="phone" label="휴대전화 번호"></krds-text-input><krds-text-input name="email" type="email" label="이메일"></krds-text-input><krds-button type="submit">다음</krds-button></form> }
  @case ('help') { <h2>도움말</h2><krds-accordion [items]="accordionItems"></krds-accordion><krds-link href="#support">문의하기</krds-link> }
  @case ('consent') { <form class="krds-form-group" (submit)="$event.preventDefault()"><h2>개인정보 수집 동의</h2><krds-disclosure title="수집 항목과 이용 목적"></krds-disclosure><krds-checkbox name="requiredConsent" label="필수 항목에 동의합니다."></krds-checkbox><krds-button type="submit">동의하고 계속</krds-button></form> }
  @case ('list') { <h2>공지사항</h2><ul><li><krds-link href="#1">서비스 점검 안내</krds-link></li><li><krds-link href="#2">신청 절차 변경 안내</krds-link></li></ul><krds-pagination [current]="1" [items]="pages"></krds-pagination> }
  @case ('feedback') { <form class="krds-form-group" (submit)="$event.preventDefault()"><fieldset><legend>이 페이지가 도움이 되었나요?</legend><krds-radio name="rating" value="good" label="도움이 됐어요"></krds-radio><krds-radio name="rating" value="bad" label="도움이 안 됐어요"></krds-radio></fieldset><krds-textarea name="comment" label="추가 의견"></krds-textarea><krds-button type="submit">의견 보내기</krds-button></form> }
  @case ('detail') { <span class="krds-badge">접수 완료</span><h2>민원 신청 상세</h2><dl><dt>신청 번호</dt><dd>2026-00124</dd><dt>처리 상태</dt><dd>담당자 검토 중</dd></dl><krds-button>목록으로</krds-button> }
  @case ('error') { <krds-critical-alerts [items]="alerts"></krds-critical-alerts><p>잠시 후 다시 시도해 주세요.</p><krds-button>다시 시도</krds-button><krds-link href="#home">홈으로 이동</krds-link> }
  @case ('form') { <form class="krds-form-group" (submit)="$event.preventDefault()"><krds-text-input name="title" label="제목"></krds-text-input><krds-text-input name="contact" label="연락처"></krds-text-input><krds-checkbox name="notification" label="처리 결과 알림 받기"></krds-checkbox><krds-button type="submit">저장</krds-button></form> }
  @case ('attachment') { <form class="krds-form-group" (submit)="$event.preventDefault()"><label for="attachment">첨부 파일</label><input id="attachment" name="attachment" type="file"><krds-button type="submit">파일 제출</krds-button></form> }
  @case ('filter-sort') { <form class="krds-form-group" (submit)="$event.preventDefault()"><fieldset><legend>처리 상태</legend><krds-checkbox name="status" value="open" label="처리 중"></krds-checkbox><krds-checkbox name="status" value="done" label="완료"></krds-checkbox></fieldset><label for="sort">정렬</label><select id="sort"><option>최신순</option><option>오래된순</option></select><krds-button type="submit">적용</krds-button></form> }
  @case ('confirm') { <h2>신청 내용 확인</h2><p>제출 전에 입력한 내용을 확인하세요.</p><krds-button (click)="modalOpen = true">확인 열기</krds-button><krds-modal title="신청서를 제출할까요?" [open]="modalOpen" cancelLabel="취소" confirmLabel="제출" closeLabel="닫기"></krds-modal> }
  @case ('mobile-notification') { <h2>알림</h2><span class="krds-badge">새 알림</span><p>신청한 민원의 처리 상태가 변경되었습니다.</p><krds-link href="#request">신청 내역 확인</krds-link><krds-button>모두 읽음 처리</krds-button> }
  @default { <h2>앱 설정</h2><krds-switch name="notification" label="알림 받기"></krds-switch><krds-disclosure title="접근성 설정"></krds-disclosure><krds-link href="#permissions">앱 권한 관리</krds-link> }
}
</main>`;

const meta = {
  title: "Angular/Patterns",
  decorators: [moduleMetadata({ imports })],
  parameters: { layout: "padded" },
  render: (args) => ({
    props: {
      ...args,
      accordionItems: [
        {
          id: "help-one",
          title: "신청 전에 무엇을 확인하나요?",
          content: "필수 서류와 처리 기간을 확인하세요.",
        },
      ],
      breadcrumbs: [
        { id: "home", label: "홈", href: "#" },
        { id: "current", label: "현재 화면", current: true },
      ],
      pages: [1, 2, 3, 4, 5],
      alerts: [{ message: "요청을 처리하지 못했습니다.", tone: "danger" }],
      modalOpen: false,
    },
    template,
  }),
} satisfies Meta<{ patternId: string }>;
export default meta;
type Story = StoryObj<{ patternId: string }>;
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
