import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import AdditionalShowcase from "./AdditionalShowcase.svelte";

const meta = {
  title: "Svelte/데이터·탐색 컨트롤",
  component: AdditionalShowcase,
  parameters: { layout: "padded", a11y: { test: "error" } },
  argTypes: {
    component: {
      control: "select",
      options: [
        "Calendar",
        "CalendarRange",
        "Carousel",
        "CarouselBanner",
        "DateInput",
        "Pagination",
        "Resize",
        "Select",
        "SelectSize",
        "SelectSorting",
        "SelectState",
        "StepIndicator",
        "StructuredList",
        "StructuredListTable",
        "Table",
        "Tab",
      ],
    },
    componentProps: { control: "object" },
    eventLabel: { control: "text" },
  },
} satisfies Meta<AdditionalShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const fixtureParameters = (fixtureId: string, fixtureStates: string[]) => ({
  fixtureIds: [fixtureId],
  fixtureId,
  fixtureStates,
  a11y: { test: "error" },
});

const calendarLabels = {
  calendarLabel: "달력",
  previousMonthLabel: "이전 달",
  nextMonthLabel: "다음 달",
  yearSelectLabel: "연도 선택",
  monthSelectLabel: "월 선택",
  weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  todayLabel: "오늘",
  cancelLabel: "취소",
  confirmLabel: "확인",
  eventLabel: "일정있음",
};

export const Calendar: Story = {
  name: "Calendar · single month",
  args: {
    component: "Calendar",
    componentProps: {
      id: "svelte-calendar",
      ...calendarLabels,
      label: "레이블",
      hint: "도움말",
      year: 2002,
      month: 12,
      value: "2002-12-08",
      disabledMonths: [2],
      todayDay: 30,
      eventDays: [8],
      disabledDays: [13],
    },
    eventLabel: "달력",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const yearButton = canvas.getByRole("combobox", { name: "연도 선택" });
    await expect(yearButton).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(yearButton);
    await expect(yearButton).toHaveAttribute("aria-expanded", "true");
  },
  parameters: { ...fixtureParameters("calendar.default", ["default", "focus-visible"]) },
};

export const CalendarRange: Story = {
  name: "Calendar · date range",
  args: {
    component: "CalendarRange",
    componentProps: {
      id: "svelte-calendar-range",
      ...calendarLabels,
      label: "기간 선택",
      year: 2011,
      month: 2,
      value: "2011-02-07",
      rangeStartDay: 7,
      rangeEndDay: 16,
      todayDay: 20,
      eventDays: [6],
    },
    eventLabel: "기간 달력",
  },
  parameters: { ...fixtureParameters("calendar-range.default", ["default", "focus-visible"]) },
};

export const DateInput: Story = {
  name: "Date input · date selection",
  args: {
    component: "DateInput",
    componentProps: {
      id: "svelte-date-input",
      ...calendarLabels,
      label: "레이블",
      hint: "도움말",
      year: 2002,
      month: 12,
      value: "2002-12-25",
      disabledMonths: [1],
      rangeStartDay: 7,
      rangeEndDay: 16,
      todayDay: 25,
      eventDays: [26],
    },
    eventLabel: "날짜 입력",
  },
  parameters: { ...fixtureParameters("date-input.default", ["default", "focus-visible"]) },
};

const slides = [
  { id: "1", title: "타이틀 영역", description: "컨텐츠 영역 컨텐츠 영역", href: "#" },
  { id: "2", title: "타이틀 영역", description: "컨텐츠 영역 컨텐츠 영역", href: "#" },
  { id: "3", title: "타이틀 영역", description: "컨텐츠 영역 컨텐츠 영역", href: "#" },
  { id: "4", title: "타이틀 영역", description: "컨텐츠 영역 컨텐츠 영역", href: "#" },
];

export const Carousel: Story = {
  name: "Carousel · content banner",
  args: {
    component: "Carousel",
    componentProps: {
      id: "svelte-carousel",
      slides,
      previousLabel: "이전",
      nextLabel: "다음",
      moreLabel: "더 보기",
      imageLabel: "예시",
      actionLabel: "버튼 영역",
      current: 0,
    },
    eventLabel: "캐러셀",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "다음" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("click");
  },
  parameters: { ...fixtureParameters("carousel.default", ["default", "focus-visible"]) },
};

export const CarouselBanner: Story = {
  name: "Carousel · banner with controls",
  args: {
    component: "CarouselBanner",
    componentProps: {
      id: "svelte-carousel-banner",
      slides: [
        { id: "one", title: "타이틀", description: "서브타이틀" },
        { id: "two", title: "타이틀", description: "서브타이틀" },
      ],
      previousLabel: "이전",
      nextLabel: "다음",
      moreLabel: "더 보기",
      imageLabel: "예시",
      playLabel: "슬라이드 재생",
      stopLabel: "슬라이드 멈춤",
      current: 0,
    },
    eventLabel: "배너 캐러셀",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "다음" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("click");
  },
  parameters: { ...fixtureParameters("carousel-banner.default", ["default", "focus-visible"]) },
};

const options = [
  { value: "one", label: "항목1" },
  { value: "two", label: "항목2" },
  { value: "three", label: "항목3" },
  { value: "four", label: "항목4" },
];

const selectProps = {
  id: "svelte-select",
  label: "레이블",
  hint: "도움말",
  title: "선택",
  options,
  modelValue: "one",
};

export const Select: Story = {
  name: "Select · default",
  args: { component: "Select", componentProps: selectProps, eventLabel: "선택" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "레이블" }), "two");
    await expect(canvas.getByRole("status")).toHaveTextContent("change");
  },
  parameters: { ...fixtureParameters("select.default", ["default", "focus-visible"]) },
};

export const SelectSize: Story = {
  name: "Select · large size",
  args: {
    component: "SelectSize",
    componentProps: { ...selectProps, id: "svelte-select-size", size: "large" },
    eventLabel: "선택 크기",
  },
  parameters: { ...fixtureParameters("select-size.default", ["default", "focus-visible"]) },
};

export const SelectSorting: Story = {
  name: "Select · sorting",
  args: {
    component: "SelectSorting",
    componentProps: {
      ...selectProps,
      id: "svelte-select-sorting",
      options: [
        { value: "relevance", label: "관련도순" },
        { value: "latest", label: "최신순" },
        { value: "popular", label: "인기순" },
      ],
      modelValue: "relevance",
    },
    eventLabel: "정렬 선택",
  },
  parameters: { ...fixtureParameters("select-sorting.default", ["default", "focus-visible"]) },
};

export const SelectState: Story = {
  name: "Select · error state",
  args: {
    component: "SelectState",
    componentProps: { ...selectProps, id: "svelte-select-state", state: "error" },
    eventLabel: "선택 상태",
  },
  parameters: { ...fixtureParameters("select-state.default", ["default", "focus-visible"]) },
};

export const Resize: Story = {
  name: "Resize · text scale menu",
  args: {
    component: "Resize",
    componentProps: {
      id: "svelte-resize",
      label: "화면크기",
      selected: "md",
      defaultValue: "md",
      selectedLabel: "선택됨",
      resetLabel: "초기화",
      hint: "선택됨",
      actionLabel: "초기화",
      options: [
        { value: "sm", label: "작게" },
        { value: "md", label: "보통" },
        { value: "lg", label: "조금 크게" },
        { value: "xlg", label: "크게" },
        { value: "xxlg", label: "가장 크게" },
      ],
    },
    eventLabel: "화면 크기",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "화면크기" }));
    await userEvent.click(canvas.getByRole("button", { name: "크게" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("click");
  },
  parameters: { ...fixtureParameters("resize.default", ["default", "focus-visible"]) },
};

export const StepIndicator: Story = {
  name: "Step indicator · five steps",
  args: {
    component: "StepIndicator",
    componentProps: {
      id: "svelte-step-indicator",
      current: 3,
      label: "단계",
      message: "현재단계",
      steps: [
        { id: "1", label: "단계 레이블" },
        { id: "2", label: "단계 레이블" },
        { id: "3", label: "단계 레이블" },
        { id: "4", label: "단계 레이블" },
        { id: "5", label: "단계 레이블" },
      ],
    },
    eventLabel: "단계 표시",
  },
  parameters: { ...fixtureParameters("step-indicator.default", ["default"]) },
};

export const Pagination: Story = {
  name: "Pagination · current page 4",
  args: {
    component: "Pagination",
    componentProps: {
      id: "svelte-pagination",
      current: 4,
      items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
      message: "현재페이지",
      previousDisabled: true,
      previousLabel: "이전",
      nextLabel: "다음",
    },
    eventLabel: "페이지네이션",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: "5" }));
    await expect(canvas.getByRole("status")).toHaveTextContent("click");
  },
  parameters: { ...fixtureParameters("pagination.default", ["default", "focus-visible"]) },
};

export const Tab: Story = {
  name: "Tab · selected panel",
  args: {
    component: "Tab",
    componentProps: {
      id: "svelte-tab-data",
      tabs: [
        { id: "login_01", label: "타이틀 1" },
        { id: "login_02", label: "타이틀 2" },
      ],
      panels: { login_01: "탭 1 영역", login_02: "탭 2 영역" },
      modelValue: "login_01",
      message: "선택됨",
    },
    eventLabel: "탭",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "타이틀 2" }));
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("탭 2 영역");
  },
  parameters: { ...fixtureParameters("tab.default", ["default", "focus-visible"]) },
};

export const StructuredList: Story = {
  name: "Structured list · service cards",
  args: {
    component: "StructuredList",
    componentProps: {
      id: "svelte-structured-list",
      items: [
        {
          id: "1",
          title: "타이틀 영역",
          description: "간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다.",
          href: "#",
          badge: "뱃지",
        },
        {
          id: "2",
          title: "타이틀 영역",
          description: "간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다.",
          href: "#",
          badge: "뱃지",
        },
        {
          id: "3",
          title: "타이틀 영역",
          description: "간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다.",
          href: "#",
          badge: "뱃지",
        },
      ],
      dateLabel: "신청 기간",
      dateValue: "2023.00.00-2024.00.00",
      tags: ["태그", "태그"],
      actionLabel: "신청하기",
      shareLabel: "공유하기",
      favoriteLabel: "찜하기",
    },
    eventLabel: "구조화 목록",
  },
  parameters: { ...fixtureParameters("structured-list.default", ["default", "focus-visible"]) },
};

const structuredTableProps = {
  id: "svelte-structured-list-table",
  className: "sample",
  selectAllLabel: "전체선택",
  actions: Array.from({ length: 4 }, (_, index) => ({
    id: `action-${index + 1}`,
    label: "핵심버튼",
    icon: "down",
  })),
  countLabel: "목록 표시 개수",
  countOptions: ["10개", "9개"],
  sortLabel: "정렬기준",
  sortOptions: ["관련도순", "최신순", "인기순"],
  sortValue: "관련도순",
  caption: "000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.",
  columns: [
    { key: "selected", label: "선택", width: "5%" },
    { key: "type", label: "유형", width: "10%" },
    { key: "title", label: "제목", width: "15%" },
    { key: "content", label: "내용", width: "30%" },
    { key: "download", label: "다운로드", visuallyHidden: true, width: "10%" },
    { key: "date", label: "게시일", width: "10%" },
  ],
  rows: Array.from({ length: 7 }, (_, index) => ({
    id: String(index + 1),
    selected: false,
    type: "유형",
    title: "타이틀 영역",
    content: "간단한 내용이 들어간는 영역입니다.",
    download: "다운로드",
    date: "2025.12.17",
  })),
  pagination: {
    current: 4,
    items: [1, 2, 3, 4, 5, 6, 7, 8, "ellipsis", 99],
    previousDisabled: true,
    previousLabel: "이전",
    nextLabel: "다음",
    currentLabel: "현재페이지",
  },
};

export const StructuredListTable: Story = {
  name: "Structured list table · selectable rows",
  args: {
    component: "StructuredListTable",
    componentProps: structuredTableProps,
    eventLabel: "구조화 표",
  },
  parameters: {
    ...fixtureParameters("structured-list-table.default", ["default", "focus-visible"]),
  },
};

const repeatedContent = Array.from({ length: 13 }, () => "내용이 들어갑니다.").join(" ");

export const Table: Story = {
  name: "Table · caption and row headers",
  args: {
    component: "Table",
    componentProps: {
      id: "svelte-table",
      caption:
        "000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.",
      columns: [
        { key: "title", label: "제목1", width: "30%" },
        { key: "content", label: "제목2" },
      ],
      rows: [
        { title: "제목1-1", content: repeatedContent },
        { title: "제목1-2", content: "내용이 들어갑니다." },
        {
          title: "제목1-3",
          content: Array.from({ length: 4 }, () => "내용이 들어갑니다.").join(" "),
        },
      ],
    },
    eventLabel: "표",
  },
  parameters: { ...fixtureParameters("table.default", ["default"]) },
};
