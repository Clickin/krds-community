import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@krds-community/react': resolve('packages/react/dist/index.js'),
        '@krds-community/styles/css': resolve('packages/styles/dist/index.css'),
      },
    },
  }),
};

export default config;
