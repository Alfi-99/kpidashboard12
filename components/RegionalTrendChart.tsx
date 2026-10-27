// components/RegionalTrendChart.tsx
"use client";

import React, { useState } from "react";
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
} from "recharts";
import type { RegionalMonthlyTrendItem } from "@/lib/types";

interface RegionalTrendChartProps {
  trends?: RegionalMonthlyTrendItem[];
  channelName?: string;
  activePeriod?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomRegionalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        minWidth: "190px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: "8px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "5px",
        }}
      >
        Periode: {label} 2026
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px" }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((item: any) => {
          if (item.value === null || item.value === undefined) return null;
          return (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                  {item.name}:
                </span>
              </div>
              <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                {Number(item.value).toFixed(2)}%
              </span>
            </div>
          );
        })}

        <div
          style={{
            marginTop: "6px",
            paddingTop: "6px",
            borderTop: "1px dashed var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10.5px",
            color: "var(--text-muted)",
          }}
        >
          <span>Target RKAP:</span>
          <span style={{ fontWeight: 700 }}>100.00%</span>
        </div>
      </div>
    </div>
  );
}

export default function RegionalTrendChart({
  trends,
  channelName = "Channel",
  activePeriod = "Oktober 2026",
}: RegionalTrendChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  if (!trends || trends.length === 0) {
    return null;
  }

  // Find latest available item with data for summary badges
  const latestItem = [...trends].reverse().find((t) => t.nasional !== null) || trends[trends.length - 1];

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "36px",
      }}
    >
      {/* ─── Header & Controls ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px 20px",
          borderRadius: "12px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "4px",
                height: "22px",
                background: "linear-gradient(180deg, #0284c7 0%, #7e22ce 100%)",
                borderRadius: "2px",
              }}
            />
            <h3
              className="font-heading"
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Tren Capaian Regional: Nasional vs Semarang vs Bandung
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#FFFFFF",
                backgroundColor: "#0369a1",
                padding: "2px 10px",
                borderRadius: "5px",
                letterSpacing: "0.03em",
              }}
            >
              {channelName}
            </span>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: "6px 0 0 14px",
            }}
          >
            Grafik komparasi capaian total KPI bulan ke bulan untuk level Nasional, Bandung (BDG), dan Semarang (SMG).
          </p>
        </div>

        {/* Chart Type Toggle Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setChartType("line")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: chartType === "line" ? "1px solid #0284c7" : "1px solid var(--border-default)",
              background: chartType === "line" ? "#0284c7" : "var(--bg-tertiary)",
              color: chartType === "line" ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            📈 Line Chart
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: chartType === "bar" ? "1px solid #0284c7" : "1px solid var(--border-default)",
              background: chartType === "bar" ? "#0284c7" : "var(--bg-tertiary)",
              color: chartType === "bar" ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            📊 Bar Chart
          </button>
        </div>
      </div>

      {/* ─── Latest Month KPI Summary Badges ─── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
        }}
      >
        {/* Nasional */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, var(--bg-card) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase" }}>
              Nasional ({latestItem?.label || activePeriod})
            </span>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)", marginTop: "4px" }}>
              {latestItem?.nasional !== null ? `${latestItem.nasional.toFixed(2)}%` : "—"}
            </div>
          </div>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 750,
              backgroundColor: (latestItem?.nasional ?? 0) >= 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: (latestItem?.nasional ?? 0) >= 100 ? "#10B981" : "#EF4444",
            }}
          >
            {(latestItem?.nasional ?? 0) >= 100 ? "Achieved" : "Under Target"}
          </span>
        </div>

        {/* Bandung (BDG) */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, var(--bg-card) 100%)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>
              Bandung (BDG) ({latestItem?.label || activePeriod})
            </span>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)", marginTop: "4px" }}>
              {latestItem?.bdg !== null ? `${latestItem.bdg.toFixed(2)}%` : "—"}
            </div>
          </div>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 750,
              backgroundColor: (latestItem?.bdg ?? 0) >= 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: (latestItem?.bdg ?? 0) >= 100 ? "#10B981" : "#EF4444",
            }}
          >
            {(latestItem?.bdg ?? 0) >= 100 ? "Achieved" : "Under Target"}
          </span>
        </div>

        {/* Semarang (SMG) */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, var(--bg-card) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#7e22ce", textTransform: "uppercase" }}>
              Semarang (SMG) ({latestItem?.label || activePeriod})
            </span>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--text-primary)", marginTop: "4px" }}>
              {latestItem?.smg !== null ? `${latestItem.smg.toFixed(2)}%` : "—"}
            </div>
          </div>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              fontSize: "10.5px",
              fontWeight: 750,
              backgroundColor: (latestItem?.smg ?? 0) >= 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: (latestItem?.smg ?? 0) >= 100 ? "#10B981" : "#EF4444",
            }}
          >
            {(latestItem?.smg ?? 0) >= 100 ? "Achieved" : "Under Target"}
          </span>
        </div>
      </div>

      {/* ─── Chart Card Container ─── */}
      <div
        className="glass-card-static"
        style={{
          padding: "24px 20px 20px 10px",
          borderRadius: "12px",
          border: "1px solid var(--border-strong)",
          background: "var(--bg-card)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={trends} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "var(--border-default)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[75, 130]}
                  tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomRegionalTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontWeight: 700 }}
                  formatter={(value) => <span style={{ color: "var(--text-primary)" }}>{value}</span>}
                />
                <ReferenceLine
                  y={100}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Target: 100%",
                    fill: "var(--text-muted)",
                    fontSize: 10,
                    fontWeight: 700,
                    position: "insideTopRight",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nasional"
                  name="Nasional"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#F59E0B", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#F59E0B" }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="bdg"
                  name="Bandung (BDG)"
                  stroke="#0EA5E9"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#0EA5E9" }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="smg"
                  name="Semarang (SMG)"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#8B5CF6" }}
                  connectNulls
                />
              </LineChart>
            ) : (
              <BarChart data={trends} margin={{ top: 15, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: "var(--border-default)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 130]}
                  tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomRegionalTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px", fontWeight: 700 }}
                  formatter={(value) => <span style={{ color: "var(--text-primary)" }}>{value}</span>}
                />
                <ReferenceLine
                  y={100}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Target: 100%",
                    fill: "var(--text-muted)",
                    fontSize: 10,
                    fontWeight: 700,
                    position: "insideTopRight",
                  }}
                />
                <Bar dataKey="nasional" name="Nasional" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="bdg" name="Bandung (BDG)" fill="#0EA5E9" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="smg" name="Semarang (SMG)" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer Note */}
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--text-muted)",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span>
            ℹ️ <strong>Catatan:</strong> Data pencatatan komparasi regional Bandung &amp; Semarang tersedia secara terpisah mulai bulan Juli 2026. Periode Januari – Juni menggunakan agregat capaian Nasional.
          </span>
          <span style={{ fontWeight: 600 }}>
            Sumber Data: Google Sheets DB KPI
          </span>
        </div>
      </div>
    </div>
  );
}
