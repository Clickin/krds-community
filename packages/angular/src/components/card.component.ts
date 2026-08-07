import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

export interface KrdsCardAction {
  label: string;
  onClick?: () => void;
}

@Component({
  selector: "krds-card",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article [class]="'krds-card ' + type">
      @if (image || badges.length > 0) {
        <div class="card-top">
          @if (image) {
            <img class="card-image" [src]="image" [attr.alt]="imageAlt" />
          }
          @for (badge of badges; track $index) {
            <span class="krds-badge bg-primary card-badge">{{ badge }}</span>
          }
        </div>
      }
      <div class="card-conts">
        <h3 class="card-title">{{ title }}</h3>
        @if (description) {
          <p class="card-description">{{ description }}</p>
        }
        @if (actions.length > 0) {
          <div class="card-actions">
            @for (action of actions; track $index) {
              <button type="button" class="krds-btn small primary" (click)="action.onClick?.()">
                {{ action.label }}
              </button>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class KrdsCardComponent {
  @Input() id = createStableId("krds-card");
  @Input() type: "vertical" | "horizontal" = "vertical";
  @Input() image = "";
  @Input() imageAlt = "";
  @Input() title = "";
  @Input() description = "";
  @Input() badges: string[] = [];
  @Input() actions: KrdsCardAction[] = [];
}
