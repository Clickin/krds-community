import * as Components from '@krds-community/svelte';
import { createRawSnippet, mount, tick, unmount, type Component } from 'svelte';
import type { FrameworkAdapter } from '../protocol';

const exportName = (componentId: string): string =>
  componentId
    .split('-')
    .map((part) => `${part.charAt(0).toLocaleUpperCase('en-US')}${part.slice(1)}`)
    .join('');

const componentFor = (componentId: string): Component<Record<string, unknown>> => {
  const name = exportName(componentId);
  const candidate: unknown = (Components as Record<string, unknown>)[name];
  if (typeof candidate !== 'function') {
    throw new Error(`Svelte package export is missing: ${name}`);
  }
  return candidate as Component<Record<string, unknown>>;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderProps = (props: Record<string, unknown>): Record<string, unknown> => {
  const children = props.children;
  if (children === undefined) return props;
  return {
    ...props,
    children: createRawSnippet(() => ({ render: () => escapeHtml(String(children)) })),
  };
};

export const adapter: FrameworkAdapter = {
  async mount(target, componentId, initialProps) {
    const component = componentFor(componentId);
    let currentProps = initialProps;
    let instance: Record<string, unknown> | undefined;

    const render = async () => {
      const previous = instance;
      instance = undefined;
      if (previous) await unmount(previous);

      target.replaceChildren();
      instance = mount(component, { target, props: renderProps(currentProps) });
      await tick();
    };

    await render();

    return {
      async update(props) {
        currentProps = props;
        await render();
      },
      async dispose() {
        const current = instance;
        instance = undefined;
        if (current) await unmount(current);
        target.replaceChildren();
      },
    };
  },
};
