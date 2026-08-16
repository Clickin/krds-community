import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

// Shared markup; `kind` decides whether the label renders visibly (tts/tts-size)
// or only as the accessible name (tts-icon).
@Component({
  selector: "krds-tts",
  standalone: true,
  imports: [CommonModule],
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      [class]="ttsClass"
      [attr.aria-label]="kind === 'tts-icon' ? label || null : null"
      (click)="playing = !playing"
    >
      <span class="krds-tts-icon" aria-hidden="true">
        <i class="svg-icon ico-volume"></i>
      </span>
      @if (kind !== "tts-icon") {
        {{ " " }}<span class="krds-tts-text">{{ label }}</span>
      }
    </button>
  `,
})
export class KrdsTtsComponent {
  @Input() id = createStableId("krds-tts");
  @Input() label = "레이블";
  @Input() kind: "tts" | "tts-icon" | "tts-size" | null = "tts";
  @Input() size = "medium";
  playing = false;

  get ttsClass(): string {
    return `krds-tts ${this.kind === "tts-size" ? this.size : "medium"}`;
  }
}

@Component({
  selector: "krds-tts-icon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="krds-tts medium"
      (click)="playing = !playing"
    >
      <span class="krds-tts-icon" aria-hidden="true">
        <i class="svg-icon ico-volume"></i>
      </span>
      @if (label) {
        <span class="sr-only">{{ label }}</span>
      }
    </button>
  `,
})
export class KrdsTtsIconComponent {
  @Input() label = "텍스트 읽기";
  playing = false;
}

@Component({
  selector: "krds-tts-size",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <button type="button" [class]="'krds-tts ' + size" (click)="playing = !playing">
      <span class="krds-tts-icon" aria-hidden="true">
        <i class="svg-icon ico-volume"></i>
      </span>
      {{ " " }}<span class="krds-tts-text">{{ label }}</span>
    </button>
  `,
})
export class KrdsTtsSizeComponent {
  @Input() label = "텍스트 읽기";
  @Input() size = "medium";
  playing = false;
}
