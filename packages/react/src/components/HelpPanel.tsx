import { useId, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "@krds-community/recipes";
import { SvgIcon, inlineSpacedText } from "./_utils.js";

export interface HelpPanelTab {
  id: string;
  panelId: string;
  label: string;
  value?: string;
  disabled?: boolean;
}
export interface HelpPanelLink {
  id?: string;
  label: ReactNode;
  href?: string;
  target?: string;
  title?: string;
  icon?: string;
}
export interface HelpPanelRelatedGroup {
  id?: string;
  title: ReactNode;
  links: HelpPanelLink[];
}
export interface HelpPanelTask {
  id?: string;
  title: ReactNode;
  current?: boolean;
  summary: ReactNode;
  steps: ReactNode[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface HelpPanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "title" | "onChange"
> {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  activeTab?: string;
  defaultActiveTab?: string;
  tabs?: HelpPanelTab[];
  label?: ReactNode;
  title?: ReactNode;
  selectedLabel?: ReactNode;
  helpTitle?: ReactNode;
  helpDescription?: ReactNode;
  downloadLinks?: HelpPanelLink[];
  relatedGroups?: HelpPanelRelatedGroup[];
  tutorialTitle?: ReactNode;
  tutorialBackTitle?: string;
  backTitle?: string;
  externalTitle?: string;
  tasks?: HelpPanelTask[];
  stopLabel?: ReactNode;
  collapseLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onActiveTabChange?: (tab: string) => void;
  onStop?: () => void;
}

export function HelpTaskDisclosure({ task, panelId }: { task: HelpPanelTask; panelId: string }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(task.defaultOpen ?? false);
  const open = task.open ?? uncontrolledOpen;
  return (
    <div className={cx("krds-disclosure", "conts-expand-area", open && "active")}>
      <button
        type="button"
        className="btn-conts-expand"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          if (task.open === undefined) setUncontrolledOpen(next);
          task.onOpenChange?.(next);
        }}
      >
        {task.summary}
      </button>
      <div id={panelId} className="expand-wrap" inert={!open}>
        <div className="expand-in">
          <ul className="krds-info-list decimal" role="list">
            {task.steps.map((step, index) => (
              <li role="listitem" key={index}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function HelpPanelSurface({
  tutorialDefault = false,
  children,
  open: controlledOpen,
  defaultOpen = false,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  tabs = [],
  label,
  title,
  selectedLabel,
  helpTitle,
  helpDescription,
  downloadLinks = [],
  relatedGroups = [],
  tutorialTitle,
  tutorialBackTitle,
  backTitle,
  externalTitle,
  tasks = [],
  stopLabel,
  collapseLabel,
  onOpenChange,
  onActiveTabChange,
  onStop,
  className,
  ref,
  id: providedId,
  ...props
}: HelpPanelProps & { tutorialDefault?: boolean } & { ref?: Ref<HTMLDivElement> }) {
  const generatedId = useId();
  const panelId = providedId ?? `${generatedId}-panel`;
  const triggerLabel = label ?? "도움 패널";
  const initialTab =
    defaultActiveTab ??
    (tutorialDefault
      ? (tabs.find((tab) => tab.value === "tutorial")?.value ??
        tabs.find((tab) => tab.value === "tutorial")?.id)
      : undefined) ??
    tabs[0]?.value ??
    tabs[0]?.id ??
    "";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState(initialTab);
  const open = controlledOpen ?? uncontrolledOpen;
  const activeTab = controlledActiveTab ?? uncontrolledActiveTab;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const setActiveTab = (next: string) => {
    if (controlledActiveTab === undefined) setUncontrolledActiveTab(next);
    onActiveTabChange?.(next);
  };
  return (
    <>
      <button
        type="button"
        id={`${panelId}-trigger`}
        className="krds-btn small tertiary btn-help-panel expand btn-help-exec"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SvgIcon name="ico-fold" /> {triggerLabel}
      </button>
      <div
        {...props}
        ref={ref}
        id={panelId}
        hidden={!open}
        className={cx("krds-help-panel", open && "expand", className)}
      >
        <div className="help-panel-wrap" tabIndex={open ? 0 : undefined}>
        <div className="help-conts-area">
          <div className="krds-tab-area layer">
            <div className="tab line">
              <ul role="tablist">
                {tabs.map((tab) => {
                  const tabValue = tab.value ?? tab.id;
                  const active = tabValue === activeTab;
                  return (
                    <li className={active ? "active" : undefined} role="presentation" key={tab.id}>
                      <button
                        id={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls={tab.panelId}
                        tabIndex={active ? 0 : -1}
                        className="btn-tab"
                        disabled={tab.disabled}
                        onClick={() => {
                          if (!tab.disabled) setActiveTab(tabValue);
                        }}
                      >
                        {tab.label}
                        {active && selectedLabel ? (
                          <i className="sr-only created"> {selectedLabel}</i>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="tab-conts-wrap">
              {tabs.map((tab, tabIndex) => {
                const tabValue = tab.value ?? tab.id;
                const active = tabValue === activeTab;
                const helpTab = tabValue === "help" || (tabIndex === 0 && tabValue !== "tutorial");
                return (
                  <section
                    id={tab.panelId}
                    role="tabpanel"
                    aria-labelledby={tab.id}
                    hidden={!active}
                    className={cx("tab-conts", active && "active")}
                    key={tab.panelId}
                  >
                    <h3 className="sr-only">{tab.label}</h3>
                    <div className="help-conts-area-inner">
                      {helpTab ? (
                        <>
                          <div className="conts-area help-conts">
                            <div className="conts-wrap">
                              <h4 className="help-title">
                                {inlineSpacedText(helpTitle, false, true)}
                                <span className="krds-btn medium icon">
                                  <span className="sr-only">{label ?? title}</span>
                                  <SvgIcon name="ico-help" />
                                </span>
                              </h4>
                              <div className="conts-desc">
                                <p>{helpDescription ?? children}</p>
                              </div>
                              <ul className="link-list">
                                {downloadLinks.map((link, index) => (
                                  <li key={link.id ?? index}>
                                    <a
                                      href={link.href ?? "#"}
                                      target={link.target}
                                      title={link.title ?? externalTitle}
                                      className="krds-btn xsmall link basic"
                                    >
                                      {link.label + " "}
                                      <SvgIcon name="ico-go" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="conts-area related-service">
                            {relatedGroups.map((group, groupIndex) => (
                              <div className="conts-wrap" key={group.id ?? groupIndex}>
                                <h4 className="help-title">{group.title}</h4>
                                <ul className="link-list">
                                  {group.links.map((link, linkIndex) => {
                                    const icon = link.icon
                                      ? link.icon.startsWith("ico-")
                                        ? link.icon
                                        : `ico-${link.icon}`
                                      : undefined;
                                    return (
                                      <li key={link.id ?? linkIndex}>
                                        <a
                                          href={link.href ?? "#"}
                                          className="krds-btn xsmall link basic"
                                        >
                                          {icon ? <SvgIcon name={icon} /> : null}
                                          {icon ? " " + link.label + " " : link.label + " "}
                                          {!icon ? <SvgIcon name="ico-angle right" /> : null}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="conts-area">
                            <h4 className="help-title">
                              <a href="#;" title={tutorialBackTitle ?? backTitle}>
                                {tutorialTitle}
                              </a>
                            </h4>
                            <ul className="coach-help-process">
                              {tasks.map((task, taskIndex) => (
                                <li key={task.id ?? taskIndex}>
                                  <h4 className={cx("tit", task.current && "current")}>
                                    {task.title}
                                  </h4>
                                  <HelpTaskDisclosure
                                    task={task}
                                    panelId={`krds-help-task-${generatedId}-${taskIndex}`}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="help-panel-action">
                            <button
                              type="button"
                              className="krds-btn medium secondary coach-btn-stop"
                              onClick={onStop}
                            >
                              {stopLabel}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="krds-btn small tertiary btn-help-panel fold"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">{label ?? title}</span>
            {inlineSpacedText(collapseLabel ?? label ?? title, true, true)}
            <SvgIcon name="ico-angle right" />
          </button>
        </div>
        </div>
      </div>
    </>
  );
}

export function HelpPanel({ ref, ...props }: HelpPanelProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <HelpPanelSurface
      {...props}
      label={props.label ?? "도움 패널"}
      {...(ref !== undefined ? { ref } : {})}
    />
  );
}
