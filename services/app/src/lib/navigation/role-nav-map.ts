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
 * Visual reference: `.ux-design/06-mockups/dashboards/hr-director-overview.html`
 * (HR Director's Workspace + Ontology + System) extended for the other 7 roles.
 */

import type { NavSection, UserRole } from './types';

const onto: NavSection = {
  id: 'ontology',
  title: 'Ontology',
  items: [
    { id: 'ontology', label: 'Advisor', href: '/ontology', icon: 'ontology' },
    { id: 'esco', label: 'ESCO tree', href: '/explorer/esco', icon: 'esco' },
    { id: 'kg', label: 'Knowledge graph', href: '/explorer/kg', icon: 'kg' },
  ],
};

/** A constrained subset of `onto` for low-privilege roles (read-only). */
const ontoLite: NavSection = {
  id: 'ontology',
  title: 'Ontology',
  items: [{ id: 'esco', label: 'ESCO tree', href: '/explorer/esco', icon: 'esco' }],
};

const systemFull: NavSection = {
  id: 'system',
  title: 'System',
  items: [
    { id: 'tenants', label: 'Tenants', href: '/admin/tenants', icon: 'tenant' },
    { id: 'users-admin', label: 'Users', href: '/admin/users', icon: 'users-admin' },
    { id: 'rbac', label: 'RBAC matrix', href: '/admin/rbac', icon: 'rbac' },
    { id: 'sap', label: 'SAP sync', href: '/explorer/sap', icon: 'sap' },
    {
      id: 'integrations',
      label: 'Integrations',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Audit log', href: '/admin/audit', icon: 'audit' },
    { id: 'showcase', label: 'Components', href: '/showcase', icon: 'showcase' },
  ],
};

const systemTenant: NavSection = {
  id: 'system',
  title: 'System',
  items: [
    { id: 'rbac', label: 'RBAC matrix', href: '/admin/rbac', icon: 'rbac' },
    {
      id: 'integrations',
      label: 'Integrations',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Audit log', href: '/admin/audit', icon: 'audit' },
  ],
};

const systemIt: NavSection = {
  id: 'system',
  title: 'System',
  items: [
    { id: 'users-admin', label: 'Users', href: '/admin/users', icon: 'users-admin' },
    { id: 'sap', label: 'SAP sync', href: '/explorer/sap', icon: 'sap' },
    {
      id: 'integrations',
      label: 'Integrations',
      href: '/admin/integrations',
      icon: 'integrations',
    },
    { id: 'audit', label: 'Audit log', href: '/admin/audit', icon: 'audit' },
  ],
};

/** Self-service "Me" section for low-privilege roles. */
const selfSection: NavSection = {
  id: 'self',
  title: 'Me',
  items: [
    { id: 'profile', label: 'My profile', href: '/me', icon: 'profile' },
    { id: 'my-skills', label: 'My skills (ESCO)', href: '/me/skills', icon: 'esco' },
    { id: 'my-goals', label: 'My goals', href: '/me/goals', icon: 'goals' },
    { id: 'my-reviews', label: 'My reviews', href: '/me/reviews', icon: 'reviews' },
    { id: 'my-learning', label: 'My learning', href: '/me/learning', icon: 'learning' },
  ],
};

const teamSection: NavSection = {
  id: 'team',
  title: 'My team',
  items: [
    { id: 'team', label: 'Direct reports', href: '/team', icon: 'team' },
    { id: 'team-reviews', label: 'Team reviews', href: '/team/reviews', icon: 'reviews' },
    { id: 'team-goals', label: 'Team goals', href: '/team/goals', icon: 'goals' },
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
          label: 'Cross-tenant analytics',
          href: '/dashboard/cross_tenant_overview',
          icon: 'analytics',
        },
        { id: 'employees', label: 'Employees', href: '/employees', icon: 'employees' },
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
          label: 'Org overview',
          href: '/dashboard/tenant_owner_overview',
          icon: 'org-chart',
        },
        { id: 'employees', label: 'Employees', href: '/employees', icon: 'employees' },
        { id: 'compensation', label: 'Compensation', href: '/compensation', icon: 'compensation' },
        {
          id: 'analytics',
          label: 'Workforce analytics',
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
        { id: 'sap', label: 'SAP sync', href: '/explorer/sap', icon: 'sap' },
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
          label: 'HR Director overview',
          href: '/dashboard/hr_director_overview',
          icon: 'analytics',
        },
        { id: 'employees', label: 'Talent registry', href: '/employees', icon: 'employees' },
        {
          id: 'capability',
          label: 'Capability map',
          href: '/dashboard/capability_graph',
          icon: 'capability',
        },
        { id: 'reviews', label: 'Reviews', href: '/reviews', icon: 'reviews' },
        { id: 'goals', label: 'Goals', href: '/goals', icon: 'goals' },
        { id: 'learning', label: 'Learning paths', href: '/learning', icon: 'learning' },
        { id: 'compensation', label: 'Compensation', href: '/compensation', icon: 'compensation' },
        {
          id: 'analytics',
          label: 'Workforce analytics',
          href: '/analytics/workforce',
          icon: 'analytics',
        },
      ],
    },
    onto,
    {
      id: 'system',
      title: 'System',
      items: [
        { id: 'audit', label: 'Audit log', href: '/admin/audit', icon: 'audit' },
        { id: 'rbac', label: 'RBAC matrix', href: '/admin/rbac', icon: 'rbac' },
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
          label: 'Employees (dept)',
          href: '/employees?scope=dept',
          icon: 'employees',
        },
        { id: 'reviews', label: 'Reviews', href: '/reviews?scope=dept', icon: 'reviews' },
        { id: 'goals', label: 'Goals (dept)', href: '/goals?scope=dept', icon: 'goals' },
        { id: 'learning', label: 'Learning paths', href: '/learning', icon: 'learning' },
      ],
    },
    onto,
  ],

  DEPT_HEAD: [
    {
      id: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { id: 'team', label: 'My team', href: '/team', icon: 'team' },
        {
          id: 'capability',
          label: 'Team capability',
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
        { id: 'reviews', label: 'My team reviews', href: '/team/reviews', icon: 'reviews' },
      ],
    },
    ontoLite,
    selfSection,
  ],

  EMPLOYEE: [selfSection, ontoLite],
};

/** Default fallback when role is unknown — least privilege. */
export const DEFAULT_NAV: NavSection[] = SIDEBAR_MAP.EMPLOYEE;
