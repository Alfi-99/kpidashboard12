// app/scorecard/ScoreCardClient.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import type { ScoreCardData } from "@/lib/scoreCardTypes";
import ScoreCardChart from "@/components/ScoreCardChart";
import TopNav from "@/components/TopNav";
import TabSelector from "@/components/TabSelector";
import { logoutAction } from "@/app/actions/auth";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ScoreCardClientProps {
  initialData: ScoreCardData;
}

const SCORECARD_TABS = [
  { key: "all", label: "All" },
  { key: "callCenter", label: "Call Center" },
  { key: "eCare", label: "eCare" },
];

export default function ScoreCardClient({ initialData }: ScoreCardClientProps) {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data } = useSWR<ScoreCardData>("/api/scorecard", fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });

  const scoreCardData: ScoreCardData = (data && data.items) ? data : initialData;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogout = () => {
    logoutAction();
  };

  // Filter items based on active tab
  const filteredItems = scoreCardData.items.filter((item) => {
    const lowerName = item.name.toLowerCase();
    if (activeTab === "callCenter") {
      return lowerName.includes("callcenter") || lowerName.includes("call center");
    }
    if (activeTab === "eCare") {
      return lowerName.includes("ecare");
    }
    return true; // "all" tab shows everything
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <TopNav isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onLogout={handleLogout} />

      <main className="dot-pattern" style={{ padding: "32px clamp(20px, 3vw, 48px)", minHeight: "calc(100vh - 52px)" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          {/* Page Header */}
          <div className="animate-fade-in-up" style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
              <div>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "var(--accent-primary)",
                  fontSize: "10px",
                  fontWeight: 750,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                  </svg>
                  Analitik Performa
                </span>
                <h1 style={{
                  margin: "0 0 6px",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  color: "var(--text-primary)",
                }}>
                  ScoreCard Contact Center
                </h1>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>
                  {filteredItems.length} metrik ({activeTab === "all" ? "Semua" : activeTab === "callCenter" ? "Call Center" : "eCare"}) · Data bulanan Jan — Des
                </p>
              </div>

              {/* Stats summary & Tab Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <TabSelector tabs={SCORECARD_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

                <div style={{
                  display: "flex",
                  gap: "18px",
                  padding: "12px 18px",
                  border: "1px solid var(--border-default)",
                  borderRadius: "14px",
                  background: "var(--bg-card)",
                  boxShadow: "var(--shadow-card)",
                }}>
                  <div style={{ display: "grid", gap: "2px", textAlign: "center" }}>
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Metrik
                    </span>
                    <strong style={{ fontSize: "20px", letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                      {filteredItems.length}
                    </strong>
                  </div>
                  <div style={{ width: "1px", background: "var(--border-default)" }} />
                  <div style={{ display: "grid", gap: "2px", textAlign: "center" }}>
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Terisi Data
                    </span>
                    <strong style={{ fontSize: "20px", letterSpacing: "-0.04em", color: "var(--color-positive)" }}>
                      {filteredItems.filter((i) => i.hasData).length}
                    </strong>
                  </div>
                  <div style={{ width: "1px", background: "var(--border-default)" }} />
                  <div style={{ display: "grid", gap: "2px", textAlign: "center" }}>
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Belum Terisi
                    </span>
                    <strong style={{ fontSize: "20px", letterSpacing: "-0.04em", color: "var(--color-negative)" }}>
                      {filteredItems.filter((i) => !i.hasData).length}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="chart-grid">
            {filteredItems.map((item, index) => (
              <ScoreCardChart key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
