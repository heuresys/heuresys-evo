import { z } from "zod";

export const ROLES = [
  "SUPERUSER",
  "TENANT_OWNER",
  "SYSADMIN",
  "IT_ADMIN",
  "HR_DIRECTOR",
  "HR_MANAGER",
  "DEPT_HEAD",
  "LINE_MANAGER",
  "EMPLOYEE",
] as const;

export const RoleSchema = z.enum(ROLES);
export type Role = z.infer<typeof RoleSchema>;

const ROLE_RANK: Record<Role, number> = {
  SUPERUSER: 100,
  TENANT_OWNER: 90,
  SYSADMIN: 85,
  IT_ADMIN: 80,
  HR_DIRECTOR: 70,
  HR_MANAGER: 60,
  DEPT_HEAD: 50,
  LINE_MANAGER: 40,
  EMPLOYEE: 10,
};

export function hasRole(actual: Role, required: Role): boolean {
  return ROLE_RANK[actual] >= ROLE_RANK[required];
}

export function isPlatformAdmin(role: Role): boolean {
  return role === "SUPERUSER" || role === "SYSADMIN";
}

export function isTenantAdmin(role: Role): boolean {
  return role === "TENANT_OWNER" || role === "IT_ADMIN";
}

export function isHrLead(role: Role): boolean {
  return role === "HR_DIRECTOR" || role === "HR_MANAGER";
}
