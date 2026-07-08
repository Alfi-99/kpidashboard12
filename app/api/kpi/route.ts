// app/api/kpi/route.ts
import { NextResponse } from "next/server";
import { getKpiData } from "@/lib/kpiMapper";
import { mockDashboardData } from "@/lib/mockDataNew";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getKpiData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route fetching Google Sheets:", error);
    return NextResponse.json(mockDashboardData);
  }
}
