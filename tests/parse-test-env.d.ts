export interface TestEnvUser {
  role: string;
  username: string;
  password: string;
  tenant: string;
}

export const TEST_ENV_PATH: string;

export function parseTestEnv(filePath?: string): TestEnvUser[];
export function getCanonicalUsersByRole(filePath?: string): Record<string, TestEnvUser>;
export function getCanonicalUsernames(filePath?: string): string[];
