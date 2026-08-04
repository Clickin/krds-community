import { For, Show, mergeProps, splitProps } from "solid-js";
import type { KrdsStep } from "@krds-community/recipes";

export interface StepIndicatorProps {
  class?: string;
  className?: string;
  steps?: KrdsStep[];
  current?: number;
  modelValue?: number;
  label?: string;
  message?: string;
  [key: string]: unknown;
}

export function StepIndicator(rawProps: StepIndicatorProps) {
  const merged = mergeProps({}, rawProps);
  const [props, native] = splitProps(merged, [
    "class",
    "className",
    "steps",
    "current",
    "modelValue",
    "label",
    "message",
  ]);
  const className = () => props.class ?? props.className ?? "";
  const stepCurrent = () => Number(props.current ?? props.modelValue ?? 0);
  return (
    <ol
      {...(native as Record<string, any>)}
      class={`krds-step-wrap${className() ? ` ${className()}` : ""}`}
    >
      <For each={props.steps ?? []}>
        {(step, stepIndex) => (
          <li
            classList={{ done: stepIndex() < stepCurrent(), active: stepIndex() === stepCurrent() }}
          >
            <span>
              <Show when={stepIndex() === stepCurrent()}>
                <em class="sr-only">{props.message}</em>
              </Show>
              <i class="step">{`${stepIndex() + 1}${props.label}`}</i>
              <span class="step-tit">{step.label}</span>
            </span>
          </li>
        )}
      </For>
    </ol>
  );
}
