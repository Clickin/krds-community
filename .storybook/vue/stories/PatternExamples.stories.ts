import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref, type Component, type VNodeChild } from "vue";
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
} from "@krds-community/vue";

const accordionItems = [
  {
    id: "help-one",
    title: "신청 전에 무엇을 확인하나요?",
    content: "필수 서류와 처리 기간을 확인하세요.",
  },
];
const breadcrumbs = [
  { id: "home", label: "홈", href: "#" },
  { id: "current", label: "현재 화면", href: "#", current: true },
];
const pages = [1, 2, 3, 4, 5];
const component = (target: Component, props: Record<string, unknown> = {}, children?: VNodeChild) =>
  h(target, props, children === undefined ? undefined : { default: () => children });
const button = (label: string, props: Record<string, unknown> = {}) =>
  component(Button, props, label);
const link = (label: string, href: string) => component(Link, { href }, label);
const form = (children: VNodeChild[]) =>
  h(
    "form",
    { class: "krds-form-group", onSubmit: (event: Event) => event.preventDefault() },
    children,
  );

const PatternPreview = defineComponent({
  name: "PatternPreview",
  props: { patternId: { type: String, required: true } },
  setup(props) {
    const open = ref(true);
    const checked = ref(false);
    const page = ref(1);
    const rating = ref("good");
    const text = ref("");
    const notifications = ref(true);
    return () => {
      let content: VNodeChild;
      if (props.patternId === "visit")
        content = [
          component(Breadcrumb, { items: breadcrumbs }),
          h("h2", "방문 안내"),
          h("p", "운영 시간과 방문 절차를 확인하세요."),
          button("방문 예약"),
        ];
      else if (props.patternId === "search")
        content = form([
          component(TextInput, {
            name: "query",
            label: "검색어",
            modelValue: text.value,
            "onUpdate:modelValue": (value: string) => (text.value = value),
          }),
          button("검색", { type: "submit" }),
        ]);
      else if (props.patternId === "login")
        content = form([
          component(TextInput, { name: "userId", label: "아이디" }),
          component(TextInput, { name: "password", type: "password", label: "비밀번호" }),
          component(Checkbox, {
            name: "remember",
            label: "아이디 저장",
            modelValue: checked.value,
            "onUpdate:modelValue": (value: boolean) => (checked.value = value),
          }),
          button("로그인", { type: "submit" }),
          link("로그인 도움말", "#help"),
        ]);
      else if (props.patternId === "application")
        content = form([
          component(TextInput, { name: "applicant", label: "신청인" }),
          component(Textarea, { name: "purpose", label: "신청 사유" }),
          component(Checkbox, { name: "agree", label: "개인정보 수집에 동의합니다." }),
          button("신청서 제출", { type: "submit" }),
        ]);
      else if (props.patternId === "policy")
        content = [
          h("h2", "개인정보 처리방침"),
          component(Disclosure, { title: "처리 목적과 보유 기간" }),
          link("전문 내려받기", "#download"),
        ];
      else if (props.patternId === "personal-information")
        content = form([
          component(TextInput, { name: "name", label: "이름" }),
          component(TextInput, { name: "phone", label: "휴대전화 번호" }),
          component(TextInput, { name: "email", type: "email", label: "이메일" }),
          button("다음", { type: "submit" }),
        ]);
      else if (props.patternId === "help")
        content = [
          h("h2", "도움말"),
          component(Accordion, { items: accordionItems }),
          link("문의하기", "#support"),
        ];
      else if (props.patternId === "consent")
        content = form([
          h("h2", "개인정보 수집 동의"),
          component(Disclosure, { title: "수집 항목과 이용 목적" }),
          component(Checkbox, { name: "requiredConsent", label: "필수 항목에 동의합니다." }),
          button("동의하고 계속", { type: "submit" }),
        ]);
      else if (props.patternId === "list")
        content = [
          h("h2", "공지사항"),
          h("ul", [
            h("li", link("서비스 점검 안내", "#1")),
            h("li", link("신청 절차 변경 안내", "#2")),
          ]),
          component(Pagination, {
            current: page.value,
            items: pages,
            onPageChange: (next: number) => (page.value = next),
          }),
        ];
      else if (props.patternId === "feedback")
        content = form([
          h("fieldset", [
            h("legend", "이 페이지가 도움이 되었나요?"),
            component(Radio, {
              name: "rating",
              value: "good",
              label: "도움이 됐어요",
              checked: rating.value === "good",
              onChange: () => (rating.value = "good"),
            }),
            component(Radio, {
              name: "rating",
              value: "bad",
              label: "도움이 안 됐어요",
              checked: rating.value === "bad",
              onChange: () => (rating.value = "bad"),
            }),
          ]),
          component(Textarea, { name: "comment", label: "추가 의견" }),
          button("의견 보내기", { type: "submit" }),
        ]);
      else if (props.patternId === "detail")
        content = [
          h("span", { class: "krds-badge" }, "접수 완료"),
          h("h2", "민원 신청 상세"),
          h("dl", [
            h("dt", "신청 번호"),
            h("dd", "2026-00124"),
            h("dt", "처리 상태"),
            h("dd", "담당자 검토 중"),
          ]),
          button("목록으로"),
        ];
      else if (props.patternId === "error")
        content = [
          component(CriticalAlerts, {
            items: [{ message: "요청을 처리하지 못했습니다.", tone: "danger" }],
          }),
          h("p", "잠시 후 다시 시도해 주세요."),
          button("다시 시도"),
          link("홈으로 이동", "#home"),
        ];
      else if (props.patternId === "form")
        content = form([
          component(TextInput, { name: "title", label: "제목" }),
          component(TextInput, { name: "contact", label: "연락처" }),
          component(Checkbox, { name: "notification", label: "처리 결과 알림 받기" }),
          button("저장", { type: "submit" }),
        ]);
      else if (props.patternId === "attachment")
        content = form([
          h("label", { for: "attachment" }, "첨부 파일"),
          h("input", { id: "attachment", name: "attachment", type: "file" }),
          button("파일 제출", { type: "submit" }),
        ]);
      else if (props.patternId === "filter-sort")
        content = form([
          h("fieldset", [
            h("legend", "처리 상태"),
            component(Checkbox, { name: "status", value: "open", label: "처리 중" }),
            component(Checkbox, { name: "status", value: "done", label: "완료" }),
          ]),
          h("label", { for: "sort" }, "정렬"),
          h("select", { id: "sort" }, [h("option", "최신순"), h("option", "오래된순")]),
          button("적용", { type: "submit" }),
        ]);
      else if (props.patternId === "confirm")
        content = [
          h("h2", "신청 내용 확인"),
          h("p", "제출 전에 입력한 내용을 확인하세요."),
          button("확인 열기", { onClick: () => (open.value = true) }),
          component(Modal, {
            title: "신청서를 제출할까요?",
            open: open.value,
            confirmLabel: "제출",
            onOpenChange: (next: boolean) => (open.value = next),
          }),
        ];
      else if (props.patternId === "mobile-notification")
        content = [
          h("h2", "알림"),
          h("span", { class: "krds-badge" }, "새 알림"),
          h("p", "신청한 민원의 처리 상태가 변경되었습니다."),
          link("신청 내역 확인", "#request"),
          button("모두 읽음 처리"),
        ];
      else
        content = [
          h("h2", "앱 설정"),
          component(Switch, {
            name: "notification",
            label: "알림 받기",
            modelValue: notifications.value,
            "onUpdate:modelValue": (value: boolean) => (notifications.value = value),
          }),
          component(Disclosure, { title: "접근성 설정" }),
          link("앱 권한 관리", "#permissions"),
        ];
      return h("main", { style: "max-width:45rem;margin:0 auto" }, content);
    };
  },
});

const meta = {
  title: "Vue/Patterns",
  component: PatternPreview,
  parameters: { layout: "padded" },
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
