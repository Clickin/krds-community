import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadManifests } from '@krds-community/conformance';

const root = resolve(import.meta.dirname, '..');
const inventoryNames = [
  'Accordion',
  'AccordionLine',
  'Badge',
  'BadgeNumber',
  'BadgeSize',
  'Breadcrumb',
  'Button',
  'ButtonHierarchy',
  'ButtonIcon',
  'ButtonSize',
  'ButtonText',
  'ButtonWithIcon',
  'Calendar',
  'CalendarRange',
  'Carousel',
  'CarouselBanner',
  'Checkbox',
  'CheckboxChip',
  'CheckboxSize',
  'CoachMark',
  'ContextualHelp',
  'CriticalAlerts',
  'DateInput',
  'Disclosure',
  'Favicon',
  'FileUpload',
  'Footer',
  'Header',
  'HelpPanel',
  'Identifier',
  'InPageNavigation',
  'LanguageSwitcher',
  'LanguageSwitcherPage',
  'Link',
  'MainMenuMobile',
  'MainMenuPc',
  'Masthead',
  'Modal',
  'ModalSample',
  'Pagination',
  'Radio',
  'RadioButton',
  'RadioChip',
  'RadioSize',
  'Resize',
  'Select',
  'SelectSize',
  'SelectSorting',
  'SelectState',
  'SideNavigation',
  'SkipLink',
  'Spinner',
  'StepIndicator',
  'StructuredList',
  'StructuredListTable',
  'Switch',
  'Tab',
  'Table',
  'Tag',
  'TagLink',
  'TextInput',
  'TextInputIcon',
  'TextInputSize',
  'TextInputState',
  'TextList',
  'TextListOrdered',
  'Textarea',
  'ToggleSwitch',
  'ToggleSwitchSize',
  'Tooltip',
  'TooltipBox',
  'TooltipVertical',
  'Tts',
  'TtsIcon',
  'TtsSize',
  'TutorialPanel',
] as const;

describe('KRDS component inventory', () => {
  it('keeps every upstream manifest mapped to a mandatory fixture', async () => {
    const manifests = await loadManifests(resolve(root, 'conformance/manifests'));
    expect(manifests).toHaveLength(76);
    expect(manifests.every((manifest) => manifest.status !== 'unmapped')).toBe(true);
    expect(manifests.every((manifest) => manifest.fixtureCount > 0)).toBe(true);
    expect(manifests.every((manifest) => manifest.mandatoryFixtureCount > 0)).toBe(true);
    expect(manifests.every((manifest) => manifest.accessibilityRequirements.length > 0)).toBe(true);
  });

  it('publishes the common props contract from recipes', async () => {
    const source = await readFile(resolve(root, 'packages/recipes/src/components.ts'), 'utf8');
    expect(source).toContain('export interface KrdsAdditionalProps');
    for (const prop of [
      'label',
      'title',
      'description',
      'disabled',
      'modelValue',
      'options',
      'items',
    ]) {
      expect(source).toContain(`  ${prop}?`);
    }
  });

  it('keeps the public component names aligned across framework packages', async () => {
    const sources = await Promise.all([
      readFile(resolve(root, 'packages/react/src/index.ts'), 'utf8'),
      readFile(resolve(root, 'packages/vue/src/index.ts'), 'utf8'),
      readFile(resolve(root, 'packages/svelte/src/index.js'), 'utf8'),
      readFile(resolve(root, 'packages/solid/src/index.tsx'), 'utf8'),
      readFile(resolve(root, 'packages/angular/src/index.ts'), 'utf8'),
    ]);
    for (const name of inventoryNames) {
      expect(sources[0]).toContain(name);
      expect(sources[1]).toContain(name);
      expect(sources[2]).toContain(`as ${name}`);
      expect(sources[3]).toContain(name);
      expect(sources[4]).toContain(`Krds${name}Component`);
    }
  });
});
