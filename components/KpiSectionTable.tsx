// components/KpiSectionTable.tsx
"use client";

import type { KpiSection } from "@/lib/types";

interface KpiSectionTableProps {
  section: KpiSection;
  daysCount: number;
  animationDelay?: number;
}

const getMtdColor = (targetStr?: string, mtdStr?: string) => {
  if (!targetStr || !mtdStr || mtdStr === "—") return null;
  
  const targetNum = parseFloat(targetStr.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""));
  const mtdNum = parseFloat(mtdStr.replace(/,/g, ".").replace(/[^0-9.-]+/g, ""));
  
  if (isNaN(targetNum) || isNaN(mtdNum)) return null;
  
  return mtdNum >= targetNum ? "var(--color-success)" : "var(--color-danger)";
};

export default function KpiSectionTable({
  section,
  daysCount,
  animationDelay = 0,
}: KpiSectionTableProps) {
  const dayColumns = Array.from({ length: daysCount }, (_, i) => i + 1);

  const tTarget = section.target ?? 0;
  const tAchievement = section.weight;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <h3 className="font-heading" style={{
          fontSize: "15px",
          fontWeight: 800,
          color: "var(--text-primary)",
          margin: 0,
        }}>
          {section.name}
        </h3>
        
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-tertiary)",
            padding: "3px 10px",
            borderRadius: "6px",
            border: `1px solid var(--border-strong)`,
          }}>
            Target: {tTarget}%
          </span>
          
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "#FFFFFF",
            backgroundColor: tAchievement >= tTarget ? "var(--color-success)" : "var(--color-danger)",
            padding: "3px 10px",
            borderRadius: "6px",
            border: `1px solid ${tAchievement >= tTarget ? "var(--color-success)" : "var(--color-danger)"}`,
          }}>
            Realisasi: {tAchievement}%
          </span>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="glass-card-static" style={{
        overflowX: "auto",
        padding: 0,
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}>
          <thead>
            <tr>
              {/* Frozen: Parameter */}
              <th style={{
                position: "sticky",
                left: 0,
                zIndex: 3,
                width: "200px",
                padding: "12px 14px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
                textAlign: "left",
                background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                borderBottom: `2px solid var(--accent-primary)`,
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                textTransform: "capitalize",
              }}>
                Parameter
              </th>

              {/* Frozen: Target */}
              <th style={{
                position: "sticky",
                left: "200px",
                zIndex: 3,
                width: "70px",
                padding: "12px 10px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
                textAlign: "center",
                background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                borderBottom: `2px solid var(--accent-primary)`,
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                textTransform: "capitalize",
              }}>
                Target
              </th>

              {/* Frozen: Bobot Target */}
              <th style={{
                position: "sticky",
                left: "270px",
                zIndex: 3,
                width: "100px",
                padding: "12px 10px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
                textAlign: "center",
                background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                borderBottom: `2px solid var(--accent-primary)`,
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                textTransform: "capitalize",
              }}>
                Bobot Target
              </th>

              {/* Frozen: MTD Achievement */}
              <th style={{
                position: "sticky",
                left: "370px",
                zIndex: 3,
                width: "120px",
                padding: "12px 10px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
                textAlign: "center",
                background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                borderBottom: `2px solid var(--accent-primary)`,
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                textTransform: "capitalize",
              }}>
                MTD Achievement
              </th>

              {/* Frozen: Bobot Achievement */}
              <th style={{
                position: "sticky",
                left: "490px",
                zIndex: 3,
                width: "125px",
                padding: "12px 10px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
                textAlign: "center",
                background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                borderBottom: `2px solid var(--accent-primary)`,
                borderRight: `2px solid var(--accent-primary)`,
                boxShadow: "4px 0 8px -3px rgba(0, 0, 0, 0.2)",
                textTransform: "capitalize",
              }}>
                Bobot Achievement
              </th>

              {/* Scrollable: Days */}
              {dayColumns.map((day) => (
                <th key={day} style={{
                  width: "54px",
                  padding: "12px 4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textAlign: "center",
                  background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                  borderBottom: `2px solid var(--accent-primary)`,
                  borderRight: day === daysCount ? "none" : "1px solid rgba(255, 255, 255, 0.15)",
                }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.parameters.map((param, index) => {
              const isSub = param.isSubRow;

              return (
                <tr
                  key={index}
                  className="kpi-row-hover"
                  style={{
                    background: isSub ? "var(--bg-tertiary)" : "var(--bg-card)",
                  }}
                >
                  {/* Frozen Parameter Cell */}
                  <td style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    padding: isSub ? "10px 14px 10px 36px" : "12px 14px",
                    fontSize: "12px",
                    fontWeight: isSub ? 400 : 600,
                    color: isSub ? "var(--text-muted)" : "var(--text-primary)",
                    fontStyle: isSub ? "italic" : "normal",
                    textAlign: "left",
                    background: isSub ? "var(--bg-tertiary)" : "var(--bg-card)",
                    borderBottom: `1px solid var(--border-subtle)`,
                    borderRight: `1px solid var(--border-subtle)`,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {param.name}
                  </td>

                  {/* Frozen Target Cell */}
                  <td style={{
                    position: "sticky",
                    left: "200px",
                    zIndex: 2,
                    padding: "12px 10px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    textAlign: "center",
                    background: isSub ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                    borderBottom: `1px solid var(--border-subtle)`,
                    borderRight: `1px solid var(--border-subtle)`,
                  }}>
                    {param.target}
                  </td>

                  {/* Frozen Bobot Target Cell */}
                  <td style={{
                    position: "sticky",
                    left: "270px",
                    zIndex: 2,
                    padding: "12px 10px",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    textAlign: "center",
                    background: isSub ? "var(--bg-tertiary)" : "var(--bg-secondary)",
                    borderBottom: `1px solid var(--border-subtle)`,
                    borderRight: `1px solid var(--border-subtle)`,
                  }}>
                    {param.bobotTarget || "—"}
                  </td>

                  {/* Frozen MTD Achievement Cell */}
                  <td style={{
                    position: "sticky",
                    left: "370px",
                    zIndex: 2,
                    padding: "12px 10px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    color: getMtdColor(param.target, param.mtdAchievement) ? "#FFFFFF" : "var(--text-primary)",
                    textAlign: "center",
                    background: getMtdColor(param.target, param.mtdAchievement) || (isSub ? "var(--bg-tertiary)" : "var(--bg-card)"),
                    borderBottom: `1px solid var(--border-subtle)`,
                    borderRight: `1px solid var(--border-subtle)`,
                  }}>
                    {param.mtdAchievement || "—"}
                  </td>

                  {/* Frozen Bobot Achievement Cell */}
                  <td style={{
                    position: "sticky",
                    left: "490px",
                    zIndex: 2,
                    padding: "12px 10px",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    textAlign: "center",
                    background: isSub ? "var(--bg-tertiary)" : "var(--bg-card)",
                    borderBottom: `1px solid var(--border-subtle)`,
                    borderRight: `2px solid var(--border-default)`,
                    boxShadow: "4px 0 8px -3px rgba(0, 0, 0, 0.15)",
                  }}>
                    {param.robotAchievement || "—"}
                  </td>

                  {/* Scrollable Daily Columns */}
                  {dayColumns.map((day) => {
                    const cellVal = param.dailyValues?.[day];
                    return (
                      <td key={day} style={{
                        padding: "12px 4px",
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        textAlign: "center",
                        borderBottom: `1px solid var(--border-subtle)`,
                        borderRight: day === daysCount ? "none" : `1px solid var(--border-subtle)`,
                        backgroundColor: cellVal ? "var(--accent-bg)" : "transparent",
                      }}>
                        {cellVal || ""}
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
