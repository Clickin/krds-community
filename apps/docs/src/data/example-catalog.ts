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
export const componentExamples = componentNavigation.flatMap((component) => {
  const fixture = fixtureCatalog.fixtures.find(
    (candidate) => candidate.componentId === (fixtureAlias[component.id] ?? component.id),
  );
  // no-upstream 컴포넌트(커뮤니티 구현)는 conformance fixture가 없으므로 카탈로그에서 제외한다.
  if (!fixture) return [];
  return [{ ...component, fixture }];
});
