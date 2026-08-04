import type { StorybookConfig } from "@storybook/vue3-vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.ts"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/vue3-vite", options: {} },
  viteFinal: async (config) => ({
    ...config,
    base: process.env.STORYBOOK_COMPOSE_BASE
      ? `${process.env.STORYBOOK_COMPOSE_BASE}/vue/`
      : config.base,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@krds-community/vue/extra": resolve("packages/vue/dist/extra.js"),
        "@krds-community/vue": resolve("packages/vue/dist/index.js"),
        "@krds-community/styles/css": resolve("packages/styles/dist/index.css"),
      },
    },
  }),
};

export default config;
