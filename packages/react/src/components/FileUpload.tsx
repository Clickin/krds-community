import {
  useId,
  useRef,
  useState,
  Fragment,
  useImperativeHandle,
  type ReactNode,
  type InputHTMLAttributes,
  type ChangeEvent,
  type Ref,
} from "react";
import { cx } from "@krds-community/recipes";
import type { NativeCommonProps } from "./_utils.js";
import { SvgIcon } from "./_utils.js";

export interface FileUploadItem {
  id: string;
  name: ReactNode;
  status?: "uploading" | "complete" | "deletable" | "error" | "downloadable";
  statusLabel?: ReactNode;
  deleteLabel?: ReactNode;
  errors?: ReactNode[];
  downloadLabel?: ReactNode;
  previewLabel?: ReactNode;
}
export interface FileUploadProps
  extends
    NativeCommonProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className" | "title"> {
  title?: ReactNode;
  description?: ReactNode;
  prompt?: ReactNode;
  inputId?: string;
  selectLabel?: ReactNode;
  currentCount?: number;
  maxCount?: number;
  countSuffix?: ReactNode;
  files?: FileUploadItem[];
  deleteAllLabel?: ReactNode;
  label?: string;
  onFilesChange?: (files: File[]) => void;
  onDelete?: (item: FileUploadItem) => void;
  onDeleteAll?: () => void;
  onDownload?: (item: FileUploadItem) => void;
  onPreview?: (item: FileUploadItem) => void;
  className?: string;
}
export function FileUpload({
  title,
  description,
  prompt,
  inputId: providedInputId,
  selectLabel,
  currentCount,
  maxCount,
  countSuffix,
  files: controlledFiles,
  deleteAllLabel,
  label: _label,
  onFilesChange,
  onDelete,
  onDeleteAll,
  onDownload,
  onPreview,
  className,
  onChange,
  id,
  ref,
  ...props
}: FileUploadProps & { ref?: Ref<HTMLInputElement> }) {
  const generatedId = useId();
  const inputId = providedInputId ?? id ?? `krds-file-upload-${generatedId}`;
  const [selectedFiles, setSelectedFiles] = useState<FileUploadItem[]>([]);
  const files = controlledFiles ?? selectedFiles;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const countSuffixText =
    typeof countSuffix === "string" || typeof countSuffix === "number" ? String(countSuffix) : "";
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.currentTarget.files ?? []);
    setSelectedFiles(next.map((file, index) => ({ id: `${index}`, name: file.name })));
    onFilesChange?.(next);
    onChange?.(event);
  };
  return (
    <div className={cx("krds-file-upload", "line", className)}>
      <div className="file-head">
        <h3 className="tit">{title}</h3>
        <div>
          <p>{description}</p>
        </div>
      </div>
      <div className="file-upload">
        <p className="txt">{prompt}</p>
        <div className="file-upload-btn-wrap">
          <input
            {...props}
            ref={inputRef}
            hidden
            id={inputId}
            type="file"
            onChange={change}
            aria-label={
              typeof selectLabel === "string"
                ? selectLabel
                : typeof title === "string"
                  ? title
                  : undefined
            }
          />
          <button
            type="button"
            className="krds-btn medium"
            disabled={props.disabled}
            onClick={() => inputRef.current?.click()}
          >
            <SvgIcon name="ico-upload" />
            {selectLabel}
          </button>
        </div>
      </div>
      <div className="file-list">
        <div className="total">
          <span className="current">
            {`${currentCount ?? files.length}${countSuffixText}`}
            {countSuffixText ? null : countSuffix}
          </span>
          {` / ${maxCount ?? ""}${countSuffixText}`}
          {countSuffixText ? null : countSuffix}
        </div>
        <ul className="upload-list">
          {files.map((file) => (
            <li className={file.status === "error" ? "is-error" : undefined} key={file.id}>
              <div className={cx("file-info", file.status === "downloadable" && "m-column")}>
                <div className="file-name">{file.name}</div>
                <div className="btn-wrap">
                  {file.status === "uploading" ? (
                    <span className="krds-spinner" role="status">
                      <span className="sr-only">{file.statusLabel}</span>
                    </span>
                  ) : null}
                  {file.status === "complete" ? (
                    <span className="complete ico-invalid">
                      <em className="sr-only">{file.statusLabel}</em>
                    </span>
                  ) : null}
                  {file.deleteLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onDelete?.(file)}
                    >
                      {file.deleteLabel} <SvgIcon name="ico-delete-fill" />
                    </button>
                  ) : null}
                  {file.downloadLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onDownload?.(file)}
                    >
                      {file.downloadLabel} <SvgIcon name="ico-down" />
                    </button>
                  ) : null}
                  {file.previewLabel ? (
                    <button
                      type="button"
                      className="krds-btn medium text"
                      onClick={() => onPreview?.(file)}
                    >
                      {file.previewLabel} <SvgIcon name="ico-angle right" />
                    </button>
                  ) : null}
                </div>
              </div>
              {file.errors?.length ? (
                <p className="file-hint-invalid">
                  {file.errors.map((error, index) => (
                    <Fragment key={index}>
                      {index ? <br /> : null}
                      {error}
                    </Fragment>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="upload-delete-btn">
          <button type="button" className="krds-btn xsmall tertiary" onClick={onDeleteAll}>
            {deleteAllLabel}
            <SvgIcon name="ico-angle right" />
          </button>
        </div>
      </div>
    </div>
  );
}
