import { describe, it, expect } from "vitest";
import {
  RoleSchema,
  ROLES,
  hasRole,
  isPlatformAdmin,
  isTenantAdmin,
  isHrLead,
} from "../role.js";

describe("RoleSchema", () => {
  it("accepts every role in ROLES list", () => {
    for (const role of ROLES) {
      expect(RoleSchema.safeParse(role).success).toBe(true);
    }
  });

  it("rejects unknown role", () => {
    expect(RoleSchema.safeParse("INTRUDER").success).toBe(false);
  });
});

describe("hasRole hierarchy", () => {
  it("SUPERUSER satisfies any required role", () => {
    for (const role of ROLES) {
      expect(hasRole("SUPERUSER", role)).toBe(true);
    }
  });

  it("EMPLOYEE does NOT satisfy LINE_MANAGER requirement", () => {
    expect(hasRole("EMPLOYEE", "LINE_MANAGER")).toBe(false);
  });

  it("HR_DIRECTOR satisfies HR_MANAGER requirement", () => {
    expect(hasRole("HR_DIRECTOR", "HR_MANAGER")).toBe(true);
  });

  it("equal role satisfies itself", () => {
    expect(hasRole("DEPT_HEAD", "DEPT_HEAD")).toBe(true);
  });
});

describe("isPlatformAdmin", () => {
  it("returns true for SUPERUSER and SYSADMIN", () => {
    expect(isPlatformAdmin("SUPERUSER")).toBe(true);
    expect(isPlatformAdmin("SYSADMIN")).toBe(true);
  });

  it("returns false for tenant-scope roles", () => {
    expect(isPlatformAdmin("TENANT_OWNER")).toBe(false);
    expect(isPlatformAdmin("HR_DIRECTOR")).toBe(false);
    expect(isPlatformAdmin("EMPLOYEE")).toBe(false);
  });
});

describe("isTenantAdmin", () => {
  it("returns true for TENANT_OWNER and IT_ADMIN", () => {
    expect(isTenantAdmin("TENANT_OWNER")).toBe(true);
    expect(isTenantAdmin("IT_ADMIN")).toBe(true);
  });

  it("returns false for SUPERUSER (platform-scope)", () => {
    expect(isTenantAdmin("SUPERUSER")).toBe(false);
  });
});

describe("isHrLead", () => {
  it("returns true for HR_DIRECTOR and HR_MANAGER", () => {
    expect(isHrLead("HR_DIRECTOR")).toBe(true);
    expect(isHrLead("HR_MANAGER")).toBe(true);
  });

  it("returns false for non-HR roles", () => {
    expect(isHrLead("LINE_MANAGER")).toBe(false);
    expect(isHrLead("DEPT_HEAD")).toBe(false);
  });
});
