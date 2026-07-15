// app/dashboard/KpiDashboardClient.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import type { KpiDashboardData } from "@/lib/types";
import AchievementGauge from "@/components/AchievementGauge";
import KpiSectionTable from "@/components/KpiSectionTable";
import SummaryHighlight from "@/components/SummaryHighlight";
import TabSelector from "@/components/TabSelector";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface KpiDashboardClientProps {
  dashboardData: KpiDashboardData;
}

export default function KpiDashboardClient({ dashboardData }: KpiDashboardClientProps) {
  const [activeTab, setActiveTab] = useState(dashboardData.tabs[0]?.tabKey || "callCenter");
  const [selectedPeriod, setSelectedPeriod] = useState("2026-07");
  const [isDark, setIsDark] = useState(true);

  const { data: liveData } = useSWR<KpiDashboardData>(`/api/kpi?period=${selectedPeriod}`, fetcher, {
    fallbackData: dashboardData,
    refreshInterval: 10000,
    keepPreviousData: true,
  });

  const activeData = liveData || dashboardData;

  // Theme toggle: set data-theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const tabs = activeData.tabs.map((t) => ({
    key: t.tabKey,
    label: t.tabName,
  }));

  const currentTabData = activeData.tabs.find((t) => t.tabKey === activeTab) || activeData.tabs[0];

  const getDaysInMonth = (periodStr: string) => {
    const [year, month] = periodStr.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysCount = getDaysInMonth(selectedPeriod);

  return (
    <div className="dot-pattern" style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "var(--font-body)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "290px 1fr",
          minHeight: "100vh",
        }}
      >
        {/* ─── Left Sidebar ─── */}
        <aside
          className="animate-fade-in-up glass-card-static"
          style={{
            borderRight: `1px solid var(--border-default)`,
            borderRadius: 0,
            padding: "30px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Dashboard Title + Theme Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 className="font-heading" style={{
                fontSize: "21px",
                fontWeight: 800,
                color: "var(--accent-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                margin: 0,
              }}>
                Dashboard KPI
              </h1>
              <p style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "4px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}>
                Performance Monitoring
              </p>
            </div>

            {/* Theme Toggle */}
            <button
              className="theme-toggle"
              onClick={() => setIsDark(!isDark)}
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
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border-default)" }} />

          {/* Total Achievement Donut */}
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
            <AchievementGauge
              value={currentTabData.totalAchievement}
              label="Total Achievement"
              size="lg"
            />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--border-default)" }} />

          {/* Summary Highlight */}
          <SummaryHighlight items={currentTabData.summaryHighlight} />
        </aside>

        {/* ─── Right Content ─── */}
        <main style={{ padding: "28px 32px", overflowY: "auto" }}>
          {/* Header Controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "24px",
            marginBottom: "28px",
            flexWrap: "wrap",
            borderBottom: `1px solid var(--border-subtle)`,
            paddingBottom: "16px",
          }}>
            {/* Tab Selector */}
            <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Period Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
              }}>
                Periode Month :
              </span>
              <select
                id="period-filter"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="filter-select"
                style={{ minWidth: "150px" }}
              >
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-02">February 2026</option>
              </select>
            </div>
          </div>

          {/* KPI Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {currentTabData.sections.map((section, index) => (
              <KpiSectionTable
                key={`${activeTab}-${section.name}`}
                section={section}
                daysCount={daysCount}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
