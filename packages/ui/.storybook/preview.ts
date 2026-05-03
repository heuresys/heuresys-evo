import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/styles/globals.css';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'paper', value: '#fafaf7' },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },
    a11y: {
      config: { rules: [] },
    },
    options: {
      storySort: {
        order: ['Welcome', 'Foundations', 'Components', ['*', 'All'], 'Recipes', '*'],
      },
    },
    layout: 'padded',
  },
  loaders: [mswLoader],
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
