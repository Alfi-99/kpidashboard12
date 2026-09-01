import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect("/dashboard");

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-mark">K</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 760, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              KPI Dashboard
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Performance Monitoring
            </div>
          </div>
        </div>

        <span className="status-dot"><i />Sistem operasional</span>
        <h2>Selamat datang</h2>
        <p>Masuk untuk mengakses dashboard KPI.</p>

        <LoginForm />
      </div>
    </main>
  );
}
