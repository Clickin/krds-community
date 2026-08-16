import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import type { KrdsTone } from "@krds-community/recipes";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-badge",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <span
      [class]="
        'krds-badge ' +
        (size !== 'medium' ? size + ' ' : '') +
        (appearance === 'outline' ? 'outline-' : appearance === 'light' ? 'bg-light-' : 'bg-') +
        tone +
        (number ? ' number' : '')
      "
      >{{ label }}</span
    >
  `,
})
export class KrdsBadgeComponent {
  @Input() id = createStableId("krds-badge");
  @Input() label = "레이블";
  @Input() tone: KrdsTone = "primary";
  @Input() appearance: "outline" | "solid" | "light" = "outline";
  @Input() size = "medium";
  @Input() number = false;
}
@Component({
  selector: "krds-badge-number",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <span
      [class]="
        'krds-badge ' +
        (size !== 'medium' ? size + ' ' : '') +
        (appearance === 'outline' ? 'outline-' : appearance === 'light' ? 'bg-light-' : 'bg-') +
        tone +
        (number ? ' number' : '')
      "
      >{{ label }}</span
    >
  `,
})
export class KrdsBadgeNumberComponent extends KrdsBadgeComponent {
  @Input() override number = true;
}
export { KrdsBadgeComponent as KrdsBadgeSizeComponent };
