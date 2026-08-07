import { useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@krds-community/recipes";
import { Button } from "./Button.js";
import type { BoxProps } from "./_utils.js";

export interface SearchProps extends BoxProps {
  size?: "xlarge" | "large" | "medium";
  placeholder?: string;
  onSearch?: (value: string) => void;
  buttonLabel?: ReactNode;
}

export function Search({
  size = "large",
  placeholder = "검색어를 입력해 주세요",
  onSearch,
  buttonLabel = "검색",
  className,
}: SearchProps) {
  const [value, setValue] = useState("");

  const submit = () => onSearch?.(value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") submit();
  };

  return (
    <div className={cx("krds-search", size, className)}>
      <div className="search-input-wrap">
        <input
          type="search"
          className="krds-input"
          placeholder={placeholder}
          aria-label="검색어"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        type="button"
        size="large"
        variant="primary"
        aria-label={typeof buttonLabel === "string" ? buttonLabel : undefined}
        onClick={submit}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
