import type { StorybookConfig } from "@storybook/html-vite";
import { resolve } from "node:path";
import solid from "vite-plugin-solid";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.ts", "./stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/html-vite", options: {} },
  viteFinal: async (config) => ({
    ...config,
    base: process.env.STORYBOOK_COMPOSE_BASE
      ? `${process.env.STORYBOOK_COMPOSE_BASE}/solid/`
      : config.base,
    plugins: [...(config.plugins ?? []), solid()],
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@krds-community/solid/extra": resolve("packages/solid/src/extra.tsx"),
        "@krds-community/solid": resolve("packages/solid/dist/index.js"),
        "@krds-community/styles/css": resolve("packages/styles/dist/index.css"),
      },
    },
  }),
};

export default config;
