// components/HeaderFilter.tsx
"use client";

import { useState } from "react";
import TabSelector from "./TabSelector";

interface HeaderFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { key: string; label: string }[];
  onPeriodChange?: (period: string) => void;
}

export default function HeaderFilter({
  activeTab,
  onTabChange,
  tabs,
  onPeriodChange,
}: HeaderFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-07");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
    onPeriodChange?.(e.target.value);
  };

  return (
    <div className="dashboard-header-controls">
      {/* Tab Selector */}
      <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      {/* Period Selector */}
      <div className="period-selector">
        <span className="period-label">Periode Month :</span>
        <div className="period-dropdown-wrapper">
          <select
            id="period-filter"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="period-dropdown"
          >
            <option value="2026-07">July 2026</option>
            <option value="2026-06">June 2026</option>
            <option value="2026-05">May 2026</option>
            <option value="2026-04">April 2026</option>
          </select>
          <svg
            className="period-dropdown-icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
