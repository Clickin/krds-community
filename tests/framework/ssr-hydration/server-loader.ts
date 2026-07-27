import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import solid from 'vite-plugin-solid';
import { createServer } from 'vite';
import type { PluginOption, ViteDevServer } from 'vite';

const projectRoot = resolve(process.cwd());
// Astro is package-scoped rather than a root dependency, so its public server
// APIs must be resolved from that package before they can be loaded here.
const astroRequire = createRequire(resolve(projectRoot, 'packages/astro/package.json'));
const astroConfigUrl = pathToFileURL(astroRequire.resolve('astro/config')).href;
const astroContainerUrl = pathToFileURL(astroRequire.resolve('astro/container')).href;
const astroCompilerRuntime = astroRequire.resolve('astro/compiler-runtime');
const solidSources =
  /(?:packages\/solid\/src|tests\/framework\/ssr-hydration\/fixtures)\/.*\.tsx$/;
const svelteSources =
  /(?:packages\/svelte\/src|tests\/framework\/ssr-hydration\/fixtures)\/.*\.svelte$/;

export async function createFrameworkSsrServer(
  framework: 'solid' | 'svelte',
): Promise<ViteDevServer> {
  const plugins: PluginOption[] =
    framework === 'solid'
      ? [solid({ include: solidSources, ssr: true, dev: false, hot: false })]
      : svelte({ include: svelteSources });

  return createServer({
    appType: 'custom',
    configFile: false,
    logLevel: 'silent',
    plugins,
    root: projectRoot,
    resolve: {
      alias: {
        '@krds-community/recipes': resolve(projectRoot, 'packages/recipes/src/index.ts'),
      },
    },
    server: {
      hmr: false,
      middlewareMode: true,
      watch: null,
    },
    ssr:
      framework === 'solid'
        ? {
            noExternal: ['solid-js', 'solid-js/web'],
          }
        : undefined,
  });
}

export async function createAstroSsrServer(): Promise<ViteDevServer> {
  const { getViteConfig } = await import(/* @vite-ignore */ astroConfigUrl);
  const configFactory = getViteConfig(
    {
      appType: 'custom',
      logLevel: 'silent',
      root: projectRoot,
      resolve: {
        alias: {
          '@krds-community/recipes': resolve(projectRoot, 'packages/recipes/src/index.ts'),
          'astro/compiler-runtime': astroCompilerRuntime,
        },
      },
      server: {
        hmr: false,
        middlewareMode: true,
        watch: null,
      },
    },
    {
      configFile: false,
      logLevel: 'silent',
      root: projectRoot,
    },
  );
  const viteConfig = await configFactory({
    command: 'serve',
    isPreview: false,
    isSsrBuild: true,
    mode: 'test',
  });

  return createServer({
    ...viteConfig,
    configFile: false,
  });
}

export async function renderAstroComponentToString(component: unknown): Promise<string> {
  const { experimental_AstroContainer } = await import(
    /* @vite-ignore */ astroContainerUrl
  );
  const container = await experimental_AstroContainer.create();

  return container.renderToString(component);
}
