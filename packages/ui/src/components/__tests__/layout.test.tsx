import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Stack, Cluster, Grid, Center } from '../layout-primitives';

describe('Layout primitives', () => {
  it('Stack renders flex-col with gap class', () => {
    const { container } = render(
      <Stack gap="lg">
        <div>a</div>
        <div>b</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'gap-6');
  });

  it('Cluster wraps children in flex-wrap', () => {
    const { container } = render(
      <Cluster justify="between">
        <span>x</span>
        <span>y</span>
      </Cluster>
    );
    expect(container.firstChild).toHaveClass('flex', 'flex-wrap', 'justify-between');
  });

  it('Grid auto produces auto-fit columns', () => {
    const { container } = render(
      <Grid cols="auto">
        <div>1</div>
      </Grid>
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/grid-cols-\[repeat\(auto-fit/);
  });

  it('Center primitive has no a11y violations on empty content', async () => {
    const { container } = render(
      <Center>
        <span>Hello</span>
      </Center>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
