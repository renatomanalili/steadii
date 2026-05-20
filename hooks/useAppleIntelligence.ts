import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { BPReading, Goal } from "../types";
import { getBPClassification } from "../utils/bpClassify";
import { getTipOfTheDay } from "../constants/tips";

type AIStatus = "unavailable" | "checking" | "ready" | "error";

type WeeklySummary = {
  text: string;
  generatedByAI: boolean;
};

type TipPersonalization = {
  intro: string;
  tip: string;
  generatedByAI: boolean;
};

export function useAppleIntelligence() {
  const [status, setStatus] = useState<AIStatus>("checking");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  async function checkAvailability() {
    try {
      setStatus("checking");

      // only available on iOS
      if (Platform.OS !== "ios") {
        setStatus("unavailable");
        return;
      }

      // check if foundation models is available
      const foundationModels =
        await import("react-native-foundation-models").catch(
          () => null,
        );

      if (!foundationModels) {
        setStatus("unavailable");
        return;
      }

      const isAvailable =
        await foundationModels.LanguageModel.availability();

      if (isAvailable === "available") {
        setStatus("ready");
      } else {
        setStatus("unavailable");
      }
    } catch (err) {
      setStatus("unavailable");
      console.error("Apple Intelligence not available:", err);
    }
  }

  async function generateWeeklySummary(
    readings: BPReading[],
  ): Promise<WeeklySummary> {
    // fallback for unavailable devices
    if (status !== "ready" || readings.length === 0) {
      return generateFallbackSummary(readings);
    }

    try {
      setGenerating(true);
      setError(null);

      const foundationModels =
        await import("react-native-foundation-models");

      const avgSystolic = Math.round(
        readings.reduce((s, r) => s + r.systolic, 0) /
          readings.length,
      );
      const avgDiastolic = Math.round(
        readings.reduce((s, r) => s + r.diastolic, 0) /
          readings.length,
      );
      const classification = getBPClassification(
        avgSystolic,
        avgDiastolic,
      );

      const prompt = `
        You are a health app assistant. Write a brief, encouraging
        weekly summary for a blood pressure tracking app user.

        Data for this week:
        - Total readings: ${readings.length}
        - Average BP: ${avgSystolic}/${avgDiastolic} mmHg
        - Classification: ${classification.label}
        - Days logged: ${new Set(readings.map((r) => r.loggedAt.split("T")[0])).size}

        Rules:
        - 2-3 sentences maximum
        - Be encouraging and factual
        - Do NOT give medical advice or diagnoses
        - Do NOT suggest medications or treatments
        - Focus on consistency and data patterns only
        - End with "Consult your doctor for medical advice."
      `;

      const session = await foundationModels.LanguageModel.create();
      const response = await session.prompt(prompt);
      await session.destroy();

      return {
        text: response.trim(),
        generatedByAI: true,
      };
    } catch (err) {
      setError("Failed to generate summary");
      console.error(err);
      return generateFallbackSummary(readings);
    } finally {
      setGenerating(false);
    }
  }

  async function personalizeTip(
    period: "AM" | "PM",
    streak: number,
  ): Promise<TipPersonalization> {
    const tip = getTipOfTheDay();

    // fallback for unavailable devices
    if (status !== "ready") {
      return {
        intro: period === "AM" ? "Good morning!" : "Good evening!",
        tip: tip.body,
        generatedByAI: false,
      };
    }

    try {
      setGenerating(true);
      setError(null);

      const foundationModels =
        await import("react-native-foundation-models");

      const prompt = `
        You are a health app assistant. Write a single short intro
        sentence (max 8 words) to personalize this wellness tip.

        Context:
        - Time of day: ${period === "AM" ? "Morning" : "Evening"}
        - User logging streak: ${streak} days
        - Tip title: ${tip.title}

        Rules:
        - One sentence only, max 8 words
        - Warm and encouraging tone
        - No medical advice
        - No line breaks
      `;

      const session = await foundationModels.LanguageModel.create();
      const response = await session.prompt(prompt);
      await session.destroy();

      return {
        intro: response.trim(),
        tip: tip.body,
        generatedByAI: true,
      };
    } catch (err) {
      setError("Failed to personalize tip");
      console.error(err);
      return {
        intro: period === "AM" ? "Good morning!" : "Good evening!",
        tip: tip.body,
        generatedByAI: false,
      };
    } finally {
      setGenerating(false);
    }
  }

  async function generateReportNarrative(
    readings: BPReading[],
    goal: Goal,
    patientName: string,
  ): Promise<string> {
    if (status !== "ready" || readings.length === 0) {
      return generateFallbackNarrative(readings, goal, patientName);
    }

    try {
      setGenerating(true);
      setError(null);

      const foundationModels =
        await import("react-native-foundation-models");

      const avgSystolic = Math.round(
        readings.reduce((s, r) => s + r.systolic, 0) /
          readings.length,
      );
      const avgDiastolic = Math.round(
        readings.reduce((s, r) => s + r.diastolic, 0) /
          readings.length,
      );
      const uniqueDays = new Set(
        readings.map((r) => r.loggedAt.split("T")[0]),
      ).size;
      const compliance = Math.round(
        (uniqueDays / goal.durationDays) * 100,
      );
      const classification = getBPClassification(
        avgSystolic,
        avgDiastolic,
      );

      const prompt = `
        You are a health app assistant writing a doctor report
        narrative. Write 3-4 sentences summarizing this patient's
        blood pressure tracking data.

        Patient: ${patientName}
        Program: ${goal.label} (${goal.durationDays} days)
        Total readings: ${readings.length}
        Days logged: ${uniqueDays} (${compliance}% compliance)
        Average BP: ${avgSystolic}/${avgDiastolic} mmHg
        Classification: ${classification.label}

        Rules:
        - Professional, clinical tone
        - Factual data summary only
        - Do NOT diagnose or recommend treatment
        - Do NOT suggest medications
        - End with: "This data was recorded by the patient
          using Steadii. Please consult with the patient
          for full clinical context."
      `;

      const session = await foundationModels.LanguageModel.create();
      const response = await session.prompt(prompt);
      await session.destroy();

      return response.trim();
    } catch (err) {
      setError("Failed to generate narrative");
      console.error(err);
      return generateFallbackNarrative(readings, goal, patientName);
    } finally {
      setGenerating(false);
    }
  }

  // fallback functions for non-AI devices
  function generateFallbackSummary(
    readings: BPReading[],
  ): WeeklySummary {
    if (readings.length === 0) {
      return {
        text: "No readings logged this week. Consistent daily logging gives you and your doctor the best data. Consult your doctor for medical advice.",
        generatedByAI: false,
      };
    }

    const avgSystolic = Math.round(
      readings.reduce((s, r) => s + r.systolic, 0) / readings.length,
    );
    const avgDiastolic = Math.round(
      readings.reduce((s, r) => s + r.diastolic, 0) / readings.length,
    );
    const uniqueDays = new Set(
      readings.map((r) => r.loggedAt.split("T")[0]),
    ).size;

    return {
      text: `This week you logged ${readings.length} readings across ${uniqueDays} days. Your average was ${avgSystolic}/${avgDiastolic} mmHg. Consult your doctor for medical advice.`,
      generatedByAI: false,
    };
  }

  function generateFallbackNarrative(
    readings: BPReading[],
    goal: Goal,
    patientName: string,
  ): string {
    const avgSystolic = Math.round(
      readings.reduce((s, r) => s + r.systolic, 0) / readings.length,
    );
    const avgDiastolic = Math.round(
      readings.reduce((s, r) => s + r.diastolic, 0) / readings.length,
    );
    const uniqueDays = new Set(
      readings.map((r) => r.loggedAt.split("T")[0]),
    ).size;
    const compliance = Math.round(
      (uniqueDays / goal.durationDays) * 100,
    );

    return `${patientName} completed a ${goal.durationDays}-day tracking program with ${readings.length} readings logged across ${uniqueDays} days (${compliance}% compliance). Average blood pressure was ${avgSystolic}/${avgDiastolic} mmHg. This data was recorded by the patient using Steadii. Please consult with the patient for full clinical context.`;
  }

  return {
    status,
    generating,
    error,
    isAvailable: status === "ready",
    generateWeeklySummary,
    personalizeTip,
    generateReportNarrative,
  };
}
