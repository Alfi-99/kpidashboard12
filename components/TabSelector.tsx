// components/TabSelector.tsx
"use client";

interface TabSelectorProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div style={{
      display: "flex",
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid #FCA5A5",
      backgroundColor: "#FFF5F5",
      padding: "3px",
      boxShadow: "0 1px 3px rgba(228, 0, 43, 0.05)",
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: "8px 24px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              cursor: "pointer",
              border: "none",
              borderRadius: "16px",
              background: isActive ? "linear-gradient(135deg, #E4002B 0%, #A8001C 100%)" : "transparent",
              color: isActive ? "#FFFFFF" : "#E4002B",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              whiteSpace: "nowrap",
              outline: "none",
              boxShadow: isActive ? "0 4px 10px rgba(228, 0, 43, 0.25)" : "none",
            }}
            className="tab-hover-effect"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
