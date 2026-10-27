// components/MultiMonthTrendTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { MultiMonthParamRow } from "@/lib/types";

interface MultiMonthTrendTableProps {
  rows?: MultiMonthParamRow[];
  channelName?: string;
  activePeriod?: string;
}

interface MonthMeta {
  key: string;
  label: string;
  isRegional: boolean; // true starting from July (Jul-26 onwards)
}

const MONTHS: MonthMeta[] = [
  { key: "Jan", label: "Jan-26", isRegional: false },
  { key: "Feb", label: "Feb-26", isRegional: false },
  { key: "Mar", label: "Mar-26", isRegional: false },
  { key: "Apr", label: "Apr-26", isRegional: false },
  { key: "May", label: "May-26", isRegional: false },
  { key: "Jun", label: "Jun-26", isRegional: false },
  { key: "Jul", label: "Jul-26", isRegional: true },
  { key: "Aug", label: "Aug-26", isRegional: true },
  { key: "Sep", label: "Sep-26", isRegional: true },
  { key: "Oct", label: "Oct-26", isRegional: true },
];

const parseNum = (valStr?: string): number | null => {
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
  // viewMode: "spreadsheet" (persis spreadsheet), "score" (hanya score), "ach" (hanya ach)
  const [viewMode, setViewMode] = useState<"spreadsheet" | "score" | "ach">("spreadsheet");
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
        return r.parameter.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rows, categoryFilter, searchQuery]);

  if (!rows || rows.length === 0) {
    return null;
  }

  // Helper to determine whether a cell missed target (soft red tint like spreadsheet)
  const isMissedCell = (
    row: MultiMonthParamRow,
    valueStr?: string,
    cellType?: "ach" | "achTarget" | "score"
  ): boolean => {
    if (!valueStr || row.isCategoryRow || row.isTotalRow) return false;
    const num = parseNum(valueStr);
    if (num === null) return false;

    if (cellType === "achTarget") {
      return num < 99.5;
    }

    if (cellType === "ach" && row.targetNum !== null && row.targetNum !== undefined) {
      if (row.isLowerBetter) {
        return num > row.targetNum;
      }
      return num < row.targetNum;
    }

    return false;
  };

  const renderDataCell = (
    val: string | undefined,
    row: MultiMonthParamRow,
    cellType: "ach" | "achTarget" | "score",
    isLatestMonth: boolean
  ) => {
    if (!val || val === "—" || val === "" || val === "#DIV/0!") {
      return (
        <td
          style={{
            textAlign: "center",
            padding: "8px 6px",
            fontSize: "11px",
            color: "var(--text-muted)",
            opacity: 0.45,
            borderRight: "1px solid var(--border-subtle)",
            background: isLatestMonth ? "rgba(251, 191, 36, 0.04)" : undefined,
          }}
        >
          —
        </td>
      );
    }

    const missed = isMissedCell(row, val, cellType);

    // Styling for category row
    if (row.isCategoryRow) {
      return (
        <td
          style={{
            textAlign: "center",
            padding: "8px 6px",
            fontSize: "11px",
            fontWeight: 800,
            color: "var(--text-primary)",
            borderRight: "1px solid var(--border-subtle)",
            background: isLatestMonth ? "rgba(251, 191, 36, 0.08)" : undefined,
          }}
        >
          {val}
        </td>
      );
    }

    // Styling for total row
    if (row.isTotalRow) {
      return (
        <td
          style={{
            textAlign: "center",
            padding: "10px 6px",
            fontSize: "11.5px",
            fontWeight: 900,
            color: isLatestMonth ? "#fbbf24" : "#38bdf8",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            background: isLatestMonth ? "rgba(251, 191, 36, 0.18)" : undefined,
          }}
        >
          {val}
        </td>
      );
    }

    // Normal parameter row cell
    const cellBg = missed
      ? "rgba(239, 68, 68, 0.12)"
      : isLatestMonth
      ? "rgba(251, 191, 36, 0.04)"
      : undefined;

    const cellColor = missed
      ? "#ef4444"
      : cellType === "score"
      ? "var(--text-primary)"
      : "var(--text-secondary)";

    return (
      <td
        style={{
          textAlign: "center",
          padding: "7px 6px",
          fontSize: "11px",
          fontWeight: cellType === "score" ? 700 : 500,
          color: cellColor,
          background: cellBg,
          borderRight: "1px solid var(--border-subtle)",
          whiteSpace: "nowrap",
        }}
      >
        {val}
      </td>
    );
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "14px",
        padding: "24px 28px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        marginBottom: "32px",
      }}
    >
      {/* ── Header Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "18px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📊</span>
              Rekapitulasi Capaian Bulanan (Januari s/d MTD) — {channelName}
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "999px",
                background: "rgba(2, 132, 199, 0.12)",
                color: "#0284c7",
                border: "1px solid rgba(2, 132, 199, 0.25)",
              }}
            >
              Persis Format Spreadsheet
            </span>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Mulai Juli terdapat capaian <strong>Nasional, Bandung (BDG), dan Semarang (SMG)</strong>. Geser tabel ke kanan untuk melihat rincian bulan lainnya.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              background: "var(--bg-tertiary)",
              padding: "3px",
              borderRadius: "10px",
              border: "1px solid var(--border-default)",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("spreadsheet")}
              style={{
                padding: "6px 12px",
                borderRadius: "7px",
                border: "none",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: viewMode === "spreadsheet" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "spreadsheet" ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: viewMode === "spreadsheet" ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
              }}
            >
              📋 Format Spreadsheet (Lengkap)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("score")}
              style={{
                padding: "6px 12px",
                borderRadius: "7px",
                border: "none",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: viewMode === "score" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "score" ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: viewMode === "score" ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
              }}
            >
              🎯 Ringkas: Score
            </button>
            <button
              type="button"
              onClick={() => setViewMode("ach")}
              style={{
                padding: "6px 12px",
                borderRadius: "7px",
                border: "none",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: viewMode === "ach" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "ach" ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: viewMode === "ach" ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
              }}
            >
              📊 Ringkas: Ach
            </button>
          </div>
        </div>
      </div>

      {/* ── Filters (Category pills + Search) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["ALL", "Revenue", "Customer Experience", "Internal Process"].map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  border: isActive
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-default)",
                  background: isActive ? "rgba(2, 132, 199, 0.12)" : "transparent",
                  color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat === "ALL" ? "Semua Kategori" : cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: "relative", minWidth: "220px" }}>
          <input
            type="text"
            placeholder="Cari parameter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px 6px 30px",
              borderRadius: "8px",
              border: "1px solid var(--border-default)",
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              fontSize: "11.5px",
              outline: "none",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* ── Table Container with Horizontal Scroll & Frozen Parameter Column ── */}
      <div
        style={{
          overflowX: "auto",
          border: "1px solid var(--border-default)",
          borderRadius: "10px",
          background: "var(--bg-card)",
          position: "relative",
          maxHeight: "750px",
          overflowY: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "11px",
          }}
        >
          {/* ═══════════ TABLE HEADERS ═══════════ */}
          <thead>
            {/* Header Row 1: Month Groups */}
            <tr style={{ background: "#0f172a", color: "#FFFFFF" }}>
              {/* No - Frozen */}
              <th
                rowSpan={viewMode === "spreadsheet" ? 2 : 1}
                style={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 35,
                  width: "45px",
                  minWidth: "45px",
                  padding: "10px 4px",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  background: "#090e17",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                No
              </th>

              {/* Parameter - Frozen (NO DEFINISI) */}
              <th
                rowSpan={viewMode === "spreadsheet" ? 2 : 1}
                style={{
                  position: "sticky",
                  top: 0,
                  left: "45px",
                  zIndex: 35,
                  width: "230px",
                  minWidth: "230px",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  background: "#090e17",
                  borderRight: "2px solid rgba(255, 255, 255, 0.25)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "4px 0 8px -2px rgba(0, 0, 0, 0.35)",
                }}
              >
                Parameter
              </th>

              {/* Target (Maroon) */}
              <th
                rowSpan={viewMode === "spreadsheet" ? 2 : 1}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                  width: "70px",
                  minWidth: "70px",
                  padding: "10px 6px",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  background: "#831843",
                  color: "#FFFFFF",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Target
              </th>

              {/* Bobot (Maroon) */}
              <th
                rowSpan={viewMode === "spreadsheet" ? 2 : 1}
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                  width: "60px",
                  minWidth: "60px",
                  padding: "10px 6px",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  background: "#831843",
                  color: "#FFFFFF",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Bobot
              </th>

              {/* Monthly Top Headers */}
              {MONTHS.map((m, idx) => {
                const isLatest = idx === MONTHS.length - 1;
                const colSpan =
                  viewMode === "spreadsheet"
                    ? m.isRegional
                      ? 7
                      : 3
                    : 1;

                // Color coding per month group like GSheet
                let headerBg = "#0369a1"; // Jan-Jun
                if (m.isRegional) headerBg = "#0284c7"; // Jul-Sep
                if (isLatest) headerBg = "#b45309"; // Oct (MTD)

                return (
                  <th
                    key={m.key}
                    colSpan={colSpan}
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 20,
                      textAlign: "center",
                      padding: "8px 6px",
                      fontWeight: 800,
                      fontSize: "11.5px",
                      letterSpacing: "0.03em",
                      background: headerBg,
                      color: "#FFFFFF",
                      borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.label} {isLatest && <span style={{ fontSize: "9px", padding: "1px 5px", background: "#f59e0b", color: "#000", borderRadius: "4px", marginLeft: "4px", fontWeight: 900 }}>MTD</span>}
                  </th>
                );
              })}
            </tr>

            {/* Header Row 2: Sub-columns (Only in spreadsheet view) */}
            {viewMode === "spreadsheet" && (
              <tr style={{ background: "#1e293b", color: "#e2e8f0" }}>
                {MONTHS.map((m) => {
                  if (!m.isRegional) {
                    // Jan - Jun: 3 columns (Ach, Ach Target, Score)
                    return (
                      <React.Fragment key={`sub_${m.key}`}>
                        <th
                          style={{
                            position: "sticky",
                            top: "35px",
                            zIndex: 18,
                            width: "65px",
                            minWidth: "65px",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "10.5px",
                            fontWeight: 700,
                            background: "#1e293b",
                            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          Ach
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: "35px",
                            zIndex: 18,
                            width: "70px",
                            minWidth: "70px",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                            background: "#1e293b",
                            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          Ach Target
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: "35px",
                            zIndex: 18,
                            width: "60px",
                            minWidth: "60px",
                            padding: "6px 4px",
                            textAlign: "center",
                            fontSize: "10.5px",
                            fontWeight: 800,
                            color: "#38bdf8",
                            background: "#0f172a",
                            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                          }}
                        >
                          Score
                        </th>
                      </React.Fragment>
                    );
                  }

                  // Jul - Oct: 7 columns (Nasional, Ach Target, Score, BDG, BDG Score, SMG, SMG Score)
                  return (
                    <React.Fragment key={`sub_${m.key}`}>
                      {/* 1. Nasional Ach */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "65px",
                          minWidth: "65px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: "#1e293b",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Nasional
                      </th>
                      {/* 2. Ach Target */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "70px",
                          minWidth: "70px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          background: "#1e293b",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Ach Target
                      </th>
                      {/* 3. Score Nasional */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "60px",
                          minWidth: "60px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "#38bdf8",
                          background: "#0f172a",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        Score
                      </th>
                      {/* 4. BDG Ach */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "62px",
                          minWidth: "62px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#7dd3fc",
                          background: "#13253b",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        BDG
                      </th>
                      {/* 5. BDG Score */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "68px",
                          minWidth: "68px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "#38bdf8",
                          background: "#0c1b2b",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        BDG score
                      </th>
                      {/* 6. SMG Ach */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "62px",
                          minWidth: "62px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#c084fc",
                          background: "#241938",
                          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        SMG
                      </th>
                      {/* 7. SMG Score */}
                      <th
                        style={{
                          position: "sticky",
                          top: "35px",
                          zIndex: 18,
                          width: "68px",
                          minWidth: "68px",
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "#a855f7",
                          background: "#170f26",
                          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        SMG Score
                      </th>
                    </React.Fragment>
                  );
                })}
              </tr>
            )}
          </thead>

          {/* ═══════════ TABLE BODY ═══════════ */}
          <tbody>
            {filteredRows.map((row, rIdx) => {
              // ── CATEGORY ROW (Revenue, Customer Experience, Internal Process) ──
              if (row.isCategoryRow) {
                return (
                  <tr
                    key={`cat_${row.parameter}_${rIdx}`}
                    style={{
                      background: "var(--bg-table-header)",
                      fontWeight: 800,
                      borderTop: "1.5px solid var(--border-default)",
                      borderBottom: "1.5px solid var(--border-default)",
                    }}
                  >
                    {/* No - Frozen */}
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 10,
                        textAlign: "center",
                        padding: "9px 4px",
                        fontWeight: 900,
                        fontSize: "12px",
                        color: "var(--accent-primary)",
                        background: "var(--bg-table-header)",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      {row.no || "•"}
                    </td>

                    {/* Parameter - Frozen */}
                    <td
                      style={{
                        position: "sticky",
                        left: "45px",
                        zIndex: 10,
                        padding: "9px 14px",
                        fontWeight: 900,
                        fontSize: "12px",
                        color: "var(--accent-primary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        background: "var(--bg-table-header)",
                        borderRight: "2px solid var(--border-default)",
                        boxShadow: "4px 0 8px -2px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {row.parameter}
                    </td>

                    {/* Target */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "9px 6px",
                        color: "var(--text-muted)",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      —
                    </td>

                    {/* Bobot */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "9px 6px",
                        fontWeight: 800,
                        color: "var(--accent-primary)",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      {row.bobot}
                    </td>

                    {/* Month values for category row */}
                    {MONTHS.map((m, mIdx) => {
                      const isLatest = mIdx === MONTHS.length - 1;
                      const val = row.monthlyValues?.[m.key];

                      if (viewMode === "score") {
                        return renderDataCell(val?.score, row, "score", isLatest);
                      }
                      if (viewMode === "ach") {
                        return renderDataCell(val?.ach, row, "ach", isLatest);
                      }

                      // Spreadsheet mode
                      if (!m.isRegional) {
                        return (
                          <React.Fragment key={`cat_cell_${m.key}_${rIdx}`}>
                            {renderDataCell("", row, "ach", isLatest)}
                            {renderDataCell("", row, "achTarget", isLatest)}
                            {renderDataCell(val?.score, row, "score", isLatest)}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={`cat_cell_${m.key}_${rIdx}`}>
                          {renderDataCell(val?.ach, row, "ach", isLatest)}
                          {renderDataCell(val?.achTarget, row, "achTarget", isLatest)}
                          {renderDataCell(val?.score, row, "score", isLatest)}
                          {renderDataCell(val?.bdgAch, row, "ach", isLatest)}
                          {renderDataCell(val?.bdgScore, row, "score", isLatest)}
                          {renderDataCell(val?.smgAch, row, "ach", isLatest)}
                          {renderDataCell(val?.smgScore, row, "score", isLatest)}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              }

              // ── TOTAL ROW ──
              if (row.isTotalRow) {
                return (
                  <tr
                    key={`total_${rIdx}`}
                    style={{
                      background: "#090e17",
                      color: "#FFFFFF",
                      borderTop: "2px solid #0284c7",
                      borderBottom: "2px solid #0284c7",
                    }}
                  >
                    {/* No - Frozen */}
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 10,
                        textAlign: "center",
                        padding: "11px 4px",
                        fontWeight: 900,
                        color: "#38bdf8",
                        background: "#090e17",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      ★
                    </td>

                    {/* Parameter - Frozen */}
                    <td
                      style={{
                        position: "sticky",
                        left: "45px",
                        zIndex: 10,
                        padding: "11px 14px",
                        fontWeight: 900,
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#38bdf8",
                        background: "#090e17",
                        borderRight: "2px solid rgba(255, 255, 255, 0.25)",
                        boxShadow: "4px 0 8px -2px rgba(0, 0, 0, 0.35)",
                      }}
                    >
                      TOTAL ACHIEVEMENT
                    </td>

                    {/* Target */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "11px 6px",
                        fontWeight: 800,
                        color: "#94a3b8",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      100%
                    </td>

                    {/* Bobot */}
                    <td
                      style={{
                        textAlign: "center",
                        padding: "11px 6px",
                        fontWeight: 800,
                        color: "#94a3b8",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      100%
                    </td>

                    {/* Monthly values for total row */}
                    {MONTHS.map((m, mIdx) => {
                      const isLatest = mIdx === MONTHS.length - 1;
                      const val = row.monthlyValues?.[m.key];

                      if (viewMode === "score") {
                        return renderDataCell(val?.score, row, "score", isLatest);
                      }
                      if (viewMode === "ach") {
                        return renderDataCell(val?.ach, row, "ach", isLatest);
                      }

                      if (!m.isRegional) {
                        return (
                          <React.Fragment key={`tot_cell_${m.key}_${rIdx}`}>
                            {renderDataCell("", row, "ach", isLatest)}
                            {renderDataCell("", row, "achTarget", isLatest)}
                            {renderDataCell(val?.score, row, "score", isLatest)}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={`tot_cell_${m.key}_${rIdx}`}>
                          {renderDataCell(val?.ach, row, "ach", isLatest)}
                          {renderDataCell(val?.achTarget, row, "achTarget", isLatest)}
                          {renderDataCell(val?.score, row, "score", isLatest)}
                          {renderDataCell(val?.bdgAch, row, "ach", isLatest)}
                          {renderDataCell(val?.bdgScore, row, "score", isLatest)}
                          {renderDataCell(val?.smgAch, row, "ach", isLatest)}
                          {renderDataCell(val?.smgScore, row, "score", isLatest)}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              }

              // ── NORMAL PARAMETER ROW ──
              const isEven = rIdx % 2 === 0;
              const rowBg = isEven ? "var(--bg-card)" : "var(--bg-tertiary)";

              return (
                <tr
                  key={`param_${row.parameter}_${rIdx}`}
                  style={{
                    backgroundColor: isEven ? "transparent" : "var(--bg-table-row-hover)",
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 0.15s ease",
                  }}
                  className="table-row-hover"
                >
                  {/* No - Frozen */}
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 10,
                      textAlign: "center",
                      padding: "8px 4px",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      background: rowBg,
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.no || rIdx}
                  </td>

                  {/* Parameter - Frozen (NO DEFINISI SUBTITLE) */}
                  <td
                    style={{
                      position: "sticky",
                      left: "45px",
                      zIndex: 10,
                      padding: "8px 14px",
                      fontWeight: 650,
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      background: rowBg,
                      borderRight: "2px solid var(--border-default)",
                      boxShadow: "4px 0 8px -2px rgba(0, 0, 0, 0.08)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.parameter}
                  </td>

                  {/* Target */}
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 6px",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.target || "—"}
                  </td>

                  {/* Bobot */}
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 6px",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.bobot || "—"}
                  </td>

                  {/* Monthly Values */}
                  {MONTHS.map((m, mIdx) => {
                    const isLatest = mIdx === MONTHS.length - 1;
                    const val = row.monthlyValues?.[m.key];

                    if (viewMode === "score") {
                      return renderDataCell(val?.score, row, "score", isLatest);
                    }
                    if (viewMode === "ach") {
                      return renderDataCell(val?.ach, row, "ach", isLatest);
                    }

                    // Spreadsheet mode:
                    if (!m.isRegional) {
                      // Jan - Jun: 3 columns
                      return (
                        <React.Fragment key={`param_cell_${m.key}_${rIdx}`}>
                          {renderDataCell(val?.ach, row, "ach", isLatest)}
                          {renderDataCell(val?.achTarget, row, "achTarget", isLatest)}
                          {renderDataCell(val?.score, row, "score", isLatest)}
                        </React.Fragment>
                      );
                    }

                    // Jul - Oct: 7 columns (Nasional, Ach Target, Score, BDG, BDG Score, SMG, SMG Score)
                    return (
                      <React.Fragment key={`param_cell_${m.key}_${rIdx}`}>
                        {renderDataCell(val?.ach, row, "ach", isLatest)}
                        {renderDataCell(val?.achTarget, row, "achTarget", isLatest)}
                        {renderDataCell(val?.score, row, "score", isLatest)}
                        {renderDataCell(val?.bdgAch, row, "ach", isLatest)}
                        {renderDataCell(val?.bdgScore, row, "score", isLatest)}
                        {renderDataCell(val?.smgAch, row, "ach", isLatest)}
                        {renderDataCell(val?.smgScore, row, "score", isLatest)}
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer Notes ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "12px",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "rgba(239, 68, 68, 0.25)",
                border: "1px solid #ef4444",
                display: "inline-block",
              }}
            />
            <span>Belum Mencapai Target (Missed)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "rgba(251, 191, 36, 0.25)",
                border: "1px solid #f59e0b",
                display: "inline-block",
              }}
            />
            <span>Bulan Berjalan (MTD)</span>
          </div>
        </div>

        <span>
          Menampilkan {filteredRows.length} baris parameter • Format kolom sinkron dengan Google Sheet
        </span>
      </div>
    </div>
  );
}
