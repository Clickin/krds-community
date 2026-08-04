import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-structured-list",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="krds-structured-list type-full">
      @for (item of items; track $index) {
        <li class="structured-item">
          <div class="in">
            <div class="card-top">
              <span [class]="'krds-badge ' + structuredBadgeTone(item)">
                {{ itemBadge(item) }}
              </span>
            </div>
            <div class="card-body">
              <a [href]="navHref(item)" class="c-text">
                <p class="c-tit">
                  <span class="span">{{ navLabel(item) }}</span>
                </p>
                <p class="c-txt">{{ itemDescription(item) }}</p>
                <p class="c-date">
                  <strong class="key">{{ dateLabel }}</strong>
                  <span class="value">{{ dateValue }}</span>
                </p>
              </a>
              <div class="c-btn">
                <a [href]="navHref(item)" class="krds-btn secondary" [attr.title]="navLabel(item)">
                  {{ actionLabel }}
                </a>
              </div>
            </div>
            <div class="card-btm">
              @for (tag of tags; track $index) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <div class="card-btn">
              <button type="button" class="krds-btn medium text" [attr.title]="navLabel(item)">
                <i class="svg-icon ico-share"></i> {{ shareLabel }}
              </button>
              <button type="button" class="krds-btn medium text" [attr.title]="navLabel(item)">
                <i class="svg-icon ico-like"></i> {{ favoriteLabel }}
              </button>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
})
export class KrdsStructuredListComponent {
  @Input() id = createStableId("krds-structured-list");
  @Input() description = "";
  @Input() dateLabel = "";
  @Input() dateValue = "";
  @Input() actionLabel = "";
  @Input() shareLabel = "";
  @Input() favoriteLabel = "";
  @Input() tags: string[] = [];
  @Input() items: unknown[] = [];

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
    return String(item.href ?? "#");
  }

  itemDescription(item: unknown): string {
    if (!item || typeof item !== "object") return this.description;
    if ("content" in item) return String(item.content ?? "");
    if ("description" in item) return String(item.description ?? "");
    return this.description;
  }

  structuredBadgeTone(item: unknown): string {
    if (!item || typeof item !== "object") return "bg-light-primary";
    if ("badgeTone" in item) return String(item.badgeTone ?? "bg-light-primary");
    if ("badgeClass" in item) return String(item.badgeClass ?? "bg-light-primary");
    if ("tone" in item) return String(item.tone ?? "bg-light-primary");
    return "bg-light-primary";
  }

  itemBadge(item: unknown): string {
    if (!item || typeof item !== "object" || !("badge" in item)) return "";
    return String(item.badge ?? "");
  }
}
