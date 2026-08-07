import { For, createSignal, createUniqueId, mergeProps, splitProps, type JSX } from "solid-js";

export interface FeedbackOption {
  value: string;
  label: string;
}

export interface UserFeedbackProps {
  class?: string;
  className?: string;
  title?: JSX.Element;
  options?: FeedbackOption[];
  onSubmit?: (value: string) => void;
  submitLabel?: JSX.Element;
  [key: string]: unknown;
}

export function UserFeedback(rawProps: UserFeedbackProps) {
  const merged = mergeProps(
    {
      title: "이 페이지에 만족하시나요?",
      options: [
        { value: "satisfied", label: "만족" },
        { value: "dissatisfied", label: "불만족" },
      ] as FeedbackOption[],
      submitLabel: "제출",
    },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "title",
    "options",
    "onSubmit",
    "submitLabel",
  ]);

  const [selected, setSelected] = createSignal<string | undefined>(undefined);
  const name = `krds-feedback-${createUniqueId()}`;

  const submit = () => {
    const value = selected();
    if (value !== undefined) props.onSubmit?.(value);
  };

  const className = () => props.class ?? props.className ?? "";
  return (
    <div
      {...(native as Record<string, any>)}
      class={`krds-user-feedback${className() ? ` ${className()}` : ""}`}
    >
      <fieldset>
        <legend class="feedback-title">{props.title}</legend>
        <div class="feedback-options">
          <For each={props.options}>
            {(option) => (
              <label class="krds-form-check">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={selected() === option.value}
                  onChange={(event) => {
                    if (event.currentTarget.checked) setSelected(option.value);
                  }}
                />
                <span>{option.label}</span>
              </label>
            )}
          </For>
        </div>
        <button type="button" class="krds-btn small primary" onClick={submit}>
          {props.submitLabel}
        </button>
      </fieldset>
    </div>
  );
}
