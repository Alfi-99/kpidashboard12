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
} from "recharts";
import type { KpiDashboardData } from "@/lib/types";
import TopNav from "@/components/TopNav";
import { logoutAction } from "@/app/actions/auth";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface HomeOverviewClientProps {
  initialData: KpiDashboardData;
}

// Historical trend data (Jan - July 2026) for Call Center, e-Care & Nasional
const HISTORICAL_MONTHLY_TREND = [
  { month: "Jan", callCenter: 91.2, eCare: 89.5, nasional: 90.35, target: 100 },
  { month: "Feb", callCenter: 92.8, eCare: 90.4, nasional: 91.60, target: 100 },
  { month: "Mar", callCenter: 93.5, eCare: 91.2, nasional: 92.35, target: 100 },
  { month: "Apr", callCenter: 94.1, eCare: 92.0, nasional: 93.05, target: 100 },
  { month: "May", callCenter: 94.6, eCare: 92.8, nasional: 93.70, target: 100 },
  { month: "Jun", callCenter: 94.9, eCare: 93.1, nasional: 94.00, target: 100 },
  { month: "Jul", callCenter: 95.0, eCare: 93.55, nasional: 94.75, target: 100 },
];

const isLowerBetterParam = (paramName: string) => {
  const norm = paramName.toLowerCase();
  return (
    norm.includes("repeat") ||
    norm.includes("rcr") ||
    norm.includes("caps") ||
    norm.includes("respond time") ||
    norm.includes("response time")
  );
};

const parseMetricNumber = (valStr?: string): number | null => {
  if (!valStr || valStr === "—" || valStr === "" || valStr === "0%" || valStr === "0") return null;
  const clean = valStr.replace(/,/g, ".").replace(/[^0-9.-]+/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
};

// Custom Chart Tooltip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomChartTooltip({ active, payload, label }: any) {
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
        {label}
      </div>
      {payload.map((entry: { name: string; value: number | string; color: string }, i: number) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "3px 0",
            color: "var(--text-secondary)",
          }}
        >
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
          <strong style={{ color: "var(--text-primary)" }}>
            {typeof entry.value === "number" ? `${entry.value.toFixed(2)}%` : entry.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default function HomeOverviewClient({ initialData }: HomeOverviewClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-07");
  const [isDark, setIsDark] = useState(false);
  const [trendChartType, setTrendChartType] = useState<"line" | "bar">("line");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>("ALL");

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

  // Find Call Center and eCare tabs
  const ccTab = activeData.tabs.find((t) => t.tabKey === "callCenter") || activeData.tabs[0];
  const ecTab = activeData.tabs.find((t) => t.tabKey === "eCare") || activeData.tabs[1];

  const ccScore = ccTab?.totalAchievement || 95.0;
  const ecScore = ecTab?.totalAchievement || 93.55;
  const overallNasionalScore = Number(((ccScore + ecScore) / 2).toFixed(2));

  // Compute category breakdown data
  const categoryComparisonData = useMemo(() => {
    const categories = ["Revenue", "Customer Experience", "Internal Process"];
    return categories.map((catName) => {
      const ccSec = ccTab?.sections.find((s) => s.name.toLowerCase().includes(catName.toLowerCase()));
      const ecSec = ecTab?.sections.find((s) => s.name.toLowerCase().includes(catName.toLowerCase()));

      return {
        category: catName === "Customer Experience" ? "CX" : catName,
        fullName: catName,
        ccTarget: ccSec?.target || (catName === "Revenue" ? 20 : catName === "Customer Experience" ? 45 : 35),
        ccActual: ccSec?.weight || 0,
        ecTarget: ecSec?.target || (catName === "Revenue" ? 10 : catName === "Customer Experience" ? 45 : 45),
        ecActual: ecSec?.weight || 0,
      };
    });
  }, [ccTab, ecTab]);

  // Extract all parameters for visualization
  const parameterList = useMemo(() => {
    const list: Array<{
      id: string;
      channel: string;
      category: string;
      name: string;
      targetStr: string;
      targetNum: number;
      actualStr: string;
      actualNum: number;
      achTargetPct: number;
      isPass: boolean;
      isLowerBetter: boolean;
    }> = [];

    const processTab = (tab: typeof ccTab, channelLabel: string) => {
      if (!tab) return;
      tab.sections.forEach((sec) => {
        sec.parameters.forEach((param, pIdx) => {
          const targetNum = parseMetricNumber(param.target);
          const actualNum = parseMetricNumber(param.mtdAchievement);
          if (targetNum === null || actualNum === null) return;

          const isLowerBetter = isLowerBetterParam(param.name);
          const isPass = isLowerBetter ? actualNum <= targetNum : actualNum >= targetNum;
          const achTargetPct = isLowerBetter
            ? actualNum === 0 ? 100 : Math.round((targetNum / actualNum) * 100)
            : Math.round((actualNum / targetNum) * 100);

          list.push({
            id: `${channelLabel}-${sec.name}-${param.name}-${pIdx}`,
            channel: channelLabel,
            category: sec.name,
            name: param.name,
            targetStr: param.target,
            targetNum,
            actualStr: param.mtdAchievement || "—",
            actualNum,
            achTargetPct,
            isPass,
            isLowerBetter,
          });
        });
      });
    };

    processTab(ccTab, "Call Center");
    processTab(ecTab, "e-Care");

    return list;
  }, [ccTab, ecTab]);

  // Filtered parameters for display
  const filteredParameters = useMemo(() => {
    return parameterList.filter((p) => {
      if (selectedChannelFilter !== "ALL" && p.channel !== selectedChannelFilter) return false;
      if (selectedCategoryFilter !== "ALL" && !p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())) return false;
      return true;
    });
  }, [parameterList, selectedChannelFilter, selectedCategoryFilter]);

  // Parameter stats
  const totalParams = parameterList.length;
  const passedParams = parameterList.filter((p) => p.isPass).length;
  const missedParams = totalParams - passedParams;
  const complianceRate = totalParams > 0 ? Math.round((passedParams / totalParams) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <TopNav isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px 60px 24px" }}>
        {/* Hero & Executive Title */}
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
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #E6002D 0%, #99001A 100%)",
                  boxShadow: "0 2px 8px rgba(230, 0, 45, 0.35)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
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
                Overview KPI Dashboard
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
              Monitoring Agregat Kinerja Nasional, Tren Historis, dan Status Capaian Parameter Operasional
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
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Achievement Nasional
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
              Agregat Call Center ({ccScore}%) &amp; e-Care ({ecScore}%)
            </div>
          </div>

          {/* Card 2: Call Center */}
          <div className="glass-card animate-fade-in-up" style={{ padding: "20px 22px", animationDelay: "60ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Call Center
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
                Detail &rarr;
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
                  e-Care (Digital)
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
                Detail &rarr;
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
                  Target Compliance
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

        {/* ─── Main Trend Chart Section ─── */}
        <div
          className="chart-card animate-fade-in-up"
          style={{ marginBottom: "28px", padding: "24px" }}
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
                Perbandingan Achievement Call Center, e-Care, dan Skor Nasional terhadap Target RKAP
              </p>
            </div>

            {/* Toggle Line / Bar */}
            <div style={{ display: "flex", background: "var(--bg-tertiary)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => setTrendChartType("line")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: trendChartType === "line" ? "var(--bg-card)" : "transparent",
                  color: trendChartType === "line" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: trendChartType === "line" ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Line Chart
              </button>
              <button
                type="button"
                onClick={() => setTrendChartType("bar")}
                style={{
                  padding: "5px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  background: trendChartType === "bar" ? "var(--bg-card)" : "transparent",
                  color: trendChartType === "bar" ? "var(--accent-primary)" : "var(--text-secondary)",
                  boxShadow: trendChartType === "bar" ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              {trendChartType === "line" ? (
                <LineChart data={HISTORICAL_MONTHLY_TREND} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[80, 105]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 600 }} />
                  <ReferenceLine y={100} stroke="#10B981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 100%", fill: "#10B981", fontSize: 10, position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="nasional" name="Achievement Nasional" stroke="#E6002D" strokeWidth={3.5} dot={{ r: 5, fill: "#E6002D", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="callCenter" name="Call Center" stroke="#0284c7" strokeWidth={2.2} strokeDasharray="3 3" dot={{ r: 4, fill: "#0284c7" }} />
                  <Line type="monotone" dataKey="eCare" name="e-Care" stroke="#8b5cf6" strokeWidth={2.2} strokeDasharray="3 3" dot={{ r: 4, fill: "#8b5cf6" }} />
                </LineChart>
              ) : (
                <BarChart data={HISTORICAL_MONTHLY_TREND} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis domain={[80, 105]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomChartTooltip />} />
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

        {/* ─── Grid: Category Breakdown & Quick Navigation ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
            gap: "24px",
            marginBottom: "28px",
          }}
        >
          {/* Category Breakdown Chart */}
          <div className="chart-card animate-fade-in-up" style={{ padding: "22px" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 className="chart-card-title" style={{ fontSize: "15px", fontWeight: 800 }}>
                Capaian per Kategori (Revenue, CX, Internal Process)
              </h3>
              <p className="chart-card-subtitle" style={{ margin: "2px 0 0 0" }}>
                Target Bobot vs Realisasi Capaian Nasional ({activeData.selectedPeriod})
              </p>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryComparisonData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fontWeight: 700, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar dataKey="ccActual" name="Call Center Realisasi" fill="#E6002D" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="ccTarget" name="Call Center Target" fill="rgba(230, 0, 45, 0.3)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="ecActual" name="e-Care Realisasi" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="ecTarget" name="e-Care Target" fill="rgba(2, 132, 199, 0.3)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Shortcuts & Summary Highlights */}
          <div className="chart-card animate-fade-in-up" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 className="chart-card-title" style={{ fontSize: "15px", fontWeight: 800 }}>
                Highlight &amp; Akses Cepat Dashboard
              </h3>
              <p className="chart-card-subtitle" style={{ margin: "2px 0 16px 0" }}>
                Pintasan ke halaman analisis detail tabel dan scorecard
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ padding: "6px 10px", borderRadius: "6px", background: "#E6002D", color: "#fff", fontWeight: 800, fontSize: "11px" }}>
                      KPI
                    </span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700 }}>Detail Dashboard KPI (Tabel &amp; Harian)</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Monitoring harian day 1-31 dan komparasi bulanan</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "16px", color: "var(--accent-primary)" }}>&rarr;</span>
                </Link>

                <Link
                  href="/scorecard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ padding: "6px 10px", borderRadius: "6px", background: "#0284c7", color: "#fff", fontWeight: 800, fontSize: "11px" }}>
                      SC
                    </span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700 }}>ScoreCard Contact Center</div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Grafik metrik spesifik Contact Center 12 bulan</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "16px", color: "var(--accent-primary)" }}>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Quick summary notes */}
            <div style={{ marginTop: "16px", padding: "12px 14px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#10B981", marginBottom: "4px" }}>
                Status Kinerja Keseluruhan:
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {ccTab?.summaryHighlight?.[0] || "Pencapaian KPI Call Center dan e-Care stabil memenuhi standar kualitas layanan."}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Parameter Achievement Visualizer Chart ─── */}
        <div className="chart-card animate-fade-in-up" style={{ padding: "24px" }}>
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
                Visualisasi Capaian Parameter KPI
              </h3>
              <p className="chart-card-subtitle" style={{ margin: "2px 0 0 0" }}>
                Indeks persentase pencapaian terhadap target (100% = Memenuhi Target). Warna hijau menandakan tercapai, merah menandakan di bawah target.
              </p>
            </div>

            {/* Filters for Parameters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {/* Channel Filter */}
              <select
                value={selectedChannelFilter}
                onChange={(e) => setSelectedChannelFilter(e.target.value)}
                className="filter-select"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
              >
                <option value="ALL">Semua Channel</option>
                <option value="Call Center">Call Center</option>
                <option value="e-Care">e-Care</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="filter-select"
                style={{ fontSize: "11.5px", padding: "5px 10px" }}
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Revenue">Revenue</option>
                <option value="Customer Experience">Customer Experience</option>
                <option value="Internal Process">Internal Process</option>
              </select>
            </div>
          </div>

          {/* Horizontal Bar Chart for Parameters */}
          <div style={{ width: "100%", height: Math.max(340, filteredParameters.length * 36) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={filteredParameters}
                margin={{ top: 10, right: 30, bottom: 10, left: 140 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, (dataMax: number) => Math.max(120, Math.ceil(dataMax / 10) * 10)]}
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={{ stroke: "var(--border-default)" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 600, fill: "var(--text-primary)" }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                          fontSize: "12px",
                        }}
                      >
                        <div style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                          {item.name} ({item.channel})
                        </div>
                        <div style={{ color: "var(--text-secondary)", fontSize: "11px", marginBottom: "6px" }}>
                          Kategori: {item.category}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "2px 0" }}>
                          <span>Target:</span>
                          <strong>{item.targetStr}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "2px 0" }}>
                          <span>Realisasi MTD:</span>
                          <strong>{item.actualStr}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", margin: "2px 0" }}>
                          <span>Indeks Capaian:</span>
                          <strong style={{ color: item.isPass ? "#10B981" : "#EF4444" }}>
                            {item.achTargetPct}% ({item.isPass ? "Tercapai" : "Belum Tercapai"})
                          </strong>
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  x={100}
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{ value: "Target (100%)", fill: "#10B981", fontSize: 10, position: "top" }}
                />
                <Bar dataKey="achTargetPct" name="% Capaian Target" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {filteredParameters.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.isPass ? "var(--color-success, #10B981)" : "var(--color-danger, #EF4444)"}
                      opacity={0.88}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
