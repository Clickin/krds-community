import { defineConfig } from 'astro/config';
import angular from '@analogjs/astro-angular';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';

const site = process.env.SITE_URL ?? 'https://krds-community.github.io/krds-community/';
const base = process.env.BASE_PATH ?? '/krds-community/';

export default defineConfig({
  site,
  base,
  integrations: [
    react({ include: ['**/src/components/patterns/ReactPatternExample.tsx'] }),
    vue({ include: ['**/src/components/patterns/VuePatternExample.vue'] }),
    angular({
      strictStylePlacement: true,
      vite: { transformFilter: (_code, id) => id.includes('/src/components/angular/') },
    }),
    svelte({ include: ['**/src/components/patterns/SveltePatternExample.svelte'] }),
    solid({ include: ['**/src/components/patterns/SolidPatternExample.tsx'] }),
    starlight({
      title: 'KRDS Community',
      description: 'KRDS 기반 프레임워크 네이티브 컴포넌트와 서비스 패턴 예제',
      defaultLocale: 'ko',
      locales: { root: { label: '한국어', lang: 'ko' } },
      customCss: ['./src/styles/theme.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/KRDS-community/krds-community',
        },
      ],
      sidebar: [
        {
          label: '시작하기',
          items: [
            { label: '소개', slug: 'index' },
            { label: '설치와 테마', slug: 'getting-started/installation' },
            { label: '공식 가이드라인 검토', slug: 'guides/krds-guidelines' },
          ],
        },
        {
          label: '컴포넌트',
          items: [{ autogenerate: { directory: 'components' } }],
        },
        {
          label: '서비스 패턴',
          items: [
            { label: '서비스 패턴 개요', slug: 'service-patterns' },
            { label: '상세 패턴', items: [{ autogenerate: { directory: 'service-patterns' } }] },
          ],
        },
        {
          label: '기본 패턴',
          items: [
            { label: '기본 패턴 개요', slug: 'basic-patterns' },
            { label: '상세 패턴', items: [{ autogenerate: { directory: 'basic-patterns' } }] },
          ],
        },
        {
          label: '개발 도구',
          items: [
            { label: '프레임워크별 실제 예제', slug: 'framework-examples' },
            { label: 'Storybook 포털', link: '/storybook/' },
          ],
        },
      ],
    }),
  ],
});
