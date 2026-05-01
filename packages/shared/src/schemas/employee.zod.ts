import { z } from "zod";

export const EmployeeIdSchema = z.string().uuid();
export type EmployeeId = z.infer<typeof EmployeeIdSchema>;

export const EmploymentStatusSchema = z.enum([
  "active",
  "inactive",
  "on_leave",
  "terminated",
]);
export type EmploymentStatus = z.infer<typeof EmploymentStatusSchema>;

export const EmployeeSchema = z.object({
  id: EmployeeIdSchema,
  tenantId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  jobTitle: z.string().max(255).nullable().optional(),
  department: z.string().max(100).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  managerId: z.string().uuid().nullable().optional(),
  hireDate: z.coerce.date().nullable().optional(),
  isActive: z.boolean().default(true),
  employmentStatus: EmploymentStatusSchema.default("active"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Employee = z.infer<typeof EmployeeSchema>;

export const EmployeeListItemSchema = EmployeeSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  jobTitle: true,
  department: true,
  isActive: true,
});
export type EmployeeListItem = z.infer<typeof EmployeeListItemSchema>;

export const EmployeeListResponseSchema = z.object({
  data: z.array(EmployeeListItemSchema),
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
});
export type EmployeeListResponse = z.infer<typeof EmployeeListResponseSchema>;
