/**
 * Canonical Korean text values for Storybook stories.
 *
 * These values match `apps/conformance-host/src/fixture-props.ts` and are the
 * single source of truth for story props across all framework AllComponents files.
 *
 * Do not duplicate these values inline in framework story files.
 * Import from this module instead.
 */

/** Accordion items used across all framework stories */
export const ACCORDION_ITEMS = [
  { id: "one", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
  { id: "two", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
] as const;

/** Accordion single item for individual story */
export const ACCORDION_ITEM_SINGLE = {
  id: "one",
  title: "아코디언 타이틀 영역",
  content: "아코디언 내용 영역",
} as const;

/** Accordion line items */
export const ACCORDION_LINE_ITEMS = [
  { id: "one", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
  { id: "two", title: "아코디언 타이틀 영역", content: "아코디언 내용 영역" },
] as const;

/** Button text by variant */
export const BUTTON_TEXT: Record<string, string> = {
  primary: "저장",
  secondary: "버튼 : secondary",
  tertiary: "버튼 : tertiary",
};

/** Button hierarchy text */
export const BUTTON_HIERARCHY_TEXT = "버튼 : primary";

/** Checkbox labels */
export const CHECKBOX_LABEL_DEFAULT = "기본";
export const CHECKBOX_LABEL_LARGE = "사이즈 : large";

/** Radio labels */
export const RADIO_LABEL_DEFAULT = "기본";
export const RADIO_LABEL_LARGE = "사이즈 : large";

/** Switch labels */
export const SWITCH_LABEL_DEFAULT = "switch : default";
export const SWITCH_LABEL_LARGE = "switch size : large";

/** Text Input defaults */
export const TEXT_INPUT_PROPS = {
  label: "레이블",
  hint: "도움말",
} as const;

/** Modal default props */
export const MODAL_PROPS = {
  title: "모달 제목",
  description: "모달 설명",
  cancelLabel: "취소",
  confirmLabel: "확인",
  closeLabel: "닫기",
} as const;

/** Modal trigger button text */
export const MODAL_TRIGGER_TEXT = "모달 열기";

/** extra: 검색 제안 (SearchSuggestions) */
export const SEARCH_SUGGESTIONS = [
  { id: "1", label: "건강보험 자격 확인" },
  { id: "2", label: "건강검진 결과 조회" },
  { id: "3", label: "건강보험료 조회" },
] as const;

/** extra: 실시간 유효성 검사 (ValidatedInput) */
export const VALIDATED_INPUT_PROPS = {
  label: "아이디",
  name: "id",
  placeholder: "아이디를 입력하세요",
  hint: "영문 4자 이상 입력하세요.",
  successMessage: "사용 가능한 아이디입니다.",
} as const;

/** extra: 즉각 표시 필터·정렬 (FilterableList) */
export const FILTERABLE_LIST_ITEMS = [
  { id: "1", label: "영유아 보육료 지원 신청", life: "infant", family: "single" },
  { id: "2", label: "아이돌봄 서비스 이용 신청", life: "child", family: "dual" },
  { id: "3", label: "청년 월세 지원 신청", life: "youth", family: "single" },
] as const;

export const FILTERABLE_LIST_FILTERS = [
  {
    id: "life",
    label: "생애 주기",
    field: "life",
    options: [
      { value: "infant", label: "영유아" },
      { value: "child", label: "아동" },
      { value: "youth", label: "청년" },
    ],
  },
  {
    id: "family",
    label: "가구 상황",
    field: "family",
    options: [
      { value: "dual", label: "맞벌이" },
      { value: "single", label: "1인 가구" },
    ],
  },
] as const;

export const FILTERABLE_LIST_SORT = { id: "title", label: "이름순", field: "label" } as const;
