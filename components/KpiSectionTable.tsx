// components/KpiSectionTable.tsx
"use client";

import type { KpiSection } from "@/lib/types";

interface KpiSectionTableProps {
  section: KpiSection;
  daysCount: number;
  animationDelay?: number;
}

export default function KpiSectionTable({
  section,
  daysCount,
  animationDelay = 0,
}: KpiSectionTableProps) {
  // Generate days array dynamically [1, 2, ..., daysCount]
  const dayColumns = Array.from({ length: daysCount }, (_, i) => i + 1);

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
      {/* Section Header with weight pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h3 style={{
          fontSize: "15px",
          fontWeight: 800,
          color: "#1A1A1A",
          margin: 0,
          fontFamily: "var(--font-inter)",
        }}>
          {section.name}
        </h3>
        <span style={{
          display: "inline-block",
          fontSize: "11px",
          fontWeight: 700,
          color: "#E4002B",
          backgroundColor: "#FDE7EA",
          padding: "3px 10px",
          borderRadius: "6px",
          border: "1px solid #FCA5A5",
          boxShadow: "0 1px 2px rgba(228, 0, 43, 0.05)",
        }}>
          {section.weight}%
        </span>
      </div>

      {/* Table Wrapper */}
      <div style={{
        overflowX: "auto",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}>
          <thead>
            <tr style={{
              background: "linear-gradient(135deg, #A8001C 0%, #D32F2F 100%)",
            }}>
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
                background: "linear-gradient(135deg, #A8001C 0%, #C62828 100%)",
                borderBottom: "2px solid #A8001C",
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
                background: "linear-gradient(135deg, #C62828 0%, #D32F2F 100%)",
                borderBottom: "2px solid #A8001C",
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
                background: "linear-gradient(135deg, #D32F2F 0%, #E53935 100%)",
                borderBottom: "2px solid #A8001C",
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
                background: "linear-gradient(135deg, #E53935 0%, #EF5350 100%)",
                borderBottom: "2px solid #A8001C",
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
                background: "linear-gradient(135deg, #EF5350 0%, #E4002B 100%)",
                borderBottom: "2px solid #A8001C",
                borderRight: "2px solid #C62828",
                boxShadow: "4px 0 8px -3px rgba(0, 0, 0, 0.2)",
                textTransform: "capitalize",
              }}>
                Bobot Achievement
              </th>

              {/* Scrollable: Days */}
              {dayColumns.map((day) => (
                <th key={day} style={{
                  width: "38px",
                  padding: "12px 2px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textAlign: "center",
                  borderBottom: "2px solid #A8001C",
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
              const rowBg = isSub ? "#FCFDFD" : "#FFFFFF";
              const targetBg = isSub ? "#FCFDFD" : "#F9FAFB";

              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor: rowBg,
                  }}
                  className="kpi-row-hover"
                >
                  {/* Frozen Parameter Cell */}
                  <td style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    padding: isSub ? "10px 14px 10px 36px" : "12px 14px",
                    fontSize: "12px",
                    fontWeight: isSub ? 400 : 600,
                    color: isSub ? "#6B7280" : "#1A1A1A",
                    fontStyle: isSub ? "italic" : "normal",
                    textAlign: "left",
                    backgroundColor: rowBg,
                    borderBottom: "1px solid #E5E7EB",
                    borderRight: "1px solid #E5E7EB",
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
                    color: "#1A1A1A",
                    textAlign: "center",
                    backgroundColor: targetBg,
                    borderBottom: "1px solid #E5E7EB",
                    borderRight: "1px solid #E5E7EB",
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
                    color: "#1A1A1A",
                    textAlign: "center",
                    backgroundColor: targetBg,
                    borderBottom: "1px solid #E5E7EB",
                    borderRight: "1px solid #E5E7EB",
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
                    fontWeight: 600,
                    color: "#E4002B",
                    textAlign: "center",
                    backgroundColor: rowBg,
                    borderBottom: "1px solid #E5E7EB",
                    borderRight: "1px solid #E5E7EB",
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
                    color: "#1A1A1A",
                    textAlign: "center",
                    backgroundColor: rowBg,
                    borderBottom: "1px solid #E5E7EB",
                    borderRight: "2px solid #E5E7EB",
                    boxShadow: "4px 0 8px -3px rgba(0, 0, 0, 0.15)",
                  }}>
                    {param.robotAchievement || "—"}
                  </td>

                  {/* Scrollable Dynamic Daily Columns */}
                  {dayColumns.map((day) => {
                    const cellVal = param.dailyValues?.[day];
                    return (
                      <td key={day} style={{
                        padding: "12px 2px",
                        fontSize: "10px",
                        color: "#4B5563",
                        fontWeight: 600,
                        textAlign: "center",
                        borderBottom: "1px solid #F0F0F0",
                        borderRight: day === daysCount ? "none" : "1px solid #F0F0F0",
                        backgroundColor: cellVal ? "#FFF7F7" : "transparent",
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
