import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-tooltip, krds-tooltip-box, krds-tooltip-vertical",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="tooltipClass"
      [attr.data-tooltip]="message"
      [attr.aria-labelledby]="tooltipPopoverId"
    >
      {{ label + " " }}<i class="svg-icon ico-angle right"></i>
    </button>
    <div [id]="tooltipPopoverId" class="krds-tooltip-popover" role="tooltip" aria-hidden="true">
      <span class="sr-only">{{ label }}</span>
      {{ message }}
    </div>
  `,
})
export class KrdsTooltipComponent {
  @Input() id = createStableId("krds-tooltip");
  @Input() label = "레이블";
  @Input() message = "도움말";
  @Input() kind: "tooltip" | "tooltip-box" | "tooltip-vertical" = "tooltip";

  get tooltipClass(): string {
    const variation =
      this.kind === "tooltip-box"
        ? " tooltip-box"
        : this.kind === "tooltip-vertical"
          ? " tooltip-vertical"
          : "";
    return `krds-btn small text krds-tooltip${variation}`;
  }

  get tooltipPopoverId(): string {
    return `${this.id}-tooltip`;
  }
}
export {
  KrdsTooltipComponent as KrdsTooltipBoxComponent,
  KrdsTooltipComponent as KrdsTooltipVerticalComponent,
};
