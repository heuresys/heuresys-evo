import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)', '../src/**/*.mdx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes', 'msw-storybook-addon'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },
  staticDirs: ['../public', { from: '../../../.ux-design', to: '/ux-design' }],
};

export default config;
