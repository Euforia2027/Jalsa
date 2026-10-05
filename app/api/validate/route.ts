import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  PASTE YOUR GOOGLE SHEET ID HERE
//    Open your sheet → copy the long ID from the URL:
//    https://docs.google.com/spreadsheets/d/ <<<THIS PART>>> /edit
// ─────────────────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = "1SWbSq-tL6lV41ctTeazGviQBjuQ3VfXnxqCMS8FuYBo";

const STUDENT_SHEET  = "Student_data";   // tab with ID_no. & Name
const CHECKED_SHEET  = "Checked_String"; // tab where validated entries are logged

// ── Auth helper ───────────────────────────────────────────────────────────────
function getAuth() {
  const credPath = path.join(process.cwd(), "app", "api", "credentials.json");
  const credentials = JSON.parse(fs.readFileSync(credPath, "utf-8"));
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// ── POST /api/validate ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const admissionNo: string = (body.admissionNo ?? "").trim();
    const passNo: string = (body.passNo ?? "").trim();

    if (!admissionNo || !passNo) {
      return NextResponse.json(
        { error: "Admission number and pass number are required." },
        { status: 400 }
      );
    }

    const auth   = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // ── 1. Read Student_data (A:B) ──────────────────────────────────────────
    const studentRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STUDENT_SHEET}!A:B`,
    });

    const rows = studentRes.data.values ?? [];

    // Find match — skip header row (row 0 = ["ID_no.", "Name"])
    const match = rows.slice(1).find(
      (row) => (row[0] ?? "").trim().toLowerCase() === admissionNo.toLowerCase()
    );

    if (!match) {
      return NextResponse.json({ found: false });
    }

    const [id, name] = match;

    // ── 2. Check if already logged in Checked_String ────────────────────────
    const checkedRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CHECKED_SHEET}!A:D`,
    });

    const checkedRows = (checkedRes.data.values ?? []).slice(1);

    const existingRow = checkedRows.find(
      (r) => (r[1] ?? "").trim().toLowerCase() === admissionNo.toLowerCase()
    );

    if (existingRow) {
      // Already checked in — return existing pass number from column A
      const existingPassNo = existingRow[0] ?? "";
      return NextResponse.json({ found: true, alreadyChecked: true, student: { id, name, passNo: existingPassNo } });
    }

    // ── 3. Append validated entry to Checked_String ─────────────────────────
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CHECKED_SHEET}!A:D`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[passNo, id, name, timestamp]],
      },
    });

    return NextResponse.json({ found: true, alreadyChecked: false, student: { id, name, passNo } });
  } catch (err) {
    console.error("[validate] error:", err);
    return NextResponse.json(
      { error: "Server error. Check server logs." },
      { status: 500 }
    );
  }
}
