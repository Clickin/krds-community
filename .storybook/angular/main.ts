import type { StorybookConfig } from "@storybook/angular";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.ts"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/angular", options: {} },
  webpackFinal: async (config) => ({
    ...config,
    output: {
      ...config.output,
      ...(process.env.STORYBOOK_COMPOSE_BASE
        ? { publicPath: `${process.env.STORYBOOK_COMPOSE_BASE}/angular/` }
        : {}),
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@krds-community/angular/extra": resolve("packages/angular/dist/extra.js"),
        "@krds-community/angular": resolve("packages/angular/dist/index.js"),
        "@krds-community/styles/css": resolve("packages/styles/dist/index.css"),
        "@krds-community/tokens/css": resolve("packages/tokens/dist/krds.css"),
      },
    },
  }),
};

export default config;
