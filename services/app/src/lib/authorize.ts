import bcrypt from 'bcryptjs';

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

/**
 * Authorize a credentials login. Pure function (DB + bcrypt injected) to make
 * unit-testing trivial. Returns the user shape NextAuth expects, or null on
 * any failure (don't leak which step failed — same null treats anonymous,
 * unknown user, and bad password identically).
 */
export async function authorizeCredentials(
  prisma: AuthorizePrismaShape,
  env: AuthorizeEnv,
  credentials: AuthorizeCredentials | undefined,
  bcryptCompare: (plaintext: string, hash: string) => Promise<boolean> = DEFAULT_BCRYPT_COMPARE
): Promise<AuthorizeUser | null> {
  const username = credentials?.username;
  const password = credentials?.password;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return null;
  }

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
