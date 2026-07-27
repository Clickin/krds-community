import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  accordionRecipe,
  buttonRecipe,
  choiceRecipe,
  fieldRecipe,
  inputRecipe,
  switchRecipe,
} from '@krds-community/recipes';
import type {
  AccordionContractProps,
  AccordionItemContract,
  ButtonContractProps,
  ChoiceContractProps,
  RadioContractProps,
  TextInputContractProps,
} from '@krds-community/recipes';

export interface ButtonProps
  extends ButtonContractProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', disabled, ...props },
  ref,
) {
  const recipe = buttonRecipe({ variant, size, disabled, className });
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      className={recipe.className}
      data-variant={recipe.data.variant}
      data-size={recipe.data.size}
    />
  );
});

export interface TextInputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'disabled'>,
    Omit<TextInputContractProps, 'label' | 'hint'> {
  label?: ReactNode;
  hint?: ReactNode;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, hint, state = 'default', size = 'medium', id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-input-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const recipe = inputRecipe({ state, size, className });
  return (
    <label className={fieldRecipe().className}>
      {label ? <span className="krds-field-label">{label}</span> : null}
      <input
        {...props}
        id={id}
        ref={ref}
        className={recipe.className}
        data-state={recipe.data.state}
        data-size={recipe.data.size}
        aria-invalid={state === 'error' ? 'true' : props['aria-invalid']}
        aria-describedby={props['aria-describedby'] ?? hintId}
      />
      {hint ? (
        <span id={hintId} className="krds-field-message" data-state={state}>
          {hint}
        </span>
      ) : null}
    </label>
  );
});

export interface CheckboxProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled'>,
    Omit<ChoiceContractProps, 'label' | 'description'> {
  label: ReactNode;
  description?: ReactNode;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size, id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-checkbox-${generatedId}`;
  return (
    <div className={choiceRecipe({ size, className }).className} data-size={size ?? 'medium'}>
      <input {...props} ref={ref} id={id} type="checkbox" />
      <label htmlFor={id}>{label}</label>
      {description ? <span className="krds-field-message">{description}</span> : null}
    </div>
  );
});

export interface RadioProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled' | 'value'>,
    Omit<RadioContractProps, 'label' | 'description' | 'value'> {
  label: ReactNode;
  value: string;
  description?: ReactNode;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, size, id: providedId, className, value, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-radio-${generatedId}`;
  return (
    <div className={choiceRecipe({ size, className }).className} data-size={size ?? 'medium'}>
      <input {...props} ref={ref} id={id} type="radio" value={value} />
      <label htmlFor={id}>{label}</label>
      {description ? <span className="krds-field-message">{description}</span> : null}
    </div>
  );
});

export interface SwitchProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled'>,
    Omit<ChoiceContractProps, 'label' | 'description'> {
  label: ReactNode;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, size, id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-switch-${generatedId}`;
  return (
    <div className={switchRecipe({ size, className }).className} data-size={size ?? 'medium'}>
      <input {...props} ref={ref} id={id} type="checkbox" />
      <label htmlFor={id}>
        <span className="switch-toggle" aria-hidden="true">
          <i />
        </span>
        {label}
      </label>
    </div>
  );
});

export interface AccordionItemData extends Omit<AccordionItemContract, 'title' | 'content'> {
  title: ReactNode;
  content: ReactNode;
}
export interface AccordionProps extends Omit<AccordionContractProps, 'items'> {
  items: AccordionItemData[];
  defaultOpen?: string[];
  className?: string;
}
export function Accordion({
  items,
  type = 'default',
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpenItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : multiple
          ? [...current, id]
          : [id],
    );
  const recipe = accordionRecipe({ type, className });
  return (
    <div className={recipe.className} data-type={type}>
      {items.map((item) => {
        const open = openItems.includes(item.id);
        const headerId = `krds-accordion-header-${item.id}`;
        const panelId = `krds-accordion-panel-${item.id}`;
        return (
          <div className={`krds-accordion-item${open ? ' is-open' : ''}`} key={item.id}>
            <h5 className="krds-accordion-heading">
              <button
                type="button"
                className="krds-accordion-trigger"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                {item.title}
              </button>
            </h5>
            <div
              id={panelId}
              className="krds-accordion-panel"
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const AccordionLine = Accordion;
export const RadioButton = Radio;
export const TextInputSize = TextInput;
export const TextInputState = TextInput;

export type InputChange = ChangeEvent<HTMLInputElement>;
