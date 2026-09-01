// components/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="login-form-spacing">
      <label className="field-label">
        <span>Username</span>
        <span className="field-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <input name="username" type="text" placeholder="Masukkan username" required autoComplete="username" />
        </span>
      </label>

      <label className="field-label">
        <span>Password</span>
        <span className="field-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input name="password" type="password" placeholder="Masukkan password" minLength={4} required autoComplete="current-password" />
        </span>
      </label>

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}

      <button className="primary-button" style={{ width: "100%", marginTop: "8px" }} disabled={pending} type="submit">
        {pending ? "Memverifikasi..." : "Masuk"}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </form>
  );
}
