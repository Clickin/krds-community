import { pinnedKrdsSnapshot } from './provenance';
const sourceVersion = pinnedKrdsSnapshot.ref;
const sourceHashes = {
    button: 'd7de0193f9c8820e8122f08666d985586eb32ca3001c23f7f0eef73eb0e82503',
    'text-input': '5356b930b598752a755993df8cd912b7a81fdfbb65f492371a302b49bbb390d7',
    checkbox: '34c7e0ec2f85d56332afbada573293a26c1388acecf4de2778c4255e5729d195',
    radio: '1d9bf024acf9afc99c83ca6c5380816a6d1fd9951dd13749b5f31f37cfbf99cc',
    switch: 'a0f8cafe200764924f78b6d3a0f83607cc521771967049b5e9865c63ff82798b',
    accordion: 'a9fac2593255947c09b3828d3a83efe466baea96e3e74c88db0b07ce1cb78252',
};
const sourceFiles = {
    button: 'upstream/krds-html/html/code/button.html, upstream/krds-html/html/code/button_hierarchy.html, upstream/krds-html/html/code/button_size.html',
    'text-input': 'upstream/krds-html/html/code/text_input.html, upstream/krds-html/html/code/text_input_size.html, upstream/krds-html/html/code/text_input_state.html',
    checkbox: 'upstream/krds-html/html/code/checkbox.html, upstream/krds-html/html/code/checkbox_size.html',
    radio: 'upstream/krds-html/html/code/radio_button.html, upstream/krds-html/html/code/radio_size.html',
    switch: 'upstream/krds-html/html/code/toggle_switch.html, upstream/krds-html/html/code/toggle_switch_size.html',
    accordion: 'upstream/krds-html/html/code/accordion.html, upstream/krds-html/html/code/accordion_line.html',
};
const headerComment = (framework, component, body) => {
    const lines = [
        `@krds-community/component: ${component}`,
        `@krds-community/framework: ${framework}`,
        `@krds-community/source-version: ${sourceVersion}`,
        `@krds-community/source-hash: ${sourceHashes[component]}`,
        `@krds-community/source: ${sourceFiles[component]}`,
    ];
    if (framework === 'astro') {
        const metadata = lines.map((line) => `// ${line}`).join('\n');
        return body.startsWith('---\n')
            ? body.replace(/^---\n/, `---\n${metadata}\n`)
            : `---\n${metadata}\n---\n${body}`;
    }
    const header = framework === 'react' || framework === 'solid'
        ? [`/* ${lines[0]}`, ...lines.slice(1).map((line) => ` * ${line}`), ' */'].join('\n')
        : [`<!-- ${lines[0]}`, ...lines.slice(1).map((line) => `     ${line}`), '-->'].join('\n');
    return `${header}\n${body}`;
};
const snippet = (framework, component, body) => headerComment(framework, component, body);
const packageNames = {
    react: '@krds-community/react',
    vue: '@krds-community/vue',
    svelte: '@krds-community/svelte',
    solid: '@krds-community/solid',
    angular: '@krds-community/angular',
    astro: '@krds-community/astro',
};
const sourcePaths = {
    react: 'packages/react/src/components.tsx',
    vue: 'packages/vue/src/index.ts',
    svelte: 'packages/svelte/src/index.d.ts',
    solid: 'packages/solid/src/index.tsx',
    angular: 'packages/angular/src/components.ts',
    astro: 'packages/astro/src/index.d.ts',
};
const frameworkSnippets = {
    button: {
        react: snippet('react', 'button', String.raw `import { Button } from '@krds-community/react';

export function SaveButton() {
  return <Button type="submit" variant="primary">저장</Button>;
}`),
        vue: snippet('vue', 'button', String.raw `<script setup lang="ts">
import { Button } from '@krds-community/vue';
</script>

<template>
  <Button type="submit" variant="primary">저장</Button>
</template>`),
        svelte: snippet('svelte', 'button', String.raw `<script lang="ts">
  import { Button } from '@krds-community/svelte';
</script>

<Button type="submit" variant="primary">저장</Button>`),
        solid: snippet('solid', 'button', String.raw `import { Button } from '@krds-community/solid';

export function SaveButton() {
  return <Button type="submit" variant="primary">저장</Button>;
}`),
        angular: snippet('angular', 'button', String.raw `import { KrdsButtonComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsButtonComponent],
  template: '<krds-button type="submit" variant="primary">저장</krds-button>',
})
export class SaveButtonComponent {}`),
        astro: snippet('astro', 'button', String.raw `---
import { Button } from '@krds-community/astro';
---

<Button type="submit" variant="primary">저장</Button>`),
    },
    'text-input': {
        react: snippet('react', 'text-input', String.raw `import { TextInput } from '@krds-community/react';

export function NameField() {
  return <TextInput name="name" label="이름" hint="실명을 입력하세요." required />;
}`),
        vue: snippet('vue', 'text-input', String.raw `<script setup lang="ts">
import { ref } from 'vue';
import { TextInput } from '@krds-community/vue';

const name = ref('');
</script>

<template>
  <TextInput v-model="name" name="name" label="이름" hint="실명을 입력하세요." required />
</template>`),
        svelte: snippet('svelte', 'text-input', String.raw `<script lang="ts">
  import { TextInput } from '@krds-community/svelte';
  let name = $state('');
</script>

<TextInput bind:value={name} name="name" label="이름" hint="실명을 입력하세요." required />`),
        solid: snippet('solid', 'text-input', String.raw `import { TextInput } from '@krds-community/solid';

export function NameField() {
  return <TextInput name="name" label="이름" hint="실명을 입력하세요." required />;
}`),
        angular: snippet('angular', 'text-input', String.raw `import { KrdsTextInputComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsTextInputComponent],
  template: '<krds-text-input name="name" label="이름" hint="실명을 입력하세요." required />',
})
export class NameFieldComponent {}`),
        astro: snippet('astro', 'text-input', String.raw `---
import { TextInput } from '@krds-community/astro';
---

<TextInput name="name" label="이름" hint="실명을 입력하세요." required />`),
    },
    checkbox: {
        react: snippet('react', 'checkbox', String.raw `import { Checkbox } from '@krds-community/react';

export function TermsField() {
  return <Checkbox name="terms" label="약관에 동의합니다." description="필수 동의" required />;
}`),
        vue: snippet('vue', 'checkbox', String.raw `<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@krds-community/vue';

const accepted = ref(false);
</script>

<Checkbox v-model="accepted" name="terms" label="약관에 동의합니다." description="필수 동의" />`),
        svelte: snippet('svelte', 'checkbox', String.raw `<script lang="ts">
  import { Checkbox } from '@krds-community/svelte';
  let accepted = $state(false);
</script>

<Checkbox bind:checked={accepted} name="terms" label="약관에 동의합니다." description="필수 동의" />`),
        solid: snippet('solid', 'checkbox', String.raw `import { Checkbox } from '@krds-community/solid';

export function TermsField() {
  return <Checkbox name="terms" label="약관에 동의합니다." description="필수 동의" />;
}`),
        angular: snippet('angular', 'checkbox', String.raw `import { KrdsCheckboxComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsCheckboxComponent],
  template: '<krds-checkbox name="terms" label="약관에 동의합니다." description="필수 동의" />',
})
export class TermsFieldComponent {}`),
        astro: snippet('astro', 'checkbox', String.raw `---
import { Checkbox } from '@krds-community/astro';
---

<Checkbox name="terms" label="약관에 동의합니다." description="필수 동의" required />`),
    },
    radio: {
        react: snippet('react', 'radio', String.raw `import { Radio } from '@krds-community/react';

export function DeliveryChoice() {
  return <Radio name="delivery" value="standard" label="일반 배송" required />;
}`),
        vue: snippet('vue', 'radio', String.raw `<script setup lang="ts">
import { ref } from 'vue';
import { Radio } from '@krds-community/vue';

const delivery = ref('standard');
</script>

<Radio v-model="delivery" name="delivery" value="standard" label="일반 배송" />`),
        svelte: snippet('svelte', 'radio', String.raw `<script lang="ts">
  import { Radio } from '@krds-community/svelte';
  let delivery = $state('standard');
</script>

<Radio bind:checked={delivery} name="delivery" value="standard" label="일반 배송" />`),
        solid: snippet('solid', 'radio', String.raw `import { Radio } from '@krds-community/solid';

export function DeliveryChoice() {
  return <Radio name="delivery" value="standard" label="일반 배송" required />;
}`),
        angular: snippet('angular', 'radio', String.raw `import { KrdsRadioComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsRadioComponent],
  template: '<krds-radio name="delivery" value="standard" label="일반 배송" />',
})
export class DeliveryChoiceComponent {}`),
        astro: snippet('astro', 'radio', String.raw `---
import { Radio } from '@krds-community/astro';
---

<Radio name="delivery" value="standard" label="일반 배송" required />`),
    },
    switch: {
        react: snippet('react', 'switch', String.raw `import { Switch } from '@krds-community/react';

export function NotificationsSwitch() {
  return <Switch name="notifications" label="알림 받기" defaultChecked />;
}`),
        vue: snippet('vue', 'switch', String.raw `<script setup lang="ts">
import { ref } from 'vue';
import { Switch } from '@krds-community/vue';

const enabled = ref(true);
</script>

<Switch v-model="enabled" name="notifications" label="알림 받기" />`),
        svelte: snippet('svelte', 'switch', String.raw `<script lang="ts">
  import { Switch } from '@krds-community/svelte';
  let enabled = $state(true);
</script>

<Switch bind:checked={enabled} name="notifications" label="알림 받기" />`),
        solid: snippet('solid', 'switch', String.raw `import { Switch } from '@krds-community/solid';

export function NotificationsSwitch() {
  return <Switch name="notifications" label="알림 받기" />;
}`),
        angular: snippet('angular', 'switch', String.raw `import { KrdsSwitchComponent } from '@krds-community/angular';

@Component({
  standalone: true,
  imports: [KrdsSwitchComponent],
  template: '<krds-switch name="notifications" label="알림 받기" [checked]="true" />',
})
export class NotificationsSwitchComponent {}`),
        astro: snippet('astro', 'switch', String.raw `---
import { Switch } from '@krds-community/astro';
---

<Switch name="notifications" label="알림 받기" checked />`),
    },
    accordion: {
        react: snippet('react', 'accordion', String.raw `import { Accordion } from '@krds-community/react';

const items = [{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }];

export function DeliveryHelp() {
  return <Accordion items={items} />;
}`),
        vue: snippet('vue', 'accordion', String.raw `<script setup lang="ts">
import { Accordion } from '@krds-community/vue';

const items = [{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }];
</script>

<Accordion :items="items" />`),
        svelte: snippet('svelte', 'accordion', String.raw `<script lang="ts">
  import { Accordion } from '@krds-community/svelte';
  const items = [{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }];
</script>

<Accordion {items} />`),
        solid: snippet('solid', 'accordion', String.raw `import { Accordion } from '@krds-community/solid';

const items = [{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }];

export function DeliveryHelp() {
  return <Accordion items={items} />;
}`),
        angular: snippet('angular', 'accordion', String.raw `import { KrdsAccordionComponent, type KrdsAccordionItem } from '@krds-community/angular';

const items: KrdsAccordionItem[] = [{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }];

@Component({
  standalone: true,
  imports: [KrdsAccordionComponent],
  template: '<krds-accordion [items]="items" />',
})
export class DeliveryHelpComponent {
  items = items;
}`),
        astro: snippet('astro', 'accordion', String.raw `---
import { Accordion } from '@krds-community/astro';
---

<Accordion items={[{ id: 'delivery', title: '배송 안내', content: '배송은 영업일 기준 2일이 걸립니다.' }]} />`),
    },
};
const baseGuidance = {
    button: {
        title: '버튼',
        category: '액션',
        summary: '사용자가 작업을 실행하거나 폼을 제출하는 네이티브 버튼입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_05_02.html',
        props: [
            { name: 'variant', type: "'primary' | 'secondary' | 'tertiary'", description: '행동의 우선순위와 시각적 계층.' },
            { name: 'size', type: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'", description: '버튼 크기.' },
            { name: 'type', type: "'button' | 'submit' | 'reset'", description: '폼 안에서의 네이티브 동작.' },
            { name: 'disabled', type: 'boolean', description: '작업을 사용할 수 없는 상태.' },
        ],
        events: ['React/Solid: `onClick`은 네이티브 MouseEvent를 받는다.', 'Vue: `@click`, Angular: `(clicked)`로 실행 결과를 연결한다.', 'Svelte: `onclick` 또는 폼의 `onsubmit`을 사용한다.', 'Astro: native `<button>`의 `click`과 폼의 `submit` 이벤트를 사용한다.'],
        forms: ['폼 안에서 제출 버튼은 `type="submit"`을 명시하고, 취소·토글은 `type="button"`을 사용한다.', '서버 검증 오류를 버튼 비활성화만으로 숨기지 말고 오류 메시지와 포커스를 함께 제공한다.'],
        accessibility: ['실제 `<button>` semantics와 키보드 활성화를 보존한다.', '아이콘만 사용할 때는 접근 가능한 이름을 제공하고, disabled 상태를 작업 불가 사유와 함께 안내한다.'],
        usage: ['작업을 설명하는 동사형 레이블을 사용한다.', '한 화면에서 primary 행동은 하나로 제한하고 계층을 `variant`로 구분한다.'],
    },
    'text-input': {
        title: '텍스트 입력 필드',
        category: '입력',
        summary: '레이블·도움말·상태를 연결한 단일 텍스트 입력 컨트롤입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_09_03.html',
        props: [
            { name: 'label', type: 'string', description: '입력 컨트롤의 visible label.' },
            { name: 'hint', type: 'string', description: '도움말 또는 검증 결과 메시지.' },
            { name: 'state', type: "'default' | 'error' | 'success' | 'information'", description: '검증·안내 상태.' },
            { name: 'size', type: "'small' | 'medium' | 'large'", description: '입력 크기.' },
            { name: 'required / readonly / disabled', type: 'boolean', description: '네이티브 입력 제약과 상호작용 상태.' },
        ],
        events: ['React: `onChange`; Vue: `v-model`; Svelte: `bind:value`; Solid: `onInput`; Angular: `ControlValueAccessor`/`input`; Astro: native `input`/`change` 이벤트.', 'blur/touched 이벤트는 서버 검증 시점과 오류 메시지 노출 시점을 조정하는 데 사용한다.'],
        forms: ['`name`, `required`, `autocomplete`를 실제 폼 계약에 맞게 지정한다.', '제어·비제어 모델 어느 쪽이든 제출 시점에 서버 검증을 다시 수행한다.'],
        accessibility: ['패키지가 label과 input을 연결하고 안정적인 ID를 생성한다.', 'hint는 `aria-describedby`, error 상태는 `aria-invalid`로 전달되며, 오류 메시지는 입력 직후에도 읽을 수 있어야 한다.'],
        usage: ['placeholder를 label 대신 사용하지 않는다.', '입력 목적에 맞는 `type`, `inputMode`, `autocomplete`를 지정한다.'],
    },
    checkbox: {
        title: '체크박스',
        category: '선택',
        summary: '독립적인 선택 또는 여러 항목을 동시에 선택하는 네이티브 체크박스입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_06_02.html',
        props: [
            { name: 'label', type: 'string', description: '체크박스의 accessible name.' },
            { name: 'description', type: 'string', description: '추가 설명 또는 제약.' },
            { name: 'name / id', type: 'string', description: '폼 제출 이름과 label 연결용 ID.' },
            { name: 'size', type: "'medium' | 'large'", description: '컨트롤 크기.' },
            { name: 'checked / disabled', type: 'boolean', description: '선택 및 상호작용 상태.' },
        ],
        events: ['React/Solid: `onChange`; Vue: `v-model`; Svelte: `bind:checked`; Angular: `(checkedChange)`; Astro: native `change` 이벤트.', '상태 변경 후 선택 결과를 live region에 중복 출력하지 말고 필요한 경우 요약만 제공한다.'],
        forms: ['같은 `name`을 공유하는 선택군은 fieldset/legend로 묶고, 제출 payload에 의미 있는 값을 사용한다.', '필수 동의는 `required`와 오류 메시지를 함께 사용한다.'],
        accessibility: ['native checkbox와 label-for relation을 보존한다.', 'description은 `aria-describedby`로 연결하며, checked/disabled 상태를 시각적 색상만으로 전달하지 않는다.'],
        usage: ['상호 배타적인 선택에는 checkbox 대신 radio를 사용한다.', '긴 설명은 label과 분리하고 선택 전에도 읽을 수 있게 한다.'],
    },
    radio: {
        title: '라디오 버튼',
        category: '선택',
        summary: '서로 배타적인 옵션 중 하나를 선택하는 네이티브 라디오 버튼입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_06_01.html',
        props: [
            { name: 'value', type: 'string | number | boolean', description: '선택 시 제출할 값.' },
            { name: 'label / description', type: 'string', description: '옵션 이름과 추가 설명.' },
            { name: 'name', type: 'string', description: '같은 선택군을 묶는 폼 이름.' },
            { name: 'size / checked / disabled', type: 'enum | boolean', description: '표현과 상호작용 상태.' },
        ],
        events: ['React/Solid: `onChange`; Vue: `v-model`; Svelte: `bind:checked`; Angular: `(selected)`; Astro: native `change` 이벤트.', '선택된 value를 애플리케이션 상태와 폼 상태에 한 번만 반영한다.'],
        forms: ['같은 `name`의 radio를 fieldset/legend로 묶고, 하나를 필수로 요구하면 그룹 오류를 명확히 표시한다.', 'value는 표시 문자열과 분리된 안정적인 도메인 값이어야 한다.'],
        accessibility: ['native radio semantics와 동일 name grouping을 사용한다.', '그룹 설명·오류를 fieldset/legend 및 `aria-describedby`로 연결한다.'],
        usage: ['두 개 이상인 명확한 옵션 집합에 사용한다.', '선택 해제를 별도 동작으로 제공해야 하면 radio 대신 다른 패턴을 검토한다.'],
    },
    switch: {
        title: '토글 스위치',
        category: '설정',
        summary: '설정처럼 즉시 켜고 끌 수 있는 boolean 값을 나타내는 체크박스 기반 컨트롤입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_06_07.html',
        props: [
            { name: 'label', type: 'string', description: '현재 설정의 의미를 설명하는 이름.' },
            { name: 'name / id', type: 'string', description: '폼 이름과 label 연결용 ID.' },
            { name: 'size', type: "'medium' | 'large'", description: '스위치 크기.' },
            { name: 'checked / disabled', type: 'boolean', description: '켜짐·꺼짐과 상호작용 상태.' },
        ],
        events: ['React/Solid: `onChange`; Vue: `v-model`; Svelte: `bind:checked`; Angular: `(checkedChange)`; Astro: native `change` 이벤트.', '변경 이벤트에서는 새 boolean 값을 저장하고 서버 저장 실패 시 원래 상태와 오류를 복원한다.'],
        forms: ['단독 설정은 명확한 `name`과 boolean 값으로 제출한다.', '즉시 반영되지 않는 설정이면 switch 대신 checkbox와 저장 버튼을 사용한다.'],
        accessibility: ['native checkbox semantics를 유지하고, label은 설정의 결과를 설명한다.', '켜짐/꺼짐을 색상이나 위치만으로 표현하지 말고 accessible name과 상태를 함께 제공한다.'],
        usage: ['변경 결과가 즉시 적용되는 설정에만 사용한다.', '작업 실행이나 페이지 이동처럼 부작용이 큰 동작에는 사용하지 않는다.'],
    },
    accordion: {
        title: '아코디언',
        category: '레이아웃 및 표현',
        summary: '관련 콘텐츠를 heading과 disclosure button으로 접고 펼치는 컴포넌트입니다.',
        officialUrl: 'https://www.krds.go.kr/html/site/component/component_04_07.html',
        props: [
            { name: 'items', type: '{ id; title; content; disabled? }[]', description: '각 disclosure 항목과 안정적인 식별자.' },
            { name: 'type', type: "'default' | 'line'", description: '표현 스타일.' },
            { name: 'multiple', type: 'boolean', description: '여러 패널을 동시에 열 수 있는지 여부.' },
            { name: 'defaultOpen', type: 'string[]', description: '초기 펼침 상태.' },
        ],
        events: ['패널 trigger는 native button click과 keyboard activation을 사용한다.', 'Astro는 별도 framework wrapper 없이 패키지 컴포넌트의 native `click` 동작을 사용한다.', '상태가 바뀐 뒤 필요한 경우 상위 상태를 갱신하되, 콘텐츠 자체를 숨기기 위해 click 이벤트를 가로채지 않는다.'],
        forms: ['폼 컨트롤을 패널에 넣으면 닫힘 상태에서 값이 사라지지 않도록 제출 시점과 보존 전략을 확인한다.', '긴 양식은 accordion으로 숨겨 필수 입력을 놓치게 하지 않는다.'],
        accessibility: ['trigger에 `aria-expanded`·`aria-controls`, panel에 `aria-labelledby`·`role="region"`을 연결한다.', '실제 heading과 button을 사용하며, 열린 패널의 focus와 닫힘 상태를 키보드로 예측할 수 있게 한다.'],
        usage: ['서로 관련된 콘텐츠 묶음에만 사용하고 핵심 안내를 기본으로 숨기지 않는다.', '항목 `id`는 렌더링 사이에 바뀌지 않는 안정적인 값으로 제공한다.'],
    },
};
export const coreComponents = Object.keys(baseGuidance).map((id) => ({
    id,
    ...baseGuidance[id],
    packageNames,
    sourcePaths,
    sourceHashes: Object.fromEntries(Object.keys(packageNames).map((framework) => [framework, sourceHashes[id]])),
    sourceSnapshot: pinnedKrdsSnapshot.ref,
    snippets: frameworkSnippets[id],
}));
export function findComponent(id) {
    const component = coreComponents.find((item) => item.id === id);
    if (!component)
        throw new Error(`알 수 없는 KRDS 핵심 컴포넌트: ${id}`);
    return component;
}
//# sourceMappingURL=components.js.map