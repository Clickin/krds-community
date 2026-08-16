import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-button-hierarchy, krds-button-size",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <button [attr.type]="type" [class]="'krds-btn ' + (variant || tone)" [disabled]="disabled">
      @if (label) {
        {{ label }}
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
})
export class KrdsButtonHierarchyComponent {
  @Input() id = createStableId("krds-button-hierarchy");
  @Input() type = "button";
  @Input() variant = "primary";
  @Input() tone = "primary";
  @Input() disabled = false;
  @Input() label = "";
}

@Component({
  selector: "krds-button-size",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <button [attr.type]="type" [class]="'krds-btn ' + size" [disabled]="disabled">
      @if (label) {
        {{ label }}
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
})
export class KrdsButtonSizeComponent {
  @Input() id = createStableId("krds-button-size");
  @Input() type = "button";
  @Input() size = "medium";
  @Input() disabled = false;
  @Input() label = "";
}
