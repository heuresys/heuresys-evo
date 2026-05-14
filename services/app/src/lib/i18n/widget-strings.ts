/**
 * widget-strings.ts — i18n UI strings per i widget brand cycle 2 Phase 3.
 *
 * Pure constants module: dictionary IT/EN per ogni widget nuovo (Phase 3).
 * Safe per import server-side (RSC) e client-side. Locale resolution via
 * `pickWidgetString(locale, key)`.
 *
 * Reference: .ux-design/01-canonical/i18n-policy.md
 */
import type { Locale } from './locale-utils';

export const WIDGET_STRINGS = {
  it: {
    // Common
    count_records: 'records',
    count_managers: 'managers',
    count_reviews: 'reviews',
    count_plans: 'plans',
    count_employees: 'employees',
    count_root_goals: 'root goals',

    // Empty / unavailable
    no_employees_in_scope: 'Nessun dipendente nello scope.',
    no_cascade_goals: 'Nessun obiettivo cascade definito.',
    no_reviews_in_column: 'Nessuna review',
    no_trend_data: 'Nessun dato trend disponibile.',
    no_managers_to_calibrate: 'Nessun manager con review da calibrare.',
    no_active_bonus_plans: 'Nessun bonus plan attivo.',

    // Labels
    flight_risk_label: 'Flight risk',
    expand: 'Espandi',
    collapse: 'Riduci',
    rating: 'Rating',
    progress: 'Progress',
    total_budget: 'Total budget',
    avg_label: 'Avg',
    variance_label: 'Variance',
    outliers_label: 'Outliers',
    manager_label: 'Manager',
    dept_label: 'Dept',

    // Kanban columns
    kanban_pending: 'Pending',
    kanban_in_progress: 'In progress',
    kanban_submitted: 'Submitted',
    kanban_approved: 'Approved',

    // Trend stats
    headcount_label: 'Headcount',
    net_label: 'Net',
    hires_label: 'Hires',
    leavers_label: 'Leavers',

    // Default titles
    title_employees: 'Employees',
    title_okr_cascade: 'OKR cascade',
    title_review_cycle: 'Review cycle status',
    title_headcount_trend: 'Headcount trend',
    title_calibration_board: 'Calibration board',
    title_bonus_plans: 'Bonus plans',
  },
  en: {
    count_records: 'records',
    count_managers: 'managers',
    count_reviews: 'reviews',
    count_plans: 'plans',
    count_employees: 'employees',
    count_root_goals: 'root goals',

    no_employees_in_scope: 'No employees in scope.',
    no_cascade_goals: 'No cascade goals defined.',
    no_reviews_in_column: 'No reviews',
    no_trend_data: 'No trend data available.',
    no_managers_to_calibrate: 'No managers with reviews to calibrate.',
    no_active_bonus_plans: 'No active bonus plans.',

    flight_risk_label: 'Flight risk',
    expand: 'Expand',
    collapse: 'Collapse',
    rating: 'Rating',
    progress: 'Progress',
    total_budget: 'Total budget',
    avg_label: 'Avg',
    variance_label: 'Variance',
    outliers_label: 'Outliers',
    manager_label: 'Manager',
    dept_label: 'Dept',

    kanban_pending: 'Pending',
    kanban_in_progress: 'In progress',
    kanban_submitted: 'Submitted',
    kanban_approved: 'Approved',

    headcount_label: 'Headcount',
    net_label: 'Net',
    hires_label: 'Hires',
    leavers_label: 'Leavers',

    title_employees: 'Employees',
    title_okr_cascade: 'OKR cascade',
    title_review_cycle: 'Review cycle status',
    title_headcount_trend: 'Headcount trend',
    title_calibration_board: 'Calibration board',
    title_bonus_plans: 'Bonus plans',
  },
} as const;

export type WidgetStringKey = keyof typeof WIDGET_STRINGS.it;

export function pickWidgetString(locale: Locale, key: WidgetStringKey): string {
  return WIDGET_STRINGS[locale][key];
}
