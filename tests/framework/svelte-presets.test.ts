import { mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { Badge, CriticalAlerts, FileUpload, Header, MainMenuMobile, Modal, Select, Tab } from '../../packages/svelte/src/index.js';

const instances: Array<Record<string, unknown>> = [];
const hosts: HTMLDivElement[] = [];

afterEach(() => {
  for (const instance of instances) unmount(instance);
  for (const host of hosts) host.remove();
  instances.length = 0;
  hosts.length = 0;
});

function mountInHost(component: Parameters<typeof mount>[0], props: Record<string, unknown>) {
  const host = document.createElement('div');
  document.body.append(host);
  hosts.push(host);
  const instance = mount(component, { target: host, props });
  instances.push(instance);
  return host;
}

describe('Svelte additional presets', () => {
  it('selects the preset branch without exposing kind as a required prop', async () => {
    const host = mountInHost(Badge, { kind: 'modal', label: 'Preset badge' });
    await tick();

    expect(host.querySelector('.krds-badge')?.textContent).toBe('Preset badge');
    expect(host.querySelector('dialog')).toBeNull();
  });

  it('preserves bindable modelValue accessors through the preset wrapper', async () => {
    let selected = 'second';
    const props: Record<string, unknown> = {
      options: [
        { value: 'first', label: 'First' },
        { value: 'second', label: 'Second' },
      ],
    };
    Object.defineProperty(props, 'modelValue', {
      enumerable: true,
      get: () => selected,
      set: (value: string) => {
        selected = value;
      },
    });
    const host = mountInHost(Select, props);
    await tick();

    const select = host.querySelector<HTMLSelectElement>('select')!;
    expect(select.value).toBe('second');
    select.value = 'first';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await tick();
    expect(selected).toBe('first');
  });

  it('moves tabs with keyboard and updates selected ARIA state', async () => {
    const host = mountInHost(Tab, {
      tabs: [
        { id: 'first', label: 'First' },
        { id: 'second', label: 'Second' },
      ],
      modelValue: 'first',
    });
    await tick();

    const buttons = host.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await tick();
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].tabIndex).toBe(0);
  });

  it('keeps alerts, file picker controls, and search inputs semantically native', async () => {
    const alerts = mountInHost(CriticalAlerts, {
      items: [{ message: 'Service notice', linkLabel: 'Read more', href: '/notice' }],
    });
    await tick();
    expect(alerts.querySelector('[role="alert"]')?.tagName).toBe('DIV');
    expect(alerts.querySelector('ul[role="alert"]')).toBeNull();

    const upload = mountInHost(FileUpload, {
      id: 'files',
      inputId: 'files',
      selectLabel: 'Choose files',
    });
    await tick();
    const uploadLabel = upload.querySelector<HTMLLabelElement>('label[for="files"]')!;
    expect(uploadLabel.querySelector('button')).toBeNull();
    expect(upload.querySelector('input[type="file"]')).toBe(uploadLabel.control);

    const mobileMenu = mountInHost(MainMenuMobile, {
      searchTitle: 'Search',
      searchLabel: 'Search',
    });
    await tick();
    expect(mobileMenu.querySelector('form[role="search"] input')?.getAttribute('aria-label')).toBe('Search');

    const header = mountInHost(Header, {
      mobileMenu: { searchTitle: 'Header search', searchLabel: 'Find' },
    });
    await tick();
    expect(header.querySelector('.sch-input input')?.getAttribute('aria-label')).toBe('Find');
  });

  it('closes the modal through its native lifecycle baseline', async () => {
    const host = mountInHost(Modal, { open: true, title: 'Preset modal' });
    await tick();

    const dialog = host.querySelector<HTMLDialogElement>('dialog')!;
    expect(dialog.open).toBe(true);
    dialog.querySelector('button')!.click();
    await tick();
    expect(dialog.open).toBe(false);
  });
});
