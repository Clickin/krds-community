import { CommonModule } from "@angular/common";
import { DomSanitizer, type SafeResourceUrl } from "@angular/platform-browser";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-favicon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <link
      rel="icon"
      [href]="safeFaviconHref(href)"
      [attr.sizes]="sizes || null"
      [attr.type]="type"
    />
  `,
})
export class KrdsFaviconComponent {
  @Input() id = createStableId("krds-favicon");
  @Input() href = "#";
  @Input() sizes = "";
  @Input() type = "";
  private readonly sanitizer = inject(DomSanitizer, { optional: true });

  safeFaviconHref(value: string): SafeResourceUrl | string {
    const href = /^(?:https?:|data:image\/|\/|#)/i.test(value) ? value : "/favicon.ico";
    return this.sanitizer?.bypassSecurityTrustResourceUrl(href) ?? href;
  }
}
