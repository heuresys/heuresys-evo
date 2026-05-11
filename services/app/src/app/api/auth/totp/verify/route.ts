/**
 * TOTP verify + enable endpoint (S28-bis Wave 10 M10 scaffold).
 *
 * POST /api/auth/totp/verify
 * Body: { secret: string (base32), code: string (6 digits) }
 *
 * Verifica che il code corrisponda al secret + abilita TOTP per l'utente.
 * Salva secret encrypted nel DB (column totp_secret) + flag totp_enabled=true.
 *
 * Status:
 *   200 - { enabled: true, recoveryCodes?: string[] }  (recovery codes future TODO)
 *   400 - invalid_body | invalid_code
 *   401 - unauthenticated
 *
 * **Wave 10 scaffold**: handler + 1 test. Encryption secret via env TOTP_KEY
 * (TODO S29+: integrazione KMS proper). Recovery codes generation defer.
 */
import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { z } from 'zod';
import crypto from 'node:crypto';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

const BodySchema = z.object({
  secret: z.string().min(16).max(128),
  code: z.string().regex(/^\d{6}$/),
});

/**
 * Encrypt secret using AES-256-GCM. TOTP_KEY env must be hex 64 chars (32 bytes).
 * Returns: <iv-hex>:<authTag-hex>:<ciphertext-hex>
 *
 * **WARNING Wave 10 scaffold**: production deployment richiede KMS-managed key
 * (es. OCI Vault) — TOTP_KEY env è only safe for dev/scaffold.
 */
function encryptSecret(secret: string): string {
  const keyHex = process.env.TOTP_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('TOTP_KEY env must be set to 64-char hex (32 bytes)');
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${ct.toString('hex')}`;
}

export async function POST(req: Request) {
  const guard = await requirePermissionApi('AUDIT_LOG', 'CREATE');
  if (!guard.ok) return guard.response;
  const { user } = guard;

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: 'invalid_body', detail: err instanceof Error ? err.message : 'parse error' },
      { status: 400 }
    );
  }

  const valid = authenticator.verify({ token: body.code, secret: body.secret });
  if (!valid) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  }

  // Persist encrypted secret + enable flag
  const encryptedSecret = encryptSecret(body.secret);
  // SAFE: user updates own TOTP settings via session-authenticated id (no cross-tenant possible).
  await prisma.users.update({
    where: { id: user.id },
    data: {
      totp_secret: encryptedSecret,
      totp_enabled: true,
      updated_at: new Date(),
    },
  });

  // S29+: generate + return recovery codes (one-time backup codes for lost device)
  return NextResponse.json({
    enabled: true,
    message: 'TOTP enabled successfully. Save your recovery codes (TODO S29+).',
  });
}
