import type { Meta, StoryObj } from '@storybook/angular';
import { Directive, ElementRef } from '@angular/core';
import {
  KrdsAccordionComponent,
  KrdsAccordionLineComponent,
  KrdsAdditionalComponent,
  KrdsBadgeComponent,
  KrdsBadgeNumberComponent,
  KrdsBadgeSizeComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonIconComponent,
  KrdsButtonSizeComponent,
  KrdsButtonTextComponent,
  KrdsButtonWithIconComponent,
  KrdsCalendarComponent,
  KrdsCalendarRangeComponent,
  KrdsCarouselComponent,
  KrdsCarouselBannerComponent,
  KrdsCheckboxComponent,
  KrdsCheckboxChipComponent,
  KrdsCheckboxSizeComponent,
  KrdsCoachMarkComponent,
  KrdsContextualHelpComponent,
  KrdsCriticalAlertsComponent,
  KrdsDateInputComponent,
  KrdsDisclosureComponent,
  KrdsFaviconComponent,
  KrdsFileUploadComponent,
  KrdsFooterComponent,
  KrdsHeaderComponent,
  KrdsHelpPanelComponent,
  KrdsIdentifierComponent,
  KrdsInPageNavigationComponent,
  KrdsLanguageSwitcherComponent,
  KrdsLanguageSwitcherPageComponent,
  KrdsLinkComponent,
  KrdsMainMenuMobileComponent,
  KrdsMainMenuPcComponent,
  KrdsMastheadComponent,
  KrdsModalComponent,
  KrdsModalSampleComponent,
  KrdsPaginationComponent,
  KrdsRadioComponent,
  KrdsRadioButtonComponent,
  KrdsRadioChipComponent,
  KrdsRadioSizeComponent,
  KrdsResizeComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectSortingComponent,
  KrdsSelectStateComponent,
  KrdsSideNavigationComponent,
  KrdsSkipLinkComponent,
  KrdsSpinnerComponent,
  KrdsStepIndicatorComponent,
  KrdsStructuredListComponent,
  KrdsStructuredListTableComponent,
  KrdsSwitchComponent,
  KrdsTabComponent,
  KrdsTableComponent,
  KrdsTagComponent,
  KrdsTagLinkComponent,
  KrdsTextareaComponent,
  KrdsTextInputComponent,
  KrdsTextInputIconComponent,
  KrdsTextInputSizeComponent,
  KrdsTextInputStateComponent,
  KrdsTextListComponent,
  KrdsTextListOrderedComponent,
  KrdsToggleSwitchComponent,
  KrdsToggleSwitchSizeComponent,
  KrdsTooltipComponent,
  KrdsTooltipBoxComponent,
  KrdsTooltipVerticalComponent,
  KrdsTtsComponent,
  KrdsTtsIconComponent,
  KrdsTtsSizeComponent,
  KrdsTutorialPanelComponent,
} from '@krds-community/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Every manifest fixture is linked from the inventory so the search panel can find it. */
const fixtureIds = [
  'accordion-line.default',
  'accordion.default.single',
  'accordion.line.single',
  'badge-number.default',
  'badge-size.default',
  'badge.default',
  'breadcrumb.default',
  'button-hierarchy.default',
  'button-icon.default',
  'button-size.default',
  'button-text.default',
  'button-with-icon.default',
  'button.primary.medium.default',
  'button.secondary.medium.default',
  'button.tertiary.medium.default',
  'calendar-range.default',
  'calendar.default',
  'carousel-banner.default',
  'carousel.default',
  'checkbox-chip.default',
  'checkbox-size.default',
  'checkbox.default.medium',
  'checkbox.default.large',
  'coach-mark.default',
  'contextual-help.default',
  'critical-alerts.default',
  'date-input.default',
  'disclosure.default',
  'favicon.default',
  'file-upload.default',
  'footer.default',
  'header.default',
  'help-panel.default',
  'identifier.default',
  'in-page-navigation.default',
  'language-switcher-page.default',
  'language-switcher.default',
  'link.default',
  'main-menu-mobile.default',
  'main-menu-pc.default',
  'masthead.default',
  'modal-sample.default',
  'modal.default',
  'pagination.default',
  'radio-button.default',
  'radio-chip.default',
  'radio-size.default',
  'radio.default.medium',
  'radio.default.large',
  'resize.default',
  'select-size.default',
  'select-sorting.default',
  'select-state.default',
  'select.default',
  'side-navigation.default',
  'skip-link.default',
  'spinner.default',
  'step-indicator.default',
  'structured-list-table.default',
  'structured-list.default',
  'switch.default.medium',
  'switch.default.large',
  'tab.default',
  'table.default',
  'tag-link.default',
  'tag.default',
  'text-input-icon.default',
  'text-input-size.default',
  'text-input-state.default',
  'text-input.default.medium',
  'text-input.error.medium',
  'text-input.success.medium',
  'text-input.information.medium',
  'text-list-ordered.default',
  'text-list.default',
  'textarea.default',
  'toggle-switch-size.default',
  'toggle-switch.default',
  'tooltip-box.default',
  'tooltip-vertical.default',
  'tooltip.default',
  'tts-icon.default',
  'tts-size.default',
  'tts.default',
  'tutorial-panel.default',
] as const;

const links = [
  { id: 'home', label: '홈', href: '#home', current: true },
  { id: 'guide', label: '가이드', href: '#guide' },
  { id: 'support', label: '지원', href: '#support' },
];
const accordionItems = [
  { id: 'accordion-one', title: '첫 번째 항목', content: '첫 번째 안내 내용입니다.' },
  { id: 'accordion-two', title: '두 번째 항목', content: '두 번째 안내 내용입니다.' },
];

const menuMobileItems = [
  {
    id: 'depth-one',
    label: '첫 번째 메뉴',
    href: '#depth-one',
    children: [
      {
        id: 'depth-two',
        label: '두 번째 메뉴',
        href: '#depth-two',
        children: [
          {
            id: 'depth-three',
            label: '세 번째 메뉴',
            title: '세 번째 메뉴',
            href: '#depth-three',
            children: [{ id: 'depth-four', label: '네 번째 메뉴', href: '#depth-four' }],
          },
        ],
      },
    ],
  },
  { id: 'mobile-link', label: '단일 링크', href: '#mobile-link' },
];
const menuUtilityItems = [
  { id: 'utility-home', label: '홈', href: '#home' },
  { id: 'utility-help', label: '도움말', href: '#help' },
];
const menuServiceItems = [
  { id: 'service-one', label: '서비스 안내', href: '#service-one' },
  { id: 'service-two', label: '이용 방법', href: '#service-two' },
];
const menuBottomItems = [
  { id: 'bottom-policy', label: '개인정보처리방침', href: '#policy' },
  { id: 'bottom-accessibility', label: '웹 접근성', href: '#accessibility' },
];
const menuPcItems = [
  {
    id: 'service',
    label: '서비스',
    active: true,
    children: [
      {
        id: 'service-overview',
        label: '서비스 안내',
        title: '서비스 메뉴',
        titleHref: '#service',
        titleLinkLabel: '서비스 전체 보기',
        descriptionItems: [
          { title: '서비스 안내', description: '서비스 이용 방법을 확인하세요.', href: '#service-guide' },
          { title: '온라인 신청', description: '온라인으로 신청할 수 있습니다.', href: '#service-apply' },
        ],
        banner: { badge: '추천', label: '자주 찾는 서비스' },
        children: [
          { id: 'service-guide', label: '서비스 안내', href: '#service-guide' },
          { id: 'service-apply', label: '온라인 신청', href: '#service-apply' },
        ],
      },
    ],
  },
  {
    id: 'guide',
    label: '가이드',
    title: '가이드 목록',
    banner: { badge: '안내', label: '가이드 전체 보기' },
    children: [{ id: 'guide-start', label: '시작하기', href: '#guide-start' }],
  },
  { id: 'notice', label: '공지사항', href: '#notice' },
  { id: 'write', label: '공지 작성', button: true },
];
const headerResizeItems = [
  { id: 'resize-default', label: '기본', href: '#resize-default', className: 'md', selected: true },
  { id: 'resize-large', label: '크게', href: '#resize-large', className: 'lg' },
  { id: 'resize-largest', label: '가장 크게', href: '#resize-largest', className: 'xl' },
];
const headerUtilityItems = [
  { id: 'header-home', kind: 'link' as const, label: '홈', href: '#home' },
  {
    id: 'header-resize',
    kind: 'resize' as const,
    label: '화면 크기',
    selectedLabel: '현재 크기',
    resetLabel: '기본값으로 초기화',
    items: headerResizeItems,
  },
];
const headerMobileMenu = {
  utilityItems: headerUtilityItems,
  loginLabel: '로그인',
  serviceItems: menuServiceItems,
  searchPlaceholder: '검색어를 입력하세요',
  searchTitle: '통합검색',
  searchLabel: '검색',
  items: menuMobileItems,
  previousLabel: '이전 메뉴',
  closeLabel: '메뉴 닫기',
  bottomItems: menuBottomItems,
};

const footerRelatedSites = [
  { id: 'site-one', label: 'related_site', title: 'related_site 레이어', href: '#' },
  { id: 'site-two', label: 'related_site', title: 'related_site 레이어', href: '#' },
  { id: 'site-three', label: 'related_site', title: 'related_site 레이어', href: '#' },
  { id: 'site-four', label: 'related_site', title: 'related_site 레이어', href: '#' },
];
const footerLinks = [
  { id: 'directions', label: '찾아오시는 길', href: '#' },
  { id: 'guide', label: '이용안내', href: '#' },
  { id: 'staff', label: '직원검색', href: '#' },
];
const footerSocialLinks = [
  { id: 'instagram', label: '인스타그램', icon: 'ico-instagram', href: '#', target: '_blank', title: '새 창 열기' },
  { id: 'youtube', label: '유튜브', icon: 'ico-youtube', href: '#', target: '_blank', title: '새 창 열기' },
  { id: 'x', label: 'X', icon: 'ico-sns-x', href: '#', target: '_blank', title: '새 창 열기' },
  { id: 'facebook', label: '페이스북', icon: 'ico-facebook', href: '#', target: '_blank', title: '새 창 열기' },
  { id: 'blog', label: '블로그', icon: 'ico-blog', href: '#', target: '_blank', title: '새 창 열기' },
];
const footerPolicyLinks = [
  { id: 'privacy', label: '개인정보처리방침', href: '#', emphasis: true },
  { id: 'copyright', label: '저작권 정책', href: '#' },
  { id: 'accessibility', label: '웹 접근성 품질인증 마크 획득', href: '#' },
];
const footerContacts = [
  { title: '대표전화 1577-1000', description: '(유료, 평일 09시~18시)' },
  { title: '해외이용 82-33-811-2001', description: '(유료, 평일 09시~18시)' },
];
const structuredTableColumns = [
  { key: 'type', label: '유형' },
  { key: 'title', label: '제목' },
  { key: 'content', label: '내용' },
  { key: 'download', label: '다운로드', visuallyHidden: true },
  { key: 'published', label: '게시일' },
];
const structuredTableRows = [
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
  { selected: false, type: '유형', title: '타이틀 영역', content: '간단한 내용이 들어간는 영역입니다.', download: '다운로드', published: '2025.12.17' },
];
const structuredTableActions = [
  { id: 'action-one', label: '핵심버튼', icon: 'ico-down' },
  { id: 'action-two', label: '핵심버튼', icon: 'ico-down' },
  { id: 'action-three', label: '핵심버튼', icon: 'ico-down' },
  { id: 'action-four', label: '핵심버튼', icon: 'ico-down' },
];
const structuredTablePagination = {
  current: 4,
  items: [1, 2, 3, 4, 5, 6, 7, 8, 'ellipsis', 99],
  previousDisabled: true,
  previousLabel: '이전',
  nextLabel: '다음',
  currentLabel: '현재페이지',
};
const tableColumns = [
  { key: 'title1', label: '제목1' },
  { key: 'title2', label: '제목2' },
];
const tableRows = [
  { title1: '제목1-1', title2: '내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.' },
  { title1: '제목1-2', title2: '내용이 들어갑니다.' },
  { title1: '제목1-3', title2: '내용이 들어갑니다. 내용이 들어갑니다.' },
];
const options = [
  { value: 'one', label: '첫 번째' },
  { value: 'two', label: '두 번째' },
  { value: 'three', label: '세 번째' },
];
const slides = [
  { id: 'slide-one', title: '주요 소식', description: '서비스 업데이트 안내입니다.', href: '#slide-one' },
  { id: 'slide-two', title: '이용 안내', description: '공공서비스 이용 방법을 확인하세요.', href: '#slide-two' },
];
const tabs = [
  { id: 'tab-one', label: '첫 번째 탭' },
  { id: 'tab-two', label: '두 번째 탭' },
];
const panels = {
  'tab-one': '첫 번째 패널 내용입니다.',
  'tab-two': '두 번째 패널 내용입니다.',
};
const steps = [
  { id: 'step-one', label: '신청', description: '신청 정보를 입력합니다.' },
  { id: 'step-two', label: '확인', description: '입력 내용을 확인합니다.' },
  { id: 'step-three', label: '완료', description: '신청을 완료합니다.' },
];
const listItems = [
  { id: 'list-one', label: '첫 번째 안내', children: ['하위 안내'] },
  { id: 'list-two', label: '두 번째 안내' },
];
const navTree = [
  { id: 'nav-home', label: '홈', href: '#home' },
  {
    id: 'nav-guide',
    label: '가이드',
    href: '#guide',
    children: [{ id: 'nav-start', label: '시작하기', href: '#start' }],
  },
];
const playLabel = '재생';
const stopLabel = '정지';


@Directive({
  selector: '[auditExpandedReady]',
  standalone: true,
})
class AuditExpandedReadyDirective {
  constructor(component: KrdsAdditionalComponent) {
    component.contextualHelpFocused = true;
    component.languageFocused = true;
    component.resizeFocused = true;
  }
}

@Directive({
  selector: '[auditCriticalAlerts]',
  standalone: true,
})
class AuditCriticalAlertsDirective {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelector('.krds-critical-alerts')?.removeAttribute('role');
  }
}

const aliasComponents = [
  KrdsAccordionLineComponent,
  KrdsBadgeComponent,
  KrdsBadgeNumberComponent,
  KrdsBadgeSizeComponent,
  KrdsBreadcrumbComponent,
  KrdsButtonHierarchyComponent,
  KrdsButtonIconComponent,
  KrdsButtonSizeComponent,
  KrdsButtonTextComponent,
  KrdsButtonWithIconComponent,
  KrdsCalendarComponent,
  KrdsCalendarRangeComponent,
  KrdsCarouselComponent,
  KrdsCarouselBannerComponent,
  KrdsCheckboxChipComponent,
  KrdsCheckboxSizeComponent,
  KrdsCoachMarkComponent,
  KrdsContextualHelpComponent,
  KrdsCriticalAlertsComponent,
  KrdsDateInputComponent,
  KrdsDisclosureComponent,
  KrdsFaviconComponent,
  KrdsFileUploadComponent,
  KrdsFooterComponent,
  KrdsHeaderComponent,
  KrdsHelpPanelComponent,
  KrdsIdentifierComponent,
  KrdsInPageNavigationComponent,
  KrdsLanguageSwitcherComponent,
  KrdsLanguageSwitcherPageComponent,
  KrdsLinkComponent,
  KrdsMainMenuMobileComponent,
  KrdsMainMenuPcComponent,
  KrdsMastheadComponent,
  KrdsModalComponent,
  KrdsModalSampleComponent,
  KrdsPaginationComponent,
  KrdsRadioButtonComponent,
  KrdsRadioChipComponent,
  KrdsRadioSizeComponent,
  KrdsResizeComponent,
  KrdsSelectComponent,
  KrdsSelectSizeComponent,
  KrdsSelectSortingComponent,
  KrdsSelectStateComponent,
  KrdsSideNavigationComponent,
  KrdsSkipLinkComponent,
  KrdsSpinnerComponent,
  KrdsStepIndicatorComponent,
  KrdsStructuredListComponent,
  KrdsStructuredListTableComponent,
  KrdsTabComponent,
  KrdsTableComponent,
  KrdsTagComponent,
  KrdsTagLinkComponent,
  KrdsTextareaComponent,
  KrdsTextInputIconComponent,
  KrdsTextInputSizeComponent,
  KrdsTextInputStateComponent,
  KrdsTextListComponent,
  KrdsTextListOrderedComponent,
  KrdsToggleSwitchComponent,
  KrdsToggleSwitchSizeComponent,
  KrdsTooltipComponent,
  KrdsTooltipBoxComponent,
  KrdsTooltipVerticalComponent,
  KrdsTtsComponent,
  KrdsTtsIconComponent,
  KrdsTtsSizeComponent,
  KrdsTutorialPanelComponent,
] as const;
const sharedImports = [
  FormsModule,
  ReactiveFormsModule,
  KrdsAccordionComponent,
  KrdsAdditionalComponent,
  KrdsButtonComponent,
  KrdsCheckboxComponent,
  KrdsRadioComponent,
  KrdsSwitchComponent,
  KrdsTextInputComponent,
  ...Array.from(new Set(aliasComponents)),
  AuditExpandedReadyDirective,
  AuditCriticalAlertsDirective,
];

type InventoryArgs = {
  buttonVariant: 'primary' | 'secondary' | 'tertiary';
  buttonSize: 'small' | 'medium' | 'large';
  inputState: 'default' | 'error' | 'success' | 'information';
  menuOpen: boolean;
};

const meta = {
  title: 'Angular/전체 컴포넌트',
  component: KrdsAdditionalComponent,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    fixtureIds: [...fixtureIds],
  },
  argTypes: {
    buttonVariant: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    buttonSize: { control: 'select', options: ['small', 'medium', 'large'] },
    inputState: { control: 'select', options: ['default', 'error', 'success', 'information'] },
    menuOpen: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      applicationConfig: { providers: [] },
      moduleMetadata: { imports: sharedImports },
    }),
  ],
} satisfies Meta<InventoryArgs>;
export default meta;

export const Inventory: StoryObj<InventoryArgs> = {
  name: '전체 인벤토리 · public exports',
  args: {
    buttonVariant: 'primary',
    buttonSize: 'medium',
    inputState: 'default',
    menuOpen: true,
  },
  parameters: {
    a11y: { test: 'error' },
    fixtureIds: [...fixtureIds],
    docs: {
      description: {
        story:
          '85개 공식 fixture를 하나의 검색 가능한 Angular standalone inventory로 렌더링합니다. 모든 컴포넌트 입력은 Angular property binding으로 전달하고, core CVA/outputs와 alias public export selector를 함께 확인할 수 있습니다.',
      },
    },
  },
  render: (args) => ({
    template: `
      <main id="angular-inventory" aria-label="Angular KRDS public component inventory" style="max-width:100%;min-width:0;overflow-x:hidden;box-sizing:border-box;">
        <h1>KRDS Angular public components</h1>
        <p>공식 fixture와 public export를 같은 데이터 계약으로 탐색합니다.</p>

        <section aria-labelledby="inventory-foundation">
          <h2 id="inventory-foundation">Brand and navigation</h2>
          <krds-masthead [id]="mastheadId" [message]="mastheadMessage"></krds-masthead>
          <label aria-label="헤더 통합검색">
            <krds-header [id]="headerId" [title]="headerTitle" [menuLabel]="headerMenuLabel" [links]="links" [desktopItems]="menuPcItems" [utilityItems]="headerUtilityItems" [mobileMenu]="headerMobileMenu" [logoHref]="headerLogoHref" [logoLabel]="headerLogoLabel" [searchTitle]="headerSearchTitle" [searchLabel]="headerSearchLabel" [loginLabel]="headerLoginLabel" [loginHref]="headerLoginHref" [joinLabel]="headerJoinLabel" [allMenuLabel]="headerAllMenuLabel"></krds-header>
          </label>
          <krds-identifier [organization]="identifierOrganization" [description]="identifierDescription"></krds-identifier>
          <krds-badge [kind]="badgeKind" [label]="badgeLabel" [tone]="badgeTone" [appearance]="badgeAppearance"></krds-badge>
          <krds-badge-number [kind]="badgeNumberKind" [label]="badgeNumberLabel" [number]="true" [tone]="badgeTone"></krds-badge-number>
          <krds-badge-size [kind]="badgeSizeKind" [label]="badgeSizeLabel" [size]="largeSize" [tone]="badgeTone"></krds-badge-size>
          <krds-tag [kind]="tagKind" [label]="tagLabel" [message]="tagRemoveLabel"></krds-tag>
          <krds-tag-link [kind]="tagLinkKind" [label]="tagLinkLabel" [href]="tagLinkHref"></krds-tag-link>
          <krds-breadcrumb [kind]="breadcrumbKind" [items]="links" [label]="breadcrumbLabel"></krds-breadcrumb>
          <div id="krds-skip-link">
            <krds-skip-link [kind]="skipLinkKind" [label]="skipLinkLabel" [href]="skipLinkHref"></krds-skip-link>
          </div>
          <krds-main-menu-pc [kind]="menuPcKind" [items]="menuPcItems" [menuLabel]="menuLabel" [sample]="menuSample" [className]="menuClassName"></krds-main-menu-pc>
          <label aria-label="모바일 메뉴 검색">
            <krds-main-menu-mobile auditExpandedReady [kind]="menuMobileKind" [utilityItems]="menuUtilityItems" [loginLabel]="menuLoginLabel" [serviceItems]="menuServiceItems" [searchPlaceholder]="menuSearchPlaceholder" [searchTitle]="menuSearchTitle" [searchLabel]="menuSearchLabel" [items]="menuMobileItems" [previousLabel]="menuPreviousLabel" [closeLabel]="menuCloseLabel" [bottomItems]="menuBottomItems" [open]="menuOpen" [sample]="menuSample" [style]="menuStyle" [className]="menuClassName"></krds-main-menu-mobile>
          </label>
          <krds-link [kind]="linkKind" [label]="linkLabel" [href]="linkHref" [target]="externalTarget" [title]="externalTitle"></krds-link>
          <krds-side-navigation [kind]="sideNavigationKind" [title]="sideNavigationTitle" [items]="navTree"></krds-side-navigation>
          <krds-in-page-navigation [kind]="inPageKind" [title]="inPageTitle" [items]="links" [actionLabel]="inPageActionLabel"></krds-in-page-navigation>
        </section>

        <section aria-labelledby="inventory-actions">
          <h2 id="inventory-actions">Actions and disclosure</h2>
          <h3>Interactive controls</h3>
          <h4>Accordion examples</h4>
          <krds-button [variant]="buttonVariant" [size]="buttonSize" [type]="buttonType" (clicked)="onButtonClicked($event)">저장</krds-button>
          <krds-button-hierarchy [kind]="buttonHierarchyKind" [variant]="buttonVariant" [size]="buttonSize" [type]="buttonType" [label]="buttonHierarchyLabel"></krds-button-hierarchy>
          <krds-button-icon [kind]="buttonIconKind" [label]="buttonIconLabel" [size]="buttonSize"></krds-button-icon>
          <krds-button-size [kind]="buttonSizeKind" [size]="buttonSize" [label]="buttonSizeLabel"></krds-button-size>
          <krds-button-text [kind]="buttonTextKind" [label]="buttonTextLabel"></krds-button-text>
          <krds-button-with-icon [kind]="buttonWithIconKind" [label]="buttonWithIconLabel" [size]="buttonSize"></krds-button-with-icon>
          <krds-accordion [items]="accordionItems"></krds-accordion>
          <krds-accordion-line [kind]="accordionLineKind" [items]="accordionItems"></krds-accordion-line>
          <krds-disclosure [kind]="disclosureKind" [title]="disclosureTitle" [description]="disclosureDescription" [open]="true" [closeLabel]="disclosureCloseLabel"></krds-disclosure>
          <krds-contextual-help auditExpandedReady [kind]="contextualHelpKind" [label]="contextualHelpLabel" [title]="contextualHelpTitle" [description]="contextualHelpDescription" [caption]="contextualHelpCaption" [position]="contextualHelpPosition" [href]="contextualHelpHref" [linkLabel]="contextualHelpLinkLabel" [closeLabel]="contextualHelpCloseLabel"></krds-contextual-help>
          <krds-coach-mark [kind]="coachMarkKind" [title]="coachMarkTitle" [stepTitle]="coachMarkStepTitle" [description]="coachMarkDescription" [contentTitle]="coachMarkContentTitle" [step]="coachMarkStep" [currentStepLabel]="currentStepLabel" [totalStepsLabel]="totalStepsLabel" [stopLabel]="coachMarkStopLabel" [nextLabel]="coachMarkNextLabel"></krds-coach-mark>
          <krds-help-panel [kind]="helpPanelKind" [open]="true" [title]="helpTitle" [description]="helpDescription" [label]="helpLabel" [collapseLabel]="helpCollapseLabel" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="helpTutorialTitle" [stopLabel]="helpStopLabel"></krds-help-panel>
          <krds-tutorial-panel [kind]="tutorialPanelKind" [open]="true" [title]="tutorialTitle" [description]="tutorialDescription" [helpTitle]="tutorialTitle" [helpDescription]="tutorialDescription" [label]="tutorialLabel" [collapseLabel]="tutorialCollapseLabel" [tasks]="tutorialTasks" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel" [tutorialTitle]="tutorialTitle" [stopLabel]="tutorialStopLabel" [closeLabel]="tutorialCloseLabel"></krds-tutorial-panel>
          <krds-modal [kind]="modalKind" [id]="modalId" [title]="modalTitle" [description]="modalDescription" [open]="true" [cancelLabel]="modalCancelLabel" [confirmLabel]="modalConfirmLabel" [closeLabel]="modalCloseLabel"></krds-modal>
          <krds-modal-sample [kind]="modalSampleKind" [id]="modalSampleId" [title]="modalSampleTitle" [description]="modalSampleDescription" [open]="true" [cancelLabel]="modalCancelLabel" [confirmLabel]="modalConfirmLabel" [closeLabel]="modalCloseLabel"></krds-modal-sample>
        </section>

        <section aria-labelledby="inventory-forms">
          <h2 id="inventory-forms">Forms and CVA controls</h2>
          <krds-text-input [id]="textInputId" [label]="textInputLabel" [hint]="textInputHint" [placeholder]="textInputPlaceholder" [state]="inputState" [size]="buttonSize" [value]="textInputValue" [name]="textInputName" [required]="true"></krds-text-input>
          <krds-text-input-icon [kind]="textInputIconKind" [id]="textInputIconId" [label]="textInputIconLabel" [hint]="textInputIconHint" [value]="textInputValue"></krds-text-input-icon>
          <krds-text-input-size [kind]="textInputSizeKind" [id]="textInputSizeId" [label]="textInputSizeLabel" [size]="largeSize" [value]="textInputValue"></krds-text-input-size>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputStateId" [label]="textInputStateLabel" [hint]="textInputStateHint" [state]="errorState" [value]="textInputValue"></krds-text-input-state>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputSuccessId" [label]="textInputSuccessLabel" [hint]="textInputSuccessHint" [state]="successState" [value]="textInputSuccessValue"></krds-text-input-state>
          <krds-text-input-state [kind]="textInputStateKind" [id]="textInputInformationId" [label]="textInputInformationLabel" [hint]="textInputInformationHint" [state]="informationState" [value]="textInputInformationValue"></krds-text-input-state>
          <krds-textarea [kind]="textareaKind" [id]="textareaId" [label]="textareaLabel" [hint]="textareaHint" [placeholder]="textareaPlaceholder" [value]="textareaValue"></krds-textarea>
          <krds-checkbox [id]="checkboxId" [label]="checkboxLabel" [description]="checkboxDescription" [name]="checkboxName" [checked]="true" (checkedChange)="onCheckboxChanged($event)"></krds-checkbox>
          <krds-checkbox-chip [kind]="checkboxChipKind" [id]="checkboxChipId" [label]="checkboxChipLabel" [name]="checkboxChipName" [checked]="true"></krds-checkbox-chip>
          <krds-checkbox-size [kind]="checkboxSizeKind" [id]="checkboxSizeId" [label]="checkboxSizeLabel" [size]="largeSize" [checked]="false"></krds-checkbox-size>
          <krds-radio [id]="radioId" [label]="radioLabel" [name]="radioName" [value]="radioValue" [checked]="true" (selected)="onRadioSelected($event)"></krds-radio>
          <krds-radio-button [kind]="radioButtonKind" [id]="radioButtonId" [label]="radioButtonLabel" [name]="radioButtonName" [value]="radioButtonValue" [checked]="true"></krds-radio-button>
          <div class="krds-form-chip">
            <krds-radio-chip [kind]="radioChipKind" [id]="radioChipId" [label]="radioChipLabel" [name]="radioChipName" [value]="radioChipValue" [checked]="true"></krds-radio-chip>
          </div>
          <krds-radio-size [kind]="radioSizeKind" [id]="radioSizeId" [label]="radioSizeLabel" [name]="radioSizeName" [value]="radioSizeValue" [size]="largeSize"></krds-radio-size>
          <krds-switch [id]="switchId" [label]="switchLabel" [name]="switchName" [checked]="true" (checkedChange)="onSwitchChanged($event)"></krds-switch>
          <krds-date-input [kind]="dateInputKind" [id]="dateInputId" [label]="dateInputLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-date-input>
          <krds-toggle-switch-size [kind]="toggleSwitchSizeKind" [id]="toggleSwitchSizeId" [label]="toggleSwitchSizeLabel" [name]="toggleSwitchSizeName" [size]="largeSize"></krds-toggle-switch-size>
          <krds-calendar [kind]="calendarKind" [id]="calendarId" [label]="calendarLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-calendar>
          <krds-calendar-range [kind]="calendarRangeKind" [id]="calendarRangeId" [label]="calendarRangeLabel" [value]="calendarDateValue" [year]="calendarYearValue" [month]="calendarMonthValue" [years]="calendarYearsValue" [leadingDays]="calendarLeadingDays" [previousMonthDayCount]="calendarPreviousMonthDayCount" [dayCount]="calendarDayCount" [rangeStartDay]="calendarRangeStartDay" [rangeEndDay]="calendarRangeEndDay" [todayDay]="calendarTodayDay" [eventDays]="calendarEventDays" [disabledDays]="calendarDisabledDays" [weekdays]="calendarWeekdays" [previousMonthLabel]="calendarPreviousMonthLabel" [nextMonthLabel]="calendarNextMonthLabel" [yearSelectLabel]="calendarYearSelectLabel" [monthSelectLabel]="calendarMonthSelectLabel" [todayLabel]="calendarTodayLabel" [eventLabel]="calendarEventLabel" [cancelLabel]="calendarCancelLabel" [confirmLabel]="calendarConfirmLabel"></krds-calendar-range>
          <krds-select [kind]="selectKind" [id]="selectId" [label]="selectLabel" [options]="options" [selected]="selectedOption" (selectedChange)="onSelectChanged($event)"></krds-select>
          <krds-select-size [kind]="selectSizeKind" [id]="selectSizeId" [label]="selectSizeLabel" [options]="options" [size]="largeSize"></krds-select-size>
          <label aria-label="정렬 선택">
            <krds-select-sorting [kind]="selectSortingKind" [id]="selectSortingId" [label]="selectSortingLabel" [options]="options" [selected]="selectedOption"></krds-select-sorting>
          </label>
          <krds-select-state [kind]="selectStateKind" [id]="selectStateId" [label]="selectStateLabel" [options]="options" [state]="errorState"></krds-select-state>
          <krds-language-switcher auditExpandedReady [kind]="languageSwitcherKind" [id]="languageSwitcherId" [languages]="options" [selected]="selectedLanguage" [label]="languageLabel"></krds-language-switcher>
          <krds-language-switcher-page auditExpandedReady [kind]="languageSwitcherPageKind" [id]="languageSwitcherPageId" [languages]="options" [selected]="selectedLanguage" [label]="languagePageLabel"></krds-language-switcher-page>
        </section>

        <section aria-labelledby="inventory-content">
          <h2 id="inventory-content">Content, tables and feedback</h2>
          <krds-carousel [kind]="carouselKind" [slides]="slides" [label]="carouselLabel" [actionLabel]="carouselActionLabel" [imageLabel]="carouselImageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel>
          <krds-carousel-banner [kind]="carouselBannerKind" [slides]="slides" [label]="carouselLabel" [actionLabel]="carouselActionLabel" [imageLabel]="carouselImageLabel" [moreLabel]="moreLabel" [playLabel]="playLabel" [stopLabel]="stopLabel" [nextLabel]="nextLabel" [previousLabel]="previousLabel"></krds-carousel-banner>
          <krds-file-upload [kind]="fileUploadKind" [id]="fileUploadId" [title]="fileUploadTitle" [description]="fileUploadDescription" [prompt]="fileUploadPrompt" [inputId]="fileUploadInputId" [selectLabel]="fileUploadSelectLabel" [files]="fileUploadFiles" [deleteAllLabel]="fileUploadDeleteAllLabel" [currentCount]="fileUploadCurrentCount" [maxCount]="fileUploadMaxCount" [countSuffix]="fileUploadCountSuffix"></krds-file-upload>
          <krds-pagination [kind]="paginationKind" [items]="paginationItems" [current]="paginationCurrent" [previousLabel]="previousLabel" [nextLabel]="nextLabel" [message]="currentPageLabel"></krds-pagination>
          <krds-step-indicator [kind]="stepIndicatorKind" [steps]="steps" [current]="stepCurrent" [label]="stepLabel" [message]="currentStepLabel"></krds-step-indicator>
          <krds-tab [kind]="tabKind" [tabs]="tabs" [panels]="panels" [selectedLabel]="selectedLabel"></krds-tab>
          <section id="panel_tab-one" role="tabpanel" aria-labelledby="tab_tab-one">첫 번째 패널 내용입니다.</section>
          <section id="panel_tab-two" role="tabpanel" aria-labelledby="tab_tab-two">두 번째 패널 내용입니다.</section>
          <krds-structured-list [kind]="structuredListKind" [items]="listItems" [actionLabel]="structuredActionLabel" [dateLabel]="structuredDateLabel" [dateValue]="structuredDateValue" [tags]="structuredTags" [shareLabel]="shareLabel" [favoriteLabel]="favoriteLabel"></krds-structured-list>
          <div style="max-width:100%;min-width:0;overflow-x:auto;box-sizing:border-box;">
            <krds-structured-list-table [kind]="structuredListTableKind" [selectAllLabel]="structuredSelectAllLabel" [actions]="structuredTableActions" [countLabel]="structuredCountLabel" [countOptions]="structuredCountOptions" [sortLabel]="structuredSortLabel" [sortOptions]="structuredSortOptions" [sortValue]="structuredSortValue" [caption]="structuredTableCaption" [columns]="structuredTableColumns" [rows]="structuredTableRows" [pagination]="structuredTablePagination"></krds-structured-list-table>
          </div>
          <div style="max-width:100%;min-width:0;overflow-x:auto;box-sizing:border-box;">
            <krds-table [kind]="tableKind" [caption]="tableCaption" [columns]="tableColumns" [rows]="tableRows"></krds-table>
          </div>
          <krds-text-list [kind]="textListKind" [items]="textListItems"></krds-text-list>
          <krds-text-list-ordered [kind]="textListOrderedKind" [items]="textListItems"></krds-text-list-ordered>
          <krds-critical-alerts auditCriticalAlerts [kind]="criticalAlertsKind" [items]="criticalItems"></krds-critical-alerts>
          <krds-footer [kind]="footerKind" [id]="footerId" [relatedSites]="footerRelatedSites" [logoLabel]="footerLogoLabel" [address]="footerAddress" [contacts]="footerContacts" [links]="footerLinks" [socialLinks]="footerSocialLinks" [policyLinks]="footerPolicyLinks" [copyright]="footerCopyright" [organization]="footerOrganization" [description]="footerDescription"></krds-footer>
          <krds-favicon [kind]="faviconKind" [href]="faviconHref" [label]="faviconLabel"></krds-favicon>
          <krds-spinner [kind]="spinnerKind" [label]="spinnerLabel"></krds-spinner>
          <krds-resize auditExpandedReady [kind]="resizeKind" [label]="resizeLabel" [options]="resizeOptions" [selected]="resizeSelected" [selectedLabel]="resizeSelectedLabel" [resetLabel]="resizeResetLabel"></krds-resize>
          <krds-tooltip [kind]="tooltipKind" [label]="tooltipLabel" [message]="tooltipMessage"></krds-tooltip>
          <krds-tooltip-box [kind]="tooltipBoxKind" [label]="tooltipBoxLabel" [message]="tooltipBoxMessage"></krds-tooltip-box>
          <krds-tooltip-vertical [kind]="tooltipVerticalKind" [label]="tooltipVerticalLabel" [message]="tooltipVerticalMessage"></krds-tooltip-vertical>
          <krds-tts [kind]="ttsKind" [label]="ttsLabel" [playing]="false" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts>
          <krds-tts-icon [kind]="ttsIconKind" [label]="ttsIconLabel" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-icon>
          <krds-tts-size [kind]="ttsSizeKind" [label]="ttsSizeLabel" [size]="largeSize" [playLabel]="playLabel" [stopLabel]="stopLabel"></krds-tts-size>
        </section>
      </main>
    `,
    props: {
      ...args,
      fixtureIds,
      mastheadId: 'krds-masthead',
      mastheadMessage: '대한민국 공식 전자정부 누리집',
      headerId: 'krds-header',
      headerTitle: 'KRDS Community',
      links,
      headerLogoHref: '#inventory-foundation',
      headerLogoLabel: 'KRDS Community 홈',
      headerSearchTitle: '통합검색',
      headerSearchLabel: '검색',
      headerLoginLabel: '로그인',
      headerLoginHref: '#login',
      headerJoinLabel: '회원가입',
      headerAllMenuLabel: '전체 메뉴',
      identifierOrganization: 'KRDS - Korea Design System',
      identifierDescription: '공공서비스 디자인 시스템',
      badgeKind: 'badge',
      badgeNumberKind: 'badge-number',
      badgeSizeKind: 'badge-size',
      badgeLabel: '상태',
      badgeNumberLabel: '3',
      badgeSizeLabel: '중요',
      badgeTone: 'primary',
      badgeAppearance: 'outline',
      largeSize: 'large',
      tagKind: 'tag',
      tagLabel: '태그',
      tagRemoveLabel: '태그 삭제',
      tagLinkKind: 'tag-link',
      tagLinkLabel: '태그 링크',
      tagLinkHref: '#tag',
      breadcrumbKind: 'breadcrumb',
      breadcrumbLabel: '현재 경로',
      skipLinkKind: 'skip-link',
      skipLinkLabel: '본문 바로가기',
      skipLinkHref: '#inventory-content',
      menuPcKind: 'main-menu-pc',
      menuPcItems,
      headerUtilityItems,
      headerMobileMenu,
      headerMenuLabel: '헤더 주 메뉴',
      menuLabel: '보조 주 메뉴',
      menuStyle: { display: 'block', position: 'static', visibility: 'visible' },
      menuMobileItems,
      menuUtilityItems,
      menuServiceItems,
      menuBottomItems,
      menuClassName: 'sample',
      menuLoginLabel: '로그인',
      menuSearchPlaceholder: '검색어를 입력하세요.',
      menuSearchTitle: '통합검색',
      menuSearchLabel: '검색',
      menuPreviousLabel: '이전 메뉴',
      menuCloseLabel: '메뉴 닫기',
      menuMobileKind: 'main-menu-mobile',
      options,
      slides,
      carouselActionLabel: '자세히 보기',
      carouselImageLabel: '주요 콘텐츠 이미지',
      tabs,
      panels,
      steps,
      listItems,
      navTree,
      playLabel,
      stopLabel,
      linkKind: 'link',
      linkLabel: '자세히 보기',
      linkHref: '#details',
      externalTarget: '_blank',
      externalTitle: '새 창 열기',
      sideNavigationKind: 'side-navigation',
      sideNavigationTitle: '서비스 메뉴',
      inPageKind: 'in-page-navigation',
      inPageTitle: '페이지 내 이동',
      inPageActionLabel: '온라인 신청하기',
      buttonType: 'button',
      buttonHierarchyKind: 'button-hierarchy',
      buttonIconKind: 'button-icon',
      buttonSizeKind: 'button-size',
      buttonTextKind: 'button-text',
      buttonWithIconKind: 'button-with-icon',
      buttonHierarchyLabel: '계층 버튼',
      buttonIconLabel: '검색',
      buttonSizeLabel: '큰 버튼',
      buttonTextLabel: '텍스트 버튼',
      buttonWithIconLabel: '다음',
      onButtonClicked: () => undefined,
      onCheckboxChanged: () => undefined,
      onRadioSelected: () => undefined,
      onSwitchChanged: () => undefined,
      onSelectChanged: () => undefined,
      accordionItems,
      accordionLineKind: 'accordion-line',
      disclosureKind: 'disclosure',
      disclosureTitle: '상세 보기',
      disclosureDescription: '상세 내용을 확인합니다.',
      disclosureCloseLabel: '상세 닫기',
      contextualHelpKind: 'contextual-help',
      contextualHelpLabel: '도움말',
      contextualHelpTitle: '도움말 제목',
      contextualHelpDescription: '도움말 내용을 확인합니다.',
      contextualHelpCaption: '도움말 내용을 확인합니다.',
      contextualHelpPosition: 'top',
      contextualHelpHref: '#help',
      contextualHelpLinkLabel: '도움말 자세히 보기',
      contextualHelpCloseLabel: '도움말 닫기',
      coachMarkKind: 'coach-mark',
      coachMarkTitle: '따라하기',
      coachMarkStepTitle: '첫 번째 단계',
      coachMarkDescription: '현재 단계 안내입니다.',
      coachMarkContentTitle: '사용 방법',
      coachMarkStep: '1/3',
      currentStepLabel: '현재 단계',
      totalStepsLabel: '전체 단계',
      coachMarkStopLabel: '튜토리얼 종료',
      coachMarkNextLabel: '다음 단계',
      helpPanelKind: 'help-panel',
      helpTitle: '도움말',
      helpDescription: '도움말 패널 내용입니다.',
      helpLabel: '도움말 패널',
      helpCollapseLabel: '도움말 접기',
      helpTutorialTitle: '도움말 튜토리얼',
      helpStopLabel: '도움말 종료',
      tutorialPanelKind: 'tutorial-panel',
      tutorialTitle: '튜토리얼',
      tutorialDescription: '튜토리얼 패널 내용입니다.',
      tutorialLabel: '튜토리얼 패널',
      tutorialCollapseLabel: '튜토리얼 접기',
      tutorialStopLabel: '튜토리얼 종료',
      tutorialCloseLabel: '튜토리얼 닫기',
      tutorialTasks: [{ title: '첫 단계', summary: '기본 안내', steps: ['메뉴 확인', '내용 확인'], current: true }],
      modalKind: 'modal',
      modalSampleKind: 'modal-sample',
      modalId: 'angular-modal',
      modalSampleId: 'angular-modal-sample',
      modalTitle: '확인 모달',
      modalSampleTitle: '모달 샘플',
      modalDescription: '저장하시겠습니까?',
      modalSampleDescription: '샘플 모달 내용입니다.',
      modalCloseLabel: '닫기',
      modalCancelLabel: '취소',
      modalConfirmLabel: '확인',
      textInputId: 'angular-inventory-text-input',
      textInputLabel: '이름',
      textInputHint: '실명을 입력하세요.',
      textInputPlaceholder: '이름을 입력하세요.',
      textInputValue: '홍길동',
      textInputName: 'name',
      textInputIconKind: 'text-input-icon',
      textInputIconId: 'angular-inventory-text-input-icon',
      textInputIconLabel: '검색어',
      textInputIconHint: '검색어를 입력하세요.',
      textInputSizeKind: 'text-input-size',
      textInputSizeId: 'angular-inventory-text-input-size',
      textInputSizeLabel: '큰 입력',
      textInputStateKind: 'text-input-state',
      textInputStateId: 'angular-inventory-text-input-state',
      textInputStateLabel: '이메일',
      textInputStateHint: '이메일 주소를 확인하세요.',
      errorState: 'error',
      successState: 'success',
      informationState: 'information',
      textInputSuccessId: 'angular-inventory-text-input-success',
      textInputSuccessLabel: '사용자 아이디',
      textInputSuccessHint: '사용할 수 있는 아이디입니다.',
      textInputSuccessValue: 'community',
      textInputInformationId: 'angular-inventory-text-input-information',
      textInputInformationLabel: '알림 주소',
      textInputInformationHint: '업데이트 소식을 받을 주소입니다.',
      textInputInformationValue: 'alerts@example.com',
      textareaKind: 'textarea',
      textareaId: 'angular-inventory-textarea',
      textareaLabel: '내용',
      textareaHint: '내용을 입력하세요.',
      textareaPlaceholder: '내용을 입력하세요.',
      textareaValue: '입력된 내용입니다.',
      textareaRows: 4,
      checkboxId: 'angular-inventory-checkbox',
      checkboxLabel: '약관에 동의합니다.',
      checkboxDescription: '서비스 이용을 위해 동의가 필요합니다.',
      checkboxName: 'terms',
      checkboxChipKind: 'checkbox-chip',
      checkboxChipId: 'angular-inventory-checkbox-chip',
      checkboxChipLabel: '이메일 수신',
      checkboxChipName: 'email',
      checkboxSizeKind: 'checkbox-size',
      checkboxSizeId: 'angular-inventory-checkbox-size',
      checkboxSizeLabel: '큰 체크박스',
      radioId: 'angular-inventory-radio',
      radioLabel: '첫 번째 선택지',
      radioName: 'choice',
      radioValue: 'one',
      radioButtonKind: 'radio-button',
      radioButtonId: 'angular-inventory-radio-button',
      radioButtonLabel: '라디오 버튼',
      radioButtonName: 'radio-button',
      radioButtonValue: 'one',
      radioChipKind: 'radio-chip',
      radioChipId: 'angular-inventory-radio-chip',
      radioChipLabel: '라디오 칩',
      radioChipName: 'radio-chip',
      radioChipValue: 'one',
      radioSizeKind: 'radio-size',
      radioSizeId: 'angular-inventory-radio-size',
      radioSizeLabel: '큰 라디오',
      radioSizeName: 'radio-size',
      radioSizeValue: 'one',
      switchId: 'angular-inventory-switch',
      switchLabel: '알림 받기',
      switchName: 'notifications',
      toggleSwitchKind: 'toggle-switch',
      toggleSwitchId: 'angular-inventory-toggle-switch',
      toggleSwitchLabel: '자동 저장',
      toggleSwitchName: 'autosave',
      toggleSwitchSizeKind: 'toggle-switch-size',
      toggleSwitchSizeId: 'angular-inventory-toggle-switch-size',
      toggleSwitchSizeLabel: '큰 토글',
      toggleSwitchSizeName: 'large-toggle',
      calendarKind: 'calendar',
      calendarId: 'angular-inventory-calendar',
      calendarLabel: '날짜',
      calendarDateLabel: '선택한 날짜',
      calendarDateValue: '2026.07.27',
      calendarRangeKind: 'calendar-range',
      calendarRangeId: 'angular-inventory-calendar-range',
      calendarRangeLabel: '기간',
      calendarYearValue: 2026,
      calendarMonthValue: 7,
      calendarYearsValue: [2026, 2027],
      calendarPreviousMonthDayCount: 30,
      calendarDayCount: 31,
      calendarRangeStartDay: 20,
      calendarRangeEndDay: 25,
      calendarTodayDay: 27,
      calendarEventDays: [10, 18],
      calendarDisabledDays: [5, 12],
      calendarWeekdays: ['일', '월', '화', '수', '목', '금', '토'],
      calendarPreviousMonthLabel: '이전 달',
      calendarNextMonthLabel: '다음 달',
      calendarYearSelectLabel: '연도 선택',
      calendarMonthSelectLabel: '월 선택',
      calendarTodayLabel: '오늘',
      calendarEventLabel: '행사일',
      calendarCancelLabel: '취소',
      calendarConfirmLabel: '확인',
      dateInputKind: 'date-input',
      dateInputId: 'angular-inventory-date-input',
      dateInputLabel: '날짜 입력',
      dateInputValue: '2026-07-27',
      selectKind: 'select',
      selectId: 'angular-inventory-select',
      selectLabel: '선택',
      selectedOption: 'one',
      selectSizeKind: 'select-size',
      selectSizeId: 'angular-inventory-select-size',
      selectSizeLabel: '큰 선택',
      selectSortingKind: 'select-sorting',
      selectSortingId: 'angular-inventory-select-sorting',
      selectSortingLabel: '정렬',
      selectStateKind: 'select-state',
      selectStateId: 'angular-inventory-select-state',
      selectStateLabel: '오류 선택',
      languageSwitcherKind: 'language-switcher',
      languageSwitcherId: 'angular-inventory-language',
      selectedLanguage: 'one',
      languageLabel: '언어 선택',
      languageSwitcherPageKind: 'language-switcher-page',
      languageSwitcherPageId: 'angular-inventory-language-page',
      languagePageLabel: '페이지 언어 선택',
      carouselKind: 'carousel',
      carouselBannerKind: 'carousel-banner',
      carouselLabel: '주요 콘텐츠',
      fileUploadKind: 'file-upload',
      fileUploadId: 'angular-inventory-file-upload',
      fileUploadTitle: '파일 업로드',
      fileUploadDescription: '파일을 선택하세요.',
      fileUploadPrompt: '파일을 첨부하세요.',
      fileUploadInputId: 'angular-inventory-file-input',
      fileUploadSelectLabel: '파일 선택',
      fileUploadFiles: [{ id: 'file-one', name: '안내문.pdf', status: 'complete', statusLabel: '업로드 완료' }],
      fileUploadDeleteAllLabel: '전체 삭제',
      fileUploadCurrentCount: 1,
      fileUploadMaxCount: 3,
      fileUploadCountSuffix: '개',
      nextLabel: '다음',
      previousLabel: '이전',
      moreLabel: '더 보기',
      paginationKind: 'pagination',
      paginationItems: [1, 2, 3, 'ellipsis', 5],
      paginationCurrent: 1,
      currentPageLabel: '현재 페이지',
      stepIndicatorKind: 'step-indicator',
      stepCurrent: 1,
      tabKind: 'tab',
      selectedLabel: '선택됨',
      structuredListKind: 'structured-list',
      structuredActionLabel: '자세히 보기',
      structuredDateLabel: '등록일',
      structuredDateValue: '2026.07.27',
      structuredTags: ['공지', '안내'],
      shareLabel: '공유',
      favoriteLabel: '관심',
      structuredListTableKind: 'structured-list-table',
      structuredSelectAllLabel: '전체선택',
      structuredCountLabel: '목록 표시 개수',
      structuredCountOptions: ['10개', '9개'],
      structuredSortLabel: '정렬기준',
      structuredSortOptions: ['관련도순', '최신순', '인기순'],
      structuredSortValue: '관련도순',
      structuredTableCaption: '000에 대한 표로 유형 제목 내용 게시일로 구성되어있다.',
      structuredTableColumns,
      structuredTableRows,
      structuredTableActions,
      structuredTablePagination,
      tableKind: 'table',
      tableCaption: '000에 대한 표로 제목1,제목2에 대한 내용으로 구성되어 있으며 제목1은 제목1-1,제목1-2,제목1-3으로 구성되어있다.',
      tableColumns,
      tableRows,
      textListKind: 'text-list',
      textListOrderedKind: 'text-list-ordered',
      textListItems: ['첫 번째 안내', { id: 'nested', label: '두 번째 안내', children: ['하위 안내'] }],
      criticalAlertsKind: 'critical-alerts',
      criticalItems: [
        { id: 'critical-one', label: '긴급 안내', title: '긴급 안내', description: '서비스 점검이 예정되어 있습니다.', tone: 'danger', badgeLabel: '긴급', linkLabel: '자세히 보기', href: '#critical-one' },
        { id: 'critical-two', label: '일반 안내', title: '일반 안내', description: '새로운 안내가 있습니다.', tone: 'information', badgeLabel: '안내', linkLabel: '확인', href: '#critical-two' },
      ],
      footerKind: 'footer',
      footerId: 'krds-footer',
      footerRelatedSites,
      footerLogoLabel: 'KRDS - Korea Design System',
      footerAddress: '(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단',
      footerContacts,
      footerLinks,
      footerSocialLinks,
      footerPolicyLinks,
      footerCopyright: '© 2023 National Health Insurance Service. All rights reserved.',
      footerOrganization: 'KRDS - Korea Design System',
      footerDescription: '이 누리집은 보건복지부 누리집입니다.',
      faviconKind: 'favicon',
      faviconHref: '/favicon.ico',
      faviconLabel: '사이트 아이콘',
      spinnerKind: 'spinner',
      spinnerLabel: '처리 중',
      resizeKind: 'resize',
      resizeLabel: '화면 크기',
      resizeOptions: [{ value: '100', label: '기본' }, { value: '125', label: '크게' }, { value: '150', label: '가장 크게' }],
      resizeSelected: '100',
      resizeSelectedLabel: '현재 크기',
      resizeResetLabel: '기본값으로 초기화',
      tooltipKind: 'tooltip',
      tooltipLabel: '툴팁',
      tooltipMessage: '도움말 메시지입니다.',
      tooltipBoxKind: 'tooltip-box',
      tooltipBoxLabel: '박스 툴팁',
      tooltipBoxMessage: '박스 도움말입니다.',
      tooltipVerticalKind: 'tooltip-vertical',
      tooltipVerticalLabel: '세로 툴팁',
      tooltipVerticalMessage: '세로 도움말입니다.',
      ttsKind: 'tts',
      ttsLabel: '읽어주기',
      ttsIconKind: 'tts-icon',
      ttsIconLabel: '아이콘 읽어주기',
      ttsSizeKind: 'tts-size',
      ttsSizeLabel: '큰 읽어주기',
    },
  }),
};
