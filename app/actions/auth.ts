"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

function getValidUsers(): Map<string, string> {
  const users = new Map<string, string>();

  // Primary user (default: admin / admin123)
  const primaryUser = process.env.AUTH_USERNAME || "admin";
  const primaryPass = process.env.AUTH_PASSWORD || "admin123";
  users.set(primaryUser, primaryPass);

  // Secondary user (default: kpi_user / kpi_pass1234)
  const secondaryUser = process.env.AUTH_USERNAME_2 || "kpi_user";
  const secondaryPass = process.env.AUTH_PASSWORD_2 || "kpi_pass1234";
  users.set(secondaryUser, secondaryPass);

  // Call Center user (default: usercc1 / usercc1_password)
  const ccUser = process.env.AUTH_USERNAME_3 || "usercc1";
  const ccPass = process.env.AUTH_PASSWORD_3 || "usercc1_password";
  users.set(ccUser, ccPass);

  // Additional users configured via AUTH_USERNAME_* / AUTH_PASSWORD_*
  for (const [key, value] of Object.entries(process.env)) {
    const match = key.match(/^AUTH_USERNAME_(\w+)$/);
    if (match && value) {
      const suffix = match[1];
      const pass = process.env[`AUTH_PASSWORD_${suffix}`];
      if (pass) {
        users.set(value, pass);
      }
    }
  }

  // JSON formatted AUTH_USERS (e.g. '{"user": "pass"}')
  if (process.env.AUTH_USERS) {
    try {
      const parsed = JSON.parse(process.env.AUTH_USERS);
      if (typeof parsed === "object" && parsed !== null) {
        for (const [u, p] of Object.entries(parsed)) {
          if (typeof p === "string") {
            users.set(u, p);
          }
        }
      }
    } catch {
      // Ignore JSON parse error
    }
  }

  return users;
}

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password harus diisi." };
  }

  const validUsers = getValidUsers();
  const expectedPassword = validUsers.get(username);

  if (!expectedPassword || expectedPassword !== password) {
    return { error: "Username atau password salah." };
  }

  await createSession({ username });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
