import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-in-page-navigation",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div class="krds-in-page-navigation-type">
      <div class="krds-in-page-navigation-area">
        <div class="in-page-navigation-header">
          <p class="quick-caption">{{ title }}</p>
          <p class="quick-title">{{ pageTitle }}</p>
        </div>
        <nav class="in-page-navigation-list" [attr.aria-label]="title || null">
          <ul>
            @for (item of items; track $index) {
              <li>
                <a [href]="navHref(item)" [class.active]="item.current === true">
                  {{ navLabel(item) }}
                </a>
              </li>
            }
          </ul>
        </nav>
        <div class="in-page-navigation-action">
          <button type="button" class="krds-btn medium">{{ actionLabel }}</button>
          <p class="quick-info">
            {{ actionInfo }}
            @if (actionCount) {
              <strong>{{ actionCount }}</strong>
            }
          </p>
        </div>
      </div>
    </div>
  `,
})
export class KrdsInPageNavigationComponent {
  @Input() id = createStableId("krds-in-page-navigation");
  @Input() title = "제목";
  @Input() pageTitle = "";
  @Input() actionLabel = "";
  @Input() actionInfo = "";
  @Input() actionCount = "";
  @Input() items: AngularNavItem[] = [];

  navLabel(item: unknown): string {
    if (typeof item === "string" || typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";
    if ("label" in item) return String(item.label ?? "");
    if ("title" in item) return String(item.title ?? "");
    if ("text" in item) return String(item.text ?? "");
    if ("message" in item) return String(item.message ?? "");
    return "";
  }

  navHref(item: unknown): string {
    if (!item || typeof item !== "object" || !("href" in item)) return "#";
    return String(item.href || "#");
  }
}
