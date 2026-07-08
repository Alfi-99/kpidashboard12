// app/dashboard/page.tsx (Server Component)
import { getKpiData } from "@/lib/kpiMapper";
import { mockDashboardData } from "@/lib/mockDataNew";
import type { KpiDashboardData } from "@/lib/types";
import KpiDashboardClient from "./KpiDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getInitialData(): Promise<KpiDashboardData> {
  try {
    return await getKpiData();
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return mockDashboardData;
  }
}

export default async function DashboardPage() {
  const data = await getInitialData();
  return <KpiDashboardClient dashboardData={data} />;
}
