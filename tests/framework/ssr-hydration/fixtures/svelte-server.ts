import { render } from 'svelte/server';
import SvelteHydrationFixture from './SvelteHydrationFixture.svelte';

export function renderSvelteFixture() {
  return render(SvelteHydrationFixture).body;
}
