import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "krds-footer",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    <footer id="krds-footer">
      <div class="foot-quick">
        <div class="inner">
          @for (site of relatedSites; track site.id) {
            <button type="button" class="link" [attr.title]="site.title">
              {{ site.label }}
            </button>
          }
        </div>
      </div>
      <div class="inner">
        <div class="f-logo">
          <span class="sr-only">{{ logoLabel }}</span>
        </div>
        <div class="f-cnt">
          <div class="f-info">
            <p class="info-addr">{{ address }}</p>
            <ul class="info-cs">
              @for (contact of contacts; track $index) {
                <li>
                  <strong class="strong">{{ contact.title }}</strong
                  ><span class="span">{{ contact.description }}</span>
                </li>
              }
            </ul>
          </div>
          <div class="f-link">
            <div class="link-go">
              @for (item of links; track $index) {
                <a [href]="item.href || '#'" class="krds-btn medium text">
                  {{ item.label }} <i class="svg-icon ico-angle right"></i>
                </a>
              }
            </div>
            <div class="link-sns">
              @for (item of socialLinks; track $index) {
                <a
                  [href]="item.href"
                  class="krds-btn xlarge icon border"
                  [attr.target]="item.target || null"
                  [attr.title]="item.title || null"
                >
                  <span class="sr-only">{{ item.label }}</span>
                  <i [class]="'svg-icon ico-' + item.icon"></i>
                </a>
              }
            </div>
          </div>
        </div>
        <div class="f-btm">
          <div class="f-btm-text">
            <div class="f-menu">
              @for (item of policyLinks; track $index) {
                <a [href]="item.href" [class.point]="item.emphasis">{{ item.label }}</a>
              }
            </div>
            <p class="f-copy">{{ copyright }}</p>
          </div>
          <div class="krds-identifier">
            <span class="logo"
              ><span class="sr-only">{{ organization }}</span></span
            >
            <span class="ban-txt">{{ description }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class KrdsFooterComponent {
  @Input() logoLabel = "";
  @Input() address = "";
  @Input() organization = "KRDS Community";
  @Input() description = "";
  @Input() copyright = "";
  @Input() relatedSites: Array<{ id: string; label: string; title: string }> = [];
  @Input() contacts: Array<{ title: string; description: string }> = [];
  @Input() links: Array<{ label: string; href?: string }> = [];
  @Input() socialLinks: Array<{
    label: string;
    icon: string;
    href: string;
    target?: string;
    title?: string;
  }> = [];
  @Input() policyLinks: Array<{
    label: string;
    href: string;
    emphasis?: boolean;
  }> = [];
}
