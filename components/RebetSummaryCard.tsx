// components/RebetSummaryCard.tsx
"use client";

import AchievementGauge from "./AchievementGauge";

interface RebetSummaryCardProps {
  achPct: number;
  rebetPct: number[];
}

function getTrendIcon(current: number, previous?: number) {
  if (previous === undefined) return null;
  if (current > previous)
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 11V3m0 0L3 7m4-4l4 4"
          stroke="var(--color-score-good)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (current < previous)
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 3v8m0 0l4-4m-4 4L3 7"
          stroke="var(--color-score-bad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8"
        stroke="var(--color-text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RebetSummaryCard({ achPct, rebetPct }: RebetSummaryCardProps) {
  return (
    <div className="card">
      <h2
        className="text-[15px] font-bold mb-5"
        style={{ color: "var(--color-text-primary)" }}
      >
        Achievement & Rebet Summary
      </h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Achievement Gauge */}
        <div className="flex-shrink-0">
          <AchievementGauge value={achPct} label="Ach" size="md" suffix="%" />
        </div>

        {/* Rebet Values */}
        <div className="flex-1">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Rebet per Periode
          </h3>
          <div className="flex gap-4">
            {rebetPct.map((val, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border animate-fade-in-up"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "#FAFAFA",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  P{i + 1}
                </span>
                <span
                  className="text-[20px] font-bold leading-none"
                  style={{
                    color:
                      val >= 50
                        ? "var(--color-score-good)"
                        : val >= 20
                        ? "var(--color-score-warning)"
                        : "var(--color-score-bad)",
                  }}
                >
                  {val}%
                </span>
                <div className="flex items-center">
                  {getTrendIcon(val, rebetPct[i - 1])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
