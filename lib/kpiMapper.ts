import type { KpiDashboardData, TabData, KpiSection, KpiParameter } from "./types";
import { mockDashboardData } from "./mockDataNew";

const DEFAULT_PERIOD = "2026-07";
const PUBLIC_SHEET_ID = "1zYDTRPdQo8OuXP1MLRu3FbpSaEXb-zMEdY3jabmvXTI";
const DAILY_SHEET_GID = "781575490";

type TabDefinition = {
  tabName: string;
  tabKey: string;
  markers: string[];
  fallbackIndex: number;
};

const TAB_DEFINITIONS: TabDefinition[] = [
  { tabName: "Call Center", tabKey: "callCenter", markers: ["callcenter"], fallbackIndex: 0 },
  { tabName: "e-Care", tabKey: "eCare", markers: ["ecare"], fallbackIndex: 1 },
];

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function normalize(value: string | undefined): string {
  return clean(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parsePercentage(value: string | undefined, fallback = 0): number {
  const parsed = Number(clean(value).replace(/%/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCSV(csvText: string): string[][] {
  return csvText.split(/\r?\n/).map((line) => {
    const values: string[] = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < line.length; index++) {
      const char = line[index];
      if (char === '"' && line[index + 1] === '"' && quoted) {
        value += '"';
        index++;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(value.trim());
        value = "";
      } else {
        value += char;
      }
    }

    values.push(value.trim());
    return values;
  });
}

async function fetchPublicSheetCsv(sheetId: string, sheetName: string): Promise<string[][]> {
  // The regular export endpoint preserves merged title rows in All Rekap.
  // GViz treats those rows as inferred headers and drops KPI names.
  const cacheBust = Date.now();
  let url = "";
  if (sheetName === "All Rekap") {
    url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&t=${cacheBust}`;
  } else if (sheetName === "Daily") {
    url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${DAILY_SHEET_GID}&t=${cacheBust}`;
  } else {
    url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${cacheBust}`;
  }
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
  return parseCSV(await response.text());
}

function periodParts(period: string): { year: number; month: number } {
  const [year, month] = period.split("-").map(Number);
  return { year, month };
}

function matchesMonth(value: string | undefined, period: string): boolean {
  const text = clean(value);
  if (!text) return false;
  const { year, month } = periodParts(period);

  const slash = text.match(/^(\d{1,2})\/(\d{4})$/);
  if (slash) return Number(slash[1]) === month && Number(slash[2]) === year;

  const iso = text.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (iso) return Number(iso[1]) === year && Number(iso[2]) === month;

  const date = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (date) return Number(date[3]) === year && Number(date[1]) === month;

  return false;
}

function dayFromDate(value: string | undefined, period: string): number | null {
  const text = clean(value);
  const { year, month } = periodParts(period);
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash && Number(slash[1]) === month && Number(slash[3]) === year) return Number(slash[2]);

  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso && Number(iso[1]) === year && Number(iso[2]) === month) return Number(iso[3]);
  return null;
}

function isMarker(value: string | undefined, definition: TabDefinition): boolean {
  const normalized = normalize(value);
  return definition.markers.includes(normalized);
}

function tabSegment(rows: string[][], definition: TabDefinition): string[][] {
  const start = rows.findIndex((row) => row.some((cell) => isMarker(cell, definition)));
  if (start < 0) return [];

  const end = rows.findIndex((row, index) =>
    index > start && TAB_DEFINITIONS.some((tab) => tab.tabKey !== definition.tabKey && row.some((cell) => isMarker(cell, tab))),
  );
  return rows.slice(start, end < 0 ? undefined : end);
}

function findPeriodRow(rows: string[][], headerRow: number, periodColumn: number, period: string): string[] | undefined {
  for (let rowIndex = headerRow + 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex] ?? [];
    if (matchesMonth(row[periodColumn], period)) return row;
    if (rowIndex > headerRow + 36 && clean(row[periodColumn]) === "") break;
  }
  return undefined;
}

function classifySection(parameterName: string): string {
  const name = normalize(parameterName);
  if (/(sales|retention|caps)/.test(name)) return "Revenue";
  if (/(tnps|repeat|fcr|customer|satisfaction)/.test(name)) return "Customer Experience";
  return "Internal Process";
}

function comparableName(value: string): string {
  return normalize(value)
    .replace("salesinteractionratio", "salesratio")
    .replace("retentionrate", "retention")
    .replace("capsnumber", "caps");
}

function parseDailyValues(rows: string[][], definition: TabDefinition, period: string): Map<string, Record<number, string>> {
  const markerRow = rows.findIndex((row) => row.some((cell) => isMarker(cell, definition)));
  if (markerRow < 0) return new Map();
  const markerColumn = rows[markerRow].findIndex((cell) => isMarker(cell, definition));
  const nextMarkerColumn = TAB_DEFINITIONS
    .filter((tab) => tab.tabKey !== definition.tabKey)
    .map((tab) => rows[markerRow].findIndex((cell) => isMarker(cell, tab)))
    .find((column) => column > markerColumn) ?? rows[markerRow].length;
  const headerIndex = markerRow + 1;
  const headers = rows[headerIndex] ?? [];
  const result = new Map<string, Record<number, string>>();

  for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex] ?? [];
    const day = dayFromDate(row[markerColumn], period);
    if (!day) continue;

    for (let column = markerColumn + 1; column < nextMarkerColumn; column++) {
      const name = clean(headers[column]);
      const value = clean(row[column]);
      if (!name || !value) continue;
      const key = comparableName(name);
      const daily = result.get(key) ?? {};
      daily[day] = value;
      result.set(key, daily);
    }
  }

  return result;
}

function parseFreetext(freetextRows: string[][]): Record<string, string[]> {
  const result: Record<string, string[]> = {
    callCenter: [],
    eCare: [],
  };
  if (!freetextRows || freetextRows.length === 0) return result;

  let callCenterCol = 0;
  let eCareCol = 5;

  const headerRow = freetextRows[0] ?? [];
  for (let col = 0; col < headerRow.length; col++) {
    const text = normalize(headerRow[col]);
    if (text.includes("callcenter")) {
      callCenterCol = col;
    } else if (text.includes("ecare")) {
      eCareCol = col;
    }
  }

  for (let r = 1; r < freetextRows.length; r++) {
    const row = freetextRows[r] ?? [];

    let ccText = "";
    for (let c = callCenterCol; c < eCareCol && c < row.length; c++) {
      if (clean(row[c])) {
        ccText = clean(row[c]);
        break;
      }
    }
    if (ccText) result.callCenter.push(ccText);

    let ecText = "";
    for (let c = eCareCol; c < row.length; c++) {
      if (clean(row[c])) {
        ecText = clean(row[c]);
        break;
      }
    }
    if (ecText) result.eCare.push(ecText);
  }

  return result;
}

function parseRekapTab(
  rows: string[][],
  dailyRows: string[][],
  definition: TabDefinition,
  period: string,
  freetextHighlights?: string[],
): TabData | null {
  const segment = tabSegment(rows, definition);
  if (segment.length === 0) return null;

  const dailyValues = parseDailyValues(dailyRows, definition, period);
  const sectionWeights: Record<string, number> = {
    Revenue: 0,
    "Customer Experience": 0,
    "Internal Process": 0,
  };
  const sectionTargets: Record<string, number> = {
    Revenue: 0,
    "Customer Experience": 0,
    "Internal Process": 0,
  };
  const sectionParameters: Record<string, KpiParameter[]> = {
    Revenue: [],
    "Customer Experience": [],
    "Internal Process": [],
  };
  let totalAchievement = 0;

  for (let rowIndex = 0; rowIndex < segment.length; rowIndex++) {
    const row = segment[rowIndex] ?? [];

    for (let column = 0; column < row.length; column++) {
      const heading = normalize(row[column]);
      if (heading === "totalachievement") {
        const periodColumn = Math.max(0, column - 1);
        const periodRow = findPeriodRow(segment, rowIndex, periodColumn, period);
        totalAchievement = parsePercentage(periodRow?.[column], totalAchievement);
      }

      const sectionByHeader: Record<string, string> = {
        totalrevenue: "Revenue",
        totalcx: "Customer Experience",
        totalcustomerexperience: "Customer Experience",
        totalinternalprocess: "Internal Process",
      };
      const sectionName = sectionByHeader[heading];
      if (sectionName) {
        const periodColumn = Math.max(0, row.findIndex((cell, index) => index <= column && normalize(cell) === "periode"));
        const periodRow = findPeriodRow(segment, rowIndex, periodColumn, period);
        sectionWeights[sectionName] = parsePercentage(periodRow?.[column], sectionWeights[sectionName]);
        if (rowIndex > 0) {
          sectionTargets[sectionName] = parsePercentage(segment[rowIndex - 1]?.[column], sectionTargets[sectionName]);
        }
      }

      // A KPI block has its title directly above a "Periode" header.
      if (clean(row[column]) && normalize(segment[rowIndex + 1]?.[column]) === "periode") {
        const parameterName = clean(row[column]);
        if (isMarker(parameterName, definition)) continue;
        const header = segment[rowIndex + 1] ?? [];
        const periodRow = findPeriodRow(segment, rowIndex + 1, column, period);
        if (!periodRow) continue;

        const findHeader = (names: string[]) => {
          const index = header.findIndex((cell, headerColumn) => headerColumn >= column && names.includes(normalize(cell)));
          return index >= 0 ? clean(periodRow[index]) : "";
        };
        const daily = dailyValues.get(comparableName(parameterName));
        const parameter: KpiParameter = {
          name: parameterName,
          target: findHeader(["target"]),
          bobotTarget: findHeader(["bobottarget"]) || undefined,
          mtdAchievement: findHeader(["mtdachievement"]) || undefined,
          robotAchievement: findHeader(["bobotachievement"]) || undefined,
          dailyValues: daily && Object.keys(daily).length > 0 ? daily : undefined,
          isSubRow: ["regular", "priority", "357", "byu", "videocall"].includes(normalize(parameterName)),
        };
        sectionParameters[classifySection(parameterName)].push(parameter);
      }
    }
  }

  const fallback = mockDashboardData.tabs[definition.fallbackIndex];
  const sections: KpiSection[] = Object.entries(sectionParameters)
    .filter(([, parameters]) => parameters.length > 0)
    .map(([name, parameters]) => ({ 
      name, 
      weight: sectionWeights[name], 
      target: sectionTargets[name],
      parameters 
    }));

  if (sections.length === 0) return null;

  const summaryHighlight = freetextHighlights && freetextHighlights.length > 0
    ? freetextHighlights
    : fallback.summaryHighlight;

  return {
    tabName: definition.tabName,
    tabKey: definition.tabKey,
    totalAchievement,
    sections,
    summaryHighlight,
  };
}

function periodLabel(period: string): string {
  const { year, month } = periodParts(period);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export async function getKpiData(period = DEFAULT_PERIOD): Promise<KpiDashboardData> {
  // This dashboard is read-only and the spreadsheet is public, so no service
  // account credentials are required. Keeping this path public also avoids a
  // malformed private key forcing the dashboard into mock-data fallback.
  const configuredSheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const sheetId = configuredSheetId && !/placeholder|example|xxxx|1AbCDefGh/i.test(configuredSheetId)
    ? configuredSheetId
    : PUBLIC_SHEET_ID;

  try {
    const [rekapRows, dailyRows, freetextRows] = await Promise.all([
      fetchPublicSheetCsv(sheetId, "All Rekap"),
      fetchPublicSheetCsv(sheetId, "Daily"),
      fetchPublicSheetCsv(sheetId, "Freetext").catch(() => []),
    ]);

    const freetextHighlightsMap = parseFreetext(freetextRows);

    const tabs = TAB_DEFINITIONS.map((definition) => {
      const highlights = freetextHighlightsMap[definition.tabKey];
      return parseRekapTab(rekapRows, dailyRows, definition, period, highlights) ?? mockDashboardData.tabs[definition.fallbackIndex];
    });

    return { tabs, selectedPeriod: periodLabel(period) };
  } catch (error) {
    console.error("Error fetching or parsing Google Sheets data:", error);
    return { ...mockDashboardData, selectedPeriod: periodLabel(period) };
  }
}
