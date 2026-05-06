import { randomBytes } from 'node:crypto';

const MIN_LENGTH = 12;
const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_DIGIT = /[0-9]/;
const HAS_SPECIAL = /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/;

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  if (typeof password !== 'string' || password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
  }
  if (!HAS_UPPER.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!HAS_LOWER.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!HAS_DIGIT.test(password)) errors.push('Password must contain at least one digit');
  if (!HAS_SPECIAL.test(password))
    errors.push('Password must contain at least one special character');
  return { valid: errors.length === 0, errors };
}

export function generateSecurePassword(length: number = 16): string {
  if (length < MIN_LENGTH) length = MIN_LENGTH;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specials = '!@#$%^&*';
  const allChars = lowercase + uppercase + digits + specials;

  const guaranteed: string[] = [];
  const guaranteedBytes = randomBytes(4);
  guaranteed.push(uppercase[guaranteedBytes[0]! % uppercase.length]!);
  guaranteed.push(lowercase[guaranteedBytes[1]! % lowercase.length]!);
  guaranteed.push(digits[guaranteedBytes[2]! % digits.length]!);
  guaranteed.push(specials[guaranteedBytes[3]! % specials.length]!);

  const remaining = length - guaranteed.length;
  const remainingBytes = randomBytes(remaining);
  for (let i = 0; i < remaining; i++) {
    guaranteed.push(allChars[remainingBytes[i]! % allChars.length]!);
  }

  const shuffleBytes = randomBytes(guaranteed.length);
  return guaranteed
    .map((char, i) => ({ char, sort: shuffleBytes[i]! }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.char)
    .join('');
}
