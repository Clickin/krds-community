import { CommonModule } from "@angular/common";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/angular";
import {
  KrdsFilterableListComponent,
  KrdsSearchSuggestionsComponent,
  KrdsValidatedInputComponent,
} from "@krds-community/angular/extra";
import {
  FILTERABLE_LIST_FILTERS,
  FILTERABLE_LIST_ITEMS,
  FILTERABLE_LIST_SORT,
  SEARCH_SUGGESTIONS,
  VALIDATED_INPUT_PROPS,
} from "../../shared/story-props";

const sharedImports = [
  CommonModule,
  KrdsSearchSuggestionsComponent,
  KrdsValidatedInputComponent,
  KrdsFilterableListComponent,
];

const meta = {
  title: "Angular/Extra 컴포넌트",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: { imports: sharedImports },
    }),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const SearchSuggestions: Story = {
  name: "SearchSuggestions · 렌더",
  render: () => ({
    template: `
      <krds-search-suggestions
        label="검색어"
        [suggestions]="suggestions"
      ></krds-search-suggestions>`,
    props: { suggestions: SEARCH_SUGGESTIONS },
  }),
  parameters: {
    docs: {
      description: {
        story:
          "검색어 입력 시 실시간 추천 검색어를 제공하는 combobox입니다. 정적 제안 목록을 주면 클라이언트에서 필터링합니다.",
      },
    },
  },
};

export const ValidatedInput: Story = {
  name: "ValidatedInput · 렌더",
  render: () => ({
    template: `
      <krds-validated-input
        [label]="label"
        [name]="name"
        [placeholder]="placeholder"
        [hint]="hint"
        [successMessage]="successMessage"
        [validate]="validate"
        [mode]="mode"
      ></krds-validated-input>`,
    props: { ...VALIDATED_INPUT_PROPS, validate: "min-length:4", mode: "focusout" },
  }),
  parameters: {
    docs: {
      description: {
        story:
          "포커스를 잃을 때 실시간으로 유효성을 검사하는 입력 필드입니다. 검증 결과에 따라 오류/성공 힌트와 aria-invalid를 표시합니다.",
      },
    },
  },
};

export const FilterableList: Story = {
  name: "FilterableList · 렌더",
  render: () => ({
    template: `
      <krds-filterable-list
        [items]="items"
        [filters]="filters"
        [sort]="sort"
      ></krds-filterable-list>`,
    props: {
      items: FILTERABLE_LIST_ITEMS,
      filters: FILTERABLE_LIST_FILTERS,
      sort: FILTERABLE_LIST_SORT,
    },
  }),
  parameters: {
    docs: {
      description: {
        story:
          "필터·정렬 옵션 선택 즉시 목록과 결과 건수를 갱신합니다. 정렬 방향 버튼으로 오름차순/내림차순을 토글합니다.",
      },
    },
  },
};

export const SearchSuggestionsInteraction: Story = {
  name: "SearchSuggestions · 상호작용",
  render: () => ({
    template: `
      <krds-search-suggestions
        label="검색어"
        [suggestions]="suggestions"
      ></krds-search-suggestions>`,
    props: { suggestions: SEARCH_SUGGESTIONS },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "검색어" });
    await userEvent.type(input, "건강");
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "검색어 입력 시 추천 목록이 실시간으로 표시됩니다. '건강' 입력 시 3개의 추천 검색어가 나타납니다.",
      },
    },
  },
};
