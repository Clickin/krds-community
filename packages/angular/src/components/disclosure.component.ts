import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-disclosure",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-disclosure conts-expand-area" [class.active]="open">
      <button
        [id]="id + '-trigger'"
        type="button"
        class="btn-conts-expand"
        [attr.aria-controls]="id + '-contents'"
        [attr.aria-expanded]="open"
        (click)="open = !open"
      >
        {{ title }}
      </button>
      <div
        class="expand-wrap"
        [id]="id + '-contents'"
        [attr.aria-labelledby]="id + '-trigger'"
        role="region"
        [attr.inert]="!open ? '' : null"
      >
        <div class="expand-in">
          @if (items.length > 0) {
            <ul class="krds-info-list dash" role="list">
              @for (item of items; track $index) {
                <li role="listitem">{{ navLabel(item) }}</li>
              }
            </ul>
          } @else {
            <ng-content></ng-content>
          }
        </div>
      </div>
    </div>
  `,
})
export class KrdsDisclosureComponent {
  @Input() id = createStableId("krds-disclosure");
  @Input() title = "제목";
  @Input() open = false;
  @Input() items: (AngularNavItem | string)[] = [];

  navLabel(item: unknown): string {
    if (typeof item === "string" || typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";
    if ("label" in item) return String((item as { label?: unknown }).label ?? "");
    if ("title" in item) return String((item as { title?: unknown }).title ?? "");
    if ("text" in item) return String((item as { text?: unknown }).text ?? "");
    if ("message" in item) return String((item as { message?: unknown }).message ?? "");
    return "";
  }
}
