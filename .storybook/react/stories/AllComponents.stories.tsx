import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionLine,
  Badge,
  BadgeNumber,
  BadgeSize,
  Breadcrumb,
  Button,
  ButtonHierarchy,
  ButtonIcon,
  ButtonSize,
  ButtonText,
  ButtonWithIcon,
  Calendar,
  CalendarRange,
  Carousel,
  CarouselBanner,
  Checkbox,
  CheckboxChip,
  CheckboxSize,
  CoachMark,
  ContextualHelp,
  CriticalAlerts,
  DateInput,
  Disclosure,
  Favicon,
  FileUpload,
  Footer,
  Header,
  HelpPanel,
  Identifier,
  InPageNavigation,
  LanguageSwitcher,
  LanguageSwitcherPage,
  Link,
  MainMenuMobile,
  MainMenuPc,
  Masthead,
  Modal,
  ModalSample,
  Pagination,
  Radio,
  RadioButton,
  RadioChip,
  RadioSize,
  Resize,
  Select,
  SelectSize,
  SelectSorting,
  SelectState,
  SideNavigation,
  SkipLink,
  Spinner,
  StepIndicator,
  StructuredList,
  StructuredListTable,
  Switch,
  Tab,
  Table,
  Tag,
  TagLink,
  Textarea,
  TextInput,
  TextInputIcon,
  TextInputSize,
  TextInputState,
  TextList,
  TextListOrdered,
  ToggleSwitch,
  ToggleSwitchSize,
  Tooltip,
  TooltipBox,
  TooltipVertical,
  Tts,
  TtsIcon,
  TtsSize,
  TutorialPanel,
} from '@krds-community/react';

const links = [
  { id: 'home', label: '홈', href: '/' },
  { id: 'guide', label: '가이드', href: '#guide' },
];
const options = [
  { value: 'one', label: '첫 번째' },
  { value: 'two', label: '두 번째' },
];
const slides = [
  { id: 'one', title: '첫 번째 카드', description: '캐러셀 콘텐츠입니다.' },
  { id: 'two', title: '두 번째 카드' },
];
const items = [
  { id: 'one', title: '첫 번째 항목', description: '항목 설명입니다.' },
  { id: 'two', title: '두 번째 항목' },
];
const columns = [
  { key: 'name', label: '이름' },
  { key: 'status', label: '상태' },
];
const rows = [
  { name: '서비스', status: '운영 중' },
  { name: '문서', status: '검토 중' },
];

const meta = { title: 'React/전체 컴포넌트', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;

export const Inventory: StoryObj<typeof meta> = {
  name: '전체 인벤토리',
  render: () => (
    <main aria-label="컴포넌트 인벤토리" style={{ display: 'grid', gap: '1rem', maxWidth: 720 }}>
      <Masthead />
      <Header title="KRDS Community" nav={links} />
      <Identifier organization="KRDS Community" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        <Badge label="배지" />
        <BadgeNumber label="3" />
        <BadgeSize label="중요" size="large" />
        <Tag label="태그" />
        <TagLink label="태그 링크" href="#tag" />
      </div>
      <Breadcrumb items={links} />
      <SkipLink />
      <MainMenuPc items={links} />
      <MainMenuMobile items={links} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
        <Button>버튼</Button>
        <ButtonHierarchy>계층 버튼</ButtonHierarchy>
        <ButtonIcon label="검색" />
        <ButtonSize size="small">작은 버튼</ButtonSize>
        <ButtonText>텍스트 버튼</ButtonText>
        <ButtonWithIcon>다음</ButtonWithIcon>
        <Link href="#link">링크</Link>
      </div>
      <Accordion items={[{ id: 'one', title: '아코디언', content: '내용입니다.' }]} />
      <AccordionLine
        items={[{ id: 'line', title: '라인 아코디언', content: '라인 내용입니다.' }]}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
        <Checkbox label="체크박스" name="check" />
        <CheckboxChip label="체크 칩" name="chip" />
        <CheckboxSize label="큰 체크 칩" size="large" />
        <Radio label="라디오" name="radio" value="one" />
        <RadioButton label="라디오 버튼" name="radio2" value="one" />
        <RadioChip label="라디오 칩" name="radio3" value="one" />
        <RadioSize label="큰 라디오 칩" name="radio4" value="one" />
        <Switch label="스위치" name="switch" />
        <ToggleSwitch label="토글" name="toggle" />
        <ToggleSwitchSize label="큰 토글" size="large" name="toggle2" />
      </div>
      <Calendar label="날짜" />
      <DateInput label="날짜 입력" />
      <CalendarRange label="기간" />
      <TextInput label="텍스트" hint="도움말" />
      <TextInputSize label="작은 텍스트" size="small" />
      <TextInputState label="오류 텍스트" state="error" hint="오류 안내" />
      <TextInputIcon label="아이콘 텍스트" />
      <Textarea label="긴 텍스트" />
      <FileUpload label="파일 업로드" />
      <Select label="선택" options={options} />
      <SelectSize label="작은 선택" options={options} size="small" />
      <SelectSorting options={options} />
      <SelectState label="오류 선택" options={options} state="error" />
      <LanguageSwitcher languages={options} />
      <LanguageSwitcherPage languages={options} />
      <Resize />
      <Carousel slides={slides} label="콘텐츠 캐러셀" />
      <CarouselBanner slides={slides} label="배너 캐러셀" />
      <Pagination current={2} />
      <StepIndicator
        steps={[
          { id: 'one', label: '첫 단계' },
          { id: 'two', label: '두 번째 단계' },
        ]}
        current={1}
      />
      <Tab
        tabs={[
          { id: 'one', label: '첫 탭' },
          { id: 'two', label: '두 번째 탭' },
        ]}
        panels={{ one: '첫 패널', two: '두 번째 패널' }}
      />
      <StructuredList items={items} />
      <StructuredListTable columns={columns} rows={rows} />
      <Table columns={columns} rows={rows} />
      <TextList items={['첫 항목', '둘째 항목']} />
      <TextListOrdered items={['첫 항목', '둘째 항목']} />
      <SideNavigation items={links} />
      <InPageNavigation items={links} />
      <Footer links={links} />
      <HelpPanel open title="도움말">
        도움말 내용
      </HelpPanel>
      <TutorialPanel open title="튜토리얼">
        튜토리얼 내용
      </TutorialPanel>
      <Disclosure title="상세 보기" open>
        상세 내용
      </Disclosure>
      <ContextualHelp label="도움말">도움말 내용</ContextualHelp>
      <CoachMark title="따라하기">현재 단계 안내</CoachMark>
      <CriticalAlerts items={['긴급 안내']} />
      <Spinner />
      <Tooltip message="툴팁">툴팁</Tooltip>
      <TooltipBox message="박스 툴팁">박스 툴팁</TooltipBox>
      <TooltipVertical message="세로 툴팁">세로 툴팁</TooltipVertical>
      <Tts text="읽어주기" />
      <TtsIcon text="아이콘 읽어주기" />
      <TtsSize text="큰 읽어주기" />
      <Modal open title="대화 상자">
        모달 내용
      </Modal>
      <ModalSample open title="모달 샘플">
        샘플 내용
      </ModalSample>
      <Favicon href="/favicon.png" />
    </main>
  ),
};
