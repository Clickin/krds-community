import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
export default [
  {
    files: ['packages/react/src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    ...reactHooks.configs.flat['recommended-latest'],
  },
];
