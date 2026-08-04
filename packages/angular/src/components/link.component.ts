import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-link",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [href]="href" class="krds-btn small link" [attr.target]="target" [attr.title]="title">
      <span class="underline">{{ label }}</span
      >{{ " " }}<i class="svg-icon ico-go"></i>
    </a>
  `,
})
export class KrdsLinkComponent {
  @Input() id = createStableId("krds-link");
  @Input() label = "레이블";
  @Input() href = "#";
  @Input() target: "_blank" | "_self" | null = null;
  @Input() title = "제목";
}
