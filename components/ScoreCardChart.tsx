// components/ScoreCardChart.tsx
"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import type { ScoreCardItem } from "@/lib/scoreCardTypes";

interface ScoreCardChartProps {
  item: ScoreCardItem;
  index: number;
}

const SERIES_COLORS = [
  "#E6002D", // Telkomsel Red
  "#0EA5E9", // Vivid Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "10px",
      padding: "10px 14px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      fontSize: "12px",
    }}>
      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{label}</div>
      {payload.map((entry: { name: string; value: number | null; color: string }, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "2px 0", color: "var(--text-secondary)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
          <span style={{ fontWeight: 600, minWidth: "90px" }}>{entry.name}:</span>
          <strong style={{ color: "var(--text-primary)" }}>
            {entry.value !== null && entry.value !== undefined ? entry.value.toLocaleString("id-ID") : "(belum diisi)"}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default function ScoreCardChart({ item, index }: ScoreCardChartProps) {
  const [showFormula, setShowFormula] = useState(false);

  // Extract series keys (e.g. ["RCR Mobile", "RCR Fixed"] or ["Value"])
  const seriesKeys = item.seriesKeys.length > 0 ? item.seriesKeys : ["Value"];
  const isMultiSeries = seriesKeys.length > 1;

  // Build full 12-month chart dataset
  const chartData = item.monthlyData.map((d) => {
    const rowObj: Record<string, unknown> = { month: d.month };
    seriesKeys.forEach((key) => {
      rowObj[key] = typeof d.series[key] === "number" ? d.series[key] : null;
    });
    return rowObj;
  });

  // Calculate max value for auto chart type detection
  let maxValue = 0;
  chartData.forEach((d) => {
    seriesKeys.forEach((key) => {
      const val = (d as Record<string, unknown>)[key];
      if (typeof val === "number" && val > maxValue) maxValue = val;
    });
  });

  const isVolume = maxValue > 1000;
  const isPercentage = item.name.toLowerCase().includes("%") ||
    item.name.toLowerCase().includes("rate") ||
    item.name.toLowerCase().includes("occupancy") ||
    item.name.toLowerCase().includes("fcr") ||
    item.name.toLowerCase().includes("coverage") ||
    item.name.toLowerCase().includes("scr") ||
    item.name.toLowerCase().includes("sl ");

  const chartType: "area" | "bar" | "line" = isVolume ? "bar" : isPercentage ? "area" : "line";

  // Show chart if item has any data or defined series structure
  const renderChart = item.hasData || seriesKeys.length > 0;

  return (
    <div
      className="chart-card animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="chart-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="chart-card-title">{item.name}</h3>
            {isMultiSeries && (
              <span style={{
                fontSize: "9px",
                fontWeight: 750,
                padding: "2px 7px",
                borderRadius: "99px",
                background: "var(--accent-bg-strong)",
                color: "var(--accent-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}>
                {seriesKeys.length} Variabel
              </span>
            )}
          </div>
          {showFormula && item.formula && (
            <p className="chart-card-subtitle" style={{ marginTop: "8px", fontStyle: "italic" }}>
              {item.formula}
            </p>
          )}
          {item.description && (
            <p className="chart-card-subtitle">{item.description}</p>
          )}
        </div>
        {item.formula && (
          <button
            className="chart-card-badge"
            onClick={() => setShowFormula(!showFormula)}
            style={{ cursor: "pointer", border: "none" }}
            title="Tampilkan formula"
          >
            {showFormula ? "Hide" : "Formula"}
          </button>
        )}
      </div>

      {renderChart ? (
        <div style={{ width: "100%", height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--accent-bg)" }} />
                {isMultiSeries && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />}
                {seriesKeys.map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={key}
                    fill={SERIES_COLORS[i % SERIES_COLORS.length]}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                ))}
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  {seriesKeys.map((key, i) => {
                    const color = SERIES_COLORS[i % SERIES_COLORS.length];
                    return (
                      <linearGradient key={key} id={`grad-${index}-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {isMultiSeries && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />}
                {seriesKeys.map((key, i) => {
                  const color = SERIES_COLORS[i % SERIES_COLORS.length];
                  return (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={color}
                      strokeWidth={2.5}
                      fill={`url(#grad-${index}-${i})`}
                      connectNulls
                      dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "#fff" }}
                    />
                  );
                })}
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: "var(--text-muted)" }} axisLine={{ stroke: "var(--border-default)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {isMultiSeries && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />}
                {seriesKeys.map((key, i) => {
                  const color = SERIES_COLORS[i % SERIES_COLORS.length];
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={color}
                      strokeWidth={2.5}
                      connectNulls
                      dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "#fff" }}
                    />
                  );
                })}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{
          height: 220,
          display: "grid",
          placeContent: "center",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          <div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: "8px" }}>
              <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
            </svg>
            <div style={{ fontSize: "11px" }}>Belum ada data</div>
          </div>
        </div>
      )}

      {/* Chart footer summary */}
      {renderChart && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px 18px",
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "10px",
          color: "var(--text-muted)",
        }}>
          {seriesKeys.map((key, i) => {
            const color = SERIES_COLORS[i % SERIES_COLORS.length];
            const validData = chartData.filter((d) => typeof (d as Record<string, unknown>)[key] === "number");
            const hasValues = validData.length > 0;
            const lastVal = hasValues ? ((validData[validData.length - 1] as Record<string, unknown>)[key] as number) : null;
            const lastMonth = hasValues ? validData[validData.length - 1].month : null;

            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                <span>
                  {isMultiSeries && <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{key}: </span>}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {hasValues ? `${lastVal?.toLocaleString("id-ID")} (${lastMonth})` : "Belum diisi"}
                  </strong>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
