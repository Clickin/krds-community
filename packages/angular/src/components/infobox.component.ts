import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-infobox",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div [class]="'krds-infobox ' + type + ' ' + size" role="region" [attr.aria-label]="ariaLabel">
      <p class="infobox-text">{{ message }}</p>
    </div>
  `,
})
export class KrdsInfoboxComponent {
  @Input() id = createStableId("krds-infobox");
  @Input() type: "primary" | "secondary" = "primary";
  @Input() size: "default" | "slim" = "default";
  @Input() message = "";
  @Input() ariaLabel = "알림";
}
