// app/scorecard/page.tsx (Server Component)
import { mapScoreCardData } from "@/lib/scoreCardMapper";
import type { ScoreCardData } from "@/lib/scoreCardTypes";
import ScoreCardClient from "./ScoreCardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SHEET_ID = "1ToE05cA0nHgVmcQq0HmHRe__By3u5uuC9la3Wa9xiHc";

/**
 * Fetch via public Google Sheets CSV export (no credentials needed).
 * Works when the sheet is shared with "Anyone with the link".
 */
async function fetchPublicSheet(): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&range=A2:O20`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Public sheet fetch failed: ${res.status}`);
  const csv = await res.text();
  return parseCsv(csv);
}

/** Simple CSV parser that handles quoted fields with commas/newlines */
function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"' && csv[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current);
        current = "";
      } else if (ch === '\n' || (ch === '\r' && csv[i + 1] === '\n')) {
        row.push(current);
        current = "";
        if (row.some((c) => c.trim())) rows.push(row);
        row = [];
        if (ch === '\r') i++;
      } else {
        current += ch;
      }
    }
  }
  // Last field
  row.push(current);
  if (row.some((c) => c.trim())) rows.push(row);

  return rows;
}

/**
 * Fetch via Google Sheets API with service account credentials.
 */
async function fetchWithCredentials(): Promise<string[][]> {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID_SCORECARD || SHEET_ID;

  if (!email || !key || email.includes("xxxx") || key.includes("...")) {
    throw new Error("No valid credentials");
  }

  const { google } = await import("googleapis");
  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A2:O20",
  });

  return (res.data.values as string[][]) ?? [];
}

async function getScoreCardData(): Promise<ScoreCardData> {
  const emptyData: ScoreCardData = { items: [], lastUpdated: new Date().toISOString() };
  try {
    // Try credentials first, fallback to public export
    let rows: string[][];
    try {
      rows = await fetchWithCredentials();
    } catch {
      console.log("ScoreCard: Falling back to public CSV export");
      rows = await fetchPublicSheet();
    }
    return mapScoreCardData(rows);
  } catch (error) {
    console.error("Error fetching ScoreCard data:", error);
    return emptyData;
  }
}

export default async function ScoreCardPage() {
  const data = await getScoreCardData();
  return <ScoreCardClient initialData={data} />;
}
