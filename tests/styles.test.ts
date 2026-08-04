import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

describe("@krds-community/styles distribution", () => {
  it("bundles every official KRDS CSS icon without runtime traffic to krds.go.kr", async () => {
    const buildScript = pathToFileURL(resolve(root, "packages/styles/scripts/build.mjs"));
    await import(`${buildScript.href}?test=${Date.now().toString(36)}`);

    const dist = resolve(root, "packages/styles/dist");
    const css = await readFile(resolve(dist, "index.css"), "utf8");
    expect(css).not.toMatch(/https?:\/\/(?:www\.)?krds\.go\.kr/i);

    const referencedIcons = [...css.matchAll(/url\(['"]?\.\/assets\/icons\/([^'")]+)['"]?\)/g)]
      .map((match) => match[1])
      .filter((icon): icon is string => Boolean(icon));
    const bundledIcons = new Set(await readdir(resolve(dist, "assets/icons")));
    expect(referencedIcons.length).toBeGreaterThan(0);
    expect(referencedIcons.every((icon) => bundledIcons.has(icon))).toBe(true);
  });
});
