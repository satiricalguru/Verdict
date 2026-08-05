import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "verdict-session";

async function getSessionSecret(): Promise<CryptoKey> {
  const secret = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("ENCRYPTION_KEY environment variable is required.");
  }
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function verifySessionValue(value: string): Promise<boolean> {
  const parts = value.split(":");
  if (parts.length !== 3) return false;
  const [userId, expiresStr, signature] = parts;
  const expires = Number(expiresStr);
  if (!userId || !Number.isFinite(expires) || expires < Date.now()) return false;

  try {
    const key = await getSessionSecret();
    const enc = new TextEncoder();
    const sig = new Uint8Array(
      await crypto.subtle.sign("HMAC", key, enc.encode(`${userId}:${expires}`))
    );
    const expectedHex = Array.from(sig)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison of the hex-encoded signature
    if (signature.length !== expectedHex.length) return false;
    let diff = 0;
    for (let i = 0; i < signature.length; i++) {
      diff |= signature.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/keys");
  if (!isProtected) {
    return NextResponse.next();
  }

  const valid =
    sessionCookie?.value && (await verifySessionValue(sessionCookie.value));

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/keys/:path*"],
};
