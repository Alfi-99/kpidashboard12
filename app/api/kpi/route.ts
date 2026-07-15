// app/api/kpi/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getKpiData } from "@/lib/kpiMapper";
import { mockDashboardData } from "@/lib/mockDataNew";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const requestedPeriod = request.nextUrl.searchParams.get("period") ?? "2026-07";
    const period = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedPeriod) ? requestedPeriod : "2026-07";
    const data = await getKpiData(period);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route fetching Google Sheets:", error);
    return NextResponse.json(mockDashboardData);
  }
}
