import { getDatabase } from "./client";
import { BPReading } from "../types";

export async function insertReading(
  systolic: number,
  diastolic: number,
  bpm: number | null,
  period: "AM" | "PM",
): Promise<number> {
  const db = getDatabase();
  const loggedAt = new Date().toISOString();

  const result = await db.runAsync(
    `INSERT INTO readings (systolic, diastolic, bpm, period, logged_at)
     VALUES (?, ?, ?, ?, ?)`,
    [systolic, diastolic, bpm, period, loggedAt],
  );

  return result.lastInsertRowId;
}

export async function getReadingsByDateRange(
  startDate: string,
  endDate: string,
): Promise<BPReading[]> {
  const db = getDatabase();

  const rows = await db.getAllAsync<BPReading>(
    `SELECT
      id,
      systolic,
      diastolic,
      bpm,
      period,
      logged_at as loggedAt,
      notes
     FROM readings
     WHERE logged_at >= ? AND logged_at <= ?
     ORDER BY logged_at DESC`,
    [startDate, endDate],
  );

  return rows;
}

export async function getReadingsForWeek(
  mondayIso: string,
  sundayIso: string,
): Promise<BPReading[]> {
  return getReadingsByDateRange(mondayIso, sundayIso);
}

export async function getTodayReadings(
  period?: "AM" | "PM",
): Promise<BPReading[]> {
  const db = getDatabase();
  const today = new Date().toISOString().split("T")[0];
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;

  if (period) {
    const rows = await db.getAllAsync<BPReading>(
      `SELECT
        id,
        systolic,
        diastolic,
        bpm,
        period,
        logged_at as loggedAt,
        notes
       FROM readings
       WHERE logged_at >= ? AND logged_at <= ?
       AND period = ?
       ORDER BY logged_at DESC`,
      [start, end, period],
    );
    return rows;
  }

  return getReadingsByDateRange(start, end);
}

export async function deleteReading(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM readings WHERE id = ?`, [id]);
}

export async function getAllReadings(): Promise<BPReading[]> {
  const db = getDatabase();

  const rows = await db.getAllAsync<BPReading>(
    `SELECT
      id,
      systolic,
      diastolic,
      bpm,
      period,
      logged_at as loggedAt,
      notes
     FROM readings
     ORDER BY logged_at DESC`,
  );

  return rows;
}
