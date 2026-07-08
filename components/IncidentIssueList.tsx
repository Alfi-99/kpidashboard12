// components/IncidentIssueList.tsx
"use client";

import type { IncidentItem } from "@/lib/types";

interface IncidentIssueListProps {
  incidents: IncidentItem[];
}

export default function IncidentIssueList({ incidents }: IncidentIssueListProps) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="card">
        <h2
          className="text-[15px] font-bold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Incident / Issue Log
        </h2>
        <div
          className="flex items-center justify-center py-8 text-[13px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="mr-2"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-11v4m0 2h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Tidak ada incident aktif
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-[15px] font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Incident / Issue Log
        </h2>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          {incidents.length} item{incidents.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-0">
        {incidents.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 py-3 border-b last:border-b-0 animate-fade-in-up"
            style={{
              borderColor: "var(--color-border)",
              animationDelay: `${index * 80}ms`,
            }}
          >
            {/* Date badge */}
            <div
              className="flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium"
              style={{
                backgroundColor: "#FEF2F2",
                color: "var(--color-status-missed)",
              }}
            >
              {item.date}
            </div>

            {/* Service & note */}
            <div className="flex-1 min-w-0">
              <span
                className="text-[13px] font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.service}
              </span>
              {item.note && (
                <p
                  className="text-[12px] mt-0.5 truncate"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.note}
                </p>
              )}
            </div>

            {/* Status dot */}
            <div className="flex-shrink-0 mt-1.5">
              <span
                className="block w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--color-status-missed)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
