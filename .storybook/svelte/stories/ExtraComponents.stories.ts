import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import {
  FilterableList,
  SearchSuggestions,
  ValidatedInput,
} from "@krds-community/svelte/extra";
import {
  FILTERABLE_LIST_FILTERS,
  FILTERABLE_LIST_ITEMS,
  FILTERABLE_LIST_SORT,
  SEARCH_SUGGESTIONS,
  VALIDATED_INPUT_PROPS,
} from "../../shared/story-props";

const meta = {
  title: "Svelte/Extra",
  parameters: { layout: "padded", a11y: { test: "error" } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchSuggestionsRender: Story = {
  component: SearchSuggestions,
  args: {
    label: "검색어",
    placeholder: "검색어를 입력하세요",
    suggestions: SEARCH_SUGGESTIONS,
  },
};

export const ValidatedInputRender: Story = {
  component: ValidatedInput,
  args: {
    ...VALIDATED_INPUT_PROPS,
    validate: "min-length:4",
  },
};

export const FilterableListRender: Story = {
  component: FilterableList,
  args: {
    items: FILTERABLE_LIST_ITEMS,
    filters: FILTERABLE_LIST_FILTERS,
    sort: FILTERABLE_LIST_SORT,
  },
};

export const SearchSuggestionsInteraction: Story = {
  component: SearchSuggestions,
  args: {
    label: "검색어",
    placeholder: "검색어를 입력하세요",
    suggestions: SEARCH_SUGGESTIONS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "검색어" });
    await userEvent.type(input, "건강");
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
  },
};
