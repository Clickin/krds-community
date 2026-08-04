import { useEffect, useId, useRef, useState, type KeyboardEvent, type Ref } from "react";
import { cx } from "@krds-community/recipes";

/**
 * 검색어 입력 시 실시간 추천 검색어를 제공하는 combobox 컴포넌트 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(service_02_03.html: 실시간 검색어 제안 — ↑↓/Enter/Esc, Status Messages)을
 * 참조해 동일한 키보드·접근성 계약을 구현한다.
 *
 * 백엔드 배선: `suggest` 콜백이 검색어를 받아 제안 목록을 반환한다. 데모/문서/
 * 테스트에서는 `suggestions` 정적 목록을 주면 클라이언트에서 필터링한다.
 */

export interface SearchSuggestion {
  id: string;
  label: string;
  /** 폼 제출/선택 시 사용할 값. 기본값은 label. */
  value?: string;
}

export interface SearchSuggestionsProps {
  label: string;
  name?: string;
  placeholder?: string;
  /** 백엔드 배선: 검색어(query) → 제안 목록. 실서비스에서 사용한다. */
  suggest?: (query: string) => Promise<SearchSuggestion[]> | SearchSuggestion[];
  /** 정적 제안 목록(내부 JSON 백엔드). `suggest`가 있으면 무시된다. */
  suggestions?: SearchSuggestion[];
  /** 제안 요청을 시작하는 최소 글자 수. 기본 2. */
  minLength?: number;
  /** `suggest` 모드 디바운스(ms). 기본 300. */
  debounceMs?: number;
  onSelect?: (item: SearchSuggestion) => void;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
}

export function SearchSuggestions({
  label,
  name,
  placeholder,
  suggest,
  suggestions,
  minLength = 2,
  debounceMs = 300,
  onSelect,
  emptyMessage = "검색 결과가 없습니다.",
  loadingMessage = "검색 중입니다.",
  disabled = false,
  className,
  id: providedId,
  ref,
}: SearchSuggestionsProps) {
  const generatedId = useId();
  const id = providedId ?? `krds-search-suggestions-${generatedId}`;
  const listboxId = `${id}-listbox`;
  const statusId = `${id}-status`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const [value, setValue] = useState("");
  const [items, setItems] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState("");
  const requestRef = useRef(0);

  const announce = (nextItems: SearchSuggestion[]) => {
    setStatus(
      nextItems.length > 0 ? `${nextItems.length}개의 추천 검색어가 표시되었습니다.` : emptyMessage,
    );
  };

  const resolveSuggestions = (query: string) => {
    if (suggest) {
      const requestId = ++requestRef.current;
      setStatus(loadingMessage);
      Promise.resolve(suggest(query)).then((result) => {
        if (requestRef.current !== requestId) return;
        setItems(result);
        setOpen(result.length > 0);
        setActiveIndex(-1);
        announce(result);
      });
      return;
    }
    const result = (suggestions ?? []).filter((item) => item.label.includes(query));
    setItems(result);
    setOpen(result.length > 0);
    setActiveIndex(-1);
    announce(result);
  };

  // value 변경 → (async: debounce 후 suggest 호출 | static: 즉시 필터)
  const debounceTimer = useRef<number | undefined>(undefined);
  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    const query = nextValue.trim();
    requestRef.current += 1;
    window.clearTimeout(debounceTimer.current);
    if (query.length < minLength) {
      setItems([]);
      setOpen(false);
      setActiveIndex(-1);
      setStatus("");
      return;
    }
    if (suggest) {
      debounceTimer.current = window.setTimeout(() => resolveSuggestions(query), debounceMs);
    } else {
      resolveSuggestions(query);
    }
  };
  useEffect(() => () => window.clearTimeout(debounceTimer.current), []);

  const selectItem = (item: SearchSuggestion) => {
    setValue(item.label);
    setOpen(false);
    setActiveIndex(-1);
    setStatus("");
    onSelect?.(item);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }
    if (!open || items.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      const item = activeIndex >= 0 ? items[activeIndex] : undefined;
      if (item) {
        event.preventDefault();
        selectItem(item);
      }
    }
  };

  return (
    <div className={cx("krds-search-suggestions", className)}>
      <div className="form-group">
        <div className="form-tit">
          <label htmlFor={id}>{label}</label>
        </div>
        <div className="form-conts">
          <input
            id={id}
            ref={ref}
            className="krds-input"
            type="text"
            name={name}
            // value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
            value={value || undefined}
            placeholder={placeholder}
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-describedby={statusId}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={onInputKeyDown}
            onBlur={() => {
              setOpen(false);
              setActiveIndex(-1);
            }}
          />
        </div>
      </div>
      <ul
        id={listboxId}
        role="listbox"
        aria-label="추천 검색어"
        className="krds-suggestions-list"
        hidden={!open}
        // 목록 클릭 시 입력 필드 blur를 막아 onClick이 동작하도록 한다.
        onMouseDown={(event) => event.preventDefault()}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={cx("krds-suggestions-item", index === activeIndex && "is-active")}
            onClick={() => selectItem(item)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <p id={statusId} className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
