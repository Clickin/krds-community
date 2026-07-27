<script lang="ts">
  import * as Components from '@krds-community/svelte';
  import { Accordion, Button, Checkbox, Radio, Switch, TextInput } from '@krds-community/svelte';

  const names = [
    'Badge', 'BadgeNumber', 'BadgeSize', 'Breadcrumb', 'ButtonHierarchy', 'ButtonIcon', 'ButtonSize', 'ButtonText', 'ButtonWithIcon',
    'Calendar', 'CalendarRange', 'Carousel', 'CarouselBanner', 'CheckboxChip', 'CheckboxSize', 'CoachMark', 'ContextualHelp', 'CriticalAlerts',
    'DateInput', 'Disclosure', 'Favicon', 'FileUpload', 'Footer', 'Header', 'HelpPanel', 'Identifier', 'InPageNavigation', 'LanguageSwitcher',
    'LanguageSwitcherPage', 'Link', 'MainMenuMobile', 'MainMenuPc', 'Masthead', 'Modal', 'ModalSample', 'Pagination', 'RadioButton', 'RadioChip',
    'RadioSize', 'Resize', 'Select', 'SelectSize', 'SelectSorting', 'SelectState', 'SideNavigation', 'SkipLink', 'Spinner', 'StepIndicator',
    'StructuredList', 'StructuredListTable', 'Tab', 'Table', 'Tag', 'TagLink', 'Textarea', 'TextInputIcon', 'TextList', 'TextListOrdered',
    'ToggleSwitch', 'ToggleSwitchSize', 'Tooltip', 'TooltipBox', 'TooltipVertical', 'Tts', 'TtsIcon', 'TtsSize', 'TutorialPanel',
  ];
  const kindOf = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '').replace('main-menu-pc', 'main-menu-pc');
  const common = {
    label: '레이블', title: '제목', description: '설명입니다.', message: '도움말입니다.', href: '#example', open: true, modelValue: 'one',
    options: [{ value: 'one', label: '첫 번째' }, { value: 'two', label: '두 번째' }],
    items: [{ id: 'one', label: '첫 항목', title: '첫 항목' }, { id: 'two', label: '두 번째', title: '두 번째' }],
    links: [{ id: 'one', label: '첫 항목', href: '#one' }, { id: 'two', label: '두 번째', href: '#two' }],
    slides: [{ id: 'one', title: '첫 슬라이드', description: '캐러셀 내용' }, { id: 'two', title: '두 번째 슬라이드' }],
    steps: [{ id: 'one', label: '첫 단계' }, { id: 'two', label: '두 번째 단계' }],
    columns: [{ key: 'name', label: '이름' }, { key: 'status', label: '상태' }],
    rows: [{ name: '서비스', status: '운영 중' }],
    tabs: [{ id: 'one', label: '첫 탭' }, { id: 'two', label: '두 번째 탭' }],
    panels: { one: '첫 패널', two: '두 번째 패널' },
  };
</script>

<main aria-label="컴포넌트 인벤토리" style="display:grid;gap:1rem;max-width:45rem">
  <Button>기본 버튼</Button>
  <TextInput label="기본 텍스트" hint="도움말" />
  <Checkbox label="체크박스" name="check" />
  <Radio label="라디오" name="radio" value="one" />
  <Switch label="스위치" name="switch" />
  <Accordion items={[{ id: 'one', title: '아코디언', content: '내용' }]} />
  {#each names as name}
    {@const Component = Components[name as keyof typeof Components] as any}
    <svelte:component this={Component} kind={kindOf(name)} {...common} label={name} title={name} />
  {/each}
</main>
