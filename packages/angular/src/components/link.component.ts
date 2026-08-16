import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-link",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <a
      [href]="href"
      class="krds-btn small link"
      [attr.target]="target"
      [attr.title]="external ? title || '새 창 열림' : title"
    >
      <span class="underline">{{ label }}</span
      >{{ " "
      }}<i
        class="svg-icon"
        [class.ico-go]="external || target === '_blank'"
        [class.ico-angle]="!external && target !== '_blank'"
        [class.right]="!external && target !== '_blank'"
      ></i>
    </a>
  `,
})
export class KrdsLinkComponent {
  @Input() id = createStableId("krds-link");
  @Input() label = "레이블";
  @Input() href = "#";
  @Input() target: "_blank" | "_self" | null = null;
  @Input() external = false;
  @Input() title: string | null = null;
}
