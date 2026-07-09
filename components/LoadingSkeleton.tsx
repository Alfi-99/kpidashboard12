// components/LoadingSkeleton.tsx
"use client";

export function GaugeSkeleton({ size = "lg" }: { size?: "lg" | "md" }) {
  const dim = size === "lg" ? "w-40 h-40" : "w-28 h-28";
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${dim} rounded-full skeleton`} />
      <div className="w-24 h-3 skeleton" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-card-static" style={{ padding: 0 }}>
      {/* Header */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border-default)" }}>
        <div className="w-full h-4 skeleton" />
      </div>
      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="w-28 h-3 skeleton" />
          <div className="flex-1 flex justify-around gap-4">
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="w-6 h-6 rounded-full skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card-static space-y-3" style={{ padding: "20px" }}>
      <div className="w-40 h-4 skeleton" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="w-full h-3 skeleton" style={{ width: `${90 - i * 15}%` }} />
      ))}
    </div>
  );
}
