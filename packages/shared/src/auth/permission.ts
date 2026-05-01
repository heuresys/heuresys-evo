import { z } from "zod";
import type { Role } from "./role.js";
import { hasRole } from "./role.js";

export const PermissionSchema = z.string().regex(/^[a-z]+:[a-z_*]+$/);
export type Permission = z.infer<typeof PermissionSchema>;

export interface AccessCheckInput {
  role: Role;
  permissions: ReadonlyArray<Permission>;
  required: { role?: Role; permission?: Permission };
}

export function canAccess(input: AccessCheckInput): boolean {
  if (input.required.role && !hasRole(input.role, input.required.role)) {
    return false;
  }
  if (input.required.permission && !matchesAny(input.permissions, input.required.permission)) {
    return false;
  }
  return true;
}

function matchesAny(granted: ReadonlyArray<Permission>, required: Permission): boolean {
  for (const p of granted) {
    if (p === required) return true;
    const [grantedDomain, grantedAction] = p.split(":");
    const [reqDomain, reqAction] = required.split(":");
    if (grantedDomain !== reqDomain) continue;
    if (grantedAction === "*") return true;
    if (grantedAction === reqAction) return true;
  }
  return false;
}
