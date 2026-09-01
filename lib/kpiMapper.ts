import type { KpiDashboardData, TabData, KpiSection, KpiParameter, MonthlyKpiRow } from "./types";
import { mockDashboardData } from "./mockDataNew";

const DEFAULT_PERIOD = "2026-07";
const PUBLIC_SHEET_ID = "1zYDTRPdQo8OuXP1MLRu3FbpSaEXb-zMEdY3jabmvXTI";
const ALL_REKAP_GID = "1217380245";
const DAILY_SHEET_GID = "781575490";

type TabDefinition = {
  tabName: string;
  tabKey: string;
  markers: string[];
  monthlySheetName: string;
  fallbackIndex: number;
};

const TAB_DEFINITIONS: TabDefinition[] = [
  { tabName: "Call Center", tabKey: "callCenter", markers: ["callcenter"], monthlySheetName: "Monthly - CallCenter", fallbackIndex: 0 },
  { tabName: "e-Care", tabKey: "eCare", markers: ["ecare"], monthlySheetName: "Monthly - Ecare", fallbackIndex: 1 },
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
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i];
    const next = csvText[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = "";
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = "";
    } else {
      currentVal += c;
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }
  return rows;
}

const SHEET_GIDS: Record<string, string> = {
  "All Rekap": "1217380245",
  "Daily": "781575490",
  "Monthly - CallCenter": "2146457801",
  "Monthly - Ecare": "1203442408",
  "Freetext": "1041510202",
};

async function fetchPublicSheetCsv(sheetId: string, sheetName: string): Promise<string[][]> {
  const cacheBust = Date.now();
  const gid = SHEET_GIDS[sheetName];
  const url = gid
    ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&t=${cacheBust}`
    : `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${cacheBust}`;

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
        if (isMarker(parameterName, definition) || normalize(parameterName) === "target") continue;
        const header = segment[rowIndex + 1] ?? [];
        const periodRow = findPeriodRow(segment, rowIndex + 1, column, period);
        const anyDataRow = segment[rowIndex + 2] ?? [];

        const findHeader = (names: string[], targetRow: string[]) => {
          const index = header.findIndex((cell, headerColumn) => headerColumn >= column && names.includes(normalize(cell)));
          return index >= 0 ? clean(targetRow[index]) : "";
        };

        const targetVal = findHeader(["target"], periodRow || anyDataRow);
        const bobotTargetVal = findHeader(["bobottarget"], periodRow || anyDataRow);
        const mtdVal = periodRow ? findHeader(["mtdachievement"], periodRow) : "—";
        const bobotAchVal = periodRow ? findHeader(["bobotachievement"], periodRow) : "—";

        const daily = dailyValues.get(comparableName(parameterName));
        const parameter: KpiParameter = {
          name: parameterName,
          target: targetVal,
          bobotTarget: bobotTargetVal || undefined,
          mtdAchievement: mtdVal || "—",
          robotAchievement: bobotAchVal || undefined,
          dailyValues: daily && Object.keys(daily).length > 0 ? daily : undefined,
          isSubRow: ["regular", "priority", "357", "byu", "videocall"].includes(normalize(parameterName)),
        };
        sectionParameters[classifySection(parameterName)].push(parameter);
      }
    }
  }

  const sections: KpiSection[] = Object.entries(sectionParameters)
    .filter(([, parameters]) => parameters.length > 0)
    .map(([name, parameters]) => ({ 
      name, 
      weight: sectionWeights[name] || 0, 
      target: sectionTargets[name] || (name === "Revenue" ? (definition.tabKey === "eCare" ? 10 : 20) : 45),
      parameters 
    }));

  if (sections.length === 0) return null;

  const summaryHighlight = freetextHighlights && freetextHighlights.length > 0
    ? freetextHighlights
    : [];

  return {
    tabName: definition.tabName,
    tabKey: definition.tabKey,
    totalAchievement,
    sections,
    summaryHighlight,
  };
}

const MONTH_NAMES_SHORT = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

type MonthlyParseResult = {
  rows: MonthlyKpiRow[];
  hasComparison: boolean;
  regionalComparison?: {
    bdgScore: string;
    smgScore: string;
    nasionalScore: string;
  };
};

function parseMonthlyComparison(rows: string[][], period: string): MonthlyParseResult {
  if (!rows || rows.length < 2) return { rows: [], hasComparison: false };

  const row0 = rows[0] || [];
  const row1 = rows[1] || [];

  const { year, month } = periodParts(period);
  const shortMonth = MONTH_NAMES_SHORT[month - 1] || "";
  const yy = String(year).slice(-2);

  const tokens = [
    `${shortMonth}-${yy}`,
    `${shortMonth}${yy}`,
    shortMonth,
  ];

  // Find column for the requested period in row0
  let periodColIndex = -1;
  for (let c = 0; c < row0.length; c++) {
    const header = normalize(row0[c]);
    if (tokens.some((t) => header.includes(normalize(t)))) {
      periodColIndex = c;
      break;
    }
  }

  // Check if BDG and SMG columns exist under this period column
  let hasBdgSmg = false;
  if (periodColIndex !== -1) {
    const h1BDG = normalize(row1[periodColIndex + 3] || "");
    const h1SMG = normalize(row1[periodColIndex + 5] || "");
    if (h1BDG.includes("bdg") || h1SMG.includes("smg")) {
      hasBdgSmg = true;
    }
  }

  // Find Target and Bobot columns
  let targetCol = 5;
  let bobotCol = 6;
  for (let c = 0; c < Math.min(10, row0.length); c++) {
    const h0 = normalize(row0[c]);
    const h1 = normalize(row1[c]);
    if (h0 === "target" || h1 === "target") targetCol = c;
    if (h0 === "bobot" || h1 === "bobot") bobotCol = c;
  }

  let regionalComparison: { bdgScore: string; smgScore: string; nasionalScore: string } | undefined = undefined;
  const result: MonthlyKpiRow[] = [];

  const startRow =
    normalize(row0[1]) === "parameter" &&
    normalize(row1[1]) === "" &&
    (periodColIndex === -1 || row1[periodColIndex] === "" || normalize(row1[periodColIndex]).includes("nasional") || normalize(row1[periodColIndex]).includes("ach"))
      ? 2
      : 1;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r] || [];
    const no = clean(row[0]);
    let param = clean(row[1]);
    const def = clean(row[2]);
    const target = clean(row[targetCol]);
    const bobot = clean(row[bobotCol]);

    let nasionalAch = "0%";
    let nasionalAchTarget = "0%";
    let nasionalScore = "0.00%";
    let bdgAch = "0%";
    let bdgScore = "0.00%";
    let smgAch = "0%";
    let smgScore = "0.00%";

    if (periodColIndex !== -1) {
      nasionalAch = clean(row[periodColIndex]) || "0%";
      nasionalAchTarget = clean(row[periodColIndex + 1]) || "0%";
      nasionalScore = clean(row[periodColIndex + 2]) || "0.00%";
      if (hasBdgSmg) {
        bdgAch = clean(row[periodColIndex + 3]) || "0%";
        bdgScore = clean(row[periodColIndex + 4]) || "0.00%";
        smgAch = clean(row[periodColIndex + 5]) || "0%";
        smgScore = clean(row[periodColIndex + 6]) || "0.00%";
      }
    }

    const normNo = normalize(no);
    const normParam = normalize(param);
    const normDef = normalize(def);

    // Is it a Total row?
    const isTotalRow =
      normNo === "total" ||
      normParam === "total" ||
      (no === "" && param === "" && def === "" && (bobot === "100%" || bobot === "100"));

    if (isTotalRow) {
      regionalComparison = {
        nasionalScore,
        bdgScore: hasBdgSmg ? bdgScore : "—",
        smgScore: hasBdgSmg ? smgScore : "—",
      };
      result.push({
        no: "",
        parameter: "Total",
        definisi: "",
        target: "",
        bobot: bobot || "100%",
        nasionalAch: periodColIndex !== -1 ? nasionalAch : "",
        nasionalAchTarget: periodColIndex !== -1 ? nasionalAchTarget : "",
        nasionalScore,
        bdgAch: hasBdgSmg ? bdgAch : "",
        bdgScore: hasBdgSmg ? bdgScore : "",
        smgAch: hasBdgSmg ? smgAch : "",
        smgScore: hasBdgSmg ? smgScore : "",
        isTotalRow: true,
      });
      continue;
    }

    // Is it a Category Header row? (Revenue, Customer Experience, Internal Process)
    const isCategory =
      (normParam === "revenue" ||
        normParam === "customerexperience" ||
        normParam === "internalprocess") &&
      !target;

    if (isCategory) {
      result.push({
        no,
        parameter: param,
        definisi: def,
        target,
        bobot,
        nasionalAch: "",
        nasionalAchTarget: "",
        nasionalScore,
        bdgAch: "",
        bdgScore: hasBdgSmg ? bdgScore : "",
        smgAch: "",
        smgScore: hasBdgSmg ? smgScore : "",
        isCategoryRow: true,
      });
      continue;
    }

    // Sub-row without parameter title
    let isSubRow = false;
    if (!param && def) {
      isSubRow = true;
      if (normDef.includes("komplainpelangganmobile")) {
        param = "FCR Mobile (Komplain)";
      } else if (normDef.includes("komplainreciprocal")) {
        param = "FCR Fixed (Reciprocal)";
      } else if (normDef.includes("inslafixed")) {
        param = "In SLA Fixed";
      } else if (normDef.includes("closeratetiketmobile")) {
        param = "Close rate tiket Mobile";
      } else {
        param = def.slice(0, 30);
      }
    }

    if (param || def || target || bobot || nasionalScore || bdgScore || smgScore) {
      result.push({
        no,
        parameter: param,
        definisi: def,
        target,
        bobot,
        nasionalAch,
        nasionalAchTarget,
        nasionalScore,
        bdgAch: hasBdgSmg ? bdgAch : "",
        bdgScore: hasBdgSmg ? bdgScore : "",
        smgAch: hasBdgSmg ? smgAch : "",
        smgScore: hasBdgSmg ? smgScore : "",
        isSubRow,
      });
    }
  }

  return { rows: result, hasComparison: hasBdgSmg, regionalComparison };
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
    const [rekapRows, dailyRows, freetextRows, ccMonthlyRows, ecMonthlyRows] = await Promise.all([
      fetchPublicSheetCsv(sheetId, "All Rekap"),
      fetchPublicSheetCsv(sheetId, "Daily"),
      fetchPublicSheetCsv(sheetId, "Freetext").catch(() => []),
      fetchPublicSheetCsv(sheetId, "Monthly - CallCenter").catch(() => []),
      fetchPublicSheetCsv(sheetId, "Monthly - Ecare").catch(() => []),
    ]);

    const freetextHighlightsMap = parseFreetext(freetextRows);
    const monthlyResultMap: Record<string, MonthlyParseResult> = {
      callCenter: parseMonthlyComparison(ccMonthlyRows, period),
      eCare: parseMonthlyComparison(ecMonthlyRows, period),
    };

    const tabs = TAB_DEFINITIONS.map((definition) => {
      const highlights = freetextHighlightsMap[definition.tabKey];
      const fallback = mockDashboardData.tabs[definition.fallbackIndex];
      const tabData = parseRekapTab(rekapRows, dailyRows, definition, period, highlights) ?? fallback;
      const mResult = monthlyResultMap[definition.tabKey];
      const monthlyComparison = mResult.rows.length > 0
        ? mResult.rows
        : (fallback.monthlyComparison ?? []);

      return {
        ...tabData,
        monthlyComparison,
        hasComparison: mResult.hasComparison,
        regionalComparison: mResult.regionalComparison,
      };
    });

    return { tabs, selectedPeriod: periodLabel(period) };
  } catch (error) {
    console.error("Error fetching or parsing Google Sheets data:", error);
    return { ...mockDashboardData, selectedPeriod: periodLabel(period) };
  }
}
