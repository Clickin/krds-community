import { describe, expect, it } from "vitest";
import {
  accordionState,
  buttonRecipe,
  cx,
  inputRecipe,
  selectRecipe,
  type SelectRecipeOptions,
  tabRecipe,
} from "@krds-community/recipes";

describe("KRDS recipes", () => {
  it("uses official KRDS button classes and omits the default medium class", () => {
    expect(buttonRecipe({ variant: "primary", size: "large" })).toMatchObject({
      className: "krds-btn primary large",
      data: { variant: "primary", size: "large" },
    });
    expect(buttonRecipe({ variant: "primary", size: "medium" }).className).toBe("krds-btn primary");
  });

  it("merges consumer classes with clsx semantics", () => {
    expect(cx("krds-input", false, undefined, "consumer-class")).toBe("krds-input consumer-class");
    expect(inputRecipe({ state: "error" }).data.state).toBe("error");
  });

  it("keeps accordion state observable", () => {
    expect(accordionState(true)).toEqual({ expanded: "true", hidden: false });
    expect(accordionState(false)).toEqual({ expanded: "false", hidden: true });
  });

  it("maps the shared select variants to complete upstream class strings", () => {
    expect(selectRecipe()).toEqual({ control: "krds-form-select" });
    expect(selectRecipe({ variant: "default" })).toEqual({ control: "krds-form-select" });
    expect(selectRecipe({ variant: "size", size: "small" })).toEqual({
      control: "krds-form-select small",
    });
    expect(selectRecipe({ variant: "size", size: "medium" })).toEqual({
      control: "krds-form-select medium",
    });
    expect(selectRecipe({ variant: "size", size: "large" })).toEqual({
      control: "krds-form-select large",
    });
    expect(selectRecipe({ variant: "state", state: "error" })).toEqual({
      control: "krds-form-select is-error",
    });
    expect(selectRecipe({ variant: "sorting" })).toEqual({
      control: "krds-form-select-sort",
    });
    expect(selectRecipe({ variant: "sorting", state: "error" })).toEqual({
      control: "krds-form-select-sort is-error",
    });
  });

  it("composes select size and state modifiers in stable order", () => {
    expect(selectRecipe({ variant: "size", size: "small", state: "error" })).toEqual({
      control: "krds-form-select small is-error",
    });
    expect(selectRecipe({ variant: "state", state: "error", size: "large" })).toEqual({
      control: "krds-form-select large is-error",
    });
  });

  it("maps each select state without retaining stale modifiers", () => {
    expect(
      [
        selectRecipe({ variant: "state", state: "success" }),
        selectRecipe({ variant: "state", state: "information" }),
        selectRecipe({ variant: "state", state: "default" }),
      ].map(({ control }) => control),
    ).toEqual([
      "krds-form-select is-success",
      "krds-form-select is-information",
      "krds-form-select",
    ]);
  });

  it("supports sorting error state while isolating unsupported size", () => {
    const unsupportedSortingSize: SelectRecipeOptions = {
      variant: "sorting",
      // @ts-expect-error Sorting selects do not support size.
      size: "small",
    };

    expect(selectRecipe(unsupportedSortingSize)).toEqual({
      control: "krds-form-select-sort",
    });
    expect(
      [
        selectRecipe({ variant: "sorting", state: "error" }),
        selectRecipe({ variant: "sorting", state: "default" }),
        selectRecipe({ variant: "sorting" }),
      ].map(({ control }) => control),
    ).toEqual(["krds-form-select-sort is-error", "krds-form-select-sort", "krds-form-select-sort"]);
  });

  it("places tab layout and active modifiers on their shared slots", () => {
    expect(tabRecipe()).toEqual({
      root: "krds-tab-area layer",
      listContainer: "tab line full",
      item: undefined,
      trigger: "btn-tab",
    });
    expect(tabRecipe({ full: false, active: true })).toEqual({
      root: "krds-tab-area layer",
      listContainer: "tab line",
      item: "active",
      trigger: "btn-tab",
    });
  });

  it("omits the inactive tab class while preserving structural slots", () => {
    const states = [false, true, false].map((active) => tabRecipe({ active }));
    expect(states.map(({ item }) => item)).toEqual([undefined, "active", undefined]);
    expect(states.map(({ root }) => root)).toEqual([
      "krds-tab-area layer",
      "krds-tab-area layer",
      "krds-tab-area layer",
    ]);
    expect(states.map(({ listContainer }) => listContainer)).toEqual([
      "tab line full",
      "tab line full",
      "tab line full",
    ]);
  });
});
