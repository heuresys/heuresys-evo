/**
 * SIDEBAR_MAP — role-driven navigation tree for the 8 canonical evo roles.
 *
 * Each entry is a list of {@link NavSection}s rendered by `<AppShellClient>`.
 * Routes that don't yet exist (FASE 3 / SH-2 of Phase 14.SH) are still
 * referenced here; their pages will be cabled progressively. RBP gates
 * enforce server-side permission anyway, so no harm in surfacing them.
 *
 * Role hierarchy (lower number = more powerful):
 *   SUPERUSER (-1) → TENANT_OWNER (0) → IT_ADMIN (1) →
 *   HR_DIRECTOR (2) → HR_MANAGER (3) → DEPT_HEAD (4) →
 *   LINE_MANAGER (5) → EMPLOYEE (6)
 *
 * S51 P3: labels italianizzati (sidebar è statica hardcoded, no STRINGS+locale
 * pattern: il refactor a getServerLocale per nav richiederebbe `'use server'`
 * o tradurre lato AppShellClient — out-of-scope sprint corrente).
 *
 * Visual reference: `.ux-design/06-mockups/dashboards/hr-director-overview.html`
 * (HR Director's Workspace + Ontology + System) extended for the other 7 roles.
 */

import type { NavSection, UserRole } from './types';

/**
 * Phase 15.H — Process dashboards (autonomous role).
 * Surfaced as secondary navigation under HR_DIRECTOR and HR_MANAGER. Backed
 * by `role_default_dashboards` rows with priority>0 (see seed
 * db/seeds/phase15h_process_role_assignments.sql).
 */
const processSection: NavSection = {
  id: 'process',
  title: 'Processi',
  items: [
    {
      id: 'process-recruiting',
      label: 'Funnel recruiting',
      href: '/dashboard/process_recruiting_funnel',
      icon: 'analytics',
    },
    {
      id: 'process-onboarding',
      label: 'Flusso onboarding',
      href: '/dashboard/process_onboarding_flow',
      icon: 'analytics',
    },
    {
      id: 'process-performance',
      label: 'Ciclo performance',
      href: '/dashboard/process_performance_cycle',
      icon: 'analytics',
    },
    {
      id: 'process-learning',
      label: 'Percorsi formativi',
      href: '/dashboard/process_learning_paths',
      icon: 'learning',
    },
  ],
};

const onto: NavSection = {
  id: 'ontology',
  title: 'Ontologia',
  items: [
    { id: 'ontology', label: 'Consulente', href: '/ontology', icon: 'ontology' },
    { id: 'esco', label: 'Albero ESCO', href: '/explorer/esco', icon: 'esco' },
    { id: 'kg', label: 'Grafo conoscenza', href: '/explorer/kg', icon: 'kg' },
  ],
};

/** A constrained subset of `onto` for low-privilege roles (read-only). */
const ontoLite: NavSection = {
  id: 'ontology',
  title: 'Ontologia',
  items: [{ id: 'esco', label: 'Albero ESCO', href: '/explorer/esco', icon: 'esco' }],
};

const systemFull: NavSection = {
  id: 'system',
  title: 'Sistema',
  items: [
    { id: 'tenants', label: 'Tenants', href: '/admin/tenants', icon: 'tenant' },
    { id: 'users-admin', label: 'Utenti', href: '/admin/users', icon: 'users-admin' },
    { id: 'rbac', label: 'Matrice RBAC', href: '/admin/rbac', icon: 'rbac' },
    { id: 'sap', label: 'Sync SAP', href: '/explorer/sap', icon: 'sap' },
    {
      id: 'integrations',
      label: 'Integrazioni',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Registro audit', href: '/admin/audit', icon: 'audit' },
    { id: 'showcase', label: 'Componenti', href: '/showcase', icon: 'showcase' },
  ],
};

const systemTenant: NavSection = {
  id: 'system',
  title: 'Sistema',
  items: [
    { id: 'rbac', label: 'Matrice RBAC', href: '/admin/rbac', icon: 'rbac' },
    {
      id: 'integrations',
      label: 'Integrazioni',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Registro audit', href: '/admin/audit', icon: 'audit' },
  ],
};

const systemIt: NavSection = {
  id: 'system',
  title: 'Sistema',
  items: [
    { id: 'users-admin', label: 'Utenti', href: '/admin/users', icon: 'users-admin' },
    { id: 'sap', label: 'Sync SAP', href: '/explorer/sap', icon: 'sap' },
    {
      id: 'integrations',
      label: 'Integrazioni',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Registro audit', href: '/admin/audit', icon: 'audit' },
  ],
};

/** Self-service "Me" section for low-privilege roles. */
const selfSection: NavSection = {
  id: 'self',
  title: 'Personale',
  items: [
    { id: 'profile', label: 'Profilo', href: '/me', icon: 'profile' },
    { id: 'my-skills', label: 'Competenze (ESCO)', href: '/me/skills', icon: 'esco' },
    { id: 'my-goals', label: 'Miei obiettivi', href: '/me/goals', icon: 'goals' },
    { id: 'my-reviews', label: 'Mie valutazioni', href: '/me/reviews', icon: 'reviews' },
    { id: 'my-learning', label: 'Mia formazione', href: '/me/learning', icon: 'learning' },
  ],
};

const teamSection: NavSection = {
  id: 'team',
  title: 'Il mio team',
  items: [
    { id: 'team', label: 'Riporti diretti', href: '/team', icon: 'team' },
    { id: 'team-reviews', label: 'Valutazioni team', href: '/team/reviews', icon: 'reviews' },
    { id: 'team-goals', label: 'Obiettivi team', href: '/team/goals', icon: 'goals' },
  ],
};

export const SIDEBAR_MAP: Record<UserRole, NavSection[]> = {
  SUPERUSER: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        {
          id: 'analytics',
          label: 'Analitiche cross-tenant',
          href: '/dashboard/cross_tenant_overview',
          icon: 'analytics',
        },
        { id: 'employees', label: 'Dipendenti', href: '/employees', icon: 'employees' },
      ],
    },
    onto,
    systemFull,
  ],

  TENANT_OWNER: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        {
          id: 'org-overview',
          label: 'Panoramica organizzazione',
          href: '/dashboard/tenant_owner_overview',
          icon: 'org-chart',
        },
        { id: 'employees', label: 'Dipendenti', href: '/employees', icon: 'employees' },
        {
          id: 'compensation',
          label: 'Stipendi e bonus',
          href: '/compensation',
          icon: 'compensation',
        },
        {
          id: 'analytics',
          label: 'Analitiche workforce',
          href: '/analytics/workforce',
          icon: 'analytics',
        },
      ],
    },
    onto,
    systemTenant,
  ],

  IT_ADMIN: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { id: 'sap', label: 'Sync SAP', href: '/explorer/sap', icon: 'sap' },
      ],
    },
    onto,
    systemIt,
  ],

  HR_DIRECTOR: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        {
          id: 'hr-overview',
          label: 'Vista HR Director',
          href: '/dashboard/hr_director_overview',
          icon: 'analytics',
        },
        { id: 'employees', label: 'Registro talenti', href: '/employees', icon: 'employees' },
        {
          id: 'capability',
          label: 'Mappa competenze',
          href: '/dashboard/capability_graph',
          icon: 'capability',
        },
        { id: 'reviews', label: 'Valutazioni', href: '/reviews', icon: 'reviews' },
        { id: 'goals', label: 'Obiettivi', href: '/goals', icon: 'goals' },
        { id: 'learning', label: 'Percorsi formativi', href: '/learning', icon: 'learning' },
        {
          id: 'compensation',
          label: 'Stipendi e bonus',
          href: '/compensation',
          icon: 'compensation',
        },
        {
          id: 'analytics',
          label: 'Analitiche workforce',
          href: '/analytics/workforce',
          icon: 'analytics',
        },
      ],
    },
    processSection,
    onto,
    {
      id: 'system',
      title: 'Sistema',
      items: [
        { id: 'audit', label: 'Registro audit', href: '/admin/audit', icon: 'audit' },
        { id: 'rbac', label: 'Matrice RBAC', href: '/admin/rbac', icon: 'rbac' },
      ],
    },
  ],

  HR_MANAGER: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        {
          id: 'employees',
          label: 'Dipendenti (dipartimento)',
          href: '/employees?scope=dept',
          icon: 'employees',
        },
        { id: 'reviews', label: 'Valutazioni', href: '/reviews?scope=dept', icon: 'reviews' },
        {
          id: 'goals',
          label: 'Obiettivi (dipartimento)',
          href: '/goals?scope=dept',
          icon: 'goals',
        },
        { id: 'learning', label: 'Percorsi formativi', href: '/learning', icon: 'learning' },
      ],
    },
    processSection,
    onto,
  ],

  DEPT_HEAD: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { id: 'team', label: 'Il mio team', href: '/team', icon: 'team' },
        {
          id: 'capability',
          label: 'Competenze del team',
          href: '/dashboard/capability_graph?scope=team',
          icon: 'capability',
        },
      ],
    },
    ontoLite,
    selfSection,
  ],

  LINE_MANAGER: [
    teamSection,
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { id: 'reviews', label: 'Valutazioni del team', href: '/team/reviews', icon: 'reviews' },
      ],
    },
    ontoLite,
    selfSection,
  ],

  EMPLOYEE: [selfSection, ontoLite],
};

/** Default fallback when role is unknown — least privilege. */
export const DEFAULT_NAV: NavSection[] = SIDEBAR_MAP.EMPLOYEE;
