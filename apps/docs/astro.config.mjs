import remarkFrameworkPreview from "./remark-framework-preview.mjs";
import angular from "@analogjs/astro-angular";
import react from "@astrojs/react";
import solid from "@astrojs/solid-js";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { categoryGroups } from "./src/data/component-meta";
import { krdsShikiHighContrast, krdsShikiLight } from "./src/theme/krds-shiki";

const site = process.env.SITE_URL ?? "http://localhost:4321";
const base = process.env.BASE_PATH ?? "/";
const faviconLink = `${base.replace(/\/$/, "")}/favicon.svg`;

export default defineConfig({
  site,
  base,
  integrations: [
    react(),
    vue({ include: ["**/*.vue"] }),
    svelte({ include: ["**/*.svelte"] }),
    solid(),
    angular({ useAngularHydration: true }),
    starlight({
      title: "KRDS Community",
      favicon: faviconLink,
      description: "KRDS 프레임워크 구현 문서와 검증 결과를 제공하는 커뮤니티 사이트입니다.",
      defaultLocale: "root",
      locales: {
        root: { label: "한국어", lang: "ko" },
      },
      expressiveCode: {
        themes: [krdsShikiLight, krdsShikiHighContrast],
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/KRDS-community/krds-community",
        },
      ],
      components: {
        Header: "./src/components/starlight/Header.astro",
        Footer: "./src/components/starlight/Footer.astro",
      },
      sidebar: [
        {
          label: "시작하기",
          items: [
            { label: "KRDS Community 소개", link: "/getting-started/introduction/" },
            { label: "빠른 시작", link: "/getting-started/installation/" },
            { label: "설치 방법", link: "/getting-started/installing/" },
            { label: "KRDS CLI", link: "/getting-started/cli/" },
            { label: "복사한 컴포넌트 업데이트", link: "/getting-started/copy-paste-migration/" },
          ],
        },
        {
          label: "디자인 스타일",
          collapsed: true,
          items: [{ autogenerate: { directory: "design" } }],
        },
        {
          label: "컴포넌트",
          collapsed: true,
          items: [
            { label: "전체 컴포넌트", link: "/components/" },
            ...categoryGroups.map((g) => ({
              label: g.label,
              // Each category sub-group keeps its own open state and starts
              // collapsed (Starlight still auto-opens the one containing the
              // current page).
              collapsed: true,
              items: [{ autogenerate: { directory: `components/${g.category}` } }],
            })),
            {
              label: "공식 사이트 전용(미구현)",
              collapsed: true,
              items: [{ autogenerate: { directory: "components/live-only" } }],
            },
          ],
        },
        {
          label: "서비스 패턴",
          collapsed: true,
          items: [{ autogenerate: { directory: "service-patterns" } }],
        },
        {
          label: "기본 패턴",
          collapsed: true,
          items: [{ autogenerate: { directory: "basic-patterns" } }],
        },
        { label: "Storybook", link: "/storybook/index.html" },
        { label: "KRDS 공식 홈페이지", link: "https://www.krds.go.kr/" },
      ],
      customCss: ["./src/styles/theme.css"],
      editLink: {
        baseUrl: "https://github.com/KRDS-community/krds-community/edit/main/apps/docs/",
      },
      lastUpdated: true,
      credits: true,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkFrameworkPreview],
  },
  vite: {
    resolve: {
      alias: {
        "@docs": new URL("./src/components", import.meta.url).pathname,
      },
    },
    ssr: {
      // Keep framework packages in vite's SSR pipeline so their `styles.css`
      // imports are transformed instead of hitting Node's ESM loader in dev.
      noExternal: [
        "@krds-community/angular",
        "@krds-community/react",
        "@krds-community/vue",
        "@krds-community/svelte",
        "@krds-community/solid",
        "@krds-community/astro",
        "@krds-community/recipes",
        "@krds-community/tokens",
      ],
    },
  },
});
