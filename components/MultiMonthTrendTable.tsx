// components/MultiMonthTrendTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { MultiMonthParamRow } from "@/lib/types";

interface MultiMonthTrendTableProps {
  rows?: MultiMonthParamRow[];
  channelName?: string;
  activePeriod?: string;
}

const MONTH_KEYS = [
  { key: "Jan", label: "Jan" },
  { key: "Feb", label: "Feb" },
  { key: "Mar", label: "Mar" },
  { key: "Apr", label: "Apr" },
  { key: "May", label: "Mei" },
  { key: "Jun", label: "Jun" },
  { key: "Jul", label: "Jul" },
  { key: "Aug", label: "Agu" },
  { key: "Sep", label: "Sep" },
  { key: "Oct", label: "Okt" },
];

const parseMetricNum = (valStr?: string): number | null => {
  if (!valStr || valStr === "—" || valStr === "" || valStr === "#DIV/0!") return null;
  const cleanStr = valStr.replace(/,/g, ".").replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleanStr);
  return isNaN(num) ? null : num;
};

export default function MultiMonthTrendTable({
  rows,
  channelName = "Channel",
  activePeriod = "Oktober 2026",
}: MultiMonthTrendTableProps) {
  const [metricMode, setMetricMode] = useState<"score" | "ach" | "achTarget">("score");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return rows.filter((r) => {
      if (r.isTotalRow) return true;
      if (categoryFilter !== "ALL") {
        if (r.isCategoryRow) {
          return r.parameter.toLowerCase().includes(categoryFilter.toLowerCase());
        }
        return r.category.toLowerCase().includes(categoryFilter.toLowerCase());
      }
      if (searchQuery.trim()) {
        if (r.isCategoryRow) return false;
        const q = searchQuery.toLowerCase();
        return (
          r.parameter.toLowerCase().includes(q) ||
          (r.definisi && r.definisi.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rows, categoryFilter, searchQuery]);

  if (!rows || rows.length === 0) {
    return null;
  }

  const renderValueBadge = (row: MultiMonthParamRow, monthKey: string) => {
    const valObj = row.monthlyValues?.[monthKey];
    if (!valObj) return <span style={{ color: "var(--text-muted)", opacity: 0.5 }}>—</span>;

    let displayVal = "";
    if (metricMode === "score") {
      displayVal = valObj.score || "";
    } else if (metricMode === "ach") {
      displayVal = valObj.ach || "";
    } else {
      displayVal = valObj.achTarget || "";
    }

    if (!displayVal || displayVal === "—" || displayVal === "#DIV/0!" || displayVal === "") {
      return <span style={{ color: "var(--text-muted)", opacity: 0.5 }}>—</span>;
    }

    // Special styling for category or total row
    if (row.isCategoryRow || row.isTotalRow) {
      return (
        <span
          style={{
            fontWeight: 800,
            fontSize: row.isTotalRow ? "12px" : "11px",
            color: row.isTotalRow ? "#38bdf8" : "var(--text-primary)",
          }}
        >
          {displayVal}
        </span>
      );
    }

    // For Achievement metric: evaluate pass/miss vs target
    if (metricMode === "ach") {
      const numAch = parseMetricNum(displayVal);
      const targetNum = row.targetNum;
      if (numAch !== null && targetNum !== null && targetNum !== undefined) {
        const isPass = row.isLowerBetter ? numAch <= targetNum : numAch >= targetNum;
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: isPass ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.14)",
              color: isPass ? "#10B981" : "#EF4444",
              border: `1px solid ${isPass ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              whiteSpace: "nowrap",
            }}
          >
            {displayVal}
          </span>
        );
      }
    }

    // For Ach to Target metric: >= 100 is green, < 100 is red
    if (metricMode === "achTarget") {
      const numTarget = parseMetricNum(displayVal);
      if (numTarget !== null) {
        const isPass = numTarget >= 100;
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10.5px",
              fontWeight: 700,
              backgroundColor: isPass ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.14)",
              color: isPass ? "#10B981" : "#EF4444",
              border: `1px solid ${isPass ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              whiteSpace: "nowrap",
            }}
          >
            {displayVal}
          </span>
        );
      }
    }

    // Score metric: neutral bold
    return (
      <span
        style={{
          fontSize: "11px",
          fontWeight: 650,
          color: "var(--text-primary)",
        }}
      >
        {displayVal}
      </span>
    );
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "32px",
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
        {/* Title & Channel badge */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "4px",
                height: "22px",
                background: "linear-gradient(180deg, var(--red) 0%, var(--red-wine) 100%)",
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
              Rekap Bulanan KPI Parameter (Januari – MTD)
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#FFFFFF",
                backgroundColor: "var(--red-wine)",
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
            Perkembangan capaian historis parameter KPI dari awal tahun (Januari) hingga bulan terkini ({activePeriod}).
          </p>
        </div>

        {/* Metric Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", marginRight: "4px" }}>
            Tampilan Nilai:
          </span>
          <button
            type="button"
            onClick={() => setMetricMode("score")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: metricMode === "score" ? "1px solid var(--accent-primary)" : "1px solid var(--border-default)",
              background: metricMode === "score" ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: metricMode === "score" ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            🎯 Score (%)
          </button>
          <button
            type="button"
            onClick={() => setMetricMode("ach")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: metricMode === "ach" ? "1px solid var(--accent-primary)" : "1px solid var(--border-default)",
              background: metricMode === "ach" ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: metricMode === "ach" ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            📊 Achievement (%)
          </button>
          <button
            type="button"
            onClick={() => setMetricMode("achTarget")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: metricMode === "achTarget" ? "1px solid var(--accent-primary)" : "1px solid var(--border-default)",
              background: metricMode === "achTarget" ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: metricMode === "achTarget" ? "#FFFFFF" : "var(--text-primary)",
            }}
          >
            📈 Ach to Target (%)
          </button>
        </div>
      </div>

      {/* ─── Search & Category Filter Bar ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Category Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {["ALL", "Revenue", "Customer Experience", "Internal Process"].map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: isSelected ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--accent-bg-strong)" : "var(--bg-card)",
                  color: isSelected ? "var(--accent-primary)" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                {cat === "ALL" ? "Semua Kategori" : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: "220px" }}>
          <input
            type="text"
            placeholder="Cari parameter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px 6px 30px",
              borderRadius: "6px",
              fontSize: "11.5px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "9px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              color: "var(--text-muted)",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* ─── Multi-Month Table with Sticky Left Columns ─── */}
      <div
        className="glass-card-static"
        style={{
          overflowX: "auto",
          padding: 0,
          borderRadius: "10px",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "11.5px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "45px",
                  textAlign: "center",
                  padding: "10px 6px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#0f172a",
                  position: "sticky",
                  left: 0,
                  zIndex: 20,
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                No
              </th>
              <th
                style={{
                  minWidth: "220px",
                  textAlign: "left",
                  padding: "10px 14px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#0f172a",
                  position: "sticky",
                  left: "45px",
                  zIndex: 20,
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Parameter KPI
              </th>
              <th
                style={{
                  width: "70px",
                  textAlign: "center",
                  padding: "10px 8px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#1e293b",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Target
              </th>
              <th
                style={{
                  width: "60px",
                  textAlign: "center",
                  padding: "10px 8px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#1e293b",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Bobot
              </th>

              {/* Monthly Headers (Jan – Okt) */}
              {MONTH_KEYS.map((m, idx) => {
                const isLatest = idx === MONTH_KEYS.length - 1;
                return (
                  <th
                    key={m.key}
                    style={{
                      width: "82px",
                      textAlign: "center",
                      padding: "10px 6px",
                      fontWeight: 800,
                      fontSize: "11.5px",
                      color: isLatest ? "#fbbf24" : "#FFFFFF",
                      background: isLatest ? "#1e3a8a" : "#0f172a",
                      borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span>{m.label}-26</span>
                      {isLatest && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 800,
                            padding: "1px 4px",
                            borderRadius: "3px",
                            backgroundColor: "#fbbf24",
                            color: "#0f172a",
                            marginTop: "2px",
                          }}
                        >
                          MTD
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rIdx) => {
              if (row.isCategoryRow) {
                return (
                  <tr
                    key={`cat_${row.category}_${rIdx}`}
                    style={{
                      background: "linear-gradient(90deg, rgba(230, 0, 45, 0.12) 0%, rgba(111, 16, 39, 0.08) 100%)",
                      borderBottom: "1px solid var(--border-default)",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px 6px",
                        textAlign: "center",
                        fontWeight: 800,
                        position: "sticky",
                        left: 0,
                        background: "var(--bg-tertiary)",
                        borderRight: "1px solid var(--border-default)",
                      }}
                    >
                      •
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        fontWeight: 800,
                        fontSize: "12px",
                        color: "var(--accent-primary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        position: "sticky",
                        left: "45px",
                        background: "var(--bg-tertiary)",
                        borderRight: "1px solid var(--border-default)",
                      }}
                    >
                      {row.parameter}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px 6px",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        borderRight: "1px solid var(--border-default)",
                      }}
                    >
                      —
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "8px 6px",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        borderRight: "1px solid var(--border-default)",
                      }}
                    >
                      {row.bobot || "—"}
                    </td>

                    {/* Category monthly scores */}
                    {MONTH_KEYS.map((m, mIdx) => {
                      const isLatest = mIdx === MONTH_KEYS.length - 1;
                      return (
                        <td
                          key={m.key}
                          style={{
                            textAlign: "center",
                            padding: "8px 6px",
                            fontWeight: 800,
                            color: "var(--text-primary)",
                            background: isLatest ? "rgba(251, 191, 36, 0.08)" : undefined,
                            borderRight: "1px solid var(--border-default)",
                          }}
                        >
                          {renderValueBadge(row, m.key)}
                        </td>
                      );
                    })}
                  </tr>
                );
              }

              if (row.isTotalRow) {
                return (
                  <tr
                    key={`total_${rIdx}`}
                    style={{
                      background: "linear-gradient(90deg, #090e17 0%, #1e293b 100%)",
                      color: "#FFFFFF",
                      borderTop: "2px solid #0284c7",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        fontWeight: 800,
                        position: "sticky",
                        left: 0,
                        background: "#090e17",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      ★
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 900,
                        fontSize: "12.5px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#38bdf8",
                        position: "sticky",
                        left: "45px",
                        background: "#090e17",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      TOTAL ACHIEVEMENT
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "12px 6px",
                        fontWeight: 800,
                        color: "#94a3b8",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      100%
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "12px 6px",
                        fontWeight: 800,
                        color: "#94a3b8",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      100%
                    </td>

                    {/* Total monthly values */}
                    {MONTH_KEYS.map((m, mIdx) => {
                      const isLatest = mIdx === MONTH_KEYS.length - 1;
                      return (
                        <td
                          key={m.key}
                          style={{
                            textAlign: "center",
                            padding: "12px 6px",
                            fontWeight: 900,
                            fontSize: "12px",
                            color: isLatest ? "#fbbf24" : "#38bdf8",
                            background: isLatest ? "rgba(251, 191, 36, 0.18)" : undefined,
                            borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          {renderValueBadge(row, m.key)}
                        </td>
                      );
                    })}
                  </tr>
                );
              }

              // Normal Parameter Row
              const isEven = rIdx % 2 === 0;
              return (
                <tr
                  key={`param_${row.parameter}_${rIdx}`}
                  style={{
                    backgroundColor: isEven ? "transparent" : "var(--bg-table-row-hover)",
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <td
                    style={{
                      textAlign: "center",
                      padding: "9px 6px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      position: "sticky",
                      left: 0,
                      background: isEven ? "var(--bg-card)" : "var(--bg-tertiary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.no || rIdx}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      fontWeight: 650,
                      color: "var(--text-primary)",
                      position: "sticky",
                      left: "45px",
                      background: isEven ? "var(--bg-card)" : "var(--bg-tertiary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{row.parameter}</span>
                      {row.definisi && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--text-muted)",
                            marginTop: "2px",
                            lineHeight: 1.25,
                            maxHeight: "26px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={row.definisi}
                        >
                          {row.definisi.slice(0, 75)}
                          {row.definisi.length > 75 ? "..." : ""}
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "9px 6px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.target || "—"}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "9px 6px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.bobot || "—"}
                  </td>

                  {/* Monthly Values */}
                  {MONTH_KEYS.map((m, mIdx) => {
                    const isLatest = mIdx === MONTH_KEYS.length - 1;
                    return (
                      <td
                        key={m.key}
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          background: isLatest ? "rgba(251, 191, 36, 0.05)" : undefined,
                          borderRight: "1px solid var(--border-subtle)",
                        }}
                      >
                        {renderValueBadge(row, m.key)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
