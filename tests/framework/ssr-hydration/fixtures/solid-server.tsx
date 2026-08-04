import { generateHydrationScript, renderToString } from "solid-js/web";
import { SolidHydrationFixture } from "./SolidHydrationFixture.tsx";

export function renderSolidFixture() {
  return `${generateHydrationScript()}${renderToString(() => <SolidHydrationFixture />)}`;
}
