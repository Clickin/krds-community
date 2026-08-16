import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

export interface KrdsTabBarItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string;
}

@Component({
  selector: "krds-tab-bar",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <nav class="krds-tab-bar" [attr.aria-label]="ariaLabel">
      @for (item of items; track $index) {
        @if (item.href) {
          <a
            [href]="item.href"
            [class]="'tab-bar-item' + (isSelected(item) ? ' active' : '')"
            [attr.aria-current]="isSelected(item) ? 'page' : null"
            (click)="select(item, $event)"
          >
            @if (item.icon) {
              <i class="svg-icon tab-bar-icon {{ item.icon }}"></i>
            }
            <span class="tab-bar-label">{{ item.label }}</span>
            @if (item.badge) {
              <span class="krds-badge bg-danger tab-bar-badge">{{ item.badge }}</span>
            }
          </a>
        } @else {
          <button
            type="button"
            [class]="'tab-bar-item' + (isSelected(item) ? ' active' : '')"
            [attr.aria-current]="isSelected(item) ? 'page' : null"
            (click)="select(item)"
          >
            @if (item.icon) {
              <i class="svg-icon tab-bar-icon {{ item.icon }}"></i>
            }
            <span class="tab-bar-label">{{ item.label }}</span>
            @if (item.badge) {
              <span class="krds-badge bg-danger tab-bar-badge">{{ item.badge }}</span>
            }
          </button>
        }
      }
    </nav>
  `,
})
export class KrdsTabBarComponent {
  @Input() id = createStableId("krds-tab-bar");
  @Input() items: KrdsTabBarItem[] = [];
  @Input() selected: string | undefined = undefined;
  @Input() defaultSelected: string | undefined = undefined;
  @Input() ariaLabel = "주요 메뉴";
  @Output() change = new EventEmitter<string>();

  private internalSelected: string | null = null;

  get isControlled(): boolean {
    return this.selected !== undefined;
  }

  get currentSelected(): string {
    if (this.selected !== undefined) return this.selected;
    if (this.internalSelected !== null) return this.internalSelected;
    return this.defaultSelected ?? "";
  }

  isSelected(item: KrdsTabBarItem): boolean {
    return this.currentSelected === item.id;
  }

  select(item: KrdsTabBarItem, event?: Event): void {
    event?.preventDefault();
    if (!this.isControlled) {
      this.internalSelected = item.id;
    }
    this.change.emit(item.id);
  }
}
