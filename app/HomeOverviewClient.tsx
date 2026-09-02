// app/HomeOverviewClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import type {
  KpiDashboardData,
  ParameterHistoryItem,
  OverallMonthlyTrend,
  CategoryMonthlyTrend,
} from "@/lib/types";
import TopNav from "@/components/TopNav";
import { logoutAction } from "@/app/actions/auth";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface HomeOverviewClientProps {
  initialData: KpiDashboardData;
}

// Fallback overall trends if not returned
const DEFAULT_OVERALL_TRENDS: OverallMonthlyTrend[] = [
  { month: "Jan", callCenter: 95.27, eCare: 88.65, nasional: 91.96, target: 100 },
  { month: "Feb", callCenter: 90.30, eCare: 90.44, nasional: 90.37, target: 100 },
  { month: "Mar", callCenter: 96.15, eCare: 84.60, nasional: 90.38, target: 100 },
  { month: "Apr", callCenter: 87.19, eCare: 80.72, nasional: 83.96, target: 100 },
  { month: "May", callCenter: 89.74, eCare: 76.35, nasional: 83.05, target: 100 },
  { month: "Jun", callCenter: 94.90, eCare: 85.00, nasional: 89.95, target: 100 },
  { month: "Jul", callCenter: 101.00, eCare: 93.55, nasional: 97.28, target: 100 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MasterChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        fontSize: "12px",
      }}
    >
      <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
        Bulan: {label} 2026
      </div>
      {payload.map((entry: { name: string; value: number | string; color: string }, i: number) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            margin: "3px 0",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: entry.color,
                display: "inline-block",
              }}
            />
            <span style={{ fontWeight: 600 }}>{entry.name}:</span>
          </div>
          <strong style={{ color: "var(--text-primary)" }}>
            {typeof entry.value === "number" ? `${entry.value.toFixed(2)}%` : entry.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

// Parameter Item Mini Chart Card
function ParameterChartCard({
  param,
  chartMode,
}: {
  param: ParameterHistoryItem;
  chartMode: "line" | "bar";
}) {
  const chartData = param.history.map((h) => ({
    month: h.month,
    ach: h.ach,
    achTarget: h.achTarget,
    score: h.score,
  }));

  const validValues = param.history.filter((h) => h.ach !== null).map((h) => h.ach as number);
  const minVal = validValues.length > 0 ? Math.min(...validValues) : 0;
  const maxVal = validValues.length > 0 ? Math.max(...validValues) : 100;
  const targetNum = param.targetNum ?? 100;

  const yDomainMin = Math.max(0, Math.floor(Math.min(minVal, targetNum) * 0.85));
  const yDomainMax = Math.ceil(Math.max(maxVal, targetNum) * 1.15);

  const isChannelCC = param.channel === "Call Center";

  return (
    <div
      className="chart-card animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "18px 20px",
        borderRadius: "14px",
        border: "1px solid var(--border-default)",
        background: "var(--bg-card)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Card Header */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: "4px",
                  background: isChannelCC ? "rgba(230, 0, 45, 0.12)" : "rgba(2, 132, 199, 0.12)",
                  color: isChannelCC ? "#E6002D" : "#0284c7",
                  border: `1px solid ${isChannelCC ? "rgba(230, 0, 45, 0.25)" : "rgba(2, 132, 199, 0.25)"}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {param.channel}
              </span>

              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                {param.category}
              </span>
            </div>

            <h4
              style={{
                fontSize: "13.5px",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
              title={param.name}
            >
              {param.name}
            </h4>
          </div>

          {/* Current Month (July) Status Badge */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 800,
                background: param.isPass ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: param.isPass ? "#10B981" : "#EF4444",
                border: `1px solid ${param.isPass ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                whiteSpace: "nowrap",
              }}
            >
              Jul: {param.currentAchStr}
            </span>
          </div>
        </div>

        {/* Target and Bobot Information */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--text-secondary)",
            background: "var(--bg-tertiary)",
            padding: "5px 10px",
            borderRadius: "6px",
            marginBottom: "12px",
          }}
        >
          <span>
            Target: <strong style={{ color: "var(--text-primary)" }}>{param.target}</strong>
          </span>
          <span>
            Bobot: <strong style={{ color: "var(--text-primary)" }}>{param.bobot}</strong>
          </span>
          <span>
            Score: <strong style={{ color: "var(--accent-primary)" }}>{param.currentScore}</strong>
          </span>
        </div>
      </div>

      {/* Chart: Line or Bar (Jan - Jul) */}
      <div style={{ width: "100%", height: 160, margin: "4px 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === "line" ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9.5, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
              <YAxis domain={[yDomainMin, yDomainMax]} tick={{ fontSize: 9.5, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        fontSize: "11px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      }}
                    >
                      <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {label} 2026
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <span>Realisasi:</span>
                        <strong style={{ color: "var(--accent-primary)" }}>
                          {item.ach !== null ? `${item.ach}${param.target.includes("%") ? "%" : ""}` : "—"}
                        </strong>
                      </div>
                      {item.score !== null && (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                          <span>Score:</span>
                          <strong>{item.score}%</strong>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              {param.targetNum !== null && (
                <ReferenceLine
                  y={param.targetNum}
                  stroke="#F59E0B"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ value: `Tgt ${param.target}`, fill: "#F59E0B", fontSize: 8.5, position: "insideTopRight" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="ach"
                name="Realisasi"
                stroke={isChannelCC ? "#E6002D" : "#0284c7"}
                strokeWidth={2.4}
                connectNulls
                dot={{ r: 3.5, fill: isChannelCC ? "#E6002D" : "#0284c7", stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9.5, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
              <YAxis domain={[yDomainMin, yDomainMax]} tick={{ fontSize: 9.5, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        fontSize: "11px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      }}
                    >
                      <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {label} 2026
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <span>Realisasi:</span>
                        <strong style={{ color: "var(--accent-primary)" }}>
                          {item.ach !== null ? `${item.ach}${param.target.includes("%") ? "%" : ""}` : "—"}
                        </strong>
                      </div>
                    </div>
                  );
                }}
              />
              {param.targetNum !== null && (
                <ReferenceLine
                  y={param.targetNum}
                  stroke="#F59E0B"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}
              <Bar dataKey="ach" name="Realisasi" radius={[3, 3, 0, 0]} maxBarSize={20}>
                {chartData.map((entry, index) => {
                  let isMet = false;
                  if (entry.ach !== null && param.targetNum !== null) {
                    isMet = param.isLowerBetter ? entry.ach <= param.targetNum : entry.ach >= param.targetNum;
                  }
                  return (
                    <Cell
                      key={`bar-${index}`}
                      fill={isMet ? "var(--color-success, #10B981)" : "var(--color-danger, #EF4444)"}
                      opacity={0.85}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Definition Preview */}
      {param.definisi && (
        <div
          style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            marginTop: "6px",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={param.definisi}
        >
          {param.definisi}
        </div>
      )}
    </div>
  );
}

export default function HomeOverviewClient({ initialData }: HomeOverviewClientProps) {
  const [isDark, setIsDark] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"callCenter" | "eCare">("callCenter");
  const [masterChartType, setMasterChartType] = useState<"line" | "bar">("line");
  const [paramChartMode, setParamChartMode] = useState<"line" | "bar">("line");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: liveData, isValidating, mutate } = useSWR<KpiDashboardData>(
    `/api/kpi?period=2026-07`,
    fetcher,
    {
      fallbackData: initialData,
      refreshInterval: 10000,
      keepPreviousData: true,
    }
  );

  const activeData = liveData || initialData;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogout = () => {
    logoutAction();
  };

  const isCC = activeChannel === "callCenter";
  const channelLabel = isCC ? "Call Center" : "e-Care";
  const channelColor = isCC ? "#E6002D" : "#0284c7";
  const channelColorLight = isCC ? "rgba(230, 0, 45, 0.12)" : "rgba(2, 132, 199, 0.12)";
  const channelGradient = isCC
    ? "linear-gradient(90deg, #E6002D, #FF4D6E)"
    : "linear-gradient(90deg, #0284c7, #38bdf8)";

  // Extract tab data for active channel
  const activeTab = activeData.tabs.find((t) => t.tabKey === activeChannel) || activeData.tabs[0];

  const getScore = (tab: typeof activeTab) => {
    if (!tab) return 100;
    const parsed = tab.regionalComparison?.nasionalScore
      ? parseFloat(tab.regionalComparison.nasionalScore.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""))
      : null;
    return parsed && !isNaN(parsed) && parsed > 0 ? parsed : tab.totalAchievement;
  };

  const channelScore = getScore(activeTab);

  // Category scores from sections
  const revenueSection = activeTab?.sections?.find((s) => s.name.toLowerCase().includes("revenue"));
  const cxSection = activeTab?.sections?.find((s) => s.name.toLowerCase().includes("customer"));
  const ipSection = activeTab?.sections?.find((s) => s.name.toLowerCase().includes("internal"));

  // Overall monthly trend data — filtered to active channel only
  const overallTrendsData = useMemo(() => {
    const raw = activeData.overallTrends && activeData.overallTrends.length > 0
      ? activeData.overallTrends
      : DEFAULT_OVERALL_TRENDS;

    return raw.map((m) => ({
      month: m.month,
      score: isCC ? m.callCenter : m.eCare,
      target: m.target,
    }));
  }, [activeData.overallTrends, isCC]);

  // Category trends for the active channel
  const categoryTrendsForChannel = useMemo(() => {
    if (!activeData.categoryTrends) return [];
    return activeData.categoryTrends.filter((ct) =>
      isCC ? ct.channel === "Call Center" : ct.channel === "e-Care"
    );
  }, [activeData.categoryTrends, isCC]);

  // Parameter histories — filtered to active channel
  const parameterHistories = useMemo(() => {
    return (activeData.parameterHistories || []).filter((p) =>
      isCC ? p.channel === "Call Center" : p.channel === "e-Care"
    );
  }, [activeData.parameterHistories, isCC]);

  // Filtered parameter histories
  const filteredParameters = useMemo(() => {
    return parameterHistories.filter((p) => {
      if (categoryFilter !== "ALL" && !p.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      if (statusFilter === "PASS" && !p.isPass) return false;
      if (statusFilter === "MISS" && p.isPass) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.definisi && p.definisi.toLowerCase().includes(q));
      }
      return true;
    });
  }, [parameterHistories, categoryFilter, statusFilter, searchQuery]);

  const totalParams = parameterHistories.length;
  const passedParams = parameterHistories.filter((p) => p.isPass).length;
  const missedParams = totalParams - passedParams;
  const complianceRate = totalParams > 0 ? Math.round((passedParams / totalParams) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Top Navigation */}
      <TopNav isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 24px 80px 24px" }}>
        {/* ─── Hero & Executive Header ─── */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "28px",
            background: `linear-gradient(135deg, ${channelColorLight} 0%, rgba(74, 0, 14, 0.06) 100%)`,
            border: "1px solid var(--border-strong)",
            borderRadius: "16px",
            padding: "24px 28px",
            backdropFilter: "blur(12px)",
            transition: "background 0.4s ease",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${channelColor} 0%, ${isCC ? "#99001A" : "#0369a1"} 100%)`,
                  boxShadow: `0 2px 10px ${isCC ? "rgba(230, 0, 45, 0.35)" : "rgba(2, 132, 199, 0.35)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </span>
              <h1
                className="font-heading"
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Overview KPI — {channelLabel}
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
              Monitoring Tren Kinerja Bulanan (Januari – Juli 2026) dari Sheet Monthly {channelLabel}
            </p>
          </div>

          {/* Controls: Channel Toggle & Sync */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Channel Toggle Switch */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-card)",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid var(--border-default)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveChannel("callCenter")}
                style={{
                  padding: "8px 18px",
                  fontSize: "12px",
                  fontWeight: 800,
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: isCC
                    ? "linear-gradient(135deg, #E6002D 0%, #CC0028 100%)"
                    : "transparent",
                  color: isCC ? "#fff" : "var(--text-secondary)",
                  boxShadow: isCC ? "0 2px 10px rgba(230, 0, 45, 0.3)" : "none",
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                  </svg>
                  Call Center
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel("eCare")}
                style={{
                  padding: "8px 18px",
                  fontSize: "12px",
                  fontWeight: 800,
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: !isCC
                    ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                    : "transparent",
                  color: !isCC ? "#fff" : "var(--text-secondary)",
                  boxShadow: !isCC ? "0 2px 10px rgba(2, 132, 199, 0.3)" : "none",
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                  </svg>
                  e-Care
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => mutate()}
              disabled={isValidating}
              className="primary-button"
              style={{
                height: "38px",
                padding: "0 16px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                opacity: isValidating ? 0.7 : 1,
              }}
            >
              <svg
                className={isValidating ? "animate-spin" : ""}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
              </svg>
              {isValidating ? "Sync..." : "Sinkronkan"}
            </button>
          </div>
        </div>

        {/* ─── Executive Summary KPI Cards ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {/* Card 1: Total Achievement */}
          <div
            className="glass-card animate-fade-in-up"
            style={{
              padding: "20px 22px",
              background: `linear-gradient(135deg, ${channelColorLight} 0%, var(--bg-card) 100%)`,
              border: `1px solid ${isCC ? "rgba(230, 0, 45, 0.3)" : "rgba(2, 132, 199, 0.3)"}`,
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: channelColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Total Achievement (Juli)
                </span>
                <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
                  {channelScore}%
                </div>
              </div>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  background: channelScore >= 95 ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                  color: channelScore >= 95 ? "#10B981" : "#F59E0B",
                }}
              >
                {channelScore >= 95 ? "Optimal" : "Monitoring"}
              </span>
            </div>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(channelScore, 100)}%`, height: "100%", background: channelGradient, borderRadius: "3px", transition: "width 0.5s ease" }} />
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)" }}>Tgt 100%</span>
            </div>
          </div>

          {/* Card 2: Revenue Category */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "60ms" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Revenue
            </span>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
              {revenueSection?.weight?.toFixed(2) ?? "—"}%
            </div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-muted)" }}>
              Target: {revenueSection?.target ?? (isCC ? 20 : 10)}%
            </div>
          </div>

          {/* Card 3: CX Category */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "120ms" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Customer Experience
            </span>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
              {cxSection?.weight?.toFixed(2) ?? "—"}%
            </div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-muted)" }}>
              Target: {cxSection?.target ?? 45}%
            </div>
          </div>

          {/* Card 4: Internal Process */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "180ms" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Internal Process
            </span>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
              {ipSection?.weight?.toFixed(2) ?? "—"}%
            </div>
            <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-muted)" }}>
              Target: {ipSection?.target ?? (isCC ? 35 : 45)}%
            </div>
          </div>

          {/* Card 5: Compliance Status */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "240ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Target Compliance
                </span>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#10B981", lineHeight: 1.1, marginTop: "6px" }}>
                  {complianceRate}%
                </div>
              </div>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "5px",
                  fontSize: "10px",
                  fontWeight: 800,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                {passedParams}/{totalParams}
              </span>
            </div>
            <div style={{ marginTop: "10px", fontSize: "10.5px", color: "var(--text-secondary)", display: "flex", gap: "8px" }}>
              <span style={{ color: "#10B981", fontWeight: 700 }}>&#x2713; {passedParams}</span>
              <span style={{ color: "#EF4444", fontWeight: 700 }}>&#x2717; {missedParams}</span>
            </div>
          </div>
        </div>

        {/* ─── Master Tren Bulanan — Single Channel ─── */}
        <div
          className="chart-card animate-fade-in-up"
          style={{ marginBottom: "32px", padding: "24px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3 className="chart-card-title" style={{ fontSize: "16px", fontWeight: 800 }}>
                Tren Total Skor {channelLabel} (Januari – Juli 2026)
              </h3>
              <p className="chart-card-subtitle" style={{ margin: "3px 0 0 0" }}>
                Grafik performa historis Achievement Total dari Sheet Monthly {channelLabel}
              </p>
            </div>

            {/* Toggle Line / Bar Chart */}
            <div style={{ display: "flex", background: "var(--bg-tertiary)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => setMasterChartType("line")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: masterChartType === "line" ? "var(--bg-card)" : "transparent",
                  color: masterChartType === "line" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: masterChartType === "line" ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Line Chart
              </button>
              <button
                type="button"
                onClick={() => setMasterChartType("bar")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: masterChartType === "bar" ? "var(--bg-card)" : "transparent",
                  color: masterChartType === "bar" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: masterChartType === "bar" ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Diagram Batang
              </button>
            </div>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              {masterChartType === "line" ? (
                <AreaChart data={overallTrendsData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="channelFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={channelColor} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={channelColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[70, 110]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<MasterChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 600 }} />
                  <ReferenceLine y={100} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 100%", fill: "#10B981", fontSize: 10, position: "insideTopRight" }} />
                  <Area type="monotone" dataKey="score" name={`Achievement ${channelLabel}`} stroke={channelColor} strokeWidth={3} fill="url(#channelFill)" dot={{ r: 5, fill: channelColor, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} connectNulls />
                </AreaChart>
              ) : (
                <BarChart data={overallTrendsData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[70, 110]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<MasterChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 600 }} />
                  <ReferenceLine y={100} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 100%", fill: "#10B981", fontSize: 10, position: "insideTopRight" }} />
                  <Bar dataKey="score" name={`Achievement ${channelLabel}`} radius={[5, 5, 0, 0]} maxBarSize={36}>
                    {overallTrendsData.map((entry, index) => (
                      <Cell
                        key={`master-bar-${index}`}
                        fill={entry.score !== null && entry.score >= 100 ? "#10B981" : channelColor}
                        opacity={0.88}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Category Trend Charts ─── */}
        {categoryTrendsForChannel.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "18px",
              marginBottom: "32px",
            }}
          >
            {categoryTrendsForChannel.map((ct) => (
              <div key={ct.category} className="chart-card animate-fade-in-up" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                      {ct.category}
                    </h4>
                    <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>
                      Target: {ct.target}% | Tren Skor Bulanan
                    </span>
                  </div>
                  {/* Latest score badge */}
                  {(() => {
                    const latest = ct.history.filter((h) => h.score !== null).pop();
                    return latest ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "5px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: latest.score! >= ct.target ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: latest.score! >= ct.target ? "#10B981" : "#EF4444",
                        }}
                      >
                        Jul: {latest.score!.toFixed(2)}%
                      </span>
                    ) : null;
                  })()}
                </div>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ct.history} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9.5, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        content={({ active, payload, label }: any) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "8px", padding: "8px 10px", fontSize: "11px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}>
                              <div style={{ fontWeight: 800, marginBottom: "3px" }}>{label} 2026</div>
                              <div>Score: <strong>{payload[0]?.value !== undefined ? `${Number(payload[0].value).toFixed(2)}%` : "—"}</strong></div>
                            </div>
                          );
                        }}
                      />
                      <ReferenceLine y={ct.target} stroke="#F59E0B" strokeDasharray="3 3" strokeWidth={1.2} />
                      <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]} maxBarSize={24}>
                        {ct.history.map((entry, i) => (
                          <Cell
                            key={`cat-${i}`}
                            fill={entry.score !== null && entry.score >= ct.target ? "#10B981" : channelColor}
                            opacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Filter & Control Bar ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
            padding: "16px 20px",
            background: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-default)",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Grafik Tren per Parameter — {channelLabel} ({filteredParameters.length} Parameter)
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Visualisasi performa bulanan (Januari – Juli) per parameter dari Sheet Monthly {channelLabel}
            </p>
          </div>

          {/* Controls: Category, Status, Search, Chart Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Cari parameter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: "11.5px",
                borderRadius: "6px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                minWidth: "160px",
              }}
            />

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
              style={{ fontSize: "11.5px", padding: "6px 10px" }}
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Revenue">Revenue</option>
              <option value="Customer Experience">Customer Experience</option>
              <option value="Internal Process">Internal Process</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              style={{ fontSize: "11.5px", padding: "6px 10px" }}
            >
              <option value="ALL">Semua Status</option>
              <option value="PASS">Target Tercapai</option>
              <option value="MISS">Belum Tercapai</option>
            </select>

            {/* Chart Mode Toggle */}
            <div style={{ display: "flex", background: "var(--bg-tertiary)", padding: "2px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => setParamChartMode("line")}
                title="Tampilan Line Chart"
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  background: paramChartMode === "line" ? "var(--bg-card)" : "transparent",
                  color: paramChartMode === "line" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: paramChartMode === "line" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Line
              </button>
              <button
                type="button"
                onClick={() => setParamChartMode("bar")}
                title="Tampilan Diagram Batang"
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  background: paramChartMode === "bar" ? "var(--bg-card)" : "transparent",
                  color: paramChartMode === "bar" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: paramChartMode === "bar" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Bar
              </button>
            </div>
          </div>
        </div>

        {/* ─── Grid Kartu Parameter KPI ─── */}
        {filteredParameters.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "18px",
            }}
          >
            {filteredParameters.map((param) => (
              <ParameterChartCard
                key={param.id}
                param={param}
                chartMode={paramChartMode}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            Tidak ada parameter yang sesuai dengan filter yang dipilih.
          </div>
        )}
      </main>
    </div>
  );
}

