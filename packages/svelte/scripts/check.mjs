import { compile } from "svelte/compiler";
import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { render } from "svelte/server";

const files = (await readdir("src")).filter((file) => file.endsWith(".svelte"));
for (const file of files) {
  const source = await readFile(`src/${file}`, "utf8");
  compile(source, { generate: "client", filename: file });
  compile(source, { generate: "server", filename: file });
}

const recipesUrl = import.meta.resolve("@krds-community/recipes");
const sharedUrl = pathToFileURL(`${process.cwd()}/src/lib/shared.js`).href;

async function renderSsr(moduleName, props) {
  const source = await readFile(`src/${moduleName}.svelte`, "utf8");
  const serverCode = compile(source, {
    generate: "server",
    filename: `${moduleName}.svelte`,
  })
    .js.code.replaceAll(
      "'svelte/internal/server'",
      `'${pathToFileURL(`${process.cwd()}/node_modules/svelte/src/internal/server/index.js`).href}'`,
    )
    .replaceAll("'./lib/shared.js'", `'${sharedUrl}'`)
    .replaceAll("'@krds-community/recipes'", `'${recipesUrl}'`);
  const { default: Component } = await import(
    `data:text/javascript;base64,${Buffer.from(serverCode).toString("base64")}`
  );
  return render(Component, { props }).body;
}

const badgeMarkup = await renderSsr("Badge", { label: "check" });
const modalMarkup = await renderSsr("Modal", { open: true, title: "check" });
const selectMarkup = await renderSsr("Select", {
  class: "consumer-select",
  modelValue: "second",
  controlState: "error",
  options: [
    { value: "first", label: "First" },
    { value: "second", label: "Second" },
  ],
});
const tabMarkup = await renderSsr("Tab", {
  class: "consumer-tabs",
  defaultValue: "first",
  tabs: [
    { id: "first", label: "First" },
    { id: "second", label: "Second" },
  ],
});

if (!badgeMarkup.includes("krds-badge")) throw new Error("Badge SSR branch failed");
if (
  !modalMarkup.includes("<section") ||
  !modalMarkup.includes("krds-modal fade in shown") ||
  !modalMarkup.includes('role="dialog"')
)
  throw new Error("Modal SSR state failed");
if (!selectMarkup.includes('value="second" selected=""'))
  throw new Error("Select SSR state failed");
if (!selectMarkup.includes('class="krds-form-select is-error consumer-select"'))
  throw new Error("Select SSR recipe failed");
if (
  !tabMarkup.includes('class="krds-tab-area layer consumer-tabs"') ||
  !tabMarkup.includes('class="tab line full"') ||
  !tabMarkup.includes('class="active"') ||
  !tabMarkup.includes('class="btn-tab"')
)
  throw new Error("Tab SSR recipe failed");

console.log(`Compiled ${files.length} Svelte rune components for client and SSR.`);
