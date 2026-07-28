<script lang="ts">
  import Accordion from '../../../packages/svelte/src/Accordion.svelte';
  import Checkbox from '../../../packages/svelte/src/Checkbox.svelte';
  import TextInput from '../../../packages/svelte/src/TextInput.svelte';
  import { SelectSorting, SelectState, Tab } from '../../../packages/svelte/src/index.js';

  let value = $state('one');
  let checked = $state(false);
  let disabled = $state(false);
  let submitted = $state('');
  let selectState: 'default' | 'error' = $state('error');
  let items = $state([
    { id: 'first', title: 'First', content: 'First content' },
    { id: 'second', title: 'Second', content: 'Second content' },
  ]);
  let openItems = $state<string[]>([]);
  let selectedTab = $state('first');
  let tabs = $state([
    { id: 'first', label: 'First tab' },
    { id: 'second', label: 'Second tab' },
  ]);
  let panels = $state({
    first: 'First panel',
    second: 'Second panel',
  });

  function submit(event: SubmitEvent) {
    event.preventDefault();
    submitted = new FormData(event.currentTarget as HTMLFormElement).get('query')?.toString() ?? '';
  }
</script>

<form onsubmit={submit}>
  <TextInput
    id="query"
    name="query"
    label="Query"
    hint="Required"
    state="error"
    bind:value
  />
  <Checkbox id="accepted" name="accepted" label="Accept" bind:checked {disabled} />
  <Accordion bind:openItems {items} />
  <SelectState
    id="reactive-select"
    class="consumer-select"
    label="Reactive select"
    state={selectState}
    options={[
      { value: 'first', label: 'First option' },
      { value: 'second', label: 'Second option' },
    ]}
  />
  <SelectSorting
    id="reactive-sorting-select"
    label="Reactive sorting select"
    state={selectState}
    options={[
      { value: 'first', label: 'First option' },
      { value: 'second', label: 'Second option' },
    ]}
  />
  <Tab
    id="reactive-tabs"
    class="consumer-tabs"
    bind:selected={selectedTab}
    {tabs}
    {panels}
    message="selected"
  />
  <output data-testid="count">{value.length}</output>
  <output data-testid="submitted">{submitted}</output>
  <output data-testid="selected-tab">{selectedTab}</output>
  <button
    type="button"
    onclick={() => {
      value = 'updated';
      disabled = true;
      selectState = 'default';
      items = [
        { id: 'first', title: 'Renamed', content: 'Updated content' },
        { id: 'second', title: 'Second', content: 'Second content' },
      ];
      selectedTab = 'second';
      tabs = [
        { id: 'first', label: 'First tab renamed' },
        { id: 'second', label: 'Second tab renamed' },
      ];
      panels = {
        first: 'First panel updated',
        second: 'Second panel updated',
      };
    }}>Parent update</button
  >
  <button type="submit">Submit</button>
</form>
