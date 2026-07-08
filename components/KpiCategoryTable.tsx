// components/KpiCategoryTable.tsx
"use client";

import type { KpiRow } from "@/lib/types";
import StatusIcon from "./StatusIcon";
import AchievementGauge from "./AchievementGauge";

interface KpiCategoryTableProps {
  groups: Record<string, KpiRow[]>;
  showColumn: "mtd" | "best";
}

const GROUP_LABELS: Record<string, string> = {
  Revenue: "Revenue",
  single_score: "",
  Operational: "Operational",
  single_row: "",
};

const GROUP_ORDER = ["Revenue", "single_score", "Operational", "single_row"];

export default function KpiCategoryTable({ groups, showColumn }: KpiCategoryTableProps) {
  const orderedGroups = GROUP_ORDER.filter((g) => groups[g]);

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      {/* Table header */}
      <div
        className="grid items-center px-5 py-3 text-[11px] font-semibold uppercase tracking-wider border-b"
        style={{
          gridTemplateColumns: "minmax(140px, 1.5fr) repeat(3, 1fr) 1fr",
          backgroundColor: "var(--table-header-bg)",
          color: "var(--color-text-muted)",
          borderColor: "var(--color-border)",
        }}
      >
        <span>Kategori / KPI</span>
        <span className="text-center">Periode 1</span>
        <span className="text-center">Periode 2</span>
        <span className="text-center">Periode 3</span>
        <span className="text-center">{showColumn === "mtd" ? "MTD" : "Best"}</span>
      </div>

      {/* Table body */}
      <div>
        {orderedGroups.map((groupKey) => {
          const rows = groups[groupKey];
          const isSingleScore = groupKey === "single_score";
          const label = GROUP_LABELS[groupKey];

          return (
            <div key={groupKey}>
              {/* Group header */}
              {label && (
                <div
                  className="px-5 py-2 text-[12px] font-bold uppercase tracking-wide border-b"
                  style={{
                    color: "var(--color-primary)",
                    backgroundColor: "var(--color-primary-light)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {label}
                </div>
              )}

              {/* Rows */}
              {rows.map((row) => {
                if (isSingleScore || row.type === "score") {
                  // Render as inline gauge row
                  return (
                    <div
                      key={row.name}
                      className="kpi-row grid items-center px-5 border-b"
                      style={{
                        gridTemplateColumns: "minmax(140px, 1.5fr) repeat(3, 1fr) 1fr",
                        minHeight: "var(--table-row-height)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div className="flex items-center gap-3 py-3">
                        <AchievementGauge
                          value={row.value ?? 0}
                          label=""
                          size="sm"
                        />
                        <span
                          className="text-[14px] font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {row.name}
                        </span>
                      </div>
                      {/* Empty period columns for score rows */}
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  );
                }

                return (
                  <div
                    key={row.name}
                    className="kpi-row grid items-center px-5 border-b"
                    style={{
                      gridTemplateColumns: "minmax(140px, 1.5fr) repeat(3, 1fr) 1fr",
                      height: "var(--table-row-height)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {row.name}
                    </span>
                    {row.status_per_period.map((status, i) => (
                      <span key={i} className="flex justify-center">
                        <StatusIcon status={status} size="sm" />
                      </span>
                    ))}
                    <span className="flex justify-center">
                      <StatusIcon
                        status={showColumn === "mtd" ? row.mtd : row.best}
                        size="sm"
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
