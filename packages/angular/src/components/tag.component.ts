import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-tag",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-tag-wrap large">
      <span class="krds-btn-tag">
        {{ label }}
        <button type="button" class="btn-delete">
          <span class="sr-only">{{ message }}</span>
        </button>
      </span>
    </div>
  `,
})
export class KrdsTagComponent {
  @Input() id = createStableId("krds-tag");
  @Input() label = "레이블";
  @Input() message = "삭제";
}

@Component({
  selector: "krds-tag-link",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-tag-wrap large">
      <a class="krds-btn-tag link" [href]="href">{{ label }}</a>
    </div>
  `,
})
export class KrdsTagLinkComponent {
  @Input() id = createStableId("krds-tag-link");
  @Input() label = "레이블";
  @Input() href = "#";
}
