import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-breadcrumb",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="krds-breadcrumb-wrap" aria-label="현재 경로" [id]="id">
      <ol class="breadcrumb">
        @for (item of items; track $index) {
          <li [class.home]="$index === 0">
            <a class="txt" [href]="navHref(item)">{{ navLabel(item) }}</a>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class KrdsBreadcrumbComponent {
  @Input() id = createStableId("krds-badge");
  @Input() items: AngularNavItem[] = [];

  navLabel(item: unknown): string {
    if (typeof item === "string" || typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";
    if ("label" in item) return String((item as { label?: unknown }).label ?? "");
    if ("title" in item) return String((item as { title?: unknown }).title ?? "");
    if ("text" in item) return String((item as { text?: unknown }).text ?? "");
    if ("message" in item) return String((item as { message?: unknown }).message ?? "");
    return "";
  }

  navHref(item: unknown): string {
    if (!item || typeof item !== "object" || !("href" in item)) return "#";
    return String((item as { href?: unknown }).href || "#");
  }
}
