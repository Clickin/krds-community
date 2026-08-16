import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
  type JSX,
} from "solid-js";

// ====== Exported types ======

export interface HelpPanelTab {
  id: string;
  panelId: string;
  label: string;
  value?: string;
  disabled?: boolean;
}

export interface HelpPanelLink {
  id?: string;
  label: JSX.Element;
  href?: string;
  target?: string;
  title?: string;
  icon?: string;
}

export interface HelpPanelRelatedGroup {
  id?: string;
  title: JSX.Element;
  links: HelpPanelLink[];
}

export interface HelpPanelTask {
  id?: string;
  title: JSX.Element;
  current?: boolean;
  summary: JSX.Element;
  steps: JSX.Element[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface HelpPanelProps {
  id?: string;
  class?: string;
  className?: string;
  children?: JSX.Element;
  open?: boolean;
  defaultOpen?: boolean;
  defaultActiveTab?: string;
  tabs?: HelpPanelTab[];
  label?: JSX.Element;
  title?: JSX.Element;
  selectedLabel?: JSX.Element;
  helpTitle?: JSX.Element;
  helpDescription?: JSX.Element;
  downloadLinks?: HelpPanelLink[];
  relatedGroups?: HelpPanelRelatedGroup[];
  tutorialTitle?: JSX.Element;
  tutorialBackTitle?: string;
  backTitle?: string;
  externalTitle?: string;
  tasks?: HelpPanelTask[];
  stopLabel?: JSX.Element;
  collapseLabel?: JSX.Element;
  onOpenChange?: (open: boolean) => void;
  onActiveTabChange?: (tab: string) => void;
  onStop?: () => void;
  [key: string]: unknown;
}

// ====== Helpers (inlined from React _utils) ======

function SvgIcon({ name }: { name: string }) {
  return <i class={`svg-icon ${name}`} />;
}

function inlineSpacedText(
  value: JSX.Element | string | undefined,
  leading: boolean,
  trailing: boolean,
): JSX.Element | undefined {
  if (typeof value !== "string") return value as JSX.Element | undefined;
  const parts = value.split(" ");
  if (parts.length < 2) {
    const text = `${leading ? " " : ""}${value}${trailing ? " " : ""}`;
    return text as unknown as JSX.Element;
  }
  const className =
    [leading ? "krds-icon-space-left" : undefined, trailing ? "krds-icon-space-right" : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <>
      {leading && " "}
      {parts.map((part, index) => (
        <>
          {index > 0 && " "}
          <span class={className}>{part}</span>
        </>
      ))}
      {trailing && " "}
    </>
  );
}

// ====== Task disclosure subcomponent ======

function HelpTaskDisclosure({ task, panelId }: { task: HelpPanelTask; panelId: string }) {
  const [uncontrolledOpen, setUncontrolledOpen] = createSignal(task.defaultOpen ?? false);
  const open = () => task.open ?? uncontrolledOpen();
  let expandWrapRef: HTMLDivElement | undefined;
  createEffect(() => {
    if (expandWrapRef) {
      if (!open()) {
        expandWrapRef.setAttribute("inert", "");
      } else {
        expandWrapRef.removeAttribute("inert");
      }
    }
  });
  return (
    <div
      classList={{
        "krds-disclosure": true,
        "conts-expand-area": true,
        active: open(),
      }}
    >
      <button
        type="button"
        class="btn-conts-expand"
        aria-expanded={open()}
        aria-controls={panelId}
        onClick={() => {
          const next = !open();
          if (task.open === undefined) setUncontrolledOpen(next);
          task.onOpenChange?.(next);
        }}
      >
        {task.summary}
      </button>
      <div
        id={panelId}
        class="expand-wrap"
        ref={(element) => {
          expandWrapRef = element;
        }}
      >
        <div class="expand-in">
          <ul class="krds-info-list decimal" role="list">
            <For each={task.steps}>{(step, _index) => <li role="listitem">{step}</li>}</For>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ====== Main surface component ======

function HelpPanelSurface(rawProps: HelpPanelProps & { tutorialDefault?: boolean }) {
  const uid = createUniqueId();
  const merged = mergeProps(
    {
      tabs: [] as HelpPanelTab[],
      downloadLinks: [] as HelpPanelLink[],
      relatedGroups: [] as HelpPanelRelatedGroup[],
      tasks: [] as HelpPanelTask[],
      defaultOpen: false,
      tutorialDefault: false,
    },
    rawProps,
  );
  const [props, native] = splitProps(merged, [
    "id",
    "class",
    "className",
    "open",
    "children",
    "defaultOpen",
    "activeTab",
    "defaultActiveTab",
    "tabs",
    "label",
    "title",
    "selectedLabel",
    "helpTitle",
    "helpDescription",
    "downloadLinks",
    "relatedGroups",
    "tutorialTitle",
    "tutorialBackTitle",
    "backTitle",
    "externalTitle",
    "tasks",
    "stopLabel",
    "collapseLabel",
    "onOpenChange",
    "onActiveTabChange",
    "onStop",
    "tutorialDefault",
  ]);

  const panelId = () => props.id ?? `krds-help-panel-${uid}`;

  const initialTab =
    props.defaultActiveTab ??
    (props.tutorialDefault
      ? (props.tabs.find((tab) => tab.value === "tutorial")?.value ??
        props.tabs.find((tab) => tab.value === "tutorial")?.id)
      : undefined) ??
    props.tabs[0]?.value ??
    props.tabs[0]?.id ??
    "";

  const [uncontrolledOpen, setUncontrolledOpen] = createSignal(props.defaultOpen);
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = createSignal(initialTab);

  const open = () => props.open ?? uncontrolledOpen();
  const activeTab = () => props.activeTab ?? uncontrolledActiveTab();

  const setOpen = (next: boolean) => {
    if (props.open === undefined) setUncontrolledOpen(next);
    props.onOpenChange?.(next);
  };

  const setActiveTab = (next: string) => {
    if (props.activeTab === undefined) setUncontrolledActiveTab(next);
    props.onActiveTabChange?.(next);
  };

  return (
    <>
      <button
        type="button"
        id={`${panelId()}-trigger`}
        class="krds-btn small tertiary btn-help-panel expand btn-help-exec"
        aria-controls={panelId()}
        aria-expanded={open()}
        onClick={() => setOpen(true)}
      >
        <SvgIcon name="ico-fold" /> {props.label ?? props.title ?? "도움 패널"}
      </button>
      <div
        {...(native as Record<string, any>)}
        id={panelId()}
        hidden={!open()}
        classList={{
          "krds-help-panel": true,
          expand: open(),
          [props.className ?? ""]: !!props.className,
        }}
      >
      <div class="help-panel-wrap" tabIndex={open() ? 0 : undefined}>
        <div class="help-conts-area">
          <div class="krds-tab-area layer">
            <div class="tab line">
              <ul role="tablist">
                <For each={props.tabs}>
                  {(tab) => {
                    const tabValue = tab.value ?? tab.id;
                    const active = () => {
                      const av = activeTab();
                      return tabValue === av || tabValue.replace(/-tab$/, "") === av;
                    };
                    return (
                      <li role="presentation" classList={{ active: active() }}>
                        <button
                          id={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={active()}
                          aria-controls={tab.panelId}
                          tabIndex={active() ? 0 : -1}
                          class="btn-tab"
                          disabled={tab.disabled}
                          onClick={() => {
                            if (!tab.disabled) setActiveTab(tabValue);
                          }}
                        >
                          {tab.label}
                          {active() && props.selectedLabel ? (
                            <i class="sr-only created">{` ${props.selectedLabel}`}</i>
                          ) : null}
                        </button>
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
            <div class="tab-conts-wrap">
              <For each={props.tabs}>
                {(tab, tabIndex) => {
                  const tabValue = tab.value ?? tab.id;
                  const active = () => {
                    const av = activeTab();
                    return tabValue === av || tabValue.replace(/-tab$/, "") === av;
                  };
                  const helpTab = () =>
                    tabValue === "help" || (tabIndex() === 0 && tabValue !== "tutorial");
                  return (
                    <section
                      id={tab.panelId}
                      role="tabpanel"
                      aria-labelledby={tab.id}
                      hidden={!active()}
                      classList={{
                        "tab-conts": true,
                        active: active(),
                      }}
                    >
                      <Show when={tab.label}>
                        <h3 class="sr-only">{tab.label}</h3>
                      </Show>
                      <div class="help-conts-area-inner">
                        <Show when={helpTab()}>
                          <div class="conts-area help-conts">
                            <div class="conts-wrap">
                              <h4 class="help-title">
                                {inlineSpacedText(props.helpTitle, false, true)}
                                <span class="krds-btn medium icon">
                                  <span class="sr-only">{props.label ?? props.title}</span>
                                  <SvgIcon name="ico-help" />
                                </span>
                              </h4>
                              <div class="conts-desc">
                                <p>{props.helpDescription ?? props.children}</p>
                              </div>
                              <ul class="link-list">
                                <For each={props.downloadLinks}>
                                  {(link) => (
                                    <li>
                                      <a
                                        href={link.href ?? "#"}
                                        target={link.target}
                                        title={link.title ?? props.externalTitle}
                                        class="krds-btn xsmall link basic"
                                      >
                                        {link.label + " "}
                                        <SvgIcon name="ico-go" />
                                      </a>
                                    </li>
                                  )}
                                </For>
                              </ul>
                            </div>
                          </div>
                          <div class="conts-area related-service">
                            <For each={props.relatedGroups}>
                              {(group) => (
                                <div class="conts-wrap">
                                  <h4 class="help-title">{group.title}</h4>
                                  <ul class="link-list">
                                    <For each={group.links}>
                                      {(link) => {
                                        const rawIcon = link.icon;
                                        const isTrailingOnly = rawIcon === "ico-angle right";
                                        const icon =
                                          !isTrailingOnly && rawIcon
                                            ? rawIcon.startsWith("ico-")
                                              ? rawIcon
                                              : `ico-${rawIcon}`
                                            : undefined;
                                        const hasLeadingIcon = !!icon && !isTrailingOnly;
                                        const hasTrailingIcon = !icon || isTrailingOnly;
                                        return (
                                          <li>
                                            <a
                                              href={link.href ?? "#"}
                                              class="krds-btn xsmall link basic"
                                            >
                                              {hasLeadingIcon ? <SvgIcon name={icon!} /> : null}
                                              {hasLeadingIcon
                                                ? " " + link.label
                                                : link.label + " "}
                                              {hasTrailingIcon ? (
                                                <SvgIcon name="ico-angle right" />
                                              ) : null}
                                            </a>
                                          </li>
                                        );
                                      }}
                                    </For>
                                  </ul>
                                </div>
                              )}
                            </For>
                          </div>
                        </Show>
                        <Show when={!helpTab()}>
                          <div class="conts-area">
                            <h4 class="help-title">
                              <a href="#;" title={props.tutorialBackTitle ?? props.backTitle}>
                                {props.tutorialTitle}
                              </a>
                            </h4>
                            <ul class="coach-help-process">
                              <For each={props.tasks}>
                                {(task, taskIndex) => (
                                  <li>
                                    <h4
                                      classList={{
                                        tit: true,
                                        current: task.current,
                                      }}
                                    >
                                      {task.title}
                                    </h4>
                                    <HelpTaskDisclosure
                                      task={task}
                                      panelId={`krds-help-task-${uid}-${taskIndex()}`}
                                    />
                                  </li>
                                )}
                              </For>
                            </ul>
                          </div>
                          <div class="help-panel-action">
                            <button
                              type="button"
                              class="krds-btn medium secondary coach-btn-stop"
                              onClick={props.onStop}
                            >
                              {props.stopLabel}
                            </button>
                          </div>
                        </Show>
                      </div>
                    </section>
                  );
                }}
              </For>
            </div>
          </div>
          <button
            type="button"
            class="krds-btn small tertiary btn-help-panel fold"
            onClick={() => setOpen(false)}
          >
            <span class="sr-only">{props.label ?? props.title}</span>
            {inlineSpacedText(props.collapseLabel ?? props.label ?? props.title, true, true)}
            <SvgIcon name="ico-angle right" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// ====== Public exports ======

export function HelpPanel(props: HelpPanelProps) {
  return <HelpPanelSurface {...props} label={props.label} />;
}

export function TutorialPanel(props: HelpPanelProps) {
  return (
    <HelpPanelSurface
      {...props}
      label={props.label ?? "튜토리얼 패널"}
      tutorialDefault={true}
    />
  );
}
