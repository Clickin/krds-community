import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FILTERABLE_LIST_FILTERS,
  FILTERABLE_LIST_ITEMS,
  FILTERABLE_LIST_SORT,
  SEARCH_SUGGESTIONS,
  VALIDATED_INPUT_PROPS,
} from "../../shared/story-props";
import { FilterableList, SearchSuggestions, ValidatedInput } from "@krds-community/react/extra";

const meta = {
  title: "React/Extra components",
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
  },
} satisfies Meta;
export default meta;

export const SearchSuggestionsStory: StoryObj<typeof meta> = {
  name: "SearchSuggestions",
  render: () => <SearchSuggestions label="검색어" suggestions={[...SEARCH_SUGGESTIONS]} />,
};

export const ValidatedInputStory: StoryObj<typeof meta> = {
  name: "ValidatedInput",
  render: () => (
    <ValidatedInput {...VALIDATED_INPUT_PROPS} validate="min-length:4" mode="focusout" />
  ),
};

export const FilterableListStory: StoryObj<typeof meta> = {
  name: "FilterableList",
  render: () => (
    <FilterableList
      items={[...FILTERABLE_LIST_ITEMS]}
      filters={[...FILTERABLE_LIST_FILTERS]}
      sort={{ ...FILTERABLE_LIST_SORT }}
    />
  ),
};

export const SearchSuggestionsInteraction: StoryObj<typeof meta> = {
  name: "SearchSuggestions 상호작용",
  render: () => <SearchSuggestions label="검색어" suggestions={[...SEARCH_SUGGESTIONS]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "검색어" });
    await userEvent.type(input, "건강");
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
  },
};
