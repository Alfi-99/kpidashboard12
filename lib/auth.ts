import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "kpi_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "kpi-local-dev-secret-change-me"),
);

type SessionPayload = { username: string };

export async function createSession(payload: SessionPayload) {
  if (!secret.length) throw new Error("SESSION_SECRET is required in production");
  const token = await new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.username)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !secret.length) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { username: payload.sub };
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
