import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { isAfter, parseISO } from "date-fns";
import {
  getActiveGoal,
  getAllGoals,
  insertGoal,
  completeGoal,
} from "../db/goals";
import { calculateGoalProgress } from "../utils/dateHelpers";
import { Goal } from "../types";

export function useGoal() {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [pastGoals, setPastGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadGoal();
    }, []),
  );

  async function loadGoal() {
    try {
      setLoading(true);
      setError(null);
      const [goal, allGoals] = await Promise.all([
        getActiveGoal(),
        getAllGoals(),
      ]);
      setActiveGoal(goal);
      setPastGoals(allGoals.filter((g) => !g.isActive));
    } catch (err) {
      setError("Failed to load goal");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createGoal(
    label: string,
    durationDays: number,
    startDate: string,
    endDate: string,
  ): Promise<boolean> {
    try {
      setError(null);
      await insertGoal(label, durationDays, startDate, endDate);
      await loadGoal();
      return true;
    } catch (err) {
      setError("Failed to create goal");
      console.error(err);
      return false;
    }
  }

  async function finishGoal(id: number): Promise<boolean> {
    try {
      setError(null);
      await completeGoal(id);
      await loadGoal();
      return true;
    } catch (err) {
      setError("Failed to complete goal");
      console.error(err);
      return false;
    }
  }

  const isGoalComplete = activeGoal
    ? isAfter(new Date(), parseISO(activeGoal.endDate))
    : false;

  const progress = activeGoal
    ? calculateGoalProgress(activeGoal.startDate, activeGoal.endDate)
    : null;

  return {
    activeGoal,
    pastGoals,
    loading,
    error,
    isGoalComplete,
    progress,
    createGoal,
    finishGoal,
    refresh: loadGoal,
  };
}
