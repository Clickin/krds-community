<script lang="ts">
  import {
    Accordion,
    Button,
    Checkbox,
    Modal,
    Radio,
    Switch,
    Tab,
    TextInput,
  } from '@krds-community/svelte';

  type View =
    | 'button'
    | 'button-states'
    | 'text-input'
    | 'text-input-states'
    | 'checkbox-medium'
    | 'checkbox-large'
    | 'radio-medium'
    | 'radio-large'
    | 'switch-medium'
    | 'switch-large'
    | 'accordion-default'
    | 'accordion-line'
    | 'tab'
    | 'form'
    | 'modal';
  let {
    view = 'button',
    buttonVariant = 'primary',
    buttonSize = 'medium',
    inputState = 'default',
    inputSize = 'medium',
  }: {
    view?: View;
    buttonVariant?: 'primary' | 'secondary' | 'tertiary';
    buttonSize?: 'small' | 'medium' | 'large';
    inputState?: 'default' | 'error' | 'success' | 'information';
    inputSize?: 'small' | 'medium' | 'large';
  } = $props();

  let modalOpen = $state(true);
  let termsChecked = $state(false);
  let submitted = $state(false);

  const accordionItems = [
    { id: 'svelte-accordion-one', title: '기본 아코디언', content: '첫 번째 안내 내용입니다.' },
    { id: 'svelte-accordion-two', title: '두 번째 항목', content: '두 번째 안내 내용입니다.' },
  ];
  const tabs = [
    { id: 'svelte-tab-one', label: '첫 탭' },
    { id: 'svelte-tab-two', label: '두 번째 탭' },
  ];
  const panels = { 'svelte-tab-one': '첫 번째 패널', 'svelte-tab-two': '두 번째 패널' };
</script>

<div style="display:grid;gap:1rem;max-width:30rem">
  {#if view === 'button'}
    <Button variant={buttonVariant} size={buttonSize}>저장</Button>
  {:else if view === 'button-states'}
    <Button>활성 버튼</Button>
    <Button disabled>비활성 버튼</Button>
  {:else if view === 'text-input'}
    <TextInput id="svelte-text-input" label="이름" hint="실명을 입력하세요." state={inputState} size={inputSize} />
  {:else if view === 'text-input-states'}
    <TextInput id="svelte-text-input-placeholder" label="검색" placeholder="검색어를 입력하세요." />
    <TextInput id="svelte-text-input-readonly" label="읽기 전용" value="고정 값" readonly />
    <TextInput id="svelte-text-input-disabled" label="비활성" value="입력할 수 없음" disabled />
  {:else if view === 'checkbox-medium'}
    <fieldset style="display:grid;gap:.5rem">
      <legend>약관 동의</legend>
      <Checkbox id="svelte-checkbox-default" label="선택 안 함" name="svelte-checkbox-medium" />
      <Checkbox id="svelte-checkbox-checked" label="선택됨" name="svelte-checkbox-medium" checked />
      <Checkbox id="svelte-checkbox-disabled" label="비활성" name="svelte-checkbox-medium" disabled />
      <Checkbox id="svelte-checkbox-disabled-checked" label="비활성 선택됨" name="svelte-checkbox-medium" disabled checked />
    </fieldset>
  {:else if view === 'checkbox-large'}
    <Checkbox id="svelte-checkbox-large" label="큰 체크박스" name="svelte-checkbox-large" size="large" />
  {:else if view === 'radio-medium'}
    <fieldset style="display:grid;gap:.5rem">
      <legend>알림 빈도</legend>
      <Radio id="svelte-radio-daily" label="매일" name="svelte-radio-medium" value="daily" checked />
      <Radio id="svelte-radio-weekly" label="매주" name="svelte-radio-medium" value="weekly" />
      <Radio id="svelte-radio-disabled" label="사용 안 함" name="svelte-radio-medium" value="none" disabled />
    </fieldset>
  {:else if view === 'radio-large'}
    <Radio id="svelte-radio-large" label="큰 라디오" name="svelte-radio-large" value="large" size="large" />
  {:else if view === 'switch-medium'}
    <Switch id="svelte-switch-default" label="알림 받기" name="svelte-switch-medium" />
    <Switch id="svelte-switch-checked" label="자동 저장" name="svelte-switch-medium" checked />
    <Switch id="svelte-switch-disabled" label="비활성" name="svelte-switch-medium" disabled />
  {:else if view === 'switch-large'}
    <Switch id="svelte-switch-large" label="큰 스위치" name="svelte-switch-large" size="large" />
  {:else if view === 'accordion-default'}
    <Accordion items={accordionItems} />
  {:else if view === 'accordion-line'}
    <Accordion type="line" items={[{ id: 'svelte-accordion-line', title: '라인 아코디언', content: '라인 안내 내용입니다.' }]} />
  {:else if view === 'tab'}
    <Tab kind="tab" id="svelte-tab" {tabs} {panels} />
  {:else if view === 'form'}
    <form aria-label="프로필 입력" onsubmit={(event) => { event.preventDefault(); submitted = true; }}>
      <TextInput id="svelte-form-name" label="이름" hint="실명을 입력하세요." />
      <Checkbox id="svelte-form-terms" label="약관에 동의합니다." name="terms" bind:checked={termsChecked} />
      <Button type="submit">제출</Button>
      {#if submitted}<p role="status">제출되었습니다.</p>{/if}
    </form>
  {:else if view === 'modal'}
    <Button onclick={() => modalOpen = true}>모달 열기</Button>
    <Modal kind="modal" id="svelte-modal" title="확인 모달" open={modalOpen}>
      저장하시겠습니까?
    </Modal>
  {/if}
</div>
