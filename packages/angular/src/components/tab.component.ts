import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { tabRecipe } from "@krds-community/recipes";
import { createStableId } from "../kinds";
import type { KrdsTabItem } from "@krds-community/recipes";

@Component({
  selector: "krds-tab",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div [class]="tabClasses.root" [attr.aria-label]="ariaLabel || null">
      <div [class]="tabClasses.listContainer">
        <ul role="tablist">
          @for (tab of tabs; track tab.id) {
            <li role="presentation" [attr.class]="tabItemClass(tab)">
              <button
                [id]="'tab_' + tab.id"
                type="button"
                [class]="tabClasses.trigger"
                role="tab"
                [attr.aria-selected]="(selected || tabs[0]?.id) === tab.id"
                [attr.aria-controls]="'panel_' + tab.id"
                [attr.tabindex]="(selected || tabs[0]?.id) === tab.id ? '0' : '-1'"
                [disabled]="tab.disabled"
                (click)="setSelected(tab.id)"
              >
                {{ tab.label }}
                @if ((selected || tabs[0]?.id) === tab.id && (selectedLabel || message)) {
                  <i class="sr-only created"> {{ selectedLabel || message }}</i>
                }
              </button>
            </li>
          }
        </ul>
      </div>
      <div class="tab-conts-wrap">
        @for (tab of tabs; track tab.id) {
          <section
            [id]="'panel_' + tab.id"
            [attr.aria-labelledby]="'tab_' + tab.id"
            class="tab-conts"
            [class.active]="(selected || tabs[0]?.id) === tab.id"
            [hidden]="(selected || tabs[0]?.id) !== tab.id"
            role="tabpanel"
            data-quick-nav="false"
          >
            @if (panelTitle) {
              <h3 class="sr-only">{{ panelTitle }}</h3>
            }
            {{ panels[tab.id] || "" }}
          </section>
        }
      </div>
      <span data-testid="selected-tab" class="sr-only">{{ selected }}</span>
    </div>
  `,
})
export class KrdsTabComponent {
  @Input() id = createStableId("krds-tab");
  @Input("aria-label") ariaLabel = "";
  @Input() selected = "";
  @Input() selectedLabel = "";
  @Input() message = "";
  @Input() panelTitle = "";
  @Input() tabs: Array<KrdsTabItem> = [];
  @Input() panels: Record<string, string> = {};
  @Output() selectedChange = new EventEmitter<string>();

  get tabClasses() {
    return tabRecipe({ full: true });
  }

  tabItemClass(tab: KrdsTabItem): string | undefined {
    return tabRecipe({ active: (this.selected || this.tabs[0]?.id) === tab.id }).item;
  }

  setSelected(id: string): void {
    this.selected = id;
    this.selectedChange.emit(id);
  }
}
