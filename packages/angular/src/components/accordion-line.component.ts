import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { accordionRecipe } from "@krds-community/recipes";
import { createStableId, type AngularNavItem } from "../kinds";

@Component({
  selector: "krds-accordion-line",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="accordionClass">
      @for (item of items; track $index) {
        <div class="accordion-item" [class.active]="isAccordionOpen($index)">
          <h5 class="accordion-header">
            <button
              type="button"
              class="btn-accordion"
              [class.active]="isAccordionOpen($index)"
              [id]="accordionHeaderId($index)"
              [attr.aria-controls]="accordionPanelId($index)"
              [attr.aria-expanded]="isAccordionOpen($index)"
              (click)="toggleAccordion($index)"
            >
              {{ navLabel(item) }}
            </button>
          </h5>
          <div
            class="accordion-collapse collapse"
            [class.show]="isAccordionOpen($index)"
            [id]="accordionPanelId($index)"
            [attr.aria-labelledby]="accordionHeaderId($index)"
            role="region"
            [hidden]="!isAccordionOpen($index)"
          >
            <div class="accordion-body">{{ itemDescription(item) }}</div>
          </div>
        </div>
      }
    </div>
  `,
})
export class KrdsAccordionLineComponent {
  @Input() id = createStableId("krds-accordion-line");
  @Input() type = "line";
  @Input() description = "";
  @Input() items: (AngularNavItem | string)[] = [];
  accordionOpenIndex: number | null = null;

  get accordionClass(): string {
    return accordionRecipe({
      type: this.type === "line" ? "line" : "default",
    }).className;
  }

  isAccordionOpen(index: number): boolean {
    return this.accordionOpenIndex === index;
  }

  toggleAccordion(index: number): void {
    this.accordionOpenIndex = this.isAccordionOpen(index) ? null : index;
  }

  accordionHeaderId(index: number): string {
    return `${this.id}-header-${index}`;
  }

  accordionPanelId(index: number): string {
    return `${this.id}-panel-${index}`;
  }

  navLabel(item: unknown): string {
    if (typeof item === "string" || typeof item === "number") return String(item);
    if (!item || typeof item !== "object") return "";
    if ("label" in item) return String((item as { label?: unknown }).label ?? "");
    if ("title" in item) return String((item as { title?: unknown }).title ?? "");
    if ("text" in item) return String((item as { text?: unknown }).text ?? "");
    if ("message" in item) return String((item as { message?: unknown }).message ?? "");
    return "";
  }

  itemDescription(item: unknown): string {
    if (!item || typeof item !== "object") return this.description;
    if ("content" in item) return String((item as { content?: unknown }).content ?? "");
    if ("description" in item) {
      return String((item as { description?: unknown }).description ?? "");
    }
    return this.description;
  }
}
