import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-tts, krds-tts-icon, krds-tts-size",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="ttsClass"
      [attr.aria-label]="effectiveKind === 'tts-icon' ? label || null : null"
      (click)="playing = !playing"
    >
      <span class="krds-tts-icon" aria-hidden="true">
        <i class="svg-icon ico-volume"></i>
      </span>
      @if (effectiveKind !== "tts-icon") {
        <span class="krds-tts-text">{{ label }}</span>
      }
    </button>
  `,
})
export class KrdsTtsComponent {
  @Input() id = createStableId("krds-tts");
  @Input() label = "레이블";
  @Input() kind: "tts" | "tts-icon" | "tts-size" | null = null;
  @Input() size = "medium";
  playing = false;

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "tts" | "tts-icon" | "tts-size";

  get effectiveKind(): "tts" | "tts-icon" | "tts-size" {
    return this.kind ?? this.hostTagKind;
  }

  get ttsClass(): string {
    return `krds-tts ${this.effectiveKind === "tts-size" ? this.size : "medium"}`;
  }
}
export { KrdsTtsComponent as KrdsTtsIconComponent, KrdsTtsComponent as KrdsTtsSizeComponent };
