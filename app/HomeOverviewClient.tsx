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
  const [selectedPeriod, setSelectedPeriod] = useState("2026-07");
  const [isDark, setIsDark] = useState(false);
  const [masterChartType, setMasterChartType] = useState<"line" | "bar">("line");
  const [paramChartMode, setParamChartMode] = useState<"line" | "bar">("line");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: liveData, isValidating, mutate } = useSWR<KpiDashboardData>(
    `/api/kpi?period=${selectedPeriod}`,
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

  // Extract score for Call Center and e-Care
  const ccTab = activeData.tabs.find((t) => t.tabKey === "callCenter") || activeData.tabs[0];
  const ecTab = activeData.tabs.find((t) => t.tabKey === "eCare") || activeData.tabs[1];

  const getScore = (tab: typeof ccTab) => {
    if (!tab) return 100;
    const parsed = tab.regionalComparison?.nasionalScore
      ? parseFloat(tab.regionalComparison.nasionalScore.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""))
      : null;
    return parsed && !isNaN(parsed) && parsed > 0 ? parsed : tab.totalAchievement;
  };

  const ccScore = getScore(ccTab);
  const ecScore = getScore(ecTab);
  const overallNasionalScore = Number(((ccScore + ecScore) / 2).toFixed(2));

  // Overall monthly trend data
  const overallTrendsData = activeData.overallTrends && activeData.overallTrends.length > 0
    ? activeData.overallTrends
    : DEFAULT_OVERALL_TRENDS;

  // Parameter histories
  const parameterHistories = activeData.parameterHistories || [];

  // Filtered parameter histories
  const filteredParameters = useMemo(() => {
    return parameterHistories.filter((p) => {
      if (channelFilter !== "ALL" && p.channel !== channelFilter) return false;
      if (categoryFilter !== "ALL" && !p.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      if (statusFilter === "PASS" && !p.isPass) return false;
      if (statusFilter === "MISS" && p.isPass) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.definisi && p.definisi.toLowerCase().includes(q));
      }
      return true;
    });
  }, [parameterHistories, channelFilter, categoryFilter, statusFilter, searchQuery]);

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
            background: "linear-gradient(135deg, rgba(230, 0, 45, 0.08) 0%, rgba(74, 0, 14, 0.12) 100%)",
            border: "1px solid var(--border-strong)",
            borderRadius: "16px",
            padding: "24px 28px",
            backdropFilter: "blur(12px)",
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
                  background: "linear-gradient(135deg, #E6002D 0%, #99001A 100%)",
                  boxShadow: "0 2px 10px rgba(230, 0, 45, 0.35)",
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
                Overview Semua KPI &amp; Parameter
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
              Monitoring Komprehensif Tren Kinerja Bulanan (Januari – {activeData.selectedPeriod}) dari Sheet Monthly Call Center &amp; e-Care
            </p>
          </div>

          {/* Controls: Period & Sync */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Periode:
              </span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="filter-select"
                style={{ minWidth: "140px", padding: "6px 12px", fontSize: "12px", fontWeight: 700 }}
              >
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-03">March 2026</option>
                <option value="2026-02">February 2026</option>
                <option value="2026-01">January 2026</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => mutate()}
              disabled={isValidating}
              className="primary-button"
              style={{
                height: "36px",
                padding: "0 14px",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {/* Card 1: Achievement Nasional */}
          <div
            className="glass-card animate-fade-in-up"
            style={{
              padding: "20px 22px",
              background: "linear-gradient(135deg, rgba(230, 0, 45, 0.12) 0%, var(--bg-card) 100%)",
              border: "1px solid rgba(230, 0, 45, 0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Achievement Nasional (Juli)
                </span>
                <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
                  {overallNasionalScore}%
                </div>
              </div>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  background: overallNasionalScore >= 95 ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                  color: overallNasionalScore >= 95 ? "#10B981" : "#F59E0B",
                }}
              >
                {overallNasionalScore >= 95 ? "Optimal" : "Monitoring"}
              </span>
            </div>
            <div style={{ marginTop: "14px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Call Center ({ccScore}%) &amp; e-Care ({ecScore}%)
            </div>
          </div>

          {/* Card 2: Call Center */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "60ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Call Center Total
                </span>
                <div style={{ fontSize: "30px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
                  {ccScore}%
                </div>
              </div>
              <Link
                href="/dashboard"
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  textDecoration: "none",
                }}
              >
                Tabel &rarr;
              </Link>
            </div>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(ccScore, 100)}%`, height: "100%", background: "linear-gradient(90deg, #E6002D, #FF4D6E)", borderRadius: "3px" }} />
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)" }}>Tgt 100%</span>
            </div>
          </div>

          {/* Card 3: e-Care */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "120ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  e-Care Digital Total
                </span>
                <div style={{ fontSize: "30px", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.1, marginTop: "6px" }}>
                  {ecScore}%
                </div>
              </div>
              <Link
                href="/dashboard"
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  textDecoration: "none",
                }}
              >
                Tabel &rarr;
              </Link>
            </div>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ flex: 1, height: "6px", background: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(ecScore, 100)}%`, height: "100%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", borderRadius: "3px" }} />
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--text-muted)" }}>Tgt 100%</span>
            </div>
          </div>

          {/* Card 4: Compliance Status */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "180ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Parameter Target Compliance
                </span>
                <div style={{ fontSize: "30px", fontWeight: 900, color: "#10B981", lineHeight: 1.1, marginTop: "6px" }}>
                  {complianceRate}%
                </div>
              </div>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "5px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                {passedParams} / {totalParams} Pass
              </span>
            </div>
            <div style={{ marginTop: "14px", fontSize: "11px", color: "var(--text-secondary)", display: "flex", gap: "10px" }}>
              <span style={{ color: "#10B981", fontWeight: 700 }}>&#x2713; {passedParams} Capai Target</span>
              <span style={{ color: "#EF4444", fontWeight: 700 }}>&#x2717; {missedParams} Perlu Perhatian</span>
            </div>
          </div>
        </div>

        {/* ─── Master Tren Bulanan (Line Chart & Bar Chart) ─── */}
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
                Tren Capaian Bulanan (Januari – {activeData.selectedPeriod})
              </h3>
              <p className="chart-card-subtitle" style={{ margin: "3px 0 0 0" }}>
                Grafik performa historis Total Skor Call Center, e-Care, dan Skor Nasional dari Google Sheets
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
                <LineChart data={overallTrendsData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[75, 105]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<MasterChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 600 }} />
                  <ReferenceLine y={100} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 100%", fill: "#10B981", fontSize: 10, position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="nasional" name="Achievement Nasional" stroke="#E6002D" strokeWidth={3.5} dot={{ r: 5, fill: "#E6002D", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} connectNulls />
                  <Line type="monotone" dataKey="callCenter" name="Call Center" stroke="#0284c7" strokeWidth={2.2} strokeDasharray="3 3" dot={{ r: 4, fill: "#0284c7" }} connectNulls />
                  <Line type="monotone" dataKey="eCare" name="e-Care" stroke="#8b5cf6" strokeWidth={2.2} strokeDasharray="3 3" dot={{ r: 4, fill: "#8b5cf6" }} connectNulls />
                </LineChart>
              ) : (
                <BarChart data={overallTrendsData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[75, 105]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<MasterChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 600 }} />
                  <ReferenceLine y={100} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 100%", fill: "#10B981", fontSize: 10, position: "insideTopRight" }} />
                  <Bar dataKey="nasional" name="Achievement Nasional" fill="#E6002D" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="callCenter" name="Call Center" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="eCare" name="e-Care" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Filter & Control Bar untuk Seluruh Parameter ─── */}
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
              Grafik Tren per Parameter KPI ({filteredParameters.length} Parameter)
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11.5px", color: "var(--text-secondary)" }}>
              Visualisasi performa bulanan (Januari – Juli) per parameter dari sheet Monthly Call Center &amp; e-Care
            </p>
          </div>

          {/* Controls: Channel, Category, Status, Search, Chart Toggle */}
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

            {/* Channel Filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="filter-select"
              style={{ fontSize: "11.5px", padding: "6px 10px" }}
            >
              <option value="ALL">Semua Channel</option>
              <option value="Call Center">Call Center</option>
              <option value="e-Care">e-Care</option>
            </select>

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
