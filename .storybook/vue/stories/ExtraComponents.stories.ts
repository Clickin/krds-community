import { expect, userEvent, within } from "storybook/test";
import { h, type Component } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { FilterableList, SearchSuggestions, ValidatedInput } from "@krds-community/vue/extra";
import {
  FILTERABLE_LIST_FILTERS,
  FILTERABLE_LIST_ITEMS,
  FILTERABLE_LIST_SORT,
  SEARCH_SUGGESTIONS,
  VALIDATED_INPUT_PROPS,
} from "../../shared/story-props";

type StoryArgs = {
  [key: string]: unknown;
};

const meta = {
  title: "Vue/Extra 컴포넌트",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

const renderComponent = (component: Component, args: StoryArgs) => ({
  setup: () => () => h(component, args),
});

export const SearchSuggestionsStory: Story = {
  name: "검색 제안",
  render: (args) => renderComponent(SearchSuggestions, args),
  args: {
    label: "검색어",
    name: "search",
    placeholder: "검색어를 입력하세요",
    suggestions: [...SEARCH_SUGGESTIONS],
  },
};

export const ValidatedInputStory: Story = {
  name: "실시간 유효성 검사",
  render: (args) => renderComponent(ValidatedInput, args),
  args: {
    ...VALIDATED_INPUT_PROPS,
    validate: "min-length:4",
    mode: "focusout",
  },
};

export const FilterableListStory: Story = {
  name: "즉각 표시 필터·정렬 목록",
  render: (args) => renderComponent(FilterableList, args),
  args: {
    items: [...FILTERABLE_LIST_ITEMS],
    filters: [...FILTERABLE_LIST_FILTERS],
    sort: { ...FILTERABLE_LIST_SORT },
  },
};

export const SearchSuggestionsInteraction: Story = {
  name: "검색 제안 상호작용",
  render: (args) => renderComponent(SearchSuggestions, args),
  args: {
    label: "검색어",
    name: "search",
    placeholder: "검색어를 입력하세요",
    suggestions: [...SEARCH_SUGGESTIONS],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "검색어" });
    await userEvent.type(input, "건강");
    const options = await canvas.findAllByRole("option");
    await expect(options).toHaveLength(3);
    await expect(options[0]).toHaveTextContent("건강보험 자격 확인");
  },
};
