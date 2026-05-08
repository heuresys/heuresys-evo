/**
 * WCAG 2.2 AAA accessibility runner — wraps @axe-core/playwright with the
 * tag-set required for AAA conformance + best-practice rules. Returns full
 * AxeResults so callers can build per-view assertions and dumps.
 */
import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import type { AxeResults, Result } from 'axe-core';

const WCAG_AAA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag2aaa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
  'best-practice',
];

export interface ViewAuditOptions {
  excludeSelectors?: string[];
  disableRules?: string[];
}

export async function auditWcagAAA(page: Page, opts: ViewAuditOptions = {}): Promise<AxeResults> {
  let builder = new AxeBuilder({ page }).withTags(WCAG_AAA_TAGS);
  for (const sel of opts.excludeSelectors ?? []) builder = builder.exclude(sel);
  if (opts.disableRules?.length) builder = builder.disableRules(opts.disableRules);
  return await builder.analyze();
}

export function summarizeViolations(violations: Result[], maxNodes = 99): string {
  if (!violations.length) return '0 violations';
  return violations
    .map(
      (v) =>
        `[${v.impact ?? 'unknown'}] ${v.id}: ${v.help}\n` +
        v.nodes
          .slice(0, maxNodes)
          .map(
            (n) =>
              `  · ${n.target.join(' ')}\n    ${n.failureSummary?.replace(/\n/g, '\n    ') ?? ''}`
          )
          .join('\n') +
        (v.nodes.length > maxNodes ? `\n  · ...+${v.nodes.length - maxNodes} more nodes` : '')
    )
    .join('\n\n');
}

export function critical(violations: Result[]): Result[] {
  return violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
}
