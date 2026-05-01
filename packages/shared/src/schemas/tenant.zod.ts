import { z } from "zod";

export const TenantIdSchema = z.string().uuid();
export type TenantId = z.infer<typeof TenantIdSchema>;

export const SubscriptionPlanSchema = z.enum([
  "starter",
  "growth",
  "enterprise",
  "custom",
]);
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const CompanySizeSchema = z.enum(["MICRO", "SMALL", "MEDIUM", "LARGE"]);
export type CompanySize = z.infer<typeof CompanySizeSchema>;

export const TenantStatusSchema = z.enum([
  "configuring",
  "active",
  "suspended",
  "archived",
]);
export type TenantStatus = z.infer<typeof TenantStatusSchema>;

export const TenantSchema = z.object({
  id: TenantIdSchema,
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  region: z.string().max(100).nullable().optional(),
  status: TenantStatusSchema.default("configuring"),
  subscriptionPlan: SubscriptionPlanSchema.default("starter"),
  companySize: CompanySizeSchema.nullable().optional(),
  industryType: z.string().max(100).nullable().optional(),
  employeeCount: z.number().int().nonnegative().default(0),
  setupCompleted: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Tenant = z.infer<typeof TenantSchema>;

export const PublicTenantSchema = TenantSchema.pick({
  id: true,
  code: true,
  name: true,
  status: true,
  subscriptionPlan: true,
});
export type PublicTenant = z.infer<typeof PublicTenantSchema>;
