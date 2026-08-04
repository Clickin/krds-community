import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from "@angular/core";
import type { OnDestroy } from "@angular/core";

/**
 * 실시간 유효성 검사 입력 필드 (extra).
 *
 * 공식 KRDS HTML 키트에 없는 커뮤니티 확장 컴포넌트다. 공식 상호작용
 * 계약(service_03_05.html: 실시간 유효성 검사 — Keyup/Focusout, global_08.html:
 * 클라이언트 측 검증)을 참조해 동일한 검증·접근성 계약을 구현한다.
 *
 * `validate` 콜백이 값을 받아 검증 결과를 반환한다. 데모/문서/conformance에서는
 * 문자열 규칙("required" | "min-length:<n>" | "email")을 주면 내부에서 판정한다.
 */

export interface KrdsValidationResult {
  valid: boolean;
  message?: string;
}

export type KrdsValidatedInputMode = "keyup" | "focusout" | "both";

let nextValidatedInputId = 0;

// components.ts의 createStableId와 동일한 로컬 카운터 패턴 (공식 모듈 import 금지).
function createStableId(prefix: string): string {
  nextValidatedInputId += 1;
  return `${prefix}-${nextValidatedInputId.toString(36)}`;
}

@Component({
  selector: "krds-validated-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="'krds-validated-input' + (className ? ' ' + className : '')">
    <div class="form-group">
      <div class="form-tit">
        <label [for]="id">{{ label }}</label>
      </div>
      <div [class]="'form-conts' + stateClass">
        <input
          [id]="id"
          class="krds-input"
          [type]="type"
          [attr.name]="name"
          [value]="value"
          [attr.value]="value || null"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-invalid]="state === 'error' ? 'true' : null"
          [attr.aria-describedby]="id + '-message'"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
      </div>
      <p [id]="id + '-message'" [class]="messageClass">{{ message }}</p>
    </div>
  </div>`,
})
export class KrdsValidatedInputComponent implements OnDestroy {
  @Input() label = "";
  @Input() name: string | null = null;
  @Input() type = "text";
  @Input() placeholder = "";
  /** 초기값이자 현재 값 (입력 이벤트로 갱신). */
  @Input() value = "";
  /** 검증 콜백 또는 문자열 규칙 ("required" | "min-length:<n>" | "email"). */
  @Input()
  validate: ((value: string) => KrdsValidationResult | Promise<KrdsValidationResult>) | string =
    () => ({ valid: true });
  /** 검증 시점. 기본 "focusout" (service_03_05 계약). */
  @Input() mode: KrdsValidatedInputMode = "focusout";
  /** keyup 모드 디바운스(ms). 기본 300. */
  @Input() debounceMs = 300;
  @Input() hint = "";
  @Input() successMessage = "입력이 유효합니다.";
  @Input() required = false;
  @Input() disabled = false;
  @Input() className = "";
  @Input() id = createStableId("krds-validated-input");

  /** idle(검증 전) | error | success. */
  state: "idle" | "error" | "success" = "idle";
  /** 검증 실패 시 표시할 메시지 (성공 시 successMessage, 검증 전 hint 사용). */
  errorMessage = "";

  private validateToken = 0;
  private timer: number | null = null;
  private readonly changeDetector = inject(ChangeDetectorRef);

  /** 메시지 우선순위: 검증 결과 message(불가) > successMessage(가능) > hint(검증 전). */
  get message(): string {
    if (this.state === "error") return this.errorMessage;
    if (this.state === "success") return this.successMessage;
    return this.hint;
  }

  get stateClass(): string {
    return this.state === "error" ? " is-error" : this.state === "success" ? " is-success" : "";
  }

  get messageClass(): string {
    return this.state === "error"
      ? "form-hint-invalid"
      : this.state === "success"
        ? "form-hint-success"
        : "form-hint";
  }

  ngOnDestroy(): void {
    this.validateToken += 1;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    if (this.mode === "keyup" || this.mode === "both") {
      this.scheduleValidation();
    }
  }

  onBlur(): void {
    if (this.mode === "focusout" || this.mode === "both") {
      this.runValidation();
    }
  }

  private scheduleValidation(): void {
    this.validateToken += 1;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.runValidation();
    }, this.debounceMs);
  }

  private runValidation(): void {
    this.validateToken += 1;
    const token = this.validateToken;
    const apply = (result: KrdsValidationResult): void => {
      if (this.validateToken !== token) return;
      this.state = result.valid ? "success" : "error";
      this.errorMessage = result.message ?? this.hint;
      this.changeDetector.markForCheck();
    };
    Promise.resolve(this.resolveValidation(this.value)).then(apply);
  }

  private resolveValidation(value: string): KrdsValidationResult | Promise<KrdsValidationResult> {
    const rule = this.validate;
    if (typeof rule === "function") {
      return rule(value);
    }
    if (rule === "required") {
      return value.trim() === ""
        ? { valid: false, message: "필수 입력 항목입니다." }
        : { valid: true };
    }
    const minLengthMatch = /^min-length:(\d+)$/.exec(rule);
    if (minLengthMatch !== null) {
      const min = Number(minLengthMatch[1]);
      return value.length >= min
        ? { valid: true }
        : { valid: false, message: `${min}자 이상 입력해 주세요.` };
    }
    if (rule === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? { valid: true }
        : { valid: false, message: "올바른 이메일 형식으로 입력해 주세요." };
    }
    return { valid: true };
  }
}
