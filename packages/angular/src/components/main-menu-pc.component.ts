import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Input, inject } from "@angular/core";
import { type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-main-menu-pc",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <nav
      class="krds-main-menu sample"
      [attr.aria-label]="ariaLabel || hostAriaLabel || menuLabel || null"
    >
      <div class="inner">
        <ul class="gnb-menu">
          @for (item of items; track item.id) {
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
                >
                  {{ item.label }}
                </button>
                <div class="gnb-toggle-wrap" [class.is-open]="item.active">
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
                                [class.active]="child.active"
                                data-trigger="gnb"
                              >
                                {{ child.label }}
                              </button>
                              <div
                                class="gnb-sub-list"
                                [class.active]="child.active"
                                [class.between]="!child.active && childIndex > 0"
                              >
                                <div class="gnb-sub-content">
                                  <h2 class="sub-title">
                                    @if (child.titleHref) {
                                      {{ child.title }}
                                      <a [href]="child.titleHref" class="krds-btn link basic small">
                                        <span class="underline">{{ child.titleLinkLabel }}</span>
                                        <i class="svg-icon ico-angle right"></i>
                                      </a>
                                    } @else {
                                      <span>{{ child.title }}</span>
                                    }
                                  </h2>
                                  @if (child.descriptionItems?.length) {
                                    <ul class="type-description">
                                      @for (desc of child.descriptionItems || []; track $index) {
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
  `,
})
export class KrdsMainMenuPcComponent {
  readonly hostAriaLabel = inject(ElementRef<HTMLElement>).nativeElement.getAttribute("aria-label");

  @Input() items: AngularNavItem[] = [];
  @Input() menuLabel = "";
  @Input("aria-label") ariaLabel = "";

  isSingleDesktopMenu(item: AngularNavItem): boolean {
    return Boolean(item.title && item.banner);
  }
}
