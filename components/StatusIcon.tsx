// components/StatusIcon.tsx
"use client";

import type { StatusValue } from "@/lib/types";

interface StatusIconProps {
  status: StatusValue;
  size?: "sm" | "md";
}

export default function StatusIcon({ status, size = "md" }: StatusIconProps) {
  const sizeClass = size === "sm" ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs";

  if (!status || status === "pending") {
    return (
      <span
        className={`status-icon inline-flex items-center justify-center ${sizeClass} rounded-full`}
        style={{ backgroundColor: "var(--color-status-pending)", color: "#6B7280" }}
        title="Pending"
      >
        —
      </span>
    );
  }

  if (status === "achieved") {
    return (
      <span
        className={`status-icon inline-flex items-center justify-center ${sizeClass} rounded-full text-white font-bold`}
        style={{ backgroundColor: "var(--color-status-achieved)" }}
        title="Achieved"
      >
        ✓
      </span>
    );
  }

  if (status === "missed") {
    return (
      <span
        className={`status-icon inline-flex items-center justify-center ${sizeClass} rounded-full text-white font-bold`}
        style={{ backgroundColor: "var(--color-status-missed)" }}
        title="Missed"
      >
        ✗
      </span>
    );
  }

  // partial
  return (
    <span
      className={`status-icon inline-flex items-center justify-center ${sizeClass} rounded-full text-white font-bold`}
      style={{ backgroundColor: "var(--color-status-partial)" }}
      title="Partial"
    >
      ~
    </span>
  );
}
