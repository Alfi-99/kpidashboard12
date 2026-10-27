// app/dashboard/KpiDashboardClient.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import type { KpiDashboardData } from "@/lib/types";
import AchievementGauge from "@/components/AchievementGauge";
import MonthlyComparisonTable from "@/components/MonthlyComparisonTable";
import MultiMonthTrendTable from "@/components/MultiMonthTrendTable";
import RegionalTrendChart from "@/components/RegionalTrendChart";
import RegionalComparisonWidget from "@/components/RegionalComparisonWidget";
import SummaryHighlight from "@/components/SummaryHighlight";
import TabSelector from "@/components/TabSelector";
import TopNav from "@/components/TopNav";
import { logoutAction } from "@/app/actions/auth";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface KpiDashboardClientProps {
  dashboardData: KpiDashboardData;
}

export default function KpiDashboardClient({ dashboardData }: KpiDashboardClientProps) {
  const [activeTab, setActiveTab] = useState(dashboardData.tabs[0]?.tabKey || "callCenter");
  const [selectedPeriod, setSelectedPeriod] = useState("2026-10");
  const [isDark, setIsDark] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const { data: liveData, isValidating, mutate } = useSWR<KpiDashboardData>(`/api/kpi?period=${selectedPeriod}`, fetcher, {
    fallbackData: dashboardData,
    refreshInterval: 10000,
    keepPreviousData: true,
    onSuccess: () => setLastSyncedAt(new Date()),
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

  const parsedNasionalScore = currentTabData?.regionalComparison?.nasionalScore
    ? parseFloat(currentTabData.regionalComparison.nasionalScore.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""))
    : null;
  const gaugeValue = parsedNasionalScore && !isNaN(parsedNasionalScore) && parsedNasionalScore > 0
    ? parsedNasionalScore
    : currentTabData.totalAchievement;

  const syncData = async () => {
    await mutate();
  };

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Top Navigation */}
      <TopNav isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "290px 1fr",
          minHeight: "calc(100vh - 52px)",
        }}
      >
        {/* ─── Left Sidebar ─── */}
        <aside
          className="animate-fade-in-up"
          style={{
            background: "var(--sidebar-bg)",
            borderRight: `1px solid rgba(255, 255, 255, 0.06)`,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "sticky",
            top: "52px",
            height: "calc(100vh - 52px)",
            overflowY: "auto",
            color: "var(--sidebar-text)",
          }}
        >
          {/* Dashboard Title */}
          <div>
            <h1 style={{
              fontSize: "21px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}>
              Dashboard KPI
            </h1>
            <p style={{
              fontSize: "10px",
              color: "var(--sidebar-muted)",
              marginTop: "4px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Performance Monitoring
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />

          {/* Achievement Nasional Donut */}
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
            <AchievementGauge
              value={gaugeValue}
              label="Achievement Nasional"
              size="lg"
            />
          </div>

          {/* Regional Comparison Widget (BDG vs SMG vs Nasional) */}
          <RegionalComparisonWidget
            hasComparison={currentTabData.hasComparison}
            regionalComparison={currentTabData.regionalComparison}
            periodLabel={activeData.selectedPeriod}
          />

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />

          {/* Summary Highlight */}
          <SummaryHighlight items={currentTabData.summaryHighlight} />
        </aside>

        {/* ─── Right Content ─── */}
        <main className="dot-pattern" style={{ padding: "28px 32px", overflowY: "auto" }}>
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
                <option value="2026-10">Oktober 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-03">March 2026</option>
                <option value="2026-02">February 2026</option>
                <option value="2026-01">January 2026</option>
              </select>
            </div>

            {/* Manual Google Sheets sync */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
              <button
                type="button"
                onClick={syncData}
                disabled={isValidating}
                aria-label="Sinkronkan data Google Sheets"
                className="primary-button"
                style={{
                  minHeight: "38px",
                  padding: "0 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  opacity: isValidating ? 0.7 : 1,
                  cursor: isValidating ? "wait" : "pointer",
                }}
              >
                <svg
                  className={isValidating ? "animate-spin" : ""}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
                </svg>
                {isValidating ? "Menyinkronkan..." : "Sinkronkan Data"}
              </button>
              <span style={{ fontSize: "9.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                {lastSyncedAt
                  ? `Terakhir: ${lastSyncedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                  : "Belum disinkronkan"}
              </span>
            </div>
          </div>

          {/* GSheet Live Update Reference Bar */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              padding: "10px 16px",
              marginBottom: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "10px",
              fontSize: "11.5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                  fontWeight: 800,
                  fontSize: "11px",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: "0 0 6px #10B981",
                  }}
                />
                Acuan Cut-Off GSheet: {activeData.lastUpdatedGSheet?.sheetCutoffNote || (activeData.lastUpdatedGSheet?.cutoffDate ? `Cut-off ${activeData.lastUpdatedGSheet.cutoffDate}` : `Terisi s/d ${activeData.lastUpdatedGSheet?.latestDataPeriod || activeData.selectedPeriod}`)}
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                Status Data: <strong>Call Center</strong> ({activeData.lastUpdatedGSheet?.callCenterLatestMonth || "Sep 2026"}) • <strong>e-Care</strong> ({activeData.lastUpdatedGSheet?.eCareLatestMonth || "Sep 2026"})
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", color: "var(--text-muted)", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>
                  Update Terakhir di GSheet:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {activeData.lastUpdatedGSheet?.formattedGsheetLastModified || activeData.lastUpdatedGSheet?.driveModifiedTime || (activeData.lastUpdatedGSheet?.cutoffDate ? `${activeData.lastUpdatedGSheet.cutoffDate}` : "20 Oktober 2026")}
                  </strong>
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", opacity: 0.85 }}>
                (Sinkron Web: {lastSyncedAt
                  ? lastSyncedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
                  : "Terkini"})
              </span>
            </div>
          </div>

          {/* Fallback Notice for tabs where current month is not yet in GSheet */}
          {currentTabData.isFallbackPeriod && (
            <div style={{
              marginBottom: "18px",
              padding: "12px 18px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#d97706",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "15px" }}>ℹ️</span>
              <span>
                Data <strong>{currentTabData.tabName}</strong> untuk periode <strong>{activeData.selectedPeriod}</strong> belum tersedia di Google Sheets. Menampilkan data historis terkini (<strong>{currentTabData.effectivePeriodLabel || "September 2026"}</strong>).
              </span>
            </div>
          )}

          {/* Monthly Comparison Table */}
          {currentTabData.monthlyComparison && currentTabData.monthlyComparison.length > 0 && (
            <MonthlyComparisonTable
              rows={currentTabData.monthlyComparison}
              period={activeData.selectedPeriod}
              hasComparison={currentTabData.hasComparison}
            />
          )}

          {/* Daily / Multi-Month Trend Table (Januari s/d MTD) */}
          {currentTabData.multiMonthRows && currentTabData.multiMonthRows.length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <MultiMonthTrendTable
                rows={currentTabData.multiMonthRows}
                channelName={currentTabData.tabName}
                activePeriod={activeData.selectedPeriod}
              />
            </div>
          )}

          {/* Interactive Regional Trend Chart (Nasional, Semarang, Bandung dari Bulan ke Bulan) */}
          {currentTabData.regionalMonthlyTrends && currentTabData.regionalMonthlyTrends.length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <RegionalTrendChart
                trends={currentTabData.regionalMonthlyTrends}
                channelName={currentTabData.tabName}
                activePeriod={activeData.selectedPeriod}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
