import { describe, expect, it } from 'vitest';
import { accordionState, buttonRecipe, cx, inputRecipe } from '@krds-community/recipes';

describe('KRDS recipes', () => {
  it('uses official KRDS button classes and omits the default medium class', () => {
    expect(buttonRecipe({ variant: 'primary', size: 'large' })).toMatchObject({
      className: 'krds-btn primary large',
      data: { variant: 'primary', size: 'large' },
    });
    expect(buttonRecipe({ variant: 'primary', size: 'medium' }).className).toBe(
      'krds-btn primary',
    );
  });

  it('merges consumer classes with clsx semantics', () => {
    expect(cx('krds-input', false, undefined, 'consumer-class')).toBe('krds-input consumer-class');
    expect(inputRecipe({ state: 'error' }).data.state).toBe('error');
  });

  it('keeps accordion state observable', () => {
    expect(accordionState(true)).toEqual({ expanded: 'true', hidden: false });
    expect(accordionState(false)).toEqual({ expanded: 'false', hidden: true });
  });
});
