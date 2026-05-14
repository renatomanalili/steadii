import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "steadii.db";

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DATABASE_NAME);
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS readings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      systolic    INTEGER NOT NULL,
      diastolic   INTEGER NOT NULL,
      bpm         INTEGER,
      period      TEXT NOT NULL DEFAULT 'AM',
      logged_at   TEXT NOT NULL,
      notes       TEXT
    );

    CREATE TABLE IF NOT EXISTS goals (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      label         TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      start_date    TEXT NOT NULL,
      end_date      TEXT NOT NULL,
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL
    );
  `);
}
