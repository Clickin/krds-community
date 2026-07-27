import type { Preview } from '@storybook/react';
import '../packages/react/dist/styles.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};
export default preview;
