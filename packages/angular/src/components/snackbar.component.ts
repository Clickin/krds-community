import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  selector: "krds-snackbar",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    @if (rendered) {
      <div [class]="'krds-snackbar' + (closing ? ' closing' : '')" role="alert">
        @if (icon) {
          <i class="svg-icon snackbar-icon {{ icon }}" aria-hidden="true"></i>
        }
        <div class="snackbar-conts">
          @if (title) {
            <strong class="snackbar-title">{{ title }}</strong>
          }
          <p class="snackbar-text">{{ message }}</p>
        </div>
        @if (actionLabel) {
          <button type="button" class="krds-btn small text snackbar-action" (click)="emitAction()">
            {{ actionLabel }}
          </button>
        }
        <button
          type="button"
          class="krds-btn small icon snackbar-close"
          [attr.aria-label]="closeLabel"
          (click)="close()"
        >
          <i class="svg-icon ico-modal-close"></i>
        </button>
      </div>
    }
  `,
})
export class KrdsSnackbarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id = createStableId("krds-snackbar");
  @Input() title = "";
  @Input() message = "";
  @Input() icon = "";
  @Input() actionLabel = "";
  @Input() closeLabel = "닫기";
  @Input() open: boolean | undefined = undefined;
  @Input() defaultOpen = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<void>();

  rendered = false;
  closing = false;
  private closeTimer: number | null = null;
  private readonly changeDetector = inject(ChangeDetectorRef);

  get isControlled(): boolean {
    return this.open !== undefined;
  }

  ngOnInit(): void {
    if (this.isControlled ? this.open === true : this.defaultOpen) {
      this.rendered = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!("open" in changes)) return;
    if (this.open === true) {
      this.closing = false;
      this.rendered = true;
      this.clearCloseTimer();
    } else if (this.open === false && this.rendered) {
      this.beginClose();
    }
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
  }

  close(): void {
    if (this.isControlled) {
      this.openChange.emit(false);
    } else {
      this.beginClose();
    }
  }

  emitAction(): void {
    this.action.emit();
  }

  private beginClose(): void {
    if (typeof window === "undefined") return;
    if (!this.rendered || this.closing) return;
    this.closing = true;
    this.clearCloseTimer();
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

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
