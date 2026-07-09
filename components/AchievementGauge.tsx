// components/AchievementGauge.tsx
"use client";

import { useEffect, useState } from "react";

interface AchievementGaugeProps {
  value: number;
  label: string;
  maxValue?: number;
  size?: "lg" | "md" | "sm";
  suffix?: string;
}

export default function AchievementGauge({
  value,
  label,
  maxValue = 100,
  size = "md",
  suffix = "",
}: AchievementGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const dimensions = {
    lg: { svgSize: 180, strokeWidth: 16, fontSize: "text-[42px]", labelSize: "text-[13px]", suffixSize: "text-[20px]" },
    md: { svgSize: 110, strokeWidth: 8, fontSize: "text-[24px]", labelSize: "text-[10px]", suffixSize: "text-[14px]" },
    sm: { svgSize: 80, strokeWidth: 6, fontSize: "text-[18px]", labelSize: "text-[9px]", suffixSize: "text-[11px]" },
  }[size];

  const radius = (dimensions.svgSize - dimensions.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(animatedValue / maxValue, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span
          className={`${dimensions.labelSize} font-bold uppercase tracking-wider`}
          style={{ color: "var(--accent-primary)", marginBottom: "6px" }}
        >
          {label}
        </span>
      )}
      <div className="relative" style={{ width: dimensions.svgSize, height: dimensions.svgSize }}>
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
        >
          <defs>
            <linearGradient id="redGaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>

          {/* Track Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={radius}
            fill="none"
            stroke="var(--accent-bg-strong)"
            strokeWidth={dimensions.strokeWidth}
          />

          {/* Progress Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={radius}
            fill="none"
            stroke="url(#redGaugeGradient)"
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="animate-gauge-fill"
            style={{
              transformOrigin: "center",
              transform: "rotate(-90deg)",
              transition: "stroke-dashoffset 1.2s ease-out",
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${dimensions.fontSize} font-black leading-none`} style={{ color: "var(--accent-primary)" }}>
            {animatedValue}
            <span className={dimensions.suffixSize}>{suffix || "%"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
