"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password harus diisi." };
  }

  const validUser = process.env.AUTH_USERNAME || "admin";
  const validPass = process.env.AUTH_PASSWORD || "admin123";

  if (username !== validUser || password !== validPass) {
    return { error: "Username atau password salah." };
  }

  await createSession({ username });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
