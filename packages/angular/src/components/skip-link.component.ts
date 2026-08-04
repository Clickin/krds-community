import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-skip-link",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [id]="id">
      <a [href]="href">{{ label }}</a>
    </div>
  `,
})
export class KrdsSkipLinkComponent {
  @Input() id = "krds-skip-link";
  @Input() label = "레이블";
  @Input() href = "#";
}
