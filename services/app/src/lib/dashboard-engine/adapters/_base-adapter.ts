/**
 * _base-adapter.ts — Widget adapter framework (cycle 2 Phase 0 T0.10).
 *
 * Typed contract for the next generation of widget adapters introduced
 * during the investor-ready rebuild (plan §0.12). Replaces the loose
 * `(raw: unknown) => Record<string, unknown> | null` shape in the legacy
 * `../adapters.ts` single-file with a generic, validation-first interface.
 *
 * Legacy adapters in `../adapters.ts` stay functional and untouched. New
 * brand widgets shipped in Phase 3 implement this interface so:
 *   - their config (DB `config_overrides`) is type-checked
 *   - their transformed data (props for the React widget) is type-checked
 *   - validation errors surface as `null` → `<DataNotAvailable />` (P11)
 *
 * Reference: ~/.claude/plans/c-stata-una-continua-indexed-cocke.md §0.12.
 */

export interface AdapterContext {
  tenantId: string | null;
  role?: string | null;
  employeeId?: string | null;
}

/**
 * Generic adapter contract: fetch → transform → validate → typed props.
 *
 * @typeParam TConfig — DB `config_overrides` shape (or `{}` if not configurable).
 * @typeParam TData   — Final props object consumed by the widget component.
 *
 * Implementations should:
 *   - `validateConfig`: narrow raw element.config_overrides → typed TConfig
 *     (return null when shape invalid, never throw)
 *   - `transform`: accept (raw, config, ctx) and produce TData or null
 *     (null = render <DataNotAvailable />, never substitute fake values)
 *   - `optionally provide fetch` if the data-fetcher pipeline isn't sufficient
 *     (typical case: aggregate from multiple sources, cached server-side)
 */
export interface WidgetAdapter<TConfig, TData> {
  /** Widget code in `dashboard_elements.widget_code` (and `widget_catalog.code`). */
  readonly widgetCode: string;
  /** Optional human label for telemetry / dev-tools. */
  readonly label?: string;

  /**
   * Validate and narrow the raw `config_overrides` JSON to the adapter's
   * typed config shape. Return `null` when the config is invalid — caller
   * will fall back to the widget's default config or `<DataNotAvailable />`.
   */
  validateConfig(raw: unknown): TConfig | null;

  /**
   * Transform raw fetched data + config + context into widget props.
   * Return `null` when transformation cannot produce a complete, usable
   * value (P11: never invent / placeholder / random).
   */
  transform(raw: unknown, config: TConfig, ctx: AdapterContext): TData | null;

  /**
   * Optional bespoke fetch hook. When omitted, the dashboard-engine
   * `data-fetcher.ts` resolves the data source from `dashboard_elements.data_source_*`.
   * Provide this only when the standard pipeline cannot express the query
   * (e.g. multi-tenant aggregations, GraphQL, cross-service joins).
   */
  fetch?(config: TConfig, ctx: AdapterContext): Promise<unknown>;
}

/**
 * Helper to assemble an adapter object with minimal boilerplate.
 * Usage:
 *   export const myAdapter = defineAdapter<MyConfig, MyData>({
 *     widgetCode: 'my_widget_v2',
 *     validateConfig: (raw) => ...,
 *     transform: (raw, cfg, ctx) => ...,
 *   });
 */
export function defineAdapter<TConfig, TData>(
  spec: WidgetAdapter<TConfig, TData>
): WidgetAdapter<TConfig, TData> {
  return spec;
}

/** Common helpers shared across adapter implementations. */

export function firstObject(raw: unknown): Record<string, unknown> | null {
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object' && raw[0] !== null) {
    return raw[0] as Record<string, unknown>;
  }
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return null;
}

export function asArray<T = unknown>(v: unknown): T[] | null {
  return Array.isArray(v) ? (v as T[]) : null;
}

export function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

export function asNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function asBoolean(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null;
}

/** Sentinel: P11 unavailable marker. Adapters return this when DB row exists but a metric is null. */
export const UNAVAILABLE = Symbol.for('heuresys.adapter.unavailable');
export type Unavailable = typeof UNAVAILABLE;

export function isUnavailable<T>(v: T | Unavailable): v is Unavailable {
  return v === UNAVAILABLE;
}
