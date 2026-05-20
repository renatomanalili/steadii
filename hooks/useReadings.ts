import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  getAllReadings,
  getTodayReadings,
  insertReading,
  deleteReading,
  getReadingsByDateRange,
} from "../db/readings";
import {
  getWeekRange,
  groupReadingsByWeek,
} from "../utils/dateHelpers";
import { BPReading } from "../types";

export function useReadings() {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [todayReadings, setTodayReadings] = useState<BPReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadReadings();
    }, []),
  );

  async function loadReadings() {
    try {
      setLoading(true);
      setError(null);
      const [all, today] = await Promise.all([
        getAllReadings(),
        getTodayReadings(),
      ]);
      setReadings(all);
      setTodayReadings(today);
    } catch (err) {
      setError("Failed to load readings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveReading(
    systolic: number,
    diastolic: number,
    bpm: number | null,
    period: "AM" | "PM",
  ): Promise<boolean> {
    try {
      setSaving(true);
      setError(null);
      await insertReading(systolic, diastolic, bpm, period);
      await loadReadings();
      return true;
    } catch (err) {
      setError("Failed to save reading");
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function removeReading(id: number): Promise<boolean> {
    try {
      setError(null);
      await deleteReading(id);
      await loadReadings();
      return true;
    } catch (err) {
      setError("Failed to delete reading");
      console.error(err);
      return false;
    }
  }

  async function getWeekReadings() {
    const { mondayIso, sundayIso } = getWeekRange(new Date());
    return getReadingsByDateRange(mondayIso, sundayIso);
  }

  const grouped = groupReadingsByWeek(readings);
  const weekKeys = Object.keys(grouped);

  return {
    readings,
    todayReadings,
    grouped,
    weekKeys,
    loading,
    saving,
    error,
    saveReading,
    removeReading,
    getWeekReadings,
    refresh: loadReadings,
  };
}
