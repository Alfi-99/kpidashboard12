// lib/mockData.ts
// Mock data for development — mirrors the JSON schema from Section 8 of implementation.md
// Used when Google Sheets credentials are not configured.

import type { KpiData } from "./types";

export const mockKpiData: KpiData = {
  totalAchievement: 95,
  groups: {
    Revenue: [
      {
        name: "SIR (Target)",
        type: "status",
        status_per_period: ["achieved", "achieved", "pending"],
        mtd: "achieved",
        best: "achieved",
      },
      {
        name: "ER",
        type: "status",
        status_per_period: ["achieved", "achieved", "pending"],
        mtd: "achieved",
        best: "achieved",
      },
      {
        name: "TAPS",
        type: "status",
        status_per_period: ["missed", "pending", "pending"],
        mtd: "missed",
        best: "achieved",
      },
    ],
    single_score: [
      { name: "CX", type: "score", value: 45, status_per_period: [null, null, null], mtd: null, best: null },
      { name: "IP", type: "score", value: 25, status_per_period: [null, null, null], mtd: null, best: null },
    ],
    Operational: [
      {
        name: "Enps",
        type: "status",
        status_per_period: ["achieved", "partial", "pending"],
        mtd: "partial",
        best: "achieved",
      },
      {
        name: "FCR",
        type: "status",
        status_per_period: ["achieved", "achieved", "achieved"],
        mtd: "achieved",
        best: "achieved",
      },
      {
        name: "Repeat",
        type: "status",
        status_per_period: ["missed", "achieved", "pending"],
        mtd: "partial",
        best: "achieved",
      },
    ],
    single_row: [
      {
        name: "5L",
        type: "status",
        status_per_period: ["achieved", "achieved", "achieved"],
        mtd: "achieved",
        best: "achieved",
      },
      {
        name: "TSLA",
        type: "status",
        status_per_period: ["achieved", "missed", "pending"],
        mtd: "partial",
        best: "achieved",
      },
      {
        name: "CR TRL",
        type: "status",
        status_per_period: ["achieved", "achieved", "partial"],
        mtd: "achieved",
        best: "achieved",
      },
    ],
  },
  achievementSummary: {
    ach_pct: 94,
    rebet_pct: [10, 98, 8],
  },
  incident_issue: [
    { date: "2026-07-05", service: "5LT-V1", note: "Timeout on payment gateway" },
    { date: "2026-07-04", service: "CRM-API", note: "Latency spike 2.3s" },
    { date: "2026-07-03", service: "Dashboard", note: "Intermittent 502 errors" },
  ],
};
