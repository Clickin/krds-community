import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-button-text, krds-button-with-icon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="'krds-btn text ' + (className || 'small')" [disabled]="disabled">
      @if (label) {
        {{ label }}
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
})
export class KrdsButtonTextComponent {
  @Input() id = createStableId("krds-button-text");
  @Input() className = "";
  @Input() disabled = false;
  @Input() label = "";
}

@Component({
  selector: "krds-button-with-icon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="'krds-btn ' + (className || size)" [disabled]="disabled">
      @if (label) {
        {{ label }}
      } @else {
        <ng-content></ng-content>
      }
      <i class="svg-icon ico-sch"></i>
    </button>
  `,
})
export class KrdsButtonWithIconComponent {
  @Input() id = createStableId("krds-button-with-icon");
  @Input() className = "";
  @Input() size = "medium";
  @Input() disabled = false;
  @Input() label = "";
}
