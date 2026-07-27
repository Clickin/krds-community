import type { StorybookConfig } from '@storybook/html-vite';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/html-vite', options: {} },
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@krds-community/solid': resolve('packages/solid/dist/index.js'),
        '@krds-community/styles/css': resolve('packages/styles/dist/index.css'),
      },
    },
  }),
};

export default config;
