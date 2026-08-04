import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const currentWorkingDirectory = process.cwd();
const root = currentWorkingDirectory.endsWith("/packages/styles")
  ? currentWorkingDirectory
  : join(currentWorkingDirectory, "packages/styles");
const repositoryRoot = join(root, "../..");
const dist = join(root, "dist");
const iconDirectory = join(dist, "assets/icons");
const upstreamIconDirectory = join(
  repositoryRoot,
  "upstream/krds-html/resources/img/component/icon",
);
const remoteIconPrefix = "https://www.krds.go.kr/resources/img/component/icon/";
await mkdir(iconDirectory, { recursive: true });
const upstreamCss = await readFile(
  join(repositoryRoot, "upstream/krds-html/resources/cdn/krds.min.css"),
  "utf8",
);
const iconNames = [
  ...new Set(
    [
      ...upstreamCss.matchAll(
        /url\(['"]?(https:\/\/www\.krds\.go\.kr\/resources\/img\/component\/icon\/([^'")]+))['"]?\)/g,
      ),
    ].map((match) => match[2]),
  ),
];
for (const iconName of iconNames) {
  await copyFile(join(upstreamIconDirectory, iconName), join(iconDirectory, iconName));
}
// Wrap the official KRDS component CSS in `@layer components` so Tailwind
// CSS utilities (`@layer utilities`, declared after components) can override
// component styles — consumers can recolor components with e.g. `bg-red-500`
// instead of being locked to the built-in variants. `@charset` must stay first.
const charset = upstreamCss.match(/^@charset[^;]+;/)?.[0] ?? "";
const body = upstreamCss.slice(charset.length).replaceAll(remoteIconPrefix, "./assets/icons/");
const css = `${charset}@layer components {\n${body}\n}\n`;
await writeFile(join(dist, "index.css"), css);
await copyFile(join(repositoryRoot, "upstream/upstream.lock.json"), join(dist, "provenance.json"));
if (process.argv.includes("--check")) {
  console.log("styles source is generated from the pinned official KRDS CSS snapshot");
}
