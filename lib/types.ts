// lib/types.ts

export type StatusValue = "achieved" | "missed" | "partial" | "pending" | null;

// Legacy types kept for backward compatibility
export interface KpiRow {
  name: string;
  type: "status" | "score";
  value?: number;
  status_per_period: StatusValue[];
  mtd: StatusValue;
  best: StatusValue;
}

export interface IncidentItem {
  date: string;
  service: string;
  note: string;
}

// ─── New types for redesigned dashboard ───

export interface KpiParameter {
  name: string;
  target: string;
  bobotTarget?: string; // target weight column
  mtdAchievement?: string;
  robotAchievement?: string; // Bobot Achievement
  dailyValues?: Record<number, string>; // day 1-31
  isSubRow?: boolean; // indented sub-parameter
}

export interface KpiSection {
  name: string;          // e.g. "Revenue", "Customer Experience", "Internal Process"
  weight: number;        // percentage weight, e.g. 20, 45, 35 (Realisasi)
  target?: number;       // e.g. 20, 45, 35 (Target)
  parameters: KpiParameter[];
}

export interface MonthlyKpiRow {
  no: string;
  parameter: string;
  definisi: string;
  target: string;
  bobot: string;
  nasionalAch: string;
  nasionalAchTarget: string;
  nasionalScore: string;
  bdgAch: string;
  bdgScore: string;
  smgAch: string;
  smgScore: string;
  isCategoryRow?: boolean;
  isTotalRow?: boolean;
  isSubRow?: boolean;
}

export interface TabData {
  tabName: string;       // "Call Center" | "e-Care"
  tabKey: string;        // "callCenter" | "eCare"
  totalAchievement: number;
  sections: KpiSection[];
  summaryHighlight: string[];
  monthlyComparison?: MonthlyKpiRow[];
}

export interface KpiDashboardData {
  tabs: TabData[];
  selectedPeriod: string; // e.g. "July 2026"
}

// Keep old KpiData for backward compatibility with existing API
export interface KpiData {
  totalAchievement: number;
  groups: Record<string, KpiRow[]>;
  achievementSummary: {
    ach_pct: number;
    rebet_pct: number[];
  };
  incident_issue: IncidentItem[];
}
