import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-text-list",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #unorderedList let-list let-level="level">
      <ul [class]="unorderedListClass(level)" role="list">
        @for (item of list; track $index) {
          <li role="listitem">
            {{ navLabel(item) }}
            @if (itemChildren(item).length > 0) {
              <ng-container
                *ngTemplateOutlet="
                  unorderedList;
                  context: { $implicit: itemChildren(item), level: level + 1 }
                "
              />
            }
          </li>
        }
      </ul>
    </ng-template>
    <ng-container *ngTemplateOutlet="unorderedList; context: { $implicit: items, level: 0 }" />
  `,
})
export class KrdsTextListComponent {
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

  itemChildren(item: unknown): unknown[] {
    if (!item || typeof item !== "object" || !("children" in item)) return [];
    return Array.isArray(item.children) ? item.children : [];
  }

  unorderedListClass(level: number): string {
    return `krds-info-list ${["decimal", "dash", "hollow"][level] ?? "hollow"}`;
  }
}

@Component({
  selector: "krds-text-list-ordered",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #orderedList let-list let-level="level">
      <ol class="krds-info-list ordered" role="list">
        @for (item of list; track $index) {
          <li role="listitem">
            <span class="num">{{ orderedMarker(level, $index) }}</span>
            {{ navLabel(item) }}
            @if (itemChildren(item).length > 0) {
              <ng-container
                *ngTemplateOutlet="
                  orderedList;
                  context: { $implicit: itemChildren(item), level: level + 1 }
                "
              />
            }
          </li>
        }
      </ol>
    </ng-template>
    <ng-container *ngTemplateOutlet="orderedList; context: { $implicit: items, level: 0 }" />
  `,
})
export class KrdsTextListOrderedComponent {
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

  itemChildren(item: unknown): unknown[] {
    if (!item || typeof item !== "object" || !("children" in item)) return [];
    return Array.isArray(item.children) ? item.children : [];
  }

  orderedMarker(level: number, index: number): string {
    if (level === 0) return `${index + 1}.`;
    if (level === 1) return `${String.fromCharCode(97 + index)}.`;
    return ["①", "②", "③", "④", "⑤"][index] ?? `${index + 1}.`;
  }
}
