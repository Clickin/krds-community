import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Input, inject } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-main-menu-mobile",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <div
      id="mobile-nav"
      class="krds-main-menu-mobile sample"
      role="navigation"
      [attr.aria-label]="ariaLabel || hostAriaLabel || menuLabel || '전체 메뉴'"
      [style]="style"
    >
      <div class="gnb-wrap">
        <div class="gnb-header">
          <div class="gnb-utils">
            <ul class="utility-list">
              @for (item of utilityItems; track item.id) {
                <li>
                  <button type="button" class="krds-btn xsmall text">{{ item.label }}</button>
                </li>
              }
            </ul>
          </div>
          <div class="gnb-login">
            <button type="button" class="krds-btn large text">
              <i class="svg-icon ico-log"></i> {{ loginLabel }}
            </button>
          </div>
          <div class="gnb-service-menu">
            @for (item of serviceItems; track item.id) {
              <a [href]="item.href || '#'" class="link">{{ item.label }}</a>
            }
          </div>
          <div class="sch-input">
            <input
              type="text"
              class="krds-input"
              [attr.placeholder]="searchPlaceholder || null"
              [attr.title]="searchTitle || null"
              [attr.aria-label]="searchLabel || searchTitle || null"
            />
            <button type="button" class="krds-btn medium icon ico-search">
              <span class="sr-only">{{ searchLabel }}</span>
              <i class="svg-icon ico-sch"></i>
            </button>
          </div>
        </div>
        <div class="gnb-body">
          <div class="gnb-menu">
            <div class="menu-wrap">
              <ul>
                @for (item of items; track item.id) {
                  <li>
                    <a [href]="item.href || '#'" class="gnb-main-trigger">{{ item.label }}</a>
                  </li>
                }
              </ul>
            </div>
            <div class="submenu-wrap">
              @for (item of items; track item.id) {
                <div class="gnb-sub-list" [id]="mobileMenuId(item)">
                  <h2 class="sub-title">{{ item.label }}</h2>
                  <ul>
                    @for (child of item.children || []; track child.id) {
                      <li>
                        <a
                          [href]="child.href || '#'"
                          class="gnb-sub-trigger"
                          [class.has-depth3]="!!child.children?.length"
                        >
                          {{ child.label }}
                        </a>
                        @if (child.children?.length) {
                          <div class="depth3-wrap">
                            <ul>
                              @for (depth3 of child.children || []; track depth3.id) {
                                <li>
                                  <a
                                    [href]="depth3.href || '#'"
                                    class="depth3-trigger"
                                    [class.has-depth4]="!!depth3.children?.length"
                                  >
                                    {{ depth3.label }}
                                  </a>
                                  @if (depth3.children?.length) {
                                    <div class="depth4-wrap">
                                      <div class="depth4-head">
                                        <button type="button" class="krds-btn icon trigger-prev">
                                          <span class="sr-only">{{ previousLabel }}</span>
                                          <i class="svg-icon ico-angle left"></i>
                                        </button>
                                        <button type="button" class="krds-btn icon trigger-close">
                                          <span class="sr-only">{{ closeLabel }}</span>
                                          <i class="svg-icon ico-popup-close"></i>
                                        </button>
                                      </div>
                                      <ul class="depth4-body">
                                        <h4 class="sub-title">{{ depth3.title }}</h4>
                                        <ul class="depth4-ul">
                                          @for (depth4 of depth3.children || []; track depth4.id) {
                                            <li>
                                              <a [href]="depth4.href || '#'">{{ depth4.label }}</a>
                                            </li>
                                          }
                                        </ul>
                                      </ul>
                                    </div>
                                  }
                                </li>
                              }
                            </ul>
                          </div>
                        }
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
          <div class="gnb-bottom">
            @for (item of bottomItems; track $index) {
              <a
                [href]="item.href || '#'"
                class="krds-btn small text"
                [attr.target]="item.target || null"
                [attr.title]="item.title || null"
              >
                {{ item.label }}
                <i [class]="'svg-icon ' + (item.target ? 'ico-go' : 'ico-angle right')"></i>
              </a>
            }
          </div>
        </div>
        <button type="button" class="krds-btn medium icon" id="close-nav">
          <span class="sr-only">{{ closeLabel }}</span>
          <i class="svg-icon ico-popup-close"></i>
        </button>
      </div>
    </div>
  `,
})
export class KrdsMainMenuMobileComponent {
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  get hostAriaLabel(): string | null {
    return this.hostElement.nativeElement.getAttribute("aria-label");
  }
  @Input() id = createStableId("krds-main-menu-mobile");
  @Input() loginLabel = "";
  @Input() searchPlaceholder = "";
  @Input() searchTitle = "";
  @Input() searchLabel = "";
  @Input() previousLabel = "";
  @Input() closeLabel = "";
  @Input() utilityItems: Array<{ id: string; label: string }> = [];
  @Input() serviceItems: AngularNavItem[] = [];
  @Input() items: AngularNavItem[] = [];
  @Input() bottomItems: AngularNavItem[] = [];
  @Input() menuLabel = "";
  @Input("aria-label") ariaLabel = "";
  @Input() style = "display: block; position: static; visibility: visible;";

  mobileMenuId(item: AngularNavItem): string {
    return item.href?.startsWith("#") ? item.href.slice(1) : (item.id ?? "");
  }
}
