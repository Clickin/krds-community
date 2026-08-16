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
  selector: "krds-toast",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    @if (rendered) {
      <div
        [class]="'krds-toast' + (closing ? ' closing' : '')"
        [attr.role]="tone === 'warning' ? 'alert' : 'status'"
      >
        <p class="toast-text">{{ message }}</p>
      </div>
    }
  `,
})
export class KrdsToastComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id = createStableId("krds-toast");
  @Input() message = "";
  @Input() tone: "information" | "warning" = "information";
  @Input() open: boolean | undefined = undefined;
  @Input() defaultOpen = false;
  @Input() duration: number | undefined = undefined;
  @Output() openChange = new EventEmitter<boolean>();

  rendered = false;
  closing = false;
  private openTimer: number | null = null;
  private closeTimer: number | null = null;
  private readonly changeDetector = inject(ChangeDetectorRef);

  get isControlled(): boolean {
    return this.open !== undefined;
  }

  ngOnInit(): void {
    if (this.isControlled ? this.open === true : this.defaultOpen) {
      this.rendered = true;
      this.scheduleAutoClose();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!("open" in changes)) return;
    if (this.open === true) {
      this.closing = false;
      this.rendered = true;
      this.clearCloseTimer();
      this.scheduleAutoClose();
    } else if (this.open === false && this.rendered) {
      this.beginClose();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private scheduleAutoClose(): void {
    if (typeof window === "undefined") return;
    if (this.openTimer !== null) {
      window.clearTimeout(this.openTimer);
    }
    const delay = this.duration ?? (this.tone === "warning" ? 4000 : 3000);
    this.openTimer = window.setTimeout(() => {
      this.openTimer = null;
      if (this.isControlled) {
        this.openChange.emit(false);
      } else {
        this.beginClose();
      }
    }, delay);
  }

  private beginClose(): void {
    if (typeof window === "undefined") return;
    if (!this.rendered || this.closing) return;
    this.closing = true;
    this.clearTimers();
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

  private clearTimers(): void {
    if (this.openTimer !== null) {
      window.clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    this.clearCloseTimer();
  }
}
