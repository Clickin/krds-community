import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-side-navigation",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <nav class="krds-side-navigation">
      <h2 class="lnb-tit">{{ title }}</h2>
      <ul class="lnb-list" role="menubar">
        @for (item of items; track $index; let topIndex = $index) {
          @if (itemChildren(item).length > 0) {
            <li class="lnb-item" [class.active]="$first" role="none">
              <button
                type="button"
                class="lnb-btn lnb-toggle"
                [class.active]="$first"
                role="menuitem"
                [attr.aria-controls]="sideMenuId(topIndex)"
                [attr.aria-expanded]="$first"
              >
                {{ navLabel(item) }}
              </button>
              <div class="lnb-submenu">
                <ul [id]="sideMenuId(topIndex)" role="menu">
                  @for (child of itemChildren(item); track $index; let childIndex = $index) {
                    <li class="lnb-subitem" [class.active]="itemCurrent(child)" role="none">
                      @if (itemChildren(child).length > 0) {
                        <button
                          type="button"
                          class="lnb-btn lnb-toggle-popup"
                          role="menuitem"
                          [attr.aria-controls]="sidePopupId(topIndex, childIndex)"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          {{ navLabel(child) }}
                        </button>
                        <div
                          class="lnb-submenu-lv2"
                          [id]="sidePopupId(topIndex, childIndex)"
                          role="menu"
                        >
                          <button type="button" class="lnb-btn-tit">
                            {{ itemDescription(child) }}
                          </button>
                          <ul>
                            @for (leaf of itemChildren(child); track $index) {
                              <li role="none">
                                <a [href]="navHref(leaf)" class="lnb-btn" role="menuitem">{{
                                  navLabel(leaf)
                                }}</a>
                              </li>
                            }
                          </ul>
                        </div>
                      } @else {
                        <a
                          [href]="navHref(child)"
                          class="lnb-btn lnb-link"
                          role="menuitem"
                          [attr.aria-current]="itemCurrent(child) ? 'page' : null"
                        >
                          {{ navLabel(child) }}
                        </a>
                      }
                    </li>
                  }
                </ul>
              </div>
            </li>
          } @else {
            <li class="lnb-item" [class.active]="itemCurrent(item)" role="none">
              <a
                [href]="navHref(item)"
                class="lnb-btn lnb-link"
                role="menuitem"
                [attr.aria-current]="itemCurrent(item) ? 'page' : null"
              >
                {{ navLabel(item) }}
              </a>
            </li>
          }
        }
      </ul>
    </nav>
  `,
})
export class KrdsSideNavigationComponent {
  @Input() id = createStableId("krds-side-navigation");
  @Input() title = "제목";
  @Input() description = "";
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
    return String(item.href ?? "#");
  }

  itemDescription(item: unknown): string {
    if (!item || typeof item !== "object") return this.description;
    if ("content" in item) return String(item.content ?? "");
    if ("description" in item) return String(item.description ?? "");
    return this.navLabel(item);
  }

  itemChildren(item: unknown): AngularNavItem[] {
    if (!item || typeof item !== "object" || !("children" in item)) return [];
    const children = item.children;
    return Array.isArray(children) ? (children as AngularNavItem[]) : [];
  }

  itemCurrent(item: unknown): boolean {
    return Boolean(item && typeof item === "object" && "current" in item && item.current);
  }

  sideMenuId(index: number): string {
    return `${this.id}-side-${index}`;
  }

  sidePopupId(topIndex: number, childIndex: number): string {
    return `${this.id}-side-${topIndex}-${childIndex}`;
  }
}
