import type { StorybookConfig } from "@storybook/html-vite";

const frameworks = [
  { id: "react", label: "React", port: 6006 },
  { id: "vue", label: "Vue", port: 6007 },
  { id: "svelte", label: "Svelte", port: 6008 },
  { id: "solid", label: "SolidJS", port: 6009 },
  { id: "angular", label: "Angular", port: 6010 },
] as const;
const developmentBase = process.env.STORYBOOK_COMPOSE_BASE;

const config: StorybookConfig = {
  stories: ["./stories/**/*.stories.ts"],
  addons: [],
  framework: "@storybook/html-vite",
  refs: (_config, { configType }) =>
    Object.fromEntries(
      frameworks.map(({ id, label, port }) => [
        id,
        {
          title: label,
          url:
            configType === "DEVELOPMENT"
              ? developmentBase
                ? `${developmentBase}/${id}/`
                : `http://${process.env.STORYBOOK_PUBLIC_HOST ?? "localhost"}:${port}/`
              : `./${id}/`,
          expanded: id === "react",
        },
      ]),
    ),
  viteFinal: async (viteConfig) =>
    developmentBase ? { ...viteConfig, base: `${developmentBase}/` } : viteConfig,
};

export default config;
