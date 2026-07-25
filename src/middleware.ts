import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("verdict-session");
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes and /api/keys
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/keys")) {
    if (!sessionCookie || !sessionCookie.value) {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/keys/:path*"],
};
