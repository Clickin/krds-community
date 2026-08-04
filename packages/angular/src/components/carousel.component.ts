import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-carousel, krds-carousel-banner",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (effectiveKind === "carousel-banner") {
      <div class="main-d-ban-swiper">
        <div class="swiper">
          <ul class="swiper-wrapper">
            @for (slide of slides; track slide.id) {
              <li class="swiper-slide">
                <div class="text">
                  <p class="cate">{{ slide.description }}</p>
                  <p class="tit">{{ slide.title }}</p>
                </div>
                <div class="im">
                  <svg
                    width="243"
                    height="178"
                    viewBox="0 0 243 178"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    [attr.aria-label]="imageLabel"
                  >
                    <rect width="243" height="178" fill="#E6E8EA"></rect>
                  </svg>
                </div>
              </li>
            }
          </ul>
        </div>
        <div class="swiper-indicator">
          <div class="swiper-pagination"></div>
          <div class="swiper-controller">
            <button type="button" class="swiper-button-play">
              <span class="sr-only">{{ playLabel }}</span>
            </button>
            <button type="button" class="swiper-button-stop">
              <span class="sr-only">{{ stopLabel }}</span>
            </button>
          </div>
          <div class="swiper-navigation">
            <button type="button" class="swiper-button-prev" (click)="previousSlide()">
              <span class="sr-only">{{ previousLabel }}</span>
            </button>
            <button type="button" class="swiper-button-next" (click)="nextSlide()">
              <span class="sr-only">{{ nextLabel }}</span>
            </button>
            <a href="#" class="swiper-button-more">
              <span class="sr-only">{{ moreLabel }}</span>
            </a>
          </div>
        </div>
      </div>
    } @else {
      <div class="main-vban-wrap bg">
        <div class="inner">
          <div class="vb-swiper">
            <div class="swiper">
              <ul class="swiper-wrapper">
                @for (slide of slides; track slide.id) {
                  <li class="swiper-slide">
                    <div class="in">
                      <div class="text">
                        <p class="tit">{{ slide.title }} <br class="w-hide" />{{ slide.title }}</p>
                        <p class="txt">
                          {{ slide.description }} <br class="w-hide" />{{ slide.description }}
                        </p>
                        <a [href]="slide.href || '#'" class="krds-btn primary">{{ actionLabel }}</a>
                      </div>
                      <div class="im">
                        <svg
                          width="243"
                          height="178"
                          viewBox="0 0 243 178"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          [attr.aria-label]="imageLabel"
                        >
                          <rect width="243" height="178" fill="#E6E8EA"></rect>
                        </svg>
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </div>
            <button type="button" class="swiper-button-prev" (click)="previousSlide()">
              <span class="sr-only">{{ previousLabel }}</span>
            </button>
            <button type="button" class="swiper-button-next" (click)="nextSlide()">
              <span class="sr-only">{{ nextLabel }}</span>
            </button>
            <div class="swiper-indicator text-center">
              <div class="swiper-pagination"></div>
              <a href="#" class="swiper-button-more">
                <span class="sr-only">{{ moreLabel }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class KrdsCarouselComponent {
  @Input() id = createStableId("krds-carousel");
  @Input() kind: "carousel" | "carousel-banner" | null = null;
  @Input() slides: Array<{ id: string; title: string; description?: string; href?: string }> = [];
  @Input() previousLabel = "";
  @Input() nextLabel = "";
  @Input() moreLabel = "";
  @Input() imageLabel = "";
  @Input() actionLabel = "";
  @Input() playLabel = "";
  @Input() stopLabel = "";
  @Input() slideIndex = 0;

  private readonly hostTagKind = inject(ElementRef<HTMLElement>)
    .nativeElement.tagName.toLocaleLowerCase("en-US")
    .slice(5) as "carousel" | "carousel-banner";

  get effectiveKind(): "carousel" | "carousel-banner" {
    return this.kind ?? this.hostTagKind;
  }

  previousSlide(): void {
    const length = Math.max(this.slides.length, 1);
    this.slideIndex = (this.slideIndex - 1 + length) % length;
  }

  nextSlide(): void {
    this.slideIndex = (this.slideIndex + 1) % Math.max(this.slides.length, 1);
  }
}
export { KrdsCarouselComponent as KrdsCarouselBannerComponent };
