import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import type { OnDestroy } from "@angular/core";

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

export interface KrdsSearchSuggestion {
  id: string;
  label: string;
  /** 폼 제출/선택 시 사용할 값. 기본값은 label. */
  value?: string;
}

let nextSearchSuggestionsId = 0;

// components.ts의 createStableId와 동일한 로컬 카운터 패턴 (공식 모듈 import 금지).
function createStableId(prefix: string): string {
  nextSearchSuggestionsId += 1;
  return `${prefix}-${nextSearchSuggestionsId.toString(36)}`;
}

@Component({
  selector: "krds-search-suggestions",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="'krds-search-suggestions' + (className ? ' ' + className : '')">
    <div class="form-group">
      <div class="form-tit">
        <label [for]="id">{{ label }}</label>
      </div>
      <div class="form-conts">
        <input
          [id]="id"
          class="krds-input"
          type="text"
          [attr.name]="name"
          [value]="value"
          [attr.value]="value || null"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.role]="'combobox'"
          [attr.aria-expanded]="open"
          [attr.aria-controls]="listboxId"
          aria-autocomplete="list"
          [attr.aria-activedescendant]="open && activeIndex >= 0 ? optionId(activeIndex) : null"
          [attr.aria-describedby]="statusId"
          (input)="onInput($event)"
          (keydown)="onKeydown($event)"
          (blur)="onBlur()"
        />
      </div>
    </div>
    <ul
      [id]="listboxId"
      role="listbox"
      aria-label="추천 검색어"
      class="krds-suggestions-list"
      [hidden]="!open"
      (mousedown)="onListMouseDown($event)"
    >
      @for (item of items; track item.id; let index = $index) {
        <li
          [id]="optionId(index)"
          role="option"
          [attr.aria-selected]="index === activeIndex"
          [class]="'krds-suggestions-item' + (index === activeIndex ? ' is-active' : '')"
          (click)="selectItem(item)"
        >
          {{ item.label }}
        </li>
      }
    </ul>
    <p [id]="statusId" class="sr-only" aria-live="polite">{{ status }}</p>
  </div>`,
})
export class KrdsSearchSuggestionsComponent implements OnDestroy {
  @Input() label = "";
  @Input() name: string | null = null;
  @Input() placeholder = "";
  /** 백엔드 배선: 검색어(query) → 제안 목록. 실서비스에서 사용한다. */
  @Input() suggest?: (query: string) => Promise<KrdsSearchSuggestion[]> | KrdsSearchSuggestion[];
  /** 정적 제안 목록(내부 JSON 백엔드). `suggest`가 있으면 무시된다. */
  @Input() suggestions?: KrdsSearchSuggestion[];
  /** 제안 요청을 시작하는 최소 글자 수. 기본 2. */
  @Input() minLength = 2;
  /** `suggest` 모드 디바운스(ms). 기본 300. */
  @Input() debounceMs = 300;
  @Input() emptyMessage = "검색 결과가 없습니다.";
  @Input() loadingMessage = "검색 중입니다.";
  @Input() disabled = false;
  @Input() className = "";
  @Input() id = createStableId("krds-search-suggestions");
  @Output() selected = new EventEmitter<KrdsSearchSuggestion>();

  value = "";
  items: KrdsSearchSuggestion[] = [];
  open = false;
  activeIndex = -1;
  status = "";

  private requestToken = 0;
  private timer: number | null = null;
  private readonly changeDetector = inject(ChangeDetectorRef);

  get listboxId(): string {
    return `${this.id}-listbox`;
  }

  get statusId(): string {
    return `${this.id}-status`;
  }

  optionId(index: number): string {
    return `${this.id}-option-${index}`;
  }

  ngOnDestroy(): void {
    this.requestToken += 1;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onValueChange();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      if (this.open) {
        event.preventDefault();
        this.open = false;
        this.activeIndex = -1;
      }
      return;
    }
    if (!this.open || this.items.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.items.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.items.length) % this.items.length;
    } else if (event.key === "Enter" && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectItem(this.items[this.activeIndex]!);
    }
  }

  onBlur(): void {
    this.open = false;
    this.activeIndex = -1;
  }

  /** 목록 클릭 시 입력 필드 blur를 막아 onClick이 동작하도록 한다. */
  onListMouseDown(event: Event): void {
    event.preventDefault();
  }

  selectItem(item: KrdsSearchSuggestion): void {
    this.value = item.label;
    this.open = false;
    this.activeIndex = -1;
    this.status = "";
    this.selected.emit(item);
  }

  private onValueChange(): void {
    const query = this.value.trim();
    this.requestToken += 1;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (query.length < this.minLength) {
      this.items = [];
      this.open = false;
      this.activeIndex = -1;
      this.status = "";
      return;
    }
    if (this.suggest) {
      this.status = this.loadingMessage;
      const requestId = this.requestToken;
      this.timer = window.setTimeout(() => {
        this.timer = null;
        Promise.resolve(this.suggest!(query)).then((result) => {
          if (this.requestToken !== requestId) return;
          this.items = result;
          this.open = result.length > 0;
          this.activeIndex = -1;
          this.announce(result);
          this.changeDetector.markForCheck();
        });
      }, this.debounceMs);
      return;
    }
    const result = (this.suggestions ?? []).filter((item) => item.label.includes(query));
    this.items = result;
    this.open = result.length > 0;
    this.activeIndex = -1;
    this.announce(result);
  }

  private announce(nextItems: KrdsSearchSuggestion[]): void {
    this.status =
      nextItems.length > 0
        ? `${nextItems.length}개의 추천 검색어가 표시되었습니다.`
        : this.emptyMessage;
  }
}
