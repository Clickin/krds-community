import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

const TOOLTIP_TEMPLATE = `
    <button
      type="button"
      [class]="tooltipClass"
      [attr.data-tooltip]="message"
      [attr.aria-labelledby]="tooltipPopoverId"
      ><ng-content>{{ tooltipLabel }}</ng-content><i class="svg-icon ico-angle right"></i></button>
    <div [id]="tooltipPopoverId" class="krds-tooltip-popover" role="tooltip" aria-hidden="true">
      <span class="sr-only">{{ label }}</span> {{ message }}
    </div>
  `;

@Component({
  selector: "krds-tooltip",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: TOOLTIP_TEMPLATE,
})
export class KrdsTooltipComponent {
  @Input() id = createStableId("krds-tooltip");
  @Input() label = "레이블";
  @Input() message = "";
  @Input() kind: "tooltip" | "tooltip-box" | "tooltip-vertical" | null = null;

  get effectiveKind(): "tooltip" | "tooltip-box" | "tooltip-vertical" {
    return this.kind ?? "tooltip";
  }

  get tooltipLabel(): string {
    return `${this.label} `;
  }
  get tooltipClass(): string {
    const variation =
      this.effectiveKind === "tooltip-box"
        ? " tooltip-box"
        : this.effectiveKind === "tooltip-vertical"
          ? " tooltip-vertical"
          : "";
    return `krds-btn small text krds-tooltip${variation}`;
  }

  get tooltipPopoverId(): string {
    return `${this.id}-tooltip`;
  }
}

@Component({
  selector: "krds-tooltip-box",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: TOOLTIP_TEMPLATE,
})
export class KrdsTooltipBoxComponent extends KrdsTooltipComponent {
  override get effectiveKind(): "tooltip-box" {
    return "tooltip-box";
  }
}

@Component({
  selector: "krds-tooltip-vertical",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: TOOLTIP_TEMPLATE,
})
export class KrdsTooltipVerticalComponent extends KrdsTooltipComponent {
  override get effectiveKind(): "tooltip-vertical" {
    return "tooltip-vertical";
  }
}
