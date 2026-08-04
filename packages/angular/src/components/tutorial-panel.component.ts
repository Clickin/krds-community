import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-tutorial-panel",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-help-panel" [class.expand]="open">
      <div class="help-panel-wrap" [attr.tabindex]="open ? '0' : null">
        <div class="help-conts-area">
          <div class="krds-tab-area layer">
            <div class="tab line">
              <ul role="tablist">
                @for (tab of tabs; track tab.id) {
                  <li role="presentation" [class.active]="tabValue(tab) === activeTab">
                    <button
                      [id]="tab.id"
                      type="button"
                      class="btn-tab"
                      role="tab"
                      [attr.aria-selected]="tabValue(tab) === activeTab"
                      [attr.aria-controls]="tabPanelId(tab)"
                      [attr.tabindex]="tabValue(tab) === activeTab ? '0' : '-1'"
                    >
                      {{ tab.label }}
                      @if (tabValue(tab) === activeTab) {
                        <i class="sr-only created"> {{ selectedLabel }}</i>
                      }
                    </button>
                  </li>
                }
              </ul>
            </div>
            <div class="tab-conts-wrap">
              @if (tabs[0]) {
                <section
                  [id]="tabPanelId(tabs[0])"
                  role="tabpanel"
                  [attr.aria-labelledby]="tabs[0].id"
                  class="tab-conts"
                  [class.active]="tabValue(tabs[0]) === activeTab"
                  [hidden]="tabValue(tabs[0]) !== activeTab"
                >
                  <h3 class="sr-only">{{ tabs[0].label }}</h3>
                  <div class="help-conts-area-inner">
                    <div class="conts-area help-conts">
                      <div class="conts-wrap">
                        <h4 class="help-title">
                          {{ helpTitle }}
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
                  [id]="tabPanelId(tabs[1])"
                  role="tabpanel"
                  [attr.aria-labelledby]="tabs[1].id"
                  class="tab-conts"
                  [class.active]="tabValue(tabs[1]) === activeTab"
                  [hidden]="tabValue(tabs[1]) !== activeTab"
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
            <span class="sr-only">{{ label }}</span> {{ collapseLabel }}
            <i class="svg-icon ico-angle right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class KrdsTutorialPanelComponent {
  @Input() id = createStableId("krds-tutorial-panel");
  @Input() open = true;
  @Input() tabs: Array<{ id: string; label: string; panelId?: string; value?: string }> = [];
  @Input() activeTab = "tutorial";
  @Input() selectedLabel = "선택됨";
  @Input() label = "";
  @Input() helpTitle = "";
  @Input() helpDescription = "";
  @Input() downloadLinks: Array<{ label: string; href: string; target?: string; title?: string }> =
    [];
  @Input() relatedGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string; icon?: string }>;
  }> = [];
  @Input() tutorialTitle = "";
  @Input() tutorialBackTitle = "";
  @Input() stopLabel = "";
  @Input() collapseLabel = "접기";
  @Input() tasks: Array<{
    title: string;
    current?: boolean;
    summary: string;
    steps: string[];
  }> = [];

  tabValue(tab: { value?: string; id: string }): string {
    return tab.value ?? tab.id;
  }

  tabPanelId(tab: { id: string; panelId?: string }): string {
    return tab.panelId ?? `${this.id}-${tab.id}-panel`;
  }

  helpDisclosureId(index: number): string {
    return `${this.id}-help-disclosure-${index}`;
  }
}
