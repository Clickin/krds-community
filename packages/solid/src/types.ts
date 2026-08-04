import type { JSX } from "solid-js";
import type {
  KrdsAdditionalProps,
  KrdsOption,
  KrdsNavItem,
  KrdsListItem,
} from "@krds-community/recipes";
import type {
  CalendarChoiceInput,
  CalendarDay,
  CalendarAction,
  TableColumn,
  TableRow,
  TablePagination,
  AlertItem,
  StructuredItem,
  HelpTab,
  HelpLink,
  HelpRelatedGroup,
  TutorialTask,
  MenuItem,
  MenuDescriptionItem,
  MenuBanner,
  FooterContact,
  UploadFile,
  HeaderMyMenu,
  HeaderMobileMenu,
} from "./shared.js";

export type {
  CalendarChoiceInput,
  CalendarDay,
  CalendarAction,
  TableColumn,
  TableRow,
  TablePagination,
  AlertItem,
  StructuredItem,
  HelpTab,
  HelpLink,
  HelpRelatedGroup,
  TutorialTask,
  MenuItem,
  MenuDescriptionItem,
  MenuBanner,
  FooterContact,
  UploadFile,
  HeaderMyMenu,
  HeaderMobileMenu,
};

export type AdditionalProps = Omit<
  KrdsAdditionalProps,
  "className" | "items" | "tabs" | "columns" | "rows"
> &
  Omit<JSX.HTMLAttributes<HTMLElement>, "children"> & {
    class?: string;
    sample?: boolean;
    className?: string;
    target?: string;
    children?: JSX.Element;
    variant?: string;
    icon?: JSX.Element;
    state?: string;
    error?: string;
    step?: string;
    text?: string;
    defaultValue?: string;
    defaultStart?: string;
    defaultEnd?: string;
    languages?: KrdsOption[];
    nav?: KrdsNavItem[];
    menuLabel?: string;
    quickLinks?: KrdsNavItem[];
    policyLinks?: KrdsNavItem[];
    address?: string;
    contact?: string;
    copyright?: string;
    identifierText?: string;
    organization?: string;
    external?: boolean;
    removable?: boolean;
    maxLength?: number;
    countSuffix?: string;
    ordered?: boolean;
    caption?: string;
    previousLabel?: string;
    nextLabel?: string;
    playLabel?: string;
    stopLabel?: string;
    moreLabel?: string;
    imageLabel?: string;
    actionLabel?: string;
    selectedLabel?: string;
    resetLabel?: string;
    calendarLabel?: string;
    todayLabel?: string;
    yearLabel?: string;
    monthLabel?: string;
    year?: string | number;
    month?: string | number;
    displayYear?: string | number;
    displayMonth?: string | number;
    selectedYear?: string | number;
    selectedMonth?: string | number;
    previousMonthLabel?: string;
    previousmonthlabel?: string;
    nextmonthlabel?: string;
    nextMonthLabel?: string;
    years?: CalendarChoiceInput[];
    months?: CalendarChoiceInput[];
    disabledYears?: number[];
    disabledMonths?: number[];
    leadingDays?: number;
    previousMonthDayCount?: number;
    dayCount?: number;
    rangeStartDay?: number;
    rangeEndDay?: number;
    todayDay?: number;
    eventDays?: number[];
    disabledDays?: number[];
    yearSelectLabel?: string;
    monthSelectLabel?: string;
    eventLabel?: string;
    weekdays?: string[];
    weeks?: CalendarDay[][];
    actions?: CalendarAction[];
    pageTitle?: string;
    actionInfo?: string;
    actionCount?: string;
    dateLabel?: string;
    dateValue?: string;
    tags?: string[];
    shareLabel?: string;
    favoriteLabel?: string;
    panelTitle?: string;
    previousDisabled?: boolean;
    stepTitle?: string;
    contentTitle?: string;
    currentStep?: string;
    totalSteps?: string;
    currentStepLabel?: string;
    totalStepsLabel?: string;
    linkLabel?: string;
    closeLabel?: string;
    currentLabel?: string;
    activeTab?: "help" | "tutorial";
    tabs?: HelpTab[];
    helpTitle?: string;
    helpDescription?: string;
    externalTitle?: string;
    backTitle?: string;
    tutorialBackTitle?: string;
    downloadLinks?: HelpLink[];
    relatedGroups?: HelpRelatedGroup[];
    tutorialTitle?: string;
    tasks?: TutorialTask[];
    collapseLabel?: string;
    utilityItems?: MenuItem[];
    loginLabel?: string;
    serviceItems?: MenuItem[];
    searchPlaceholder?: string;
    searchTitle?: string;
    searchLabel?: string;
    bottomItems?: MenuItem[];
    selectAllLabel?: string;
    countLabel?: string;
    countOptions?: string[];
    sortLabel?: string;
    sortOptions?: string[];
    sortValue?: string;
    columns?: TableColumn[];
    rows?: TableRow[];
    pagination?: TablePagination;
    relatedSites?: MenuItem[];
    logoLabel?: string;
    contacts?: FooterContact[];
    socialLinks?: MenuItem[];
    prompt?: string;
    inputId?: string;
    selectLabel?: string;
    currentCount?: number;
    maxCount?: number;
    files?: UploadFile[];
    deleteAllLabel?: string;
    desktopItems?: MenuItem[];
    logoHref?: string;
    loginHref?: string;
    joinLabel?: string;
    allMenuLabel?: string;
    myMenu?: HeaderMyMenu;
    mobileMenu?: HeaderMobileMenu;
    navigationRole?: JSX.HTMLAttributes<HTMLElement>["role"] | false;
    navigationLabel?: string;
    bottomSize?: "small" | "medium";
    cancelLabel?: string;
    confirmLabel?: string;
    items?: (
      | MenuItem
      | KrdsNavItem
      | KrdsListItem
      | StructuredItem
      | AlertItem
      | string
      | number
    )[];
  };
