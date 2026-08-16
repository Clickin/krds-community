import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

const LANGUAGE_SWITCHER_TEMPLATE = `
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
                    effectiveKind === 'language-switcher' && option.value === selectedValue
                  "
                  [attr.lang]="option.value"
                  [attr.target]="option.target || (effectiveKind === 'language-switcher-page' ? '_blank' : null)"
                  [attr.title]="option.title || (effectiveKind === 'language-switcher-page' ? externalTitle : null)"
                >
                  {{ option.label }}
                  @if (effectiveKind === "language-switcher-page") {
                    <i class="svg-icon ico-go"></i>
                  }
                  <span class="sr-only">{{
                    effectiveKind === "language-switcher" && option.value === selectedValue
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
  `;

@Component({
  selector: "krds-language-switcher",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: LANGUAGE_SWITCHER_TEMPLATE,
})
export class KrdsLanguageSwitcherComponent {
  @Input() id = createStableId("krds-language-switcher");
  @Input() label = "레이블";
  @Input() selected = "";
  @Input() selectedLabel = "";
  @Input() currentLabel = "";
  @Input() externalTitle = "";
  @Input() kind: "language-switcher" | "language-switcher-page" | null = null;
  @Input() options: Array<{
    value: string;
    label: string;
    target?: string;
    title?: string;
  }> = [];

  get effectiveKind(): "language-switcher" | "language-switcher-page" {
    return this.kind ?? "language-switcher";
  }

  get languageMenuId(): string {
    return `${this.id}-menu`;
  }
  get selectedValue(): string {
    return this.selected || this.options[0]?.value || "";
  }
  get selectedOptionLabel(): string {
    return (
      this.options.find((option) => option.value === this.selectedValue)?.label ??
      this.options[0]?.label ??
      ""
    );
  }

  get visibleLanguageOptions(): Array<{
    value: string;
    label: string;
    target?: string;
    title?: string;
  }> {
    return this.effectiveKind === "language-switcher-page"
      ? this.options.filter((option) => option.value !== this.selectedValue)
      : this.options;
  }
}

@Component({
  selector: "krds-language-switcher-page",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: LANGUAGE_SWITCHER_TEMPLATE,
})
export class KrdsLanguageSwitcherPageComponent extends KrdsLanguageSwitcherComponent {
  override get effectiveKind(): "language-switcher" | "language-switcher-page" {
    return "language-switcher-page";
  }
}
