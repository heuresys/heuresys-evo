import bcrypt from 'bcryptjs';

/**
 * L57 (S23-quater): bcrypt rotation policy.
 * 256/265 active users hanno hash con cost <12 (default bcryptjs cost 10).
 * Al successful login, rehash transparente con cost canonical e UPDATE row.
 * Strategia "one-shot": user non si accorge di nulla; la rotation completa
 * naturalmente man mano che i users si autenticano.
 */
const CANONICAL_BCRYPT_COST = 12;
const BCRYPT_PREFIX_RE = /^\$2[aby]\$(\d{2})\$/;

function detectBcryptCost(hash: string): number | null {
  const m = hash.match(BCRYPT_PREFIX_RE);
  if (!m) return null;
  const cost = parseInt(m[1] ?? '', 10);
  return Number.isFinite(cost) ? cost : null;
}

export type AuthorizeUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  tenantId: string;
};

export type AuthorizePrismaShape = {
  users: {
    findFirst: (args: {
      where: { username: string; is_active: boolean; deleted_at: null };
      select: {
        id: true;
        username: true;
        password_hash: true;
        role: true;
        employee_id: true;
        totp_enabled: true;
      };
    }) => Promise<{
      id: string;
      username: string;
      password_hash: string | null;
      role: string | null;
      employee_id: string | null;
      totp_enabled: boolean;
    } | null>;
    update?: (args: {
      where: { id: string };
      data: { password_hash: string; updated_at: Date };
    }) => Promise<unknown>;
  };
  employees: {
    findUnique: (args: {
      where: { id: string };
      select: { tenant_id: true };
    }) => Promise<{ tenant_id: string | null } | null>;
  };
};

export type AuthorizeEnv = {
  DEFAULT_SUPERUSER_TENANT_ID?: string;
};

export type AuthorizeCredentials = {
  username?: unknown;
  password?: unknown;
};

const DEFAULT_BCRYPT_COMPARE = bcrypt.compare.bind(bcrypt);
const DEFAULT_BCRYPT_HASH = bcrypt.hash.bind(bcrypt);

/**
 * Authorize a credentials login. Pure function (DB + bcrypt injected) to make
 * unit-testing trivial. Returns the user shape NextAuth expects, or null on
 * any failure (don't leak which step failed — same null treats anonymous,
 * unknown user, and bad password identically).
 *
 * L57 side-effect: rehash transparente del password_hash se cost <12
 * (canonical). Errore di rehash NON blocca login (fire-and-error-tolerate).
 */
export async function authorizeCredentials(
  prisma: AuthorizePrismaShape,
  env: AuthorizeEnv,
  credentials: AuthorizeCredentials | undefined,
  bcryptCompare: (plaintext: string, hash: string) => Promise<boolean> = DEFAULT_BCRYPT_COMPARE,
  bcryptHash: (plaintext: string, cost: number) => Promise<string> = DEFAULT_BCRYPT_HASH
): Promise<AuthorizeUser | null> {
  const username = credentials?.username;
  const password = credentials?.password;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return null;
  }

  // SAFE: pre-auth lookup, no tenant context yet (resolved post-bcrypt)
  const user = await prisma.users.findFirst({
    where: { username, is_active: true, deleted_at: null },
    select: {
      id: true,
      username: true,
      password_hash: true,
      role: true,
      employee_id: true,
      totp_enabled: true,
    },
  });

  if (!user || !user.password_hash) return null;

  const ok = await bcryptCompare(password, user.password_hash);
  if (!ok) return null;

  // L57: rehash al login se cost <12 (one-shot rotation).
  // Errore qui MAI blocca login (await with try/catch).
  const currentCost = detectBcryptCost(user.password_hash);
  if (currentCost !== null && currentCost < CANONICAL_BCRYPT_COST && prisma.users.update) {
    try {
      const newHash = await bcryptHash(password, CANONICAL_BCRYPT_COST);
      await prisma.users.update({
        where: { id: user.id },
        data: { password_hash: newHash, updated_at: new Date() },
      });
    } catch (err) {
      // Non-blocking: log and continue. User logs in successfully anyway.
      const detail = err instanceof Error ? err.message : String(err);
      console.warn(`[authorize] bcrypt rotation failed for user ${user.id}: ${detail}`);
    }
  }

  let tenantId: string | null = null;
  if (user.employee_id) {
    const emp = await prisma.employees.findUnique({
      where: { id: user.employee_id },
      select: { tenant_id: true },
    });
    tenantId = emp?.tenant_id ?? null;
  }
  if (!tenantId) {
    tenantId = env.DEFAULT_SUPERUSER_TENANT_ID ?? null;
  }

  // Post-L50 canonical convention: tenant users have username == work email
  // (firstname.lastname@tenant.domain). Platform users (e.g. sysadmin) keep a
  // bare token; for those we still synth an `@heuresys.local` placeholder so
  // NextAuth has a well-formed email field.
  const email = user.username.includes('@') ? user.username : `${user.username}@heuresys.local`;
  return {
    id: user.id,
    name: user.username,
    email,
    username: user.username,
    role: user.role ?? 'EMPLOYEE',
    tenantId: tenantId ?? '',
  };
}
