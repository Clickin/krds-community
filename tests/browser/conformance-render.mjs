import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import * as Components from "@krds-community/react";

const exportName = (id) =>
  id
    .split("-")
    .map((part) => `${part.charAt(0).toLocaleUpperCase("en-US")}${part.slice(1)}`)
    .join("");

const serializeDom = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    return text ? { text } : null;
  }
  if (!(node instanceof Element) || node.matches("script, style")) return null;
  return {
    tag: node.tagName.toLocaleLowerCase("en-US"),
    attributes: Object.fromEntries([...node.attributes].map((a) => [a.name, a.value])),
    children: [...node.childNodes].map(serializeDom).filter(Boolean),
  };
};

describe("in-browser framework render (no Node<->browser round-trips)", () => {
  it("mounts a React KRDS button and captures DOM + computed style in-browser", async () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const Component = Components[exportName("button")];
    flushSync(() => createRoot(root).render(createElement(Component, { variant: "primary" })));
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const button = root.querySelector("button");
    const snapshot = serializeDom(root);
    const style = getComputedStyle(button);
    const rect = button.getBoundingClientRect();

    // eslint-disable-next-line no-console
    console.log(
      `[in-browser] snapshot=${JSON.stringify(snapshot)} style.display=${style.display} ` +
        `size=${Math.round(rect.width)}x${Math.round(rect.height)}`,
    );

    if (!snapshot || snapshot.tag !== "div" || !Object.keys(snapshot.attributes).length)
      throw new Error("React did not render expected DOM");
    if (rect.width <= 0 || rect.height <= 0) throw new Error("Computed geometry empty");

    root.remove();
  });
});
