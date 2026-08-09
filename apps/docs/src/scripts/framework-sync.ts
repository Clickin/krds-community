/* ---------------------------------------------------------------------------
 * Shared framework-tab synchronization for the docs site.
 *
 * One module, one localStorage key (`starlight-synced-tabs__framework`, the
 * official Starlight convention) so every `[data-framework-tabs]` tablist on
 * the page — FrameworkPreview, FrameworkCodeTabs — follows the same
 * selection. Stored values are framework ids ('react', 'vue', …), not
 * labels: ids are stable and unambiguous.
 *
 * Listeners are attached once at the document level (delegation), so tabsets
 * added later by Astro view transitions work without re-wiring.
 * --------------------------------------------------------------------------- */

const SYNC_KEY = 'framework';
const STORAGE_KEY = `starlight-synced-tabs__${SYNC_KEY}`;

const readStored = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStored = (fw: string): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, fw);
  } catch {
    /* storage unavailable (private mode etc.) — in-page sync still works */
  }
};

/** Apply `fw` to every framework tablist on the page. Returns false when no tablist offers that framework. */
export function selectFramework(fw: string): boolean {
  let found = false;
  document.querySelectorAll<HTMLElement>('[data-framework-tabs]').forEach((tablist) => {
    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"][data-framework]'));
    const target = tabs.find((tab) => tab.dataset.framework === fw);
    if (!target) return;
    found = true;
    tabs.forEach((tab) => {
      const selected = tab === target;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const container =
      tablist.closest<HTMLElement>('[data-framework-preview], [data-code-tabs]') ??
      tablist.parentElement;
    container
      ?.querySelectorAll<HTMLElement>(
        '[data-source-panel], [data-code-panel], [data-preview-panel]',
      )
      .forEach((panel) => {
        panel.hidden = panel.dataset.framework !== fw;
      });
  });
  document.querySelectorAll<HTMLElement>('[data-astro-note]').forEach((note) => {
    note.toggleAttribute('hidden', fw !== 'astro');
  });
  return found;
}

const onTabClick = (event: Event): void => {
  const tab = (event.target as Element).closest<HTMLElement>('[role="tab"][data-framework]');
  const fw = tab?.dataset.framework;
  if (!tab || !fw) return;
  selectFramework(fw);
  writeStored(fw);
};

const onTabKeydown = (event: KeyboardEvent): void => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tab = (event.target as Element).closest<HTMLElement>('[role="tab"][data-framework]');
  const tablist = tab?.closest<HTMLElement>('[data-framework-tabs]');
  const tabs = tablist ? Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"][data-framework]')) : [];
  if (!tab || tabs.length === 0) return;
  event.preventDefault();
  const index = tabs.indexOf(tab);
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  const target = tabs[next];
  const fw = target?.dataset.framework;
  if (target && fw) {
    target.focus();
    selectFramework(fw);
    writeStored(fw);
  }
};

const onStorage = (event: StorageEvent): void => {
  if (event.key === STORAGE_KEY && event.newValue) selectFramework(event.newValue);
};

/** Idempotent: wires document-level listeners once and restores the saved framework. */
export function initFrameworkSync(): void {
  if (document.documentElement.dataset.frameworkSyncReady === 'true') return;
  document.documentElement.dataset.frameworkSyncReady = 'true';
  document.addEventListener('click', onTabClick);
  document.addEventListener('keydown', onTabKeydown);
  window.addEventListener('storage', onStorage);
  restore();
}

/** Apply the persisted framework choice (no-op when nothing is stored). */
export function restore(): void {
  const stored = readStored();
  if (stored) selectFramework(stored);
}

initFrameworkSync();
document.addEventListener('astro:page-load', () => {
  initFrameworkSync();
  restore();
});
