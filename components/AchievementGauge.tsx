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
    lg: { svgSize: 180, strokeWidth: 16, fontSize: "text-[40px]", labelSize: "text-[12px]", suffixSize: "text-[18px]" },
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
          className={`${dimensions.labelSize} font-extrabold uppercase tracking-widest`}
          style={{
            color: "#FF4D6E",
            marginBottom: "8px",
            letterSpacing: "0.1em",
            fontFamily: "inherit",
          }}
        >
          {label}
        </span>
      )}
      <div className="relative" style={{ width: dimensions.svgSize, height: dimensions.svgSize }}>
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
          style={{ filter: "drop-shadow(0 0 12px rgba(230, 0, 45, 0.35))" }}
        >
          <defs>
            <linearGradient id="wineGaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E6002D" />
              <stop offset="100%" stopColor="#FF4D6E" />
            </linearGradient>
          </defs>

          {/* Track Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.10)"
            strokeWidth={dimensions.strokeWidth}
          />

          {/* Progress Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={radius}
            fill="none"
            stroke="url(#wineGaugeGradient)"
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

        {/* Center Text — Pure White with Glow for High Contrast */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${dimensions.fontSize} font-black leading-none`}
            style={{
              color: "#FFFFFF",
              fontFamily: "inherit",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
            }}
          >
            {animatedValue}
            <span className={dimensions.suffixSize} style={{ color: "#FF8CA3" }}>{suffix || "%"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
