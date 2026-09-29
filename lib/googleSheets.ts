// lib/googleSheets.ts
import { google } from "googleapis";

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export function hasValidCredentials(): boolean {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  return Boolean(email && key && !email.includes("xxxx") && !key.includes("..."));
}

export async function fetchSheetsBatch(ranges: string[], spreadsheetId?: string): Promise<Record<string, string[][]>> {
  const targetId = spreadsheetId || process.env.GOOGLE_SHEET_ID;
  if (!targetId) throw new Error("No spreadsheet ID provided");
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: targetId,
    ranges,
  });

  const result: Record<string, string[][]> = {};
  res.data.valueRanges?.forEach((vr, i) => {
    const rangeKey = ranges[i];
    result[rangeKey] = (vr.values as string[][]) ?? [];
  });
  return result;
}

