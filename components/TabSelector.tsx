// components/TabSelector.tsx
"use client";

interface TabSelectorProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: "4px",
        background: "var(--bg-switcher)",
        borderRadius: "9999px",
        padding: "4px",
        border: `1px solid var(--border-switcher)`,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 700,
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              background: isActive ? "var(--accent-primary)" : "transparent",
              color: isActive ? "#FFFFFF" : "var(--text-muted)",
              boxShadow: isActive ? "0 2px 8px var(--glow-color)" : "none",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
