import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-contextual-help",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="contextualHelpClass">
      <p class="tooltip-txt">{{ caption }}</p>
      <div class="tooltip-action">
        <button
          type="button"
          class="krds-btn medium icon tooltip-btn"
          aria-expanded="false"
          [attr.aria-controls]="tooltipPopoverId"
        >
          <span class="sr-only">{{ label }}</span>
          <i class="svg-icon ico-tooltip"></i>
        </button>
        <div [id]="tooltipPopoverId" class="tooltip-popover" role="tooltip">
          <h4 class="tooltip-title">{{ title }}</h4>
          <div class="tooltip-contents">
            <p>{{ description }}</p>
            <div class="btn-wrap">
              <a [href]="href" class="krds-btn xsmall link basic">
                {{ linkLabel }} <i class="svg-icon ico-angle right"></i>
              </a>
            </div>
          </div>
          <button type="button" class="krds-btn xsmall icon tooltip-close">
            <span class="sr-only">{{ closeLabel }}</span>
            <i class="svg-icon ico-modal-close"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class KrdsContextualHelpComponent {
  @Input() id = createStableId("krds-contextual-help");
  @Input() label = "레이블";
  @Input() caption = "";
  @Input() title = "제목";
  @Input() description = "";
  @Input() href = "#";
  @Input() linkLabel = "";
  @Input() closeLabel = "";
  @Input() position = "top";

  get contextualHelpClass(): string {
    return `krds-contextual-help ${this.position.split("-").join(" ")}`;
  }

  get tooltipPopoverId(): string {
    return `${this.id}-tooltip`;
  }
}
