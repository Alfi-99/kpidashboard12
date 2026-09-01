// components/MonthlyComparisonTable.tsx
"use client";

import React, { useState } from "react";
import type { MonthlyKpiRow } from "@/lib/types";

interface MonthlyComparisonTableProps {
  rows?: MonthlyKpiRow[];
  period?: string;
}

export default function MonthlyComparisonTable({
  rows,
  period = "July 2026",
}: MonthlyComparisonTableProps) {
  const [expandedDefIndex, setExpandedDefIndex] = useState<number | null>(null);

  if (!rows || rows.length === 0) {
    return null;
  }

  const toggleDef = (idx: number) => {
    setExpandedDefIndex(expandedDefIndex === idx ? null : idx);
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "28px",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "4px",
              height: "20px",
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
            Monthly Comparison & Performance
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
            {period}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-primary)",
              background: "var(--bg-tertiary)",
              padding: "5px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-strong)",
            }}
          >
            Komparasi:{" "}
            <strong style={{ color: "#0284c7" }}>Bandung (BDG)</strong> vs{" "}
            <strong style={{ color: "#7e22ce" }}>Semarang (SMG)</strong> vs{" "}
            <strong style={{ color: "#d97706" }}>Nasional</strong>
          </span>
        </div>
      </div>

      {/* Table Container */}
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
            {/* Top Header Row */}
            <tr>
              <th
                rowSpan={2}
                style={{
                  width: "42px",
                  textAlign: "center",
                  padding: "11px 6px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#0f172a",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                No
              </th>
              <th
                rowSpan={2}
                style={{
                  minWidth: "220px",
                  textAlign: "left",
                  padding: "11px 14px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#0f172a",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Parameter
              </th>
              <th
                rowSpan={2}
                style={{
                  minWidth: "260px",
                  maxWidth: "340px",
                  textAlign: "left",
                  padding: "11px 14px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#0f172a",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Definisi
              </th>
              <th
                rowSpan={2}
                style={{
                  width: "75px",
                  textAlign: "center",
                  padding: "11px 6px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#b91c1c",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Target
              </th>
              <th
                rowSpan={2}
                style={{
                  width: "70px",
                  textAlign: "center",
                  padding: "11px 6px",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "#1e293b",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                Bobot
              </th>
              <th
                colSpan={3}
                style={{
                  textAlign: "center",
                  padding: "9px 6px",
                  fontWeight: 900,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  letterSpacing: "0.04em",
                }}
              >
                NASIONAL
              </th>
              <th
                colSpan={2}
                style={{
                  textAlign: "center",
                  padding: "9px 6px",
                  fontWeight: 900,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  letterSpacing: "0.04em",
                }}
              >
                BANDUNG (BDG)
              </th>
              <th
                colSpan={2}
                style={{
                  textAlign: "center",
                  padding: "9px 6px",
                  fontWeight: 900,
                  fontSize: "11.5px",
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  letterSpacing: "0.04em",
                }}
              >
                SEMARANG (SMG)
              </th>
            </tr>

            {/* Sub Header Row */}
            <tr>
              {/* Nasional Subheaders */}
              <th
                style={{
                  width: "75px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#b45309",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                Ach
              </th>
              <th
                style={{
                  width: "85px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#92400e",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                Ach Target
              </th>
              <th
                style={{
                  width: "75px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  background: "#78350f",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                Score
              </th>

              {/* BDG Subheaders */}
              <th
                style={{
                  width: "75px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#0369a1",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                BDG
              </th>
              <th
                style={{
                  width: "85px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  background: "#075985",
                  borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                BDG Score
              </th>

              {/* SMG Subheaders */}
              <th
                style={{
                  width: "75px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#6b21a8",
                  borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                SMG
              </th>
              <th
                style={{
                  width: "85px",
                  textAlign: "center",
                  padding: "7px 4px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  background: "#581c87",
                  borderBottom: "1px solid var(--border-strong)",
                }}
              >
                SMG Score
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => {
              if (row.isTotalRow) {
                return (
                  <tr
                    key={`monthly-total-${idx}`}
                    style={{
                      background: "#0f172a",
                      color: "#FFFFFF",
                      borderTop: "2px solid var(--accent-primary)",
                      borderBottom: "2px solid var(--accent-primary)",
                    }}
                  >
                    <td
                      colSpan={4}
                      style={{
                        padding: "12px 14px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: 900,
                        letterSpacing: "0.05em",
                        color: "#FFFFFF",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      TOTAL ACHIEVEMENT
                    </td>
                    <td
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "12px",
                        color: "#FFFFFF",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      {row.bobot || "100%"}
                    </td>

                    {/* Nasional Total */}
                    <td
                      colSpan={2}
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    />
                    <td
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "13px",
                        color: "#fbbf24",
                        background: "rgba(245, 158, 11, 0.2)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      {row.nasionalScore || "—"}
                    </td>

                    {/* BDG Total */}
                    <td style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <td
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "13px",
                        color: "#38bdf8",
                        background: "rgba(56, 189, 248, 0.2)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      {row.bdgScore || "—"}
                    </td>

                    {/* SMG Total */}
                    <td style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <td
                      style={{
                        padding: "12px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "13px",
                        color: "#d8b4fe",
                        background: "rgba(168, 85, 247, 0.2)",
                      }}
                    >
                      {row.smgScore || "—"}
                    </td>
                  </tr>
                );
              }

              if (row.isCategoryRow) {
                return (
                  <tr
                    key={`monthly-cat-${idx}`}
                    style={{
                      background: "var(--bg-tertiary)",
                      borderTop: "1px solid var(--border-strong)",
                      borderBottom: "1px solid var(--border-strong)",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        color: "var(--accent-primary)",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      {row.no || "•"}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontWeight: 900,
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      {row.parameter}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    />
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    />
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        borderRight: "1px solid var(--border-subtle)",
                      }}
                    >
                      {row.bobot}
                    </td>

                    {/* Nasional Category Score */}
                    <td style={{ borderRight: "1px solid var(--border-subtle)" }} />
                    <td style={{ borderRight: "1px solid var(--border-subtle)" }} />
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "12.5px",
                        color: "#d97706",
                        background: "rgba(245, 158, 11, 0.08)",
                        borderRight: "1px solid var(--border-strong)",
                      }}
                    >
                      {row.nasionalScore}
                    </td>

                    {/* BDG Category Score */}
                    <td style={{ borderRight: "1px solid var(--border-subtle)" }} />
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "12.5px",
                        color: "#0284c7",
                        background: "rgba(56, 189, 248, 0.08)",
                        borderRight: "1px solid var(--border-strong)",
                      }}
                    >
                      {row.bdgScore}
                    </td>

                    {/* SMG Category Score */}
                    <td style={{ borderRight: "1px solid var(--border-subtle)" }} />
                    <td
                      style={{
                        padding: "10px 6px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "12.5px",
                        color: "#7e22ce",
                        background: "rgba(168, 85, 247, 0.08)",
                      }}
                    >
                      {row.smgScore}
                    </td>
                  </tr>
                );
              }

              // Normal & Sub Parameter Rows
              const isEven = idx % 2 === 0;
              const isExpanded = expandedDefIndex === idx;

              return (
                <tr
                  key={`monthly-row-${idx}`}
                  style={{
                    background: isEven ? "transparent" : "var(--bg-table-row-hover)",
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 0.15s ease",
                  }}
                  className="table-row-hover"
                >
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "11px",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.no}
                  </td>
                  <td
                    style={{
                      padding: "9px 14px",
                      paddingLeft: row.isSubRow ? "28px" : "14px",
                      fontWeight: row.isSubRow ? 500 : 700,
                      color: row.isSubRow ? "var(--text-secondary)" : "var(--text-primary)",
                      fontSize: "11.5px",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.isSubRow && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "var(--accent-primary)",
                          opacity: 0.7,
                          marginRight: "8px",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                    {row.parameter}
                  </td>
                  <td
                    onClick={() => row.definisi && toggleDef(idx)}
                    style={{
                      padding: "9px 14px",
                      fontSize: "11px",
                      lineHeight: "1.4",
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                      cursor: row.definisi ? "pointer" : "default",
                      wordBreak: "break-word",
                    }}
                    title={row.definisi}
                  >
                    {row.definisi ? (
                      <div>
                        <div
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? "unset" : 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {row.definisi}
                        </div>
                        {row.definisi.length > 70 && (
                          <span
                            style={{
                              fontSize: "9.5px",
                              color: "var(--accent-primary)",
                              fontWeight: 700,
                              marginTop: "3px",
                              display: "inline-block",
                              cursor: "pointer",
                            }}
                          >
                            {isExpanded ? "Tutup" : "Selengkapnya"}
                          </span>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.target || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "11.5px",
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.bobot || "—"}
                  </td>

                  {/* Nasional Values */}
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.nasionalAch || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "11.5px",
                      color: "var(--text-secondary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.nasionalAchTarget || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      background: "rgba(245, 158, 11, 0.06)",
                      borderRight: "1px solid var(--border-strong)",
                    }}
                  >
                    {row.nasionalScore || "—"}
                  </td>

                  {/* BDG Values */}
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.bdgAch || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      background: "rgba(56, 189, 248, 0.06)",
                      borderRight: "1px solid var(--border-strong)",
                    }}
                  >
                    {row.bdgScore || "—"}
                  </td>

                  {/* SMG Values */}
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      borderRight: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.smgAch || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 6px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      background: "rgba(168, 85, 247, 0.06)",
                    }}
                  >
                    {row.smgScore || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
