// components/RegionalComparisonWidget.tsx
"use client";

import React from "react";

interface RegionalComparisonWidgetProps {
  hasComparison?: boolean;
  regionalComparison?: {
    bdgScore: string;
    smgScore: string;
    nasionalScore: string;
  };
  periodLabel?: string;
}

export default function RegionalComparisonWidget({
  hasComparison,
  regionalComparison,
  periodLabel = "July 2026",
}: RegionalComparisonWidgetProps) {
  if (!regionalComparison && !hasComparison) {
    return null;
  }

  const bdgScore = regionalComparison?.bdgScore || "—";
  const smgScore = regionalComparison?.smgScore || "—";
  const nasionalScore = regionalComparison?.nasionalScore || "—";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "10px",
        padding: "14px 12px",
      }}
    >
      {/* Widget Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--sidebar-muted, rgba(255, 255, 255, 0.6))",
          }}
        >
          {hasComparison ? "Regional Score" : "Nasional Score"}
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: "var(--accent-primary, #E6002D)",
            background: "rgba(230, 0, 45, 0.15)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {periodLabel}
        </span>
      </div>

      {/* Comparison Grid */}
      {hasComparison ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Bandung (BDG) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(2, 132, 199, 0.1)",
              border: "1px solid rgba(2, 132, 199, 0.25)",
              borderRadius: "6px",
              padding: "7px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#38bdf8",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#e0f2fe",
                  letterSpacing: "0.02em",
                }}
              >
                Bandung (BDG)
              </span>
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 900,
                color: "#38bdf8",
                letterSpacing: "-0.01em",
              }}
            >
              {bdgScore}
            </span>
          </div>

          {/* Semarang (SMG) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.25)",
              borderRadius: "6px",
              padding: "7px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#c084fc",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#f3e8ff",
                  letterSpacing: "0.02em",
                }}
              >
                Semarang (SMG)
              </span>
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 900,
                color: "#c084fc",
                letterSpacing: "-0.01em",
              }}
            >
              {smgScore}
            </span>
          </div>

          {/* Nasional Reference */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "6px",
              padding: "6px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#fbbf24",
                }}
              />
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Nasional (Total)
              </span>
            </div>
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: 800,
                color: "#fbbf24",
              }}
            >
              {nasionalScore}
            </span>
          </div>
        </div>
      ) : (
        /* Only Nasional Available for this period */
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              borderRadius: "6px",
              padding: "8px 10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#fbbf24",
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fef3c7" }}>
                Total Nasional
              </span>
            </div>
            <span style={{ fontSize: "12.5px", fontWeight: 900, color: "#fbbf24" }}>
              {nasionalScore}
            </span>
          </div>
          <span
            style={{
              fontSize: "9.5px",
              color: "rgba(255, 255, 255, 0.5)",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: "2px",
            }}
          >
            Breakdown BDG &amp; SMG tersedia mulai Juli 2026
          </span>
        </div>
      )}
    </div>
  );
}
