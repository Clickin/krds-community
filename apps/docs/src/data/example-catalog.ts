import catalogData from "@krds-community/conformance-host/fixtures.json";
import type { FixtureCatalog } from "@krds-community/conformance-host/protocol";

import { componentNavigation } from "./component-meta";

const fixtureCatalog = catalogData as FixtureCatalog;
// Docs catalog ids that predate the manifest dedupe: the aggregate `radio`/`switch`
// manifests were merged into the official-file manifests (radio-button, toggle-switch).
const fixtureAlias: Record<string, string> = {
  radio: "radio-button",
  switch: "toggle-switch",
};
export const componentExamples = componentNavigation.map((component) => {
  const fixture = fixtureCatalog.fixtures.find(
    (candidate) => candidate.componentId === (fixtureAlias[component.id] ?? component.id),
  );
  if (!fixture) throw new Error(`Missing fixture for docs component: ${component.id}`);
  return { ...component, fixture };
});
