import { describe, it, expect } from "vitest";
import {
  EmployeeSchema,
  EmployeeListItemSchema,
  EmployeeListResponseSchema,
  EmploymentStatusSchema,
} from "../employee.zod.js";

const validEmployee = {
  id: "11111111-2222-3333-4444-555555555555",
  tenantId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  firstName: "Laura",
  lastName: "Bertolini",
  email: "laura.bertolini@econova.org",
  jobTitle: "Sustainability Officer",
  department: "ESG",
  location: "Milano",
  managerId: null,
  hireDate: "2024-01-15",
  isActive: true,
  employmentStatus: "active" as const,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
};

describe("EmployeeSchema", () => {
  it("parses a valid full employee record", () => {
    const result = EmployeeSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = EmployeeSchema.safeParse({ ...validEmployee, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects empty firstName", () => {
    const result = EmployeeSchema.safeParse({ ...validEmployee, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects firstName over 100 chars", () => {
    const result = EmployeeSchema.safeParse({ ...validEmployee, firstName: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("rejects non-uuid tenantId", () => {
    const result = EmployeeSchema.safeParse({ ...validEmployee, tenantId: "not-uuid" });
    expect(result.success).toBe(false);
  });

  it("accepts null optional fields (jobTitle, department, location, managerId, hireDate)", () => {
    const result = EmployeeSchema.safeParse({
      ...validEmployee,
      jobTitle: null,
      department: null,
      location: null,
      managerId: null,
      hireDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("coerces ISO date strings to Date", () => {
    const result = EmployeeSchema.parse(validEmployee);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it("applies isActive default true when omitted", () => {
    const { isActive: _omit, ...withoutIsActive } = validEmployee;
    const result = EmployeeSchema.parse(withoutIsActive);
    expect(result.isActive).toBe(true);
  });

  it("applies employmentStatus default 'active' when omitted", () => {
    const { employmentStatus: _omit, ...withoutStatus } = validEmployee;
    const result = EmployeeSchema.parse(withoutStatus);
    expect(result.employmentStatus).toBe("active");
  });
});

describe("EmploymentStatusSchema enum", () => {
  it.each(["active", "inactive", "on_leave", "terminated"])("accepts %s", (status) => {
    expect(EmploymentStatusSchema.safeParse(status).success).toBe(true);
  });

  it("rejects unknown status", () => {
    expect(EmploymentStatusSchema.safeParse("ghosted").success).toBe(false);
  });
});

describe("EmployeeListItemSchema (picked subset)", () => {
  it("includes only the picked keys", () => {
    const item = EmployeeListItemSchema.parse(validEmployee);
    expect(Object.keys(item).sort()).toEqual(
      ["department", "email", "firstName", "id", "isActive", "jobTitle", "lastName"].sort(),
    );
  });
});

describe("EmployeeListResponseSchema", () => {
  it("parses a valid pagination response", () => {
    const response = {
      data: [
        {
          id: validEmployee.id,
          firstName: validEmployee.firstName,
          lastName: validEmployee.lastName,
          email: validEmployee.email,
          jobTitle: validEmployee.jobTitle,
          department: validEmployee.department,
          isActive: validEmployee.isActive,
        },
      ],
      total: 1,
      limit: 20,
      offset: 0,
    };
    expect(EmployeeListResponseSchema.safeParse(response).success).toBe(true);
  });

  it("rejects negative offset", () => {
    const result = EmployeeListResponseSchema.safeParse({
      data: [],
      total: 0,
      limit: 20,
      offset: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects limit zero", () => {
    const result = EmployeeListResponseSchema.safeParse({
      data: [],
      total: 0,
      limit: 0,
      offset: 0,
    });
    expect(result.success).toBe(false);
  });
});
