/** @jsxImportSource solid-js */
import type { Meta, StoryObj } from "@storybook/html-vite";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { expect, userEvent, within } from "storybook/test";
import {
  FilterableList,
  SearchSuggestions,
  ValidatedInput,
} from "@krds-community/solid/extra";
import {
  FILTERABLE_LIST_FILTERS,
  FILTERABLE_LIST_ITEMS,
  FILTERABLE_LIST_SORT,
  SEARCH_SUGGESTIONS,
  VALIDATED_INPUT_PROPS,
} from "../../shared/story-props";

// 공용 props는 `as const` readonly라 컴포넌트 props(가변 배열)에 맞게 풀어 쓴다.
const filterableItems = FILTERABLE_LIST_ITEMS.map((item) => ({ ...item }));
const filterableFilters = FILTERABLE_LIST_FILTERS.map((filter) => ({
  id: filter.id,
  label: filter.label,
  field: filter.field,
  options: filter.options.map((option) => ({ value: option.value, label: option.label })),
}));

const meta = { title: "SolidJS/Extra", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const mount = (element: JSX.Element): HTMLElement => {
  const root = document.createElement("div");
  root.style.cssText = "max-width:30rem";
  render(() => element, root);
  return root;
};

export const SearchSuggestionsRender: Story = {
  render: () => mount(<SearchSuggestions label="검색어" suggestions={[...SEARCH_SUGGESTIONS]} />),
};

export const ValidatedInputRender: Story = {
  render: () =>
    mount(
      <ValidatedInput
        {...VALIDATED_INPUT_PROPS}
        validate="min-length:4"
        mode="focusout"
      />,
    ),
};

export const FilterableListRender: Story = {
  render: () =>
    mount(
      <FilterableList
        items={filterableItems}
        filters={filterableFilters}
        sort={FILTERABLE_LIST_SORT}
      />,
    ),
};

export const SearchSuggestionsInteraction: Story = {
  render: () => mount(<SearchSuggestions label="검색어" suggestions={[...SEARCH_SUGGESTIONS]} />),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "검색어" });
    await userEvent.type(input, "건강");
    await expect(canvas.getAllByRole("option")).toHaveLength(3);
  },
};
