import type { StorybookConfig } from "@storybook/svelte-vite";
import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.ts"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/svelte-vite", options: { docgen: false } },
  viteFinal: async (config) => ({
    ...config,
    base: process.env.STORYBOOK_COMPOSE_BASE
      ? `${process.env.STORYBOOK_COMPOSE_BASE}/svelte/`
      : config.base,
    plugins: [svelte(), ...(config.plugins ?? [])],
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@krds-community/svelte": resolve("packages/svelte/dist/index.js"),
        "@krds-community/styles/css": resolve("packages/styles/dist/index.css"),
      },
    },
  }),
};

export default config;
