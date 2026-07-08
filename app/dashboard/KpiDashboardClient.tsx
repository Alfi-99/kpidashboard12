// app/dashboard/KpiDashboardClient.tsx
"use client";

import { useState } from "react";
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
  const { data: liveData } = useSWR<KpiDashboardData>("/api/kpi", fetcher, {
    fallbackData: dashboardData,
    refreshInterval: 10000, // Poll every 10 seconds for real-time updates
  });

  const activeData = liveData || dashboardData;

  const [activeTab, setActiveTab] = useState(activeData.tabs[0]?.tabKey || "callCenter");
  const [selectedPeriod, setSelectedPeriod] = useState("2026-07");

  const tabs = activeData.tabs.map((t) => ({
    key: t.tabKey,
    label: t.tabName,
  }));

  const currentTabData = activeData.tabs.find((t) => t.tabKey === activeTab) || activeData.tabs[0];

  // Helper to calculate days count dynamically based on the selected year and month
  const getDaysInMonth = (periodStr: string) => {
    const [year, month] = periodStr.split("-").map(Number);
    // Setting day = 0 returns the last day of the previous month (which is the month we passed since it's 1-indexed)
    return new Date(year, month, 0).getDate();
  };

  const daysCount = getDaysInMonth(selectedPeriod);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "var(--font-inter)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "290px 1fr",
          minHeight: "100vh",
        }}
      >
        {/* ─── Left Sidebar ─── */}
        <aside
          className="animate-fade-in-up"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #FFF9F9 100%)",
            borderRight: "1px solid #FEE2E2",
            padding: "30px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            boxShadow: "2px 0 10px rgba(228, 0, 43, 0.02)",
          }}
        >
          {/* Dashboard Title */}
          <div>
            <h1 style={{
              fontSize: "21px",
              fontWeight: 800,
              color: "#A8001C",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}>
              Dashboard KPI
            </h1>
            <p style={{
              fontSize: "11px",
              color: "#9CA3AF",
              marginTop: "4px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}>
              Performance Monitoring & Overview
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#FEE2E2" }} />

          {/* Total Achievement Donut */}
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
            <AchievementGauge
              value={currentTabData.totalAchievement}
              label="Total Achievement"
              size="lg"
            />
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#FEE2E2" }} />

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
            borderBottom: "1px solid #F3F4F6",
            paddingBottom: "16px",
          }}>
            {/* Tab Selector */}
            <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Period Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#A8001C",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
              }}>
                Periode Month :
              </span>
              <div style={{ position: "relative" }}>
                <select
                  id="period-filter"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    padding: "8px 36px 8px 16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    borderRadius: "20px",
                    border: "1px solid #FCA5A5",
                    color: "#A8001C",
                    background: "#FFF5F5",
                    cursor: "pointer",
                    minWidth: "150px",
                    outline: "none",
                    fontFamily: "inherit",
                    boxShadow: "0 1px 3px rgba(228, 0, 43, 0.05)",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#E4002B";
                    e.target.style.boxShadow = "0 0 0 3px rgba(228, 0, 43, 0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#FCA5A5";
                    e.target.style.boxShadow = "0 1px 3px rgba(228, 0, 43, 0.05)";
                  }}
                >
                  <option value="2026-07">July 2026</option>
                  <option value="2026-06">June 2026</option>
                  <option value="2026-05">May 2026</option>
                  <option value="2026-04">April 2026</option>
                  <option value="2026-02">February 2026</option>
                </select>
                <svg
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="#E4002B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
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
