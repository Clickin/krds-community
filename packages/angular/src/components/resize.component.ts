import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-resize",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-drop-wrap krds-resize" data-adjust="scale">
      <button
        type="button"
        class="krds-btn small text drop-btn"
        aria-expanded="false"
        [attr.aria-controls]="resizeMenuId"
      >
        {{ label }} <i class="svg-icon ico-toggle"></i>
      </button>
      <div class="drop-menu" [id]="resizeMenuId">
        <div class="drop-in">
          <ul class="drop-list">
            @for (option of options; track $index) {
              <li>
                <button
                  type="button"
                  [class]="
                    'item-link ' + option.value + (option.value === selected ? ' active' : '')
                  "
                  [attr.data-adjust-scale]="option.value"
                  (click)="setSelected(option.value)"
                >
                  {{ option.label }}
                  <span class="sr-only">{{ option.value === selected ? selectedLabel : "" }}</span>
                </button>
              </li>
            }
          </ul>
          <div class="drop-bottom">
            <button
              type="button"
              class="krds-btn medium text"
              data-adjust-scale="md"
              (click)="setSelected('md')"
            >
              <i class="svg-icon ico-reset"></i> {{ resetLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class KrdsResizeComponent {
  @Input() id = createStableId("krds-resize");
  @Input() label = "레이블";
  @Input() selected = "";
  @Input() selectedLabel = "";
  @Input() resetLabel = "";
  @Input() options: Array<{ value: string; label: string }> = [];

  get resizeMenuId(): string {
    return `${this.id}-menu`;
  }

  setSelected(value: string): void {
    this.selected = value;
  }
}
