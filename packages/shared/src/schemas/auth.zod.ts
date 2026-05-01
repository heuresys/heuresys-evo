import { z } from "zod";
import { RoleSchema } from "../auth/role.js";

export const LoginCredentialsSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(8).max(256),
});
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const TotpChallengeSchema = z.object({
  challengeToken: z.string().min(20),
  totpCode: z.string().regex(/^\d{6}$/, "TOTP must be 6 digits"),
});
export type TotpChallenge = z.infer<typeof TotpChallengeSchema>;

export const TotpRecoveryChallengeSchema = z.object({
  challengeToken: z.string().min(20),
  recoveryCode: z.string().min(8).max(64),
});
export type TotpRecoveryChallenge = z.infer<typeof TotpRecoveryChallengeSchema>;

export const LoginResponsePendingTotpSchema = z.object({
  status: z.literal("pending_totp"),
  challengeToken: z.string(),
  expiresAt: z.coerce.date(),
});

export const LoginResponseSuccessSchema = z.object({
  status: z.literal("authenticated"),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    role: RoleSchema,
    tenantId: z.string().uuid().nullable(),
    employeeId: z.string().uuid().nullable(),
  }),
});

export const LoginResponseSchema = z.discriminatedUnion("status", [
  LoginResponsePendingTotpSchema,
  LoginResponseSuccessSchema,
]);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  username: z.string(),
  role: RoleSchema,
  tenantId: z.string().uuid().nullable(),
  employeeId: z.string().uuid().nullable(),
  permissions: z.array(z.string()).default([]),
  iat: z.number().int(),
  exp: z.number().int(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const SessionUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: RoleSchema,
  tenantId: z.string().uuid().nullable(),
  employeeId: z.string().uuid().nullable(),
  permissions: z.array(z.string()).default([]),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;
