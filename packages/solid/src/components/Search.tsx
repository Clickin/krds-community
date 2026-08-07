import { createSignal, mergeProps, splitProps } from "solid-js";

export interface SearchProps {
  class?: string;
  className?: string;
  size?: "xlarge" | "large" | "medium";
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
  [key: string]: unknown;
}

export function Search(rawProps: SearchProps) {
  const merged = mergeProps(
    { size: "large" as const, placeholder: "검색어를 입력해 주세요", buttonLabel: "검색" },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "size",
    "placeholder",
    "buttonLabel",
    "onSearch",
  ]);

  const [value, setValue] = createSignal("");

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-search ${props.size}${className() ? ` ${className()}` : ""}`}
    >
      <div class="search-input-wrap">
        <input
          type="search"
          class="krds-input"
          placeholder={props.placeholder}
          aria-label="검색어"
          value={value()}
          onInput={(event) => setValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              props.onSearch?.(value());
            }
          }}
        />
      </div>
      <button
        type="button"
        class="krds-btn large primary"
        aria-label={props.buttonLabel}
        onClick={() => props.onSearch?.(value())}
      >
        {props.buttonLabel}
      </button>
    </div>
  );
}
