import {
  For,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
} from "solid-js";

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
}

export function SearchSuggestions(rawProps: SearchSuggestionsProps) {
  const merged = mergeProps(
    {
      minLength: 2,
      debounceMs: 300,
      emptyMessage: "검색 결과가 없습니다.",
      loadingMessage: "검색 중입니다.",
      disabled: false,
      id: `krds-search-suggestions-${createUniqueId()}`,
    },
    rawProps,
  );
  const [props, nativeProps] = splitProps(merged, [
    "label",
    "suggest",
    "suggestions",
    "minLength",
    "debounceMs",
    "onSelect",
    "emptyMessage",
    "loadingMessage",
    "className",
  ]);
  const listboxId = `${nativeProps.id}-listbox`;
  const statusId = `${nativeProps.id}-status`;
  const optionId = (index: number) => `${nativeProps.id}-option-${index}`;

  const [value, setValue] = createSignal("");
  const [items, setItems] = createSignal<SearchSuggestion[]>([]);
  const [open, setOpen] = createSignal(false);
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const [status, setStatus] = createSignal("");
  // 진행 중인 suggest 요청을 무효화하기 위한 토큰. 새 입력마다 증가시켜
  // 이전 요청의 결과가 늦게 도착해도 반영되지 않게 한다.
  let requestToken = 0;
  let inputElement: HTMLInputElement | undefined;

  // 참조 DOM 계약: value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 계약과 동일).
  createEffect(() => {
    const current = value();
    if (current) inputElement?.setAttribute("value", current);
    else inputElement?.removeAttribute("value");
  });

  const announce = (nextItems: SearchSuggestion[]) => {
    setStatus(
      nextItems.length > 0
        ? `${nextItems.length}개의 추천 검색어가 표시되었습니다.`
        : props.emptyMessage,
    );
  };

  const resolveSuggestions = (query: string) => {
    if (props.suggest) {
      const requestId = ++requestToken;
      setStatus(props.loadingMessage);
      Promise.resolve(props.suggest(query)).then((result) => {
        if (requestToken !== requestId) return;
        setItems(result);
        setOpen(result.length > 0);
        setActiveIndex(-1);
        announce(result);
      });
      return;
    }
    const result = (props.suggestions ?? []).filter((item) => item.label.includes(query));
    setItems(result);
    setOpen(result.length > 0);
    setActiveIndex(-1);
    announce(result);
  };

  // value 변경 → (async: 디바운스 후 suggest 호출 | static: 즉시 필터)
  createEffect(() => {
    const query = value().trim();
    requestToken += 1;
    if (query.length < props.minLength) {
      setItems([]);
      setOpen(false);
      setActiveIndex(-1);
      setStatus("");
      return;
    }
    if (props.suggest) {
      const timer = window.setTimeout(() => resolveSuggestions(query), props.debounceMs);
      onCleanup(() => window.clearTimeout(timer));
      return;
    }
    resolveSuggestions(query);
  });

  const selectItem = (item: SearchSuggestion) => {
    setValue(item.label);
    setOpen(false);
    setActiveIndex(-1);
    setStatus("");
    props.onSelect?.(item);
  };

  const onInputKeyDown = (event: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
    if (event.key === "Escape") {
      if (open()) {
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }
    if (!open() || items().length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % items().length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + items().length) % items().length);
    } else if (event.key === "Enter" && activeIndex() >= 0) {
      event.preventDefault();
      const item = items()[activeIndex()];
      if (item) selectItem(item);
    }
  };

  return (
    <div class={`krds-search-suggestions${props.className ? ` ${props.className}` : ""}`}>
      <div class="form-group">
        <div class="form-tit">
          <label for={nativeProps.id}>{props.label}</label>
        </div>
        <div class="form-conts">
          <input
            id={nativeProps.id}
            ref={(element) => {
              inputElement = element;
            }}
            class="krds-input"
            type="text"
            name={nativeProps.name}
            value={value()}
            placeholder={nativeProps.placeholder}
            disabled={nativeProps.disabled}
            role="combobox"
            aria-expanded={open()}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              open() && activeIndex() >= 0 ? optionId(activeIndex()) : undefined
            }
            aria-describedby={statusId}
            onInput={(event) => setValue(event.currentTarget.value)}
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
        class="krds-suggestions-list"
        hidden={!open()}
        // 목록 클릭 시 입력 필드 blur를 막아 onClick이 동작하도록 한다.
        onMouseDown={(event) => event.preventDefault()}
      >
        <For each={items()}>
          {(item, index) => (
            <li
              id={optionId(index())}
              role="option"
              aria-selected={index() === activeIndex()}
              class={`krds-suggestions-item${index() === activeIndex() ? " is-active" : ""}`}
              onClick={() => selectItem(item)}
            >
              {item.label}
            </li>
          )}
        </For>
      </ul>
      <p id={statusId} class="sr-only" aria-live="polite">
        {status()}
      </p>
    </div>
  );
}
