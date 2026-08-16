import { CommonModule, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
  createStableId,
  type AngularNavItem,
  type HeaderUtilityItem,
  type HeaderMyMenu,
  type HeaderMobileMenu,
} from "../kinds";

@Component({
  selector: "krds-header",
  standalone: true,
  imports: [CommonModule, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <header
      [id]="'krds-header'"
      [attr.aria-label]="ariaLabel || null"
      [attr.class]="className || null"
      [ngStyle]="style"
    >
      <div class="header-in">
        <div class="header-container">
          <div class="inner">
            <div class="header-utility">
              <ul class="utility-list">
                @for (item of utilityItems; track item.id) {
                  <li>
                    @if (item.kind === "link") {
                      <a
                        [href]="item.href || '#'"
                        class="krds-btn small text"
                        [attr.target]="item.target || null"
                        [attr.title]="item.title || null"
                      >
                        {{ item.label }} <i class="svg-icon ico-go"></i>
                      </a>
                    } @else {
                      <div class="krds-drop-wrap" [class.krds-resize]="item.kind === 'resize'">
                        <button
                          type="button"
                          class="krds-btn small text drop-btn"
                          aria-expanded="false"
                          [attr.aria-controls]="headerUtilityMenuId(item)"
                        >
                          {{ item.label }} <i class="svg-icon ico-toggle"></i>
                        </button>
                        <div class="drop-menu" [id]="headerUtilityMenuId(item)">
                          <div class="drop-in">
                            <ul class="drop-list">
                              @for (dropItem of item.items || []; track dropItem.id) {
                                <li>
                                  @if (item.kind === "resize") {
                                    <button
                                      type="button"
                                      [class]="
                                        'item-link' +
                                        (dropItem.className ? ' ' + dropItem.className : '')
                                      "
                                      [class.active]="dropItem.selected"
                                    >
                                      {{ dropItem.label }}
                                      <span class="sr-only">{{
                                        dropItem.selected ? item.selectedLabel : ""
                                      }}</span>
                                    </button>
                                  } @else {
                                    <a
                                      [href]="dropItem.href || '#'"
                                      [class]="
                                        'item-link' +
                                        (dropItem.className ? ' ' + dropItem.className : '')
                                      "
                                      [attr.target]="dropItem.target || null"
                                      [attr.title]="dropItem.title || null"
                                    >
                                      {{ dropItem.label }}
                                      <span class="sr-only"></span>
                                    </a>
                                  }
                                </li>
                              }
                            </ul>
                            @if (item.kind === "resize") {
                              <div class="drop-bottom">
                                <button type="button" class="krds-btn medium text">
                                  <i class="svg-icon ico-reset"></i> {{ item.resetLabel }}
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </li>
                }
              </ul>
            </div>
            <div class="header-branding">
              <h2 class="logo">
                <a [attr.href]="logoHref || null">
                  <span class="sr-only">{{ logoLabel }}</span>
                </a>
              </h2>
              <div class="header-actions">
                <button type="button" class="btn-navi sch" [attr.title]="searchTitle || null">
                  {{ searchLabel }}
                </button>
                <a [attr.href]="loginHref || null" class="btn-navi login">{{ loginLabel }}</a>
                <button type="button" class="btn-navi join">{{ joinLabel }}</button>
                @if (myMenu) {
                  <div class="krds-drop-wrap my-drop">
                    <button
                      type="button"
                      class="btn-navi my drop-btn"
                      aria-expanded="false"
                      [attr.aria-controls]="headerMyMenuId()"
                    >
                      {{ myMenu.label }}
                    </button>
                    <div class="drop-menu" [id]="headerMyMenuId()">
                      <div class="drop-in">
                        <div class="drop-top">
                          <p class="my-name">{{ myMenu.userName }}</p>
                          <dl class="my-time">
                            <dt>{{ myMenu.timeLabel }}</dt>
                            <dd>
                              <span class="time">{{ myMenu.time }}</span>
                              <button type="button" class="krds-btn medium text">
                                {{ myMenu.extendLabel }}
                              </button>
                            </dd>
                          </dl>
                        </div>
                        <ul class="drop-list">
                          @for (menuItem of myMenu.items; track menuItem.id) {
                            <li>
                              <a [href]="menuItem.href || '#'" class="item-link">
                                {{ menuItem.label }}
                                <span class="sr-only"></span>
                              </a>
                            </li>
                          }
                        </ul>
                        <div class="drop-bottom">
                          <button type="button" class="krds-btn medium text">
                            <i class="svg-icon ico-logout"></i> {{ myMenu.logoutLabel }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <button type="button" class="btn-navi all" [attr.aria-controls]="headerMobileId">
                  {{ allMenuLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav class="krds-main-menu" [attr.aria-label]="menuLabel || null">
          <div class="inner">
            <ul class="gnb-menu" [attr.aria-label]="menuLabel || null">
              @for (item of headerDesktopItems; track item.id) {
                <li>
                  @if (item.href) {
                    <a
                      [href]="item.href"
                      class="gnb-main-trigger is-link"
                      data-trigger="gnb"
                      [class.external-link]="!!item.target"
                      [attr.target]="item.target || null"
                      [attr.title]="item.title || null"
                    >
                      {{ item.label }}
                    </a>
                  } @else if (item.button) {
                    <button type="button" class="gnb-main-trigger is-link" data-trigger="gnb">
                      {{ item.label }}
                    </button>
                  } @else {
                    <button
                      type="button"
                      class="gnb-main-trigger"
                      [class.active]="item.active"
                      data-trigger="gnb"
                      [attr.aria-controls]="headerDesktopMenuId(item)"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {{ item.label }}
                    </button>
                    <div
                      class="gnb-toggle-wrap"
                      [class.is-open]="item.active"
                      [id]="headerDesktopMenuId(item)"
                    >
                      <div
                        class="gnb-main-list"
                        [attr.data-has-submenu]="isSingleDesktopMenu(item) ? null : 'true'"
                      >
                        @if (isSingleDesktopMenu(item)) {
                          <div class="gnb-sub-list single-list between">
                            <div class="gnb-sub-content">
                              <h2 class="sub-title">
                                <span>{{ item.title }}</span>
                              </h2>
                              <ul>
                                @for (leaf of item.children || []; track leaf.id) {
                                  <li>
                                    @if (leaf.href) {
                                      <a [href]="leaf.href">{{ leaf.label }}</a>
                                    } @else {
                                      <button type="button">{{ leaf.label }}</button>
                                    }
                                  </li>
                                }
                              </ul>
                            </div>
                            @if (item.banner) {
                              <div class="gnb-sub-banner">
                                <span class="krds-badge bg-secondary">{{ item.banner.badge }}</span>
                                <button type="button" class="krds-btn medium text">
                                  {{ item.banner.label }} <i class="svg-icon ico-angle right"></i>
                                </button>
                              </div>
                            }
                          </div>
                        } @else {
                          <ul>
                            @for (
                              child of item.children || [];
                              track child.id;
                              let childIndex = $index
                            ) {
                              <li>
                                @if (child.href) {
                                  <a
                                    [href]="child.href"
                                    class="gnb-sub-trigger is-link"
                                    [class.external-link]="!!child.target"
                                    data-trigger="gnb"
                                    [attr.target]="child.target || null"
                                    [attr.title]="child.title || null"
                                  >
                                    {{ child.label }}
                                  </a>
                                } @else {
                                  <button
                                    type="button"
                                    class="gnb-sub-trigger"
                                    [class.active]="child.active || childIndex === 0"
                                    data-trigger="gnb"
                                    [attr.aria-controls]="headerDesktopSubmenuId(child)"
                                    [attr.aria-expanded]="child.active || childIndex === 0"
                                    aria-haspopup="true"
                                  >
                                    {{ child.label }}
                                  </button>
                                  <div
                                    class="gnb-sub-list"
                                    [class.active]="child.active || childIndex === 0"
                                    [class.between]="!child.active && childIndex > 0"
                                    [id]="headerDesktopSubmenuId(child)"
                                  >
                                    <div class="gnb-sub-content">
                                      <h2 class="sub-title">
                                        @if (child.titleHref) {
                                          {{ child.title }}
                                          <a
                                            [href]="child.titleHref"
                                            class="krds-btn link basic small"
                                          >
                                            <span class="underline">{{
                                              child.titleLinkLabel
                                            }}</span>
                                            <i class="svg-icon ico-angle right"></i>
                                          </a>
                                        } @else {
                                          <span>{{ child.title }}</span>
                                        }
                                      </h2>
                                      @if (child.descriptionItems?.length) {
                                        <ul class="type-description">
                                          @for (
                                            desc of child.descriptionItems || [];
                                            track $index
                                          ) {
                                            <li>
                                              <h3 class="tit">
                                                <a
                                                  [href]="desc.href"
                                                  [attr.target]="desc.target || null"
                                                  [attr.title]="desc.externalTitle || null"
                                                >
                                                  {{ desc.title }} <i class="svg-icon ico-go"></i>
                                                </a>
                                              </h3>
                                              <p class="txt">{{ desc.description }}</p>
                                            </li>
                                          }
                                        </ul>
                                      } @else {
                                        <ul>
                                          @for (leaf of child.children || []; track leaf.id) {
                                            <li>
                                              @if (leaf.href) {
                                                <a [href]="leaf.href">{{ leaf.label }}</a>
                                              } @else {
                                                <button type="button">{{ leaf.label }}</button>
                                              }
                                            </li>
                                          }
                                        </ul>
                                      }
                                    </div>
                                    @if (child.banner) {
                                      <div class="gnb-sub-banner">
                                        <span class="krds-badge bg-secondary">{{
                                          child.banner.badge
                                        }}</span>
                                        <button type="button" class="krds-btn medium text">
                                          {{ child.banner.label }}
                                          <i class="svg-icon ico-angle right"></i>
                                        </button>
                                      </div>
                                    }
                                  </div>
                                }
                              </li>
                            }
                          </ul>
                        }
                      </div>
                    </div>
                  }
                </li>
              }
            </ul>
          </div>
        </nav>
      </div>
      @if (mobileMenu) {
        <div [id]="headerMobileId" class="krds-main-menu-mobile" style="display: none">
          <div class="gnb-wrap">
            <div class="gnb-header">
              <div class="gnb-utils">
                <ul class="utility-list">
                  @for (item of mobileMenu.utilityItems; track item.id) {
                    <li>
                      <button type="button" class="krds-btn xsmall text">{{ item.label }}</button>
                    </li>
                  }
                </ul>
              </div>
              <div class="gnb-login">
                <button type="button" class="krds-btn large text">
                  <i class="svg-icon ico-log"></i> {{ mobileMenu.loginLabel }}
                </button>
              </div>
              <div class="gnb-service-menu">
                @for (item of mobileMenu.serviceItems; track item.id) {
                  <a [href]="item.href || '#'" class="link">{{ item.label }}</a>
                }
              </div>
              <div class="sch-input">
                <input
                  type="text"
                  class="krds-input"
                  [placeholder]="mobileMenu.searchPlaceholder"
                  [attr.title]="mobileMenu.searchTitle || null"
                  [attr.aria-label]="mobileMenu.searchLabel || mobileMenu.searchTitle || null"
                />
                <button type="button" class="krds-btn medium icon ico-search">
                  <span class="sr-only">{{ mobileMenu.searchLabel }}</span>
                  <i class="svg-icon ico-sch"></i>
                </button>
              </div>
            </div>
            <div class="gnb-body">
              <div class="gnb-menu">
                <div class="menu-wrap">
                  <ul role="tablist">
                    @for (item of mobileMenu.items; track item.id; let mobileIndex = $index) {
                      <li role="none">
                        <a
                          [id]="mobileMenuTabId(mobileIndex)"
                          [href]="item.href || '#'"
                          class="gnb-main-trigger"
                          [class.active]="mobileIndex === 0"
                          role="tab"
                          [attr.aria-selected]="mobileIndex === 0"
                          [attr.aria-controls]="mobileMenuId(item)"
                        >
                          {{ item.label }}
                        </a>
                      </li>
                    }
                  </ul>
                </div>
                <div class="submenu-wrap">
                  @for (item of mobileMenu.items; track item.id) {
                    <div
                      class="gnb-sub-list"
                      [id]="mobileMenuId(item)"
                      role="tabpanel"
                      [attr.aria-labelledby]="mobileMenuTabId($index)"
                    >
                      <h2 class="sub-title">{{ item.label }}</h2>
                      <ul>
                        @for (
                          child of item.children || [];
                          track child.id;
                          let childIndex = $index
                        ) {
                          <li>
                            <a
                              [href]="child.href || '#'"
                              class="gnb-sub-trigger"
                              [class.has-depth3]="!!child.children?.length"
                              [attr.aria-expanded]="child.children?.length ? false : null"
                              [attr.aria-controls]="headerMobileDepth3Id($index, childIndex)"
                            >
                              {{ child.label }}
                            </a>
                            @if (child.children?.length) {
                              <div
                                class="depth3-wrap"
                                [id]="headerMobileDepth3Id($index, childIndex)"
                              >
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
                                            <button
                                              type="button"
                                              class="krds-btn icon trigger-prev"
                                            >
                                              <span class="sr-only">{{
                                                mobileMenu.previousLabel
                                              }}</span>
                                              <i class="svg-icon ico-angle left"></i>
                                            </button>
                                            <button
                                              type="button"
                                              class="krds-btn icon trigger-close"
                                            >
                                              <span class="sr-only">{{
                                                mobileMenu.closeLabel
                                              }}</span>
                                              <i class="svg-icon ico-popup-close"></i>
                                            </button>
                                          </div>
                                          <ul class="depth4-body">
                                            <h4 class="sub-title">{{ depth3.title }}</h4>
                                            <ul class="depth4-ul">
                                              @for (
                                                depth4 of depth3.children || [];
                                                track depth4.id
                                              ) {
                                                <li>
                                                  <a [href]="depth4.href || '#'">{{
                                                    depth4.label
                                                  }}</a>
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
                @for (item of mobileMenu.bottomItems; track $index) {
                  <a
                    [href]="item.href || '#'"
                    class="krds-btn medium text"
                    [attr.target]="item.target || null"
                    [attr.title]="item.title || null"
                  >
                    {{ item.label }}
                    <i [class]="'svg-icon ' + (item.target ? 'ico-go' : 'ico-angle right')"></i>
                  </a>
                }
              </div>
            </div>
            <button type="button" class="krds-btn medium icon" [id]="id + '-close-nav'">
              <span class="sr-only">{{ mobileMenu.closeLabel }}</span>
              <i class="svg-icon ico-popup-close"></i>
            </button>
          </div>
        </div>
      }
    </header>
  `,
})
export class KrdsHeaderComponent {
  @Input() id = createStableId("krds-header");
  @Input("aria-label") ariaLabel = "";
  @Input() className = "";
  @Input() style: Record<string, string> = {};
  @Input() logoHref?: string;
  @Input() logoLabel = "";
  @Input() searchTitle = "";
  @Input() searchLabel = "";
  @Input() loginLabel = "";
  @Input() loginHref?: string;
  @Input() joinLabel = "";
  @Input() allMenuLabel = "";
  @Input() menuLabel = "";
  @Input() utilityItems: HeaderUtilityItem[] = [];
  @Input() myMenu: HeaderMyMenu | null = null;
  @Input() desktopItems: AngularNavItem[] = [];
  @Input() links: AngularNavItem[] = [];
  @Input() mobileMenu: HeaderMobileMenu | null = null;

  get headerDesktopItems(): AngularNavItem[] {
    return this.desktopItems.length > 0 ? this.desktopItems : this.links;
  }

  isSingleDesktopMenu(item: AngularNavItem): boolean {
    return Boolean(item.title && item.banner);
  }

  headerDesktopMenuId(item: AngularNavItem): string {
    return `${this.id}-gnb-main-${item.id}`;
  }

  headerDesktopSubmenuId(item: AngularNavItem): string {
    return `${this.id}-gnb-sub-${item.id}`;
  }

  get headerMobileId(): string {
    return this.mobileMenu?.id ?? "mobile-nav";
  }

  mobileMenuId(item: AngularNavItem): string {
    return item.id ?? (item.href?.startsWith("#") ? item.href.slice(1) : "");
  }

  mobileMenuTabId(index: number): string {
    return `${this.id}-mobile-tab-${index}`;
  }

  headerUtilityMenuId(item: HeaderUtilityItem): string {
    return `${this.id}-utility-${item.id}`;
  }

  headerMyMenuId(): string {
    return `${this.id}-mymenu`;
  }

  headerMobileDepth3Id(mobileIndex: number, childIndex: number): string {
    return `${this.id}-depth3-${mobileIndex}-${childIndex}`;
  }
}
