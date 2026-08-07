import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-alert",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'krds-alert ' + state + ' ' + size" role="status">
      <i class="svg-icon alert-icon {{ stateIcon }}" aria-hidden="true"></i>
      @if (title) {
        <strong class="alert-title">{{ title }}</strong>
      }
      <p class="alert-body">{{ message }}</p>
    </div>
  `,
})
export class KrdsAlertComponent {
  @Input() id = createStableId("krds-alert");
  @Input() state: "danger" | "warning" | "success" | "information" = "danger";
  @Input() size: "with-title" | "slim" = "slim";
  @Input() title = "";
  @Input() message = "";

  get stateIcon(): string {
    switch (this.state) {
      case "success":
        return "ico-success-fill";
      case "information":
        return "ico-information-fill";
      case "warning":
      case "danger":
      default:
        return "ico-error-fill";
    }
  }
}
