// lib/scoreCardMapper.ts

import type { ScoreCardItem, ScoreCardData, ScoreCardMonthData } from "./scoreCardTypes";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Parse a multi-line cell value into key-numeric and key-rawString maps.
 * Handles single lines ("85%"), colon-separated lines ("Occupancy : 85%"),
 * multi-line entries ("Occupancy : 85%\nshrinkage eCare : 30.28%"),
 * comma decimals ("7,17%"), etc.
 */
function parseCellLines(raw: string): {
  series: Record<string, number>;
  rawSeries: Record<string, string>;
  primaryNumeric?: number;
} {
  const series: Record<string, number> = {};
  const rawSeries: Record<string, string> = {};
  let primaryNumeric: number | undefined = undefined;

  if (!raw || !raw.trim()) {
    return { series, rawSeries, primaryNumeric: undefined };
  }

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  lines.forEach((line, idx) => {
    let key = "";
    let valStr = "";

    if (line.includes(":")) {
      const parts = line.split(":");
      key = parts[0].trim();
      valStr = parts.slice(1).join(":").trim();
    } else {
      key = lines.length > 1 ? `Metric ${idx + 1}` : "Value";
      valStr = line;
    }

    rawSeries[key] = valStr;

    if (valStr) {
      // Replace comma with dot for decimal parsing (e.g. 7,17 -> 7.17)
      const cleaned = valStr.replace(/,/g, ".").replace(/[^0-9.-]/g, "");
      const num = parseFloat(cleaned);
      if (!isNaN(num)) {
        series[key] = num;
        if (primaryNumeric === undefined) {
          primaryNumeric = num;
        }
      }
    }
  });

  return { series, rawSeries, primaryNumeric };
}

export function mapScoreCardData(rows: string[][]): ScoreCardData {
  if (!rows || rows.length === 0) {
    return { items: [], lastUpdated: new Date().toISOString() };
  }

  const items: ScoreCardItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]?.trim()) continue;

    const name = row[0]?.trim() || "";
    const formula = row[1]?.trim() || "";
    const description = row[2]?.trim() || "";

    const monthlyData: ScoreCardMonthData[] = [];
    let hasData = false;
    const seriesKeysSet = new Set<string>();

    for (let m = 0; m < 12; m++) {
      const cellIndex = 3 + m; // columns D(3) through O(14)
      const rawValue = row[cellIndex]?.trim() || "";

      if (rawValue) {
        hasData = true;
      }

      const parsed = parseCellLines(rawValue);

      // Collect all sub-metric keys (e.g. "Occupancy", "shrinkage eCare")
      Object.keys(parsed.rawSeries).forEach((k) => seriesKeysSet.add(k));

      monthlyData.push({
        month: MONTHS[m],
        value: rawValue,
        numericValue: parsed.primaryNumeric,
        series: parsed.series,
        rawSeries: parsed.rawSeries,
      });
    }

    items.push({
      name,
      formula,
      description,
      monthlyData,
      hasData,
      seriesKeys: Array.from(seriesKeysSet),
    });
  }

  return {
    items,
    lastUpdated: new Date().toISOString(),
  };
}
