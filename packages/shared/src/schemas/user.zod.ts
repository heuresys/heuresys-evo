import { z } from "zod";
import { RoleSchema } from "../auth/role.js";

export const UserIdSchema = z.string().uuid();
export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = z.object({
  id: UserIdSchema,
  username: z.string().min(1).max(100),
  role: RoleSchema,
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  lastLogin: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  employeeId: z.string().uuid().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  totpEnabled: z.boolean().default(false),
});
export type User = z.infer<typeof UserSchema>;

export const PublicUserSchema = UserSchema.omit({
  permissions: true,
  deletedAt: true,
});
export type PublicUser = z.infer<typeof PublicUserSchema>;
