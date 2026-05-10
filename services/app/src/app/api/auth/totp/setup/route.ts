/**
 * TOTP setup endpoint (S28-bis Wave 10 M10 scaffold).
 *
 * POST /api/auth/totp/setup
 *
 * Genera un secret TOTP per l'utente autenticato e restituisce:
 * - secret (base32)
 * - otpauth_url (per QR code)
 * - qrcode (data URL PNG, opzionale)
 *
 * Il secret NON viene salvato nel DB finché l'utente non conferma il codice
 * via /api/auth/totp/verify (separato).
 *
 * Status:
 *   200 - { secret, otpauth_url, qrcode }
 *   401 - unauthenticated
 *   409 - totp_already_enabled (use disable + re-setup flow)
 *
 * **Wave 10 scaffold**: handler + tests. UI wizard + integrazione login flow
 * defer S29+ (registry M10 effort 20-30h).
 */
import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

// Issuer identifier shown in TOTP authenticator app (e.g. "Heuresys (alice@rtl-bank.org)")
const ISSUER = 'Heuresys';

export async function POST() {
  // TOTP setup è user-self action; map a area generica AUDIT_LOG (read-protected)
  // come pattern per evitare di esporre senza gate. In S29+ mappare a area MFA dedicata.
  const guard = await requirePermissionApi('AUDIT_LOG', 'CREATE');
  if (!guard.ok) return guard.response;
  const { user } = guard;

  // Check current TOTP state
  const u = await prisma.users.findUnique({
    where: { id: user.id },
    select: { id: true, username: true, totp_enabled: true },
  });
  if (!u) {
    return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  }
  if (u.totp_enabled) {
    return NextResponse.json({ error: 'totp_already_enabled' }, { status: 409 });
  }

  const secret = authenticator.generateSecret();
  const accountLabel = u.username.includes('@') ? u.username : `${u.username}@heuresys.local`;
  const otpauthUrl = authenticator.keyuri(accountLabel, ISSUER, secret);
  const qrcode = await QRCode.toDataURL(otpauthUrl);

  // NOTE: secret returned to client BUT NOT saved to DB until verify confirms code.
  // Client deve mostrare QR + chiedere user di insert codice → POST /verify con secret + code.
  return NextResponse.json({
    secret,
    otpauthUrl,
    qrcode,
    issuer: ISSUER,
    account: accountLabel,
  });
}
