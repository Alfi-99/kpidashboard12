// lib/scoreCardTypes.ts

export interface ScoreCardMonthData {
  month: string;                    // "Jan", "Feb", etc.
  value: string;                    // raw value from sheet (may be multi-line)
  numericValue?: number;            // primary numeric value
  series: Record<string, number>;   // parsed key-numeric pairs (e.g. { "Occupancy": 85, "shrinkage eCare": 30.28 })
  rawSeries: Record<string, string>; // parsed key-rawString pairs
}

export interface ScoreCardItem {
  name: string;            // Column A: ScoreCard name
  formula: string;         // Column B: Formula description
  description: string;     // Column C: Why it's on the card
  monthlyData: ScoreCardMonthData[];  // Columns D-O (Jan-Dec)
  hasData: boolean;        // Whether any monthly data exists
  seriesKeys: string[];    // Unique series keys found across all months (e.g. ["Occupancy", "shrinkage eCare"])
}

export interface ScoreCardData {
  items: ScoreCardItem[];
  lastUpdated: string;
}
