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
