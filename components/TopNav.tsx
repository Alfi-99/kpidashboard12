// components/TopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopNavProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export default function TopNav({ isDark, onToggleTheme, onLogout }: TopNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard", label: "Dashboard KPI", icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      href: "/scorecard", label: "ScoreCard Contact Center", icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
        </svg>
      )
    },
  ];

  return (
    <nav className="top-nav">
      <Link href="/dashboard" className="top-nav-brand">
        <span className="top-nav-brand-mark">K</span>
        <span className="top-nav-brand-text">KPI Dashboard</span>
      </Link>

      <div className="top-nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`top-nav-link ${pathname === link.href ? "active" : ""}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      <div className="top-nav-actions">
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <div className="theme-toggle-knob">
            {isDark ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </div>
        </button>

        {/* Logout */}
        {onLogout && (
          <button className="top-nav-logout" onClick={onLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Keluar
          </button>
        )}
      </div>
    </nav>
  );
}
