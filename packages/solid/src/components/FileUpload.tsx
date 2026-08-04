import { For, Show, createSignal, mergeProps, splitProps } from "solid-js";
import type { UploadFile } from "../shared.js";

export interface FileUploadProps {
  class?: string;
  className?: string;
  title?: string;
  description?: string;
  prompt?: string;
  inputId?: string;
  name?: string;
  value?: string;
  modelValue?: string | number | boolean;
  disabled?: boolean;
  selectLabel?: string;
  label?: string;
  files?: UploadFile[];
  currentCount?: number;
  maxCount?: number;
  countSuffix?: string;
  deleteAllLabel?: string;
  defaultValue?: string;
  [key: string]: unknown;
}

export function FileUpload(rawProps: FileUploadProps) {
  const merged = mergeProps({ countSuffix: "개" }, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "description",
    "prompt",
    "inputId",
    "name",
    "value",
    "modelValue",
    "disabled",
    "selectLabel",
    "label",
    "files",
    "currentCount",
    "maxCount",
    "countSuffix",
    "deleteAllLabel",
    "defaultValue",
  ]);
  const [, setLocalValue] = createSignal("");
  const setValue = (next: string) => {
    if (
      props.value === undefined &&
      (props.modelValue === undefined ||
        typeof props.modelValue === "boolean" ||
        Array.isArray(props.modelValue))
    )
      setLocalValue(next);
  };
  let uploadInput: HTMLInputElement | undefined;
  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-file-upload line${className() ? ` ${className()}` : ""}`}
    >
      <div class="file-head">
        <h3 class="tit">{props.title}</h3>
        <div>
          <p>{props.description}</p>
        </div>
      </div>
      <div class="file-upload">
        <p class="txt">{props.prompt}</p>
        <div class="file-upload-btn-wrap">
          <input
            ref={(element) => {
              uploadInput = element;
            }}
            hidden
            id={props.inputId}
            name={props.name}
            type="file"
            aria-label={props.label ?? props.selectLabel ?? props.title}
            onChange={(event) => {
              setValue(
                Array.from(event.currentTarget.files ?? [])
                  .map((file) => file.name)
                  .join(", "),
              );
              (native as Record<string, any>).onChange?.(event);
            }}
          />
          <button
            type="button"
            class="krds-btn medium"
            disabled={props.disabled}
            onClick={() => uploadInput?.click()}
          >
            <i class="svg-icon ico-upload" />
            {props.selectLabel}
          </button>
        </div>
      </div>
      <div class="file-list">
        <div class="total">
          <span class="current">
            {String(props.currentCount ?? "") + String(props.countSuffix ?? "")}
          </span>
          {" / " + String(props.maxCount ?? "") + String(props.countSuffix ?? "")}
        </div>
        <ul class="upload-list">
          <For each={props.files}>
            {(file) => (
              <li classList={{ "is-error": file.status === "error" }}>
                <div class="file-info" classList={{ "m-column": file.status === "downloadable" }}>
                  <div class="file-name">{file.name}</div>
                  <div class="btn-wrap">
                    <Show when={file.status === "uploading"}>
                      <span class="krds-spinner" role="status">
                        <span class="sr-only">{file.statusLabel}</span>
                      </span>
                    </Show>
                    <Show when={file.status === "complete"}>
                      <span class="ico-invalid complete">
                        <em class="sr-only">{file.statusLabel}</em>
                      </span>
                    </Show>
                    <Show when={file.status === "deletable" || file.status === "error"}>
                      <button type="button" class="krds-btn medium text">
                        {file.deleteLabel} <i class="svg-icon ico-delete-fill" />
                      </button>
                    </Show>
                    <Show when={file.status === "downloadable"}>
                      <button type="button" class="krds-btn medium text">
                        {file.downloadLabel} <i class="svg-icon ico-down" />
                      </button>
                      <button type="button" class="krds-btn medium text">
                        {file.previewLabel} <i class="svg-icon ico-angle right" />
                      </button>
                    </Show>
                  </div>
                </div>
                <Show when={file.errors?.length}>
                  <p class="file-hint-invalid">
                    <For each={file.errors}>
                      {(error, errorIndex) => (
                        <>
                          {error}
                          <Show when={errorIndex() < (file.errors?.length ?? 0) - 1}>
                            <br />
                          </Show>
                        </>
                      )}
                    </For>
                  </p>
                </Show>
              </li>
            )}
          </For>
        </ul>
        <div class="upload-delete-btn">
          <button type="button" class="krds-btn xsmall tertiary">
            {props.deleteAllLabel}
            <i class="svg-icon ico-angle right" />
          </button>
        </div>
      </div>
    </div>
  );
}
