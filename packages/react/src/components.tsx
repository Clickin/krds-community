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
  cx,
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
function joinAriaIds(...ids: Array<string | undefined>) {
  const unique = new Set(
    ids.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? []),
  );
  return unique.size ? Array.from(unique).join(' ') : undefined;
}

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
  {
    label,
    hint,
    state = 'default',
    size,
    id: providedId,
    className,
    readonly,
    readOnly,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-input-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const hintClassName =
    state === 'default'
      ? 'form-hint'
      : state === 'error'
        ? 'form-hint-invalid'
        : `form-hint-${state}`;
  return (
    <div className="form-group">
      <div className="form-tit">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className={cx('form-conts', state === 'default' ? undefined : `is-${state}`)}>
        <input
          {...props}
          id={id}
          ref={ref}
          readOnly={readonly ?? readOnly}
          className={cx('krds-input', size, className)}
          aria-invalid={state === 'error' ? 'true' : props['aria-invalid']}
          aria-describedby={joinAriaIds(props['aria-describedby'], hintId)}
        />
      </div>
      {hint ? (
        <p id={hintId} className={hintClassName}>
          {hint}
        </p>
      ) : null}
    </div>
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
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = choiceRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="checkbox"
        aria-describedby={joinAriaIds(props['aria-describedby'], descriptionId)}
      />
      <label htmlFor={id}>{label}</label>
      {description ? (
        <div className="krds-form-check-cnt">
          <p id={descriptionId} className="krds-form-check-p">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
});

export interface RadioProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled' | 'value'>,
    Omit<RadioContractProps, 'label' | 'description' | 'value'> {
  label: ReactNode;
  value?: string;
  description?: ReactNode;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, size, id: providedId, className, value, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-radio-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = choiceRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="radio"
        value={value}
        aria-describedby={joinAriaIds(props['aria-describedby'], descriptionId)}
      />
      <label htmlFor={id}>{label}</label>
      {description ? (
        <div className="krds-form-check-cnt">
          <p id={descriptionId} className="krds-form-check-p">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
});

export interface SwitchProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'disabled'>,
    Omit<ChoiceContractProps, 'label' | 'description'> {
  label: ReactNode;
  description?: ReactNode;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, size, id: providedId, className, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `krds-switch-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const recipe = switchRecipe({ size, className });
  return (
    <div className={recipe.className}>
      <input
        {...props}
        ref={ref}
        id={id}
        type="checkbox"
        aria-describedby={joinAriaIds(props['aria-describedby'], descriptionId)}
      />
      <label htmlFor={id}>
        <span className="switch-toggle">
          <i />
        </span>
        {label}
      </label>
      {description ? (
        <span id={descriptionId} className="krds-field-message">
          {description}
        </span>
      ) : null}
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
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}
export function Accordion({
  items,
  type = 'default',
  multiple = false,
  defaultOpen = [],
  open: controlledOpen,
  onOpenChange,
  className,
}: AccordionProps) {
  const generatedId = useId();
  const accordionId = `krds-accordion-${generatedId}`;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(defaultOpen);
  const openItems = controlledOpen ?? uncontrolledOpen;
  const toggle = (id: string) => {
    const next = openItems.includes(id)
      ? openItems.filter((item) => item !== id)
      : multiple
        ? [...openItems, id]
        : [id];
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };
  const recipe = accordionRecipe({ type, className });
  return (
    <div className={recipe.className}>
      {items.map((item, index) => {
        const open = openItems.includes(item.id);
        const headerId = `${accordionId}-header-${index}-${item.id}`;
        const panelId = `${accordionId}-panel-${index}-${item.id}`;
        return (
          <div className="accordion-item" key={headerId}>
            <h5 className="accordion-header">
              <button
                type="button"
                className="btn-accordion"
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
              className={cx('accordion-collapse', 'collapse', open && 'show')}
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
            >
              <div className="accordion-body">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AccordionLine(props: Omit<AccordionProps, 'type'>) {
  return <Accordion {...props} type="line" />;
}
export const RadioButton = Radio;
export const TextInputSize = TextInput;
export const TextInputState = TextInput;

export type InputChange = ChangeEvent<HTMLInputElement>;
