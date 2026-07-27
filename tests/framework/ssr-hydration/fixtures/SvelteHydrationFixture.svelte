<script lang="ts">
  import {
    Accordion,
    Checkbox,
    Tab,
    TextInput,
  } from '../../../../packages/svelte/src/index.js';

  let value = $state('server value');
  let accepted = $state(false);
  let openItems = $state(['first']);
  let submitted = $state('');
  const accordionItems = [
    { id: 'first', title: 'First section', content: 'First section content' },
    { id: 'second', title: 'Second section', content: 'Second section content' },
  ];
  const tabs = [
    { id: 'first', label: 'First tab' },
    { id: 'second', label: 'Second tab' },
  ];
  const panels = { first: 'First panel', second: 'Second panel' };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    submitted = new FormData(event.currentTarget as HTMLFormElement).get('query')?.toString() ?? '';
  };
</script>

<form onsubmit={submit}>
  <TextInput
    id="svelte-query"
    name="query"
    label="Query"
    hint="Hydrated field"
    bind:value
  />
  <Checkbox
    id="svelte-accepted"
    name="accepted"
    label="Accept"
    bind:checked={accepted}
  />
  <Accordion items={accordionItems} bind:openItems />
  <Tab
    id="svelte-tabs"
    {tabs}
    {panels}
    modelValue="first"
    message="Selected"
  />
  <output data-testid="value-length">{value.length}</output>
  <output data-testid="submitted">{submitted}</output>
  <button type="submit">Submit</button>
</form>
