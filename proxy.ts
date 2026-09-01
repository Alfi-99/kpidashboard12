// proxy.ts (Next.js 16+ Proxy convention replacing deprecated middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "kpi_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "kpi-local-dev-secret-change-me"),
);

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build security response wrapper to attach CSP & hardening headers for VA compliance
  const applySecurityHeaders = (response: NextResponse) => {
    // Content Security Policy (CSP)
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: blob: https:;
      connect-src 'self' https://docs.google.com https://*.google.com https://*.googleapis.com;
      frame-ancestors 'none';
      form-action 'self';
      base-uri 'self';
      object-src 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();

    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=()");
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-DNS-Prefetch-Control", "on");

    return response;
  };

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Allow public paths (/login, /api/*)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Check for valid session token
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
  }

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return applySecurityHeaders(NextResponse.next());
  } catch {
    return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
