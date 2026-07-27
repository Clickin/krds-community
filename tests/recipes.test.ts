import { describe, expect, it } from 'vitest';
import { accordionState, buttonRecipe, cx, inputRecipe } from '@krds-community/recipes';

describe('KRDS recipes', () => {
  it('uses static variant and size data attributes', () => {
    expect(buttonRecipe({ variant: 'primary', size: 'large' })).toMatchObject({
      className: 'krds-button',
      data: { variant: 'primary', size: 'large' },
    });
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
