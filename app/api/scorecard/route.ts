// app/api/scorecard/route.ts
import { NextResponse } from "next/server";
import { mapScoreCardData } from "@/lib/scoreCardMapper";

const SHEET_ID = "1ToE05cA0nHgVmcQq0HmHRe__By3u5uuC9la3Wa9xiHc";

/** Fetch via public Google Sheets CSV export (no credentials needed) */
async function fetchPublicSheet(): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&range=A2:O20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Public sheet fetch failed: ${res.status}`);
  const csv = await res.text();
  return parseCsv(csv);
}

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
  row.push(current);
  if (row.some((c) => c.trim())) rows.push(row);
  return rows;
}

/** Fetch via Google Sheets API with credentials */
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

export async function GET() {
  try {
    let rows: string[][];
    try {
      rows = await fetchWithCredentials();
    } catch {
      rows = await fetchPublicSheet();
    }
    const data = mapScoreCardData(rows);
    return NextResponse.json(data);
  } catch (error) {
    console.error("ScoreCard API error:", error);
    return NextResponse.json(
      { items: [], lastUpdated: new Date().toISOString() }
    );
  }
}
