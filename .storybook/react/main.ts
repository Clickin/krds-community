import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (config) => ({
    ...config,
    base: process.env.STORYBOOK_COMPOSE_BASE
      ? `${process.env.STORYBOOK_COMPOSE_BASE}/react/`
      : config.base,
    server: {
      ...config.server,
      headers: {
        ...config.server?.headers,
        "Access-Control-Allow-Origin": `http://${process.env.STORYBOOK_PUBLIC_HOST ?? "localhost"}:6005`,
        "Access-Control-Allow-Credentials": "true",
      },
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@krds-community/react/extra": resolve("packages/react/dist/extra.js"),
        "@krds-community/react": resolve("packages/react/dist/index.js"),
        "@krds-community/styles/css": resolve("packages/styles/dist/index.css"),
      },
    },
  }),
};

export default config;
