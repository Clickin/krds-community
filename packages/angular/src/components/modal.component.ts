import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-modal, krds-modal-sample",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [":host { display: contents; }"],
  template: `
    @if (kind === "modal-sample") {
      <section
        [id]="id"
        class="krds-modal fade in shown"
        role="dialog"
        [attr.aria-labelledby]="id + '-title'"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 [id]="id + '-title'" class="modal-title">{{ title }}</h2>
            </div>
            <div class="modal-conts">
              <div class="conts-area">{{ description }}</div>
            </div>
            <div class="modal-btn btn-wrap">
              <button type="button" class="krds-btn medium tertiary close-modal">
                {{ cancelLabel }}
              </button>
              <button type="button" class="krds-btn medium primary close-modal">
                {{ confirmLabel }}
              </button>
            </div>
            <button type="button" class="krds-btn medium icon btn-close close-modal">
              <span class="sr-only">{{ closeLabel }}</span>
              <i class="svg-icon ico-popup-close"></i>
            </button>
          </div>
        </div>
        <div class="modal-back in"></div>
      </section>
    } @else {
      <section
        [id]="id"
        class="krds-modal fade"
        [class.in]="open"
        [class.shown]="open"
        role="dialog"
        [attr.aria-labelledby]="id + '-title'"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 [id]="id + '-title'" class="modal-title">{{ title }}</h2>
            </div>
            <div class="modal-conts">
              <div class="conts-area">
                @if (items.length > 0) {
                  @for (item of items; track $index) {
                    {{ navLabel(item) }}
                    @if (!$last) {
                      <br />
                    }
                  }
                } @else {
                  {{ description }}
                }
              </div>
            </div>
            <div class="modal-btn btn-wrap">
              <button type="button" class="krds-btn medium tertiary close-modal">
                {{ cancelLabel }}
              </button>
              <button type="button" class="krds-btn medium primary close-modal">
                {{ confirmLabel }}
              </button>
            </div>
            <button type="button" class="krds-btn medium icon btn-close close-modal">
              <span class="sr-only">{{ closeLabel }}</span>
              <i class="svg-icon ico-popup-close"></i>
            </button>
          </div>
        </div>
        <div class="modal-back" [class.in]="open"></div>
      </section>
    }
  `,
})
export class KrdsModalComponent {
  @Input() id = createStableId("krds-modal");
  @Input() open = false;
  @Input() title = "제목";
  @Input() description = "";
  @Input() cancelLabel = "";
  @Input() confirmLabel = "";
  @Input() closeLabel = "닫기";
  @Input() kind: "modal" | "modal-sample" = "modal";
  @Input() items: (AngularNavItem | string)[] = [];

  navLabel(item: unknown): string {
    if (typeof item === "string" || typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";
    if ("label" in item) return String(item.label ?? "");
    if ("title" in item) return String(item.title ?? "");
    if ("text" in item) return String(item.text ?? "");
    if ("message" in item) return String(item.message ?? "");
    return "";
  }
}
export { KrdsModalComponent as KrdsModalSampleComponent };
