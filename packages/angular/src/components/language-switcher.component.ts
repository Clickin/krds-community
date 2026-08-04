import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-language-switcher, krds-language-switcher-page",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-drop-wrap krds-language">
      <button
        type="button"
        class="krds-btn small text drop-btn"
        aria-expanded="false"
        [attr.aria-controls]="languageMenuId"
      >
        <i class="svg-icon ico-global"></i>{{ " " + label + " "
        }}<i class="svg-icon ico-toggle"></i>
      </button>
      <div class="drop-menu" [id]="languageMenuId">
        <div class="drop-in">
          @if (effectiveKind === "language-switcher-page") {
            <div class="drop-top">
              <p class="current-laguage">
                <span>{{ currentLabel }}</span>
                <strong>{{ selectedOptionLabel }}</strong>
              </p>
            </div>
          }
          <ul class="drop-list">
            @for (option of visibleLanguageOptions; track $index) {
              <li>
                <a
                  href="#"
                  class="item-link"
                  [class.active]="
                    effectiveKind === 'language-switcher' && option.value === selected
                  "
                  [attr.lang]="option.value"
                  [attr.target]="effectiveKind === 'language-switcher-page' ? '_blank' : null"
                  [attr.title]="effectiveKind === 'language-switcher-page' ? externalTitle : null"
                >
                  {{ option.label }}
                  @if (effectiveKind === "language-switcher-page") {
                    <i class="svg-icon ico-go"></i>
                  }
                  <span class="sr-only">{{
                    effectiveKind === "language-switcher" && option.value === selected
                      ? selectedLabel
                      : ""
                  }}</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class KrdsLanguageSwitcherComponent {
  @Input() id = createStableId("krds-language-switcher");
  @Input() label = "레이블";
  @Input() selected = "";
  @Input() selectedLabel = "";
  @Input() currentLabel = "";
  @Input() externalTitle = "";
  @Input() kind: "language-switcher" | "language-switcher-page" | null = null;
  @Input() options: Array<{ value: string; label: string }> = [];

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "language-switcher" | "language-switcher-page";

  get effectiveKind(): "language-switcher" | "language-switcher-page" {
    return this.kind ?? this.hostTagKind;
  }

  get languageMenuId(): string {
    return `${this.id}-menu`;
  }

  get selectedOptionLabel(): string {
    return (
      this.options.find((option) => option.value === this.selected)?.label ??
      this.options[0]?.label ??
      ""
    );
  }

  get visibleLanguageOptions(): Array<{ value: string; label: string }> {
    return this.effectiveKind === "language-switcher-page"
      ? this.options.filter((option) => option.value !== this.selected)
      : this.options;
  }
}
export { KrdsLanguageSwitcherComponent as KrdsLanguageSwitcherPageComponent };
