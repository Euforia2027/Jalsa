// ─── JALSA 2026 — Pass Data ───────────────────────────────────────────────────
// Add real student records here. admissionNo + passId must BOTH match to validate.

export interface PassRecord {
  admissionNo: string;
  passId: string;
  name: string;
  event: string;
  seat?: string;
}

export const passes: PassRecord[] = [
  // --- Sample records (replace with real data) ---
  { admissionNo: "2301001", passId: "JALSA-001", name: "Aarav Sharma",   event: "Cultural Night", seat: "A-01" },
  { admissionNo: "2301002", passId: "JALSA-002", name: "Priya Mehta",    event: "Cultural Night", seat: "A-02" },
  { admissionNo: "2301003", passId: "JALSA-003", name: "Rohan Pillai",   event: "Cultural Night", seat: "B-01" },
  { admissionNo: "2301004", passId: "JALSA-004", name: "Sneha Nair",     event: "Cultural Night", seat: "B-02" },
  { admissionNo: "2301005", passId: "JALSA-005", name: "Karan Joshi",    event: "Cultural Night", seat: "C-01" },
];

// ─── Lookup function ──────────────────────────────────────────────────────────
export function validatePass(admissionNo: string, passId: string): PassRecord | null {
  const record = passes.find(
    (p) =>
      p.admissionNo.trim().toLowerCase() === admissionNo.trim().toLowerCase() &&
      p.passId.trim().toLowerCase() === passId.trim().toLowerCase()
  );
  return record ?? null;
}
