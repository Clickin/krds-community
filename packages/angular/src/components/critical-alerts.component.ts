import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-critical-alerts",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="main-urgent-wrap" role="alert">
      <ul class="krds-critical-alerts">
        @for (item of items; track $index) {
          <li>
            <div class="critical-ban">
              <span [class]="'critical-badge ' + criticalTone(item)">
                {{ criticalLabel(item) }}
              </span>
              <p class="critical-txt">{{ navLabel(item) }}</p>
              <a [href]="navHref(item)" class="krds-btn medium link basic">
                <span class="m-hide">{{ itemLinkLabel(item) }}</span
                >{{ " " }}<i class="svg-icon ico-angle right"></i>
              </a>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
})
export class KrdsCriticalAlertsComponent {
  @Input() id = createStableId("krds-critical-alerts");
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

  criticalTone(item: unknown): string {
    if (!item || typeof item !== "object" || !("tone" in item)) return "info";
    return String(item.tone ?? "info");
  }

  criticalLabel(item: unknown): string {
    if (!item || typeof item !== "object" || !("badgeLabel" in item)) return "";
    return String(item.badgeLabel ?? "");
  }

  itemLinkLabel(item: unknown): string {
    if (!item || typeof item !== "object" || !("linkLabel" in item)) return "";
    return String(item.linkLabel ?? "");
  }
}
