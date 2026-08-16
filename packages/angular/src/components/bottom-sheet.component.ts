import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  type SimpleChanges,
} from "@angular/core";
import { createStableId } from "../kinds";

const CLOSE_ANIMATION_MS = 200;

@Component({
  selector: "krds-bottom-sheet",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    @if (rendered) {
      <div
        [class]="'krds-bottom-sheet' + (closing ? ' closing' : '')"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="title ? id + '-title' : null"
      >
        <button
          type="button"
          class="bottom-sheet-overlay"
          data-close
          [attr.aria-label]="closeLabel"
          (click)="close()"
        ></button>
        <div class="bottom-sheet-panel" role="document">
          <button
            type="button"
            class="bottom-sheet-handle"
            aria-hidden="true"
            tabindex="-1"
          ></button>
          @if (title) {
            <div class="bottom-sheet-header">
              <h2 [id]="id + '-title'" class="bottom-sheet-title">{{ title }}</h2>
              @if (description) {
                <p class="bottom-sheet-description">{{ description }}</p>
              }
            </div>
          }
          <div class="bottom-sheet-body">
            @if (items.length) {
              <ul class="bottom-sheet-options">
                @for (item of items; track $index) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
            <ng-content></ng-content>
          </div>
          <button
            type="button"
            class="krds-btn medium icon bottom-sheet-close"
            [attr.aria-label]="closeLabel"
            (click)="close()"
          >
            <i class="svg-icon ico-modal-close"></i>
          </button>
        </div>
      </div>
    }
  `,
})
export class KrdsBottomSheetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id = createStableId("krds-bottom-sheet");
  @Input() open: boolean | undefined = undefined;
  @Input() defaultOpen = false;
  @Input() title = "";
  @Input() description = "";
  // Options list rendered as `bottom-sheet-options` (react demo contract).
  // ng-content children are not projected by astro-angular, so demos pass
  // options via this prop instead.
  @Input() items: string[] = [];
  @Input() closeLabel = "닫기";
  @Output() openChange = new EventEmitter<boolean>();

  rendered = false;
  closing = false;
  private closeTimer: number | null = null;
  private lastFocused: HTMLElement | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  get isControlled(): boolean {
    return this.open !== undefined;
  }

  ngOnInit(): void {
    if (this.isControlled ? this.open === true : this.defaultOpen) {
      this.rendered = true;
      this.openPanel();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!("open" in changes)) return;
    if (this.open === true) {
      this.closing = false;
      this.rendered = true;
      this.clearCloseTimer();
      this.openPanel();
    } else if (this.open === false && this.rendered) {
      this.beginClose();
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.detachKeydown();
  }

  close(): void {
    if (this.isControlled) {
      this.openChange.emit(false);
    } else {
      this.beginClose();
    }
  }

  private openPanel(): void {
    if (typeof window === "undefined") return;
    this.attachKeydown();
    this.lastFocused =
      typeof document === "undefined" ? null : (document.activeElement as HTMLElement | null);
    window.setTimeout(() => {
      this.panelFocusables()[0]?.focus();
    }, 0);
  }

  private beginClose(): void {
    if (typeof window === "undefined") return;
    if (!this.rendered || this.closing) return;
    this.closing = true;
    this.clearCloseTimer();
    this.detachKeydown();
    this.lastFocused?.focus();
    this.lastFocused = null;
    this.closeTimer = window.setTimeout(() => {
      this.closeTimer = null;
      this.rendered = false;
      this.closing = false;
      if (!this.isControlled) {
        this.openChange.emit(false);
      }
      this.changeDetector.markForCheck();
    }, CLOSE_ANIMATION_MS);
    this.changeDetector.markForCheck();
  }

  private panelFocusables(): HTMLElement[] {
    const panel = (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>(
      ".bottom-sheet-panel",
    );
    if (!panel) return [];
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  private attachKeydown(): void {
    if (this.keydownHandler !== null || typeof document === "undefined") return;
    this.keydownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = this.panelFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", this.keydownHandler);
  }

  private detachKeydown(): void {
    if (this.keydownHandler !== null) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
