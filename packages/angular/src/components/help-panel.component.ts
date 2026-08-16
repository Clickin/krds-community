import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-help-panel",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      [id]="id + '-trigger'"
      class="krds-btn small tertiary btn-help-panel expand btn-help-exec"
      [attr.aria-controls]="id"
      [attr.aria-expanded]="open"
      (click)="open = true"
    >
      <i class="svg-icon ico-fold"></i> {{ label }}
    </button>
    <div [id]="id" class="krds-help-panel" [class.expand]="open" [hidden]="!open">
      <div class="help-panel-wrap" [attr.tabindex]="open ? '0' : null">
        <div class="help-conts-area">
          <div class="krds-tab-area layer">
            <div class="tab line">
              <ul role="tablist">
                @for (tab of tabs; track tab.id) {
                  <li role="presentation" [class.active]="helpTabValue(tab) === effectiveActiveTab">
                    <button
                      [id]="tab.id"
                      type="button"
                      class="btn-tab"
                      role="tab"
                      [attr.aria-selected]="helpTabValue(tab) === effectiveActiveTab"
                      [attr.aria-controls]="helpTabPanelId(tab)"
                      [attr.tabindex]="helpTabValue(tab) === effectiveActiveTab ? '0' : '-1'"
                      (click)="setActiveTab(helpTabValue(tab))"
                    >
                      {{ tab.label }}
                      @if (helpTabValue(tab) === effectiveActiveTab && selectedLabel) {
                        <i class="sr-only created">{{ " " + selectedLabel }}</i>
                      }
                    </button>
                  </li>
                }
              </ul>
            </div>
            <div class="tab-conts-wrap">
              @if (tabs[0]) {
                <section
                  [id]="helpTabPanelId(tabs[0])"
                  role="tabpanel"
                  [attr.aria-labelledby]="tabs[0].id"
                  class="tab-conts"
                  [class.active]="helpTabValue(tabs[0]) === effectiveActiveTab"
                  [hidden]="helpTabValue(tabs[0]) !== effectiveActiveTab"
                >
                  <h3 class="sr-only">{{ tabs[0].label }}</h3>
                  <div class="help-conts-area-inner">
                    <div class="conts-area help-conts">
                      <div class="conts-wrap">
                        <h4 class="help-title">
                          @if (helpTitle.split(" ").length < 2) {
                            {{ helpTitle }} {{ " " }}
                          } @else {
                            @for (part of helpTitle.split(" "); track $index) {
                              @if ($index > 0) { {{ " " }} }
                              <span class="krds-icon-space-right">{{ part }}</span>
                            }
                            {{ " " }}
                          }
                          <span class="krds-btn medium icon">
                            <span class="sr-only">{{ label }}</span>
                            <i class="svg-icon ico-help"></i>
                          </span>
                        </h4>
                        <div class="conts-desc">
                          <p>{{ helpDescription }}</p>
                        </div>
                        <ul class="link-list">
                          @for (link of downloadLinks; track $index) {
                            <li>
                              <a
                                [href]="link.href"
                                [attr.target]="link.target || null"
                                [attr.title]="link.title || null"
                                class="krds-btn xsmall link basic"
                              >
                                {{ link.label }} <i class="svg-icon ico-go"></i>
                              </a>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                    <div class="conts-area related-service">
                      @for (group of relatedGroups; track $index) {
                        <div class="conts-wrap">
                          <h4 class="help-title">{{ group.title }}</h4>
                          <ul class="link-list">
                            @for (link of group.links; track $index) {
                              <li>
                                <a [href]="link.href" class="krds-btn xsmall link basic">
                                  @if (link.icon) {
                                    <i [class]="'svg-icon ico-' + link.icon"></i>
                                  }
                                  {{ link.label }}
                                  @if (!link.icon) {
                                    <i class="svg-icon ico-angle right"></i>
                                  }
                                </a>
                              </li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                </section>
              }
              @if (tabs[1]) {
                <section
                  [id]="helpTabPanelId(tabs[1])"
                  role="tabpanel"
                  [attr.aria-labelledby]="tabs[1].id"
                  class="tab-conts"
                  [class.active]="helpTabValue(tabs[1]) === effectiveActiveTab"
                  [hidden]="helpTabValue(tabs[1]) !== effectiveActiveTab"
                >
                  <h3 class="sr-only">{{ tabs[1].label }}</h3>
                  <div class="help-conts-area-inner">
                    <div class="conts-area">
                      <h4 class="help-title">
                        <a href="#;" [attr.title]="tutorialBackTitle">{{ tutorialTitle }}</a>
                      </h4>
                      <ul class="coach-help-process">
                        @for (task of tasks; track $index; let taskIndex = $index) {
                          <li>
                            <h4 class="tit" [class.current]="task.current">{{ task.title }}</h4>
                            <div class="krds-disclosure conts-expand-area">
                              <button
                                type="button"
                                class="btn-conts-expand"
                                [attr.aria-controls]="helpDisclosureId(taskIndex)"
                                aria-expanded="false"
                              >
                                {{ task.summary }}
                              </button>
                              <div class="expand-wrap" [id]="helpDisclosureId(taskIndex)" inert>
                                <div class="expand-in">
                                  <ul class="krds-info-list decimal" role="list">
                                    @for (step of task.steps; track $index) {
                                      <li role="listitem">{{ step }}</li>
                                    }
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                        }
                      </ul>
                    </div>
                    <div class="help-panel-action">
                      <button type="button" class="krds-btn medium secondary coach-btn-stop">
                        {{ stopLabel }}
                      </button>
                    </div>
                  </div>
                </section>
              }
            </div>
          </div>
          <button
            type="button"
            class="krds-btn small tertiary btn-help-panel fold"
            (click)="open = false"
          >
            <span class="sr-only">{{ label }}</span>
            @if ((collapseLabel || label).split(" ").length < 2) {
              {{ " " + (collapseLabel || label) + " " }}
            } @else {
              {{ " " }}
              @for (part of (collapseLabel || label).split(" "); track $index) {
                @if ($index > 0) { {{ " " }} }
                <span class="krds-icon-space-left krds-icon-space-right">{{ part }}</span>
              }
              {{ " " }}
            }
            <i class="svg-icon ico-angle right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class KrdsHelpPanelComponent {
  @Input() id = createStableId("krds-help-panel");
  @Input() open = false;
  @Input() label = "도움 패널";
  @Input() selectedLabel = "";
  @Input() collapseLabel = "";
  @Input() helpTitle = "";
  @Input() helpDescription = "";
  @Input() tutorialTitle = "";
  @Input() tutorialBackTitle = "";
  @Input() stopLabel = "";
  @Input() activeTab = "";
  @Input() tabs: Array<{ id: string; label: string; panelId?: string; value?: string }> = [];
  @Output() activeTabChange = new EventEmitter<string>();
  @Input() downloadLinks: Array<{ label: string; href: string; target?: string; title?: string }> =
    [];
  @Input() relatedGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string; icon?: string }>;
  }> = [];
  @Input() tasks: Array<{
    title: string;
    current?: boolean;
    summary: string;
    steps: string[];
  }> = [];

  // react initializes the uncontrolled active tab to the first tab; mirror it
  // so panels render content even when the MDX never passes activeTab.
  get effectiveActiveTab(): string {
    return this.activeTab || (this.tabs[0] ? this.helpTabValue(this.tabs[0]) : "");
  }

  helpTabValue(tab: { id: string; value?: string }): string {
    return tab.value ?? tab.id;
  }

  helpTabPanelId(tab: { id: string; panelId?: string }): string {
    return tab.panelId ?? `${tab.id}-panel`;
  }

  helpDisclosureId(index: number): string {
    return `${this.id}-disclosure-${index}`;
  }

  setActiveTab(value: string): void {
    this.activeTab = value;
    this.activeTabChange.emit(value);
  }
}
