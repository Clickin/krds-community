import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { createStableId } from "../kinds";

@Component({
  selector: "krds-file-upload",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="krds-file-upload line">
      <div class="file-head">
        <h3 class="tit">{{ title }}</h3>
        <div>
          <p>{{ description }}</p>
        </div>
      </div>
      <div class="file-upload">
        <p class="txt">{{ prompt }}</p>
        <div class="file-upload-btn-wrap">
          <input
            #fileInput
            type="file"
            [name]="name"
            [id]="inputId"
            [attr.aria-label]="selectLabel || title || null"
            hidden
          />
          <button
            type="button"
            class="krds-btn medium"
            [disabled]="disabled"
            (click)="fileInput.click()"
          >
            <i class="svg-icon ico-upload"></i>{{ selectLabel }}
          </button>
        </div>
      </div>
      <div class="file-list">
        <div class="total">
          <span class="current">{{ effectiveCount }}{{ countSuffix }}</span
          >{{ " / " + (maxCount ?? "") + countSuffix }}
        </div>
        <ul class="upload-list">
          @for (file of files; track file.id) {
            <li [class.is-error]="file.status === 'error'">
              <div class="file-info" [class.m-column]="file.status === 'downloadable'">
                <div class="file-name">{{ file.name }}</div>
                <div class="btn-wrap">
                  @if (file.status === "uploading") {
                    <span class="krds-spinner" role="status">
                      <span class="sr-only">{{ file.statusLabel }}</span>
                    </span>
                  } @else if (file.status === "complete") {
                    <span class="ico-invalid complete">
                      <em class="sr-only">{{ file.statusLabel }}</em>
                    </span>
                  }
                  @if (file.deleteLabel) {
                    <button type="button" class="krds-btn medium text">
                      {{ file.deleteLabel }} <i class="svg-icon ico-delete-fill"></i>
                    </button>
                  }
                  @if (file.downloadLabel) {
                    <button type="button" class="krds-btn medium text">
                      {{ file.downloadLabel }} <i class="svg-icon ico-down"></i>
                    </button>
                  }
                  @if (file.previewLabel) {
                    <button type="button" class="krds-btn medium text">
                      {{ file.previewLabel }} <i class="svg-icon ico-angle right"></i>
                    </button>
                  }
                </div>
              </div>
              @if (file.errors?.length) {
                <p class="file-hint-invalid">
                  @for (error of file.errors; track $index) {
                    {{ error }}
                    @if (!$last) {
                      <br />
                    }
                  }
                </p>
              }
            </li>
          }
        </ul>
        <div class="upload-delete-btn">
          <button type="button" class="krds-btn xsmall tertiary">
            {{ deleteAllLabel }}<i class="svg-icon ico-angle right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class KrdsFileUploadComponent {
  @Input() id = createStableId("krds-file-upload");
  @Input() title = "";
  @Input() description = "";
  @Input() prompt = "";
  @Input() name = "";
  @Input() inputId = "";
  @Input() disabled = false;
  @Input() selectLabel = "";
  @Input() currentCount: number | null = null;
  @Input() maxCount: number | null = null;
  @Input() countSuffix = "";
  @Input() deleteAllLabel = "";
  @Input() files: Array<{
    id: string;
    name: string;
    status: "uploading" | "complete" | "deletable" | "error" | "downloadable";
    statusLabel?: string;
    deleteLabel?: string;
    errors?: string[];
    downloadLabel?: string;
    previewLabel?: string;
  }> = [];

  // react renders currentCount ?? files.length — mirror it so a provided
  // file list alone drives the counter.
  get effectiveCount(): number {
    return this.currentCount ?? this.files.length;
  }
}
