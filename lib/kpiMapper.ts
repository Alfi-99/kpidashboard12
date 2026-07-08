// lib/kpiMapper.ts
import { fetchSheetRange } from "./googleSheets";
import type { KpiDashboardData, TabData, KpiSection, KpiParameter } from "./types";
import { mockDashboardData } from "./mockDataNew";

// Helper to parse percentages or numbers safely
function parsePercentage(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/%/g, "").trim();
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

// Simple zero-dependency CSV parser
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/);
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

// Helper to fetch public sheet data as CSV
async function fetchPublicSheetCsv(sheetId: string, sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch public sheet CSV: ${res.statusText}`);
  }
  const text = await res.text();
  return parseCSV(text);
}

// Robust sheet parser function
function parseTabSheet(rows: string[][], tabName: string, tabKey: string): TabData {
  let totalAchievement = 95; // default fallback
  const sectionsMap: Record<string, { weight: number; parameters: KpiParameter[] }> = {};
  const summaryHighlight: string[] = [];

  let currentSectionName: string | null = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const colA = row[0] ? row[0].trim() : "";
    const colB = row[1] ? row[1].trim() : "";

    // 1. Check for Total Achievement
    if (colA.toLowerCase() === "total achievement") {
      if (colB) {
        totalAchievement = parsePercentage(colB);
      }
      continue;
    }

    // 2. Detect Highlights (can be anywhere in the sheet or labeled Highlight in Col A)
    if (colA.toLowerCase().startsWith("highlight") || colA.toLowerCase().startsWith("summary highlight")) {
      const highlightVal = colB || colA.substring(colA.indexOf(":") + 1).trim();
      if (highlightVal && !highlightVal.toLowerCase().includes("(freetext)")) {
        summaryHighlight.push(highlightVal);
      }
      continue;
    }

    // 3. Detect Section Start
    if (colA.toLowerCase().startsWith("total revenue")) {
      currentSectionName = "Revenue";
      sectionsMap[currentSectionName] = {
        weight: colB ? parsePercentage(colB) : 20,
        parameters: [],
      };
      continue;
    } else if (colA.toLowerCase().startsWith("total cx") || colA.toLowerCase().startsWith("total customer experience")) {
      currentSectionName = "Customer Experience";
      sectionsMap[currentSectionName] = {
        weight: colB ? parsePercentage(colB) : 45,
        parameters: [],
      };
      continue;
    } else if (colA.toLowerCase().startsWith("total internal process")) {
      currentSectionName = "Internal Process";
      sectionsMap[currentSectionName] = {
        weight: colB ? parsePercentage(colB) : 35,
        parameters: [],
      };
      continue;
    }

    // 4. Parse Parameters if we are inside a section
    if (currentSectionName && colA) {
      // Skip header row
      if (colA.toLowerCase() === "parameter") continue;

      // Extract details
      const target = colB;
      const mtd = row[3] ? row[3].trim() : "";       // Column D: MTD Achievement
      const bobotAch = row[4] ? row[4].trim() : "";  // Column E: Bobot Achievement

      // Daily values: columns F to AJ (indexes 5 to 35 in 0-indexed array)
      const dailyValues: Record<number, string> = {};
      for (let day = 1; day <= 31; day++) {
        const val = row[5 + (day - 1)]; // Col F is index 5
        if (val !== undefined && val.trim() !== "") {
          dailyValues[day] = val.trim();
        }
      }

      // Check if parameter is a sub-row (indented or starts with whitespace)
      const isSubRow = row[0].startsWith(" ") || row[0].startsWith("\t") || 
                       ["regular", "priority", "357", "byu", "video call"].includes(colA.toLowerCase());

      const kpiParam: KpiParameter = {
        name: colA,
        target: target,
        mtdAchievement: mtd || undefined,
        robotAchievement: bobotAch || undefined,
        dailyValues: Object.keys(dailyValues).length > 0 ? dailyValues : undefined,
        isSubRow,
      };

      sectionsMap[currentSectionName].parameters.push(kpiParam);
    }
  }

  // Convert sections map to list
  const sectionsList: KpiSection[] = Object.keys(sectionsMap).map((name) => ({
    name,
    weight: sectionsMap[name].weight,
    parameters: sectionsMap[name].parameters,
  }));

  // Fallback default highlights if none parsed from spreadsheet
  const finalHighlights = summaryHighlight.length > 0 ? summaryHighlight : [
    `Pencapaian KPI ${tabName} bulan ini berjalan stabil.`,
    "Beberapa parameter utama telah memenuhi target MTD.",
    "Perlu pengawasan berkelanjutan pada pencapaian harian."
  ];

  return {
    tabName,
    tabKey,
    totalAchievement,
    sections: sectionsList,
    summaryHighlight: finalHighlights,
  };
}

export async function getKpiData(): Promise<KpiDashboardData> {
  // Use the spreadsheet ID provided by the user
  const sheetId = process.env.GOOGLE_SHEET_ID && !process.env.GOOGLE_SHEET_ID.includes("1AbCDefGh")
    ? process.env.GOOGLE_SHEET_ID
    : "1zYDTRPdQo8OuXP1MLRu3FbpSaEXb-zMEdY3jabmvXTI"; // Fallback to user's real sheet ID

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  const isAuthConfigured = clientEmail && privateKey && !clientEmail.includes("xxxx@");

  try {
    let callCenterRows: string[][] = [];
    let eCareRows: string[][] = [];

    if (isAuthConfigured) {
      console.log("Fetching Google Sheets using authenticated API...");
      [callCenterRows, eCareRows] = await Promise.all([
        fetchSheetRange("'Daily Call Center'!A1:AJ45"),
        fetchSheetRange("'Daily eCare'!A1:AJ45"),
      ]);
    } else {
      console.log("Fetching Google Sheets using public visualization API...");
      [callCenterRows, eCareRows] = await Promise.all([
        fetchPublicSheetCsv(sheetId, "Daily Call Center"),
        fetchPublicSheetCsv(sheetId, "Daily eCare"),
      ]);
    }

    const tabs: TabData[] = [];

    if (callCenterRows && callCenterRows.length > 0) {
      tabs.push(parseTabSheet(callCenterRows, "Call Center", "callCenter"));
    } else {
      tabs.push(mockDashboardData.tabs[0]);
    }

    if (eCareRows && eCareRows.length > 0) {
      tabs.push(parseTabSheet(eCareRows, "e-Care", "eCare"));
    } else {
      tabs.push(mockDashboardData.tabs[1]);
    }

    return {
      tabs,
      selectedPeriod: "July 2026",
    };
  } catch (error) {
    console.error("Error fetching or parsing Google Sheets data:", error);
    return mockDashboardData;
  }
}
