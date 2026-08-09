<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

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

  type Props = SearchSuggestionsProps &
    Omit<
      HTMLAttributes<HTMLInputElement>,
      | 'children'
      | 'class'
      | 'id'
      | 'value'
      | 'name'
      | 'placeholder'
      | 'disabled'
      | 'role'
      | 'aria-expanded'
      | 'aria-controls'
      | 'aria-autocomplete'
      | 'aria-activedescendant'
      | 'aria-describedby'
      | 'oninput'
      | 'onkeydown'
      | 'onblur'
    >;

  const generatedId = $props.id();

  let {
    label,
    name,
    placeholder,
    suggest,
    suggestions = [],
    minLength = 2,
    debounceMs = 300,
    onSelect,
    emptyMessage = '검색 결과가 없습니다.',
    loadingMessage = '검색 중입니다.',
    disabled = false,
    className = '',
    id = `krds-search-suggestions-${generatedId}`,
    ...restProps
  }: Props = $props();

  const listboxId = $derived(`${id}-listbox`);
  const statusId = $derived(`${id}-status`);
  const optionId = $derived((index: number) => `${id}-option-${index}`);

  let value = $state('');
  let items = $state<SearchSuggestion[]>([]);
  let open = $state(false);
  let activeIndex = $state(-1);
  let status = $state('');
  // 선택 직후 value 변경으로 인한 재필터링(목록 재오픈)을 막는 플래그.
  let justSelected = false;
  // 진행 중인 suggest 요청을 무효화하기 위한 토큰 카운터.
  let requestId = 0;
  let inputElement: HTMLInputElement;
  // 참조 DOM 계약: value 속성은 비어 있지 않을 때만 렌더(공식 TextInput 패턴과 동일).
  $effect(() => {
    if (value) inputElement.setAttribute('value', value);
    else inputElement.removeAttribute('value');
  });

  const announce = (nextItems: SearchSuggestion[]) => {
    status =
      nextItems.length > 0
        ? `${nextItems.length}개의 추천 검색어가 표시되었습니다.`
        : emptyMessage;
  };

  const resolveSuggestions = (query: string) => {
    if (suggest) {
      const currentRequestId = ++requestId;
      status = loadingMessage;
      Promise.resolve(suggest(query)).then((result) => {
        if (requestId !== currentRequestId) return;
        items = result;
        open = result.length > 0;
        activeIndex = -1;
        announce(result);
      });
      return;
    }
    const result = (suggestions ?? []).filter((item) => item.label.includes(query));
    items = result;
    open = result.length > 0;
    activeIndex = -1;
    announce(result);
  };

  // 입력값 변경 → (suggest 모드: 디바운스 후 호출 | static 모드: 즉시 필터)
  $effect(() => {
    if (justSelected) {
      justSelected = false;
      return;
    }
    const query = value.trim();
    requestId += 1;
    if (query.length < minLength) {
      items = [];
      open = false;
      activeIndex = -1;
      status = '';
      return;
    }
    if (suggest) {
      const timer = setTimeout(() => resolveSuggestions(query), debounceMs);
      return () => clearTimeout(timer);
    }
    resolveSuggestions(query);
  });

  const selectItem = (item: SearchSuggestion) => {
    requestId += 1;
    justSelected = true;
    value = item.label;
    open = false;
    activeIndex = -1;
    status = '';
    onSelect?.(item);
  };

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        open = false;
        activeIndex = -1;
      }
      return;
    }
    if (!open || items.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectItem(items[activeIndex]);
    }
  };
</script>

<div class={`krds-search-suggestions${className ? ` ${className}` : ''}`}>
  <div class="form-group">
    <div class="form-tit">
      <label for={id}>{label}</label>
    </div>
    <div class="form-conts">
      <input
        {...restProps}
        {id}
        bind:this={inputElement}
        class="krds-input"
        type="text"
        {name}
        {value}
        {placeholder}
        {disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-describedby={statusId}
        oninput={(event) => {
          justSelected = false;
          value = event.currentTarget.value;
        }}
        onkeydown={onInputKeyDown}
        onblur={() => {
          open = false;
          activeIndex = -1;
        }}
      />
    </div>
  </div>
  <ul
    id={listboxId}
    role="listbox"
    aria-label="추천 검색어"
    class="krds-suggestions-list"
    hidden={!open}
    onmousedown={(event) => event.preventDefault()}
  >
    {#each items as item, index (item.id)}
      <li
        id={optionId(index)}
        role="option"
        aria-selected={index === activeIndex}
        class="krds-suggestions-item"
        class:is-active={index === activeIndex}
        onclick={() => selectItem(item)}
        onkeydown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectItem(item);
          }
        }}
      >
        {item.label}
      </li>
    {/each}
  </ul>
  <p id={statusId} class="sr-only" aria-live="polite">{status}</p>
</div>
