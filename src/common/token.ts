import { createHmac, randomBytes } from 'node:crypto';

export function createSignedToken(payload: Record<string, unknown>, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function verifySignedToken(token: string, secret: string) {
  const [body, signature] = token.split('.');
  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret).update(body).digest('base64url');
  if (expectedSignature !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function createOpaqueToken() {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string, secret: string) {
  return createHmac('sha256', secret).update(token).digest('hex');
}

/** Generate a cryptographically random 6-digit OTP string. */
export function createOtpCode(): string {
  // Generates a number between 100000 and 999999
  const bytes = randomBytes(4).readUInt32BE(0);
  return String(100_000 + (bytes % 900_000));
}
