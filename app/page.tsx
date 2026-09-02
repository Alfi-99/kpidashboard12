// app/page.tsx — Home (Overview KPI)
import { getKpiData } from "@/lib/kpiMapper";
import { mockDashboardData } from "@/lib/mockDataNew";
import HomeOverviewClient from "./HomeOverviewClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let initialData = mockDashboardData;
  try {
    initialData = await getKpiData("2026-07");
  } catch (error) {
    console.error("Failed to load initial KPI data on Home page:", error);
  }

  return <HomeOverviewClient initialData={initialData} />;
}
