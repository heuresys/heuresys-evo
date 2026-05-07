import hkdf from '@panva/hkdf';
import { jwtDecrypt, type JWTPayload } from 'jose';

export interface NextAuthV4Payload extends JWTPayload {
  id?: string;
  username?: string;
  role?: string;
  tenantId?: string;
  email?: string;
  name?: string;
}

const HKDF_INFO_V4 = 'NextAuth.js Generated Encryption Key';
const KEY_LENGTH = 32;

export async function decodeNextAuthV4Token(
  token: string,
  secret: string
): Promise<NextAuthV4Payload | null> {
  if (!token || !secret) return null;
  try {
    const encryptionKey = await hkdf('sha256', secret, '', HKDF_INFO_V4, KEY_LENGTH);
    const { payload } = await jwtDecrypt(token, encryptionKey, {
      contentEncryptionAlgorithms: ['A256GCM'],
      keyManagementAlgorithms: ['dir'],
    });
    return payload as NextAuthV4Payload;
  } catch {
    return null;
  }
}
