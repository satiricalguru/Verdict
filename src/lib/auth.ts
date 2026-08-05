import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAME = "verdict-session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const PASSWORD_VERSION = "scrypt";

function getSessionSecret(): string {
  const secret =
    process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "CRITICAL SECURITY ERROR: ENCRYPTION_KEY environment variable is required for session signing."
    );
  }
  return secret;
}

/**
 * Signs a session payload (`userId:expires`) with HMAC-SHA256 using the
 * server secret so session cookies cannot be forged by clients.
 */
function signSession(userId: string, expires: number): string {
  const payload = `${userId}:${expires}`;
  const hmac = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}:${hmac}`;
}

/** Verifies signature and expiry of a session cookie value. Returns the userId or null. */
function verifySession(value: string): string | null {
  const parts = value.split(":");
  if (parts.length !== 3) return null;
  const [userId, expiresStr, signature] = parts;
  const expires = Number(expiresStr);
  if (!userId || !Number.isFinite(expires) || expires < Date.now()) return null;

  const expected = crypto
    .createHmac("sha256", getSessionSecret())
    .update(`${userId}:${expires}`)
    .digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  return userId;
}

/**
 * Password hashing — scrypt (memory-hard, salted, versioned).
 * Format: `scrypt$N$r$p$saltHex$hashHex`. Legacy unsalted SHA-256 hashes
 * (plain hex, 64 chars) are still verified for backward compatibility.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = crypto.scryptSync(password, salt, 64, { N, r, p });
  return `${PASSWORD_VERSION}$${N}$${r}$${p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false;

  const parts = stored.split("$");
  if (parts[0] === PASSWORD_VERSION && parts.length === 6) {
    const [, N, r, p, saltHex, hashHex] = parts;
    const salt = Buffer.from(saltHex, "hex");
    const hash = crypto.scryptSync(password, salt, 64, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });
    const expected = Buffer.from(hashHex, "hex");
    return (
      hash.length === expected.length && crypto.timingSafeEqual(hash, expected)
    );
  }

  // Legacy unsalted SHA-256 hash (pre-audit format)
  if (/^[0-9a-f]{64}$/i.test(stored)) {
    const legacy = crypto.createHash("sha256").update(password).digest("hex");
    const a = Buffer.from(legacy);
    const b = Buffer.from(stored);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  return false;
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<void> {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signSession(userId, expires), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const userId = verifySession(sessionCookie.value);
    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.warn("getCurrentUser error:", error);
    return null;
  }
}

/** True when a valid (unforgeable, unexpired) session cookie is present. */
export async function hasValidSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    return Boolean(sessionCookie?.value && verifySession(sessionCookie.value));
  } catch {
    return false;
  }
}
