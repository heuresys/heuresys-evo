import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';

// jest-axe exports { toHaveNoViolations } as an object that already maps the
// matcher name to its implementation; pass it through verbatim.
expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});
