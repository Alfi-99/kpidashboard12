// app/dashboard/loading.tsx
import { GaugeSkeleton, TableSkeleton, CardSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div
      className="min-h-screen"
      style={{
        padding: "var(--space-page-padding)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="w-48 h-7 skeleton mb-2" />
            <div className="w-64 h-4 skeleton" />
          </div>
          <div className="flex gap-3">
            <div className="w-32 h-9 skeleton rounded-lg" />
            <div className="w-24 h-9 skeleton rounded-lg" />
          </div>
        </div>

        {/* Gauge skeleton */}
        <div className="flex justify-center">
          <div className="card flex flex-col items-center px-10 py-8">
            <GaugeSkeleton size="lg" />
          </div>
        </div>

        {/* Table skeleton */}
        <TableSkeleton />

        {/* Bottom cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={3} />
        </div>
      </div>
    </div>
  );
}
