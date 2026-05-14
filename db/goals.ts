import { getDatabase } from "./client";
import { Goal } from "../types";

export async function insertGoal(
  label: string,
  durationDays: number,
  startDate: string,
  endDate: string,
): Promise<number> {
  const db = getDatabase();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `UPDATE goals SET is_active = 0 WHERE is_active = 1`,
  );

  const result = await db.runAsync(
    `INSERT INTO goals (label, duration_days, start_date, end_date, is_active, created_at)
     VALUES (?, ?, ?, ?, 1, ?)`,
    [label, durationDays, startDate, endDate, createdAt],
  );

  return result.lastInsertRowId;
}

export async function getActiveGoal(): Promise<Goal | null> {
  const db = getDatabase();

  const row = await db.getFirstAsync<{
    id: number;
    label: string;
    duration_days: number;
    start_date: string;
    end_date: string;
    is_active: number;
    created_at: string;
  }>(`SELECT * FROM goals WHERE is_active = 1 LIMIT 1`);

  if (!row) return null;

  return {
    id: row.id,
    label: row.label,
    durationDays: row.duration_days,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
  };
}

export async function getAllGoals(): Promise<Goal[]> {
  const db = getDatabase();

  const rows = await db.getAllAsync<{
    id: number;
    label: string;
    duration_days: number;
    start_date: string;
    end_date: string;
    is_active: number;
    created_at: string;
  }>(`SELECT * FROM goals ORDER BY created_at DESC`);

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    durationDays: row.duration_days,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
  }));
}

export async function completeGoal(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(`UPDATE goals SET is_active = 0 WHERE id = ?`, [
    id,
  ]);
}
