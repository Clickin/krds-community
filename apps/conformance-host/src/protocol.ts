export type Framework = "react" | "vue" | "svelte" | "solid" | "angular" | "astro";

export type FixtureLayoutContext = "content-inner" | "viewport-height";

export interface FixtureAction {
  action: string;
  target?: string;
  key?: string;
  value?: string | number | boolean;
}

export interface FixtureState {
  id: string;
  setup: FixtureAction[];
  props: Record<string, unknown>;
  expectations: Record<string, unknown>;
}

export interface FixtureDefinition {
  id: string;
  componentId: string;
  sourcePath: string;
  sourceSelector: string;
  sourceIndex: number;
  sourceAncestorSelector?: string;
  contractAncestorSelector?: { upstream: string; framework: string };
  visualSelector?: string;
  visualAncestorSelector?: string;
  layoutContext?: FixtureLayoutContext;
  viewport: { name: string; width: number; height: number };
  props: Record<string, unknown>;
  states: FixtureState[];
  expectations: Record<string, unknown>;
  comparisons: { dom: string; visual: string; accessibility: string };
  contract: {
    semanticElement: string;
    accessibleRole?: string;
    requiredAttributes: Record<string, unknown>;
    forbiddenAttributes: string[];
    accessibility: string[];
  };
  errata: string[];
}

export const fixtureRootAttributes = ({
  layoutContext,
}: Pick<FixtureDefinition, "layoutContext">) => {
  if (layoutContext === "content-inner") {
    return { class: "inner", "data-layout-context": layoutContext } as const;
  }
  if (layoutContext === "viewport-height") {
    return { "data-layout-context": layoutContext } as const;
  }
  return {};
};

export interface FixtureCatalog {
  upstream: {
    repository: string;
    ref: string;
    commit: string;
    packageVersion: string;
    snapshotIntegrity: string;
  };
  fixtures: FixtureDefinition[];
}

export interface MountedFixture {
  update(props: Record<string, unknown>): void | Promise<void>;
  dispose(): void | Promise<void>;
}

export interface FrameworkAdapter {
  mount(
    target: HTMLElement,
    componentId: string,
    props: Record<string, unknown>,
  ): MountedFixture | Promise<MountedFixture>;
}

export interface RuntimeEvent {
  type: string;
  target: string;
  value?: string;
  checked?: boolean;
}

export interface ConformanceRuntime {
  ready: boolean;
  framework: Framework;
  fixture: FixtureDefinition;
  upstream: FixtureCatalog["upstream"];
  rootSelector: "#fixture-root";
  stateId?: string;
  setState(stateId: string): Promise<FixtureAction[]>;
  reset(): Promise<void>;
  getEvents(): RuntimeEvent[];
  dispose(): Promise<void>;
}

declare global {
  interface Window {
    __KRDS_CONFORMANCE__?: ConformanceRuntime;
  }
}
