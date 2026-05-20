import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { format, parseISO } from "date-fns";
import {
  CheckCircle,
  FileText,
  RotateCcw,
} from "lucide-react-native";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getActiveGoal, completeGoal } from "../db/goals";
import { getReadingsByDateRange } from "../db/readings";
import { generateReportData } from "../utils/reportGenerator";
import { getBPClassification } from "../utils/bpClassify";
import { Goal, BPReading } from "../types";
import { colors, spacing, radius, fonts } from "../constants/theme";

export default function GoalComplete() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [name, setName] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [activeGoal, storedName] = await Promise.all([
        getActiveGoal(),
        AsyncStorage.getItem("steadii_name"),
      ]);
      if (storedName) setName(storedName);
      if (activeGoal) {
        setGoal(activeGoal);
        const allReadings = await getReadingsByDateRange(
          activeGoal.startDate,
          activeGoal.endDate,
        );
        setReadings(allReadings);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleExportPDF() {
    if (!goal) return;
    setGenerating(true);
    try {
      const report = generateReportData(name, goal, readings);
      const classification = getBPClassification(
        report.avgSystolic,
        report.avgDiastolic,
      );

      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, sans-serif;
                padding: 40px;
                color: #1a1a2e;
                max-width: 600px;
                margin: 0 auto;
              }
              h1 { font-size: 28px; font-weight: 300; margin-bottom: 4px; }
              h2 { font-size: 18px; font-weight: 600; margin-top: 32px; }
              .subtitle { color: #666; font-size: 14px; }
              .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                background: ${classification.color}26;
                color: ${classification.color};
                border: 1px solid ${classification.color}66;
              }
              .stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin: 24px 0;
              }
              .stat {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 16px;
              }
              .stat-value {
                font-size: 24px;
                font-weight: 500;
                color: #0f1320;
              }
              .stat-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
              }
              .summary {
                background: #f0faf6;
                border-left: 4px solid #4ECCA3;
                padding: 16px;
                border-radius: 0 8px 8px 0;
                font-size: 14px;
                line-height: 1.6;
                color: #333;
                margin: 24px 0;
              }
              .disclaimer {
                font-size: 11px;
                color: #999;
                margin-top: 40px;
                padding-top: 16px;
                border-top: 1px solid #eee;
              }
              .header-bar {
                background: #0F1320;
                color: white;
                padding: 20px 40px;
                margin: -40px -40px 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .app-name {
                font-size: 20px;
                font-weight: 300;
                letter-spacing: 2px;
                color: #4ECCA3;
              }
            </style>
          </head>
          <body>
            <div class="header-bar">
              <span class="app-name">Steadii</span>
              <span style="color: #8B9ABF; font-size: 12px;">
                Blood Pressure Report
              </span>
            </div>

            <h1>${report.patientName}</h1>
            <p class="subtitle">
              ${goal.label} ·
              ${format(parseISO(goal.startDate), "MMM d")} –
              ${format(parseISO(goal.endDate), "MMM d, yyyy")}
            </p>

            <div style="margin-top: 16px;">
              <span class="badge">${classification.label}</span>
            </div>

            <h2>Summary</h2>
            <div class="summary">${report.summary}</div>

            <h2>Key Stats</h2>
            <div class="stats">
              <div class="stat">
                <div class="stat-value">
                  ${report.avgSystolic}/${report.avgDiastolic}
                </div>
                <div class="stat-label">Avg Blood Pressure</div>
              </div>
              <div class="stat">
                <div class="stat-value">
                  ${report.complianceRate}%
                </div>
                <div class="stat-label">Compliance Rate</div>
              </div>
              <div class="stat">
                <div class="stat-value">
                  ${report.totalReadings}
                </div>
                <div class="stat-label">Total Readings</div>
              </div>
              ${
                report.avgBpm
                  ? `<div class="stat">
                      <div class="stat-value">${report.avgBpm}</div>
                      <div class="stat-label">Avg Heart Rate</div>
                    </div>`
                  : ""
              }
            </div>

            <div class="disclaimer">
              This report was generated by Steadii, a personal blood pressure
              tracking app. It is not a medical diagnosis. Please consult your
              doctor for professional medical advice.
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share BP Report",
      });

      if (goal.id) {
        await completeGoal(goal.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  }

  async function handleNewGoal() {
    if (goal?.id) {
      await completeGoal(goal.id);
    }
    router.replace("/onboarding/goal");
  }

  if (!goal) return null;

  const report = generateReportData(name, goal, readings);
  const classification = getBPClassification(
    report.avgSystolic,
    report.avgDiastolic,
  );
  const progress = Math.round(
    (report.totalReadings / goal.durationDays) * 100,
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.checkCircle}>
            <CheckCircle size={48} color={colors.accentPrimary} />
          </View>
          <Typography variant="title" style={styles.heroTitle}>
            Goal complete!
          </Typography>
          <Typography variant="body" color={colors.accentPrimary}>
            {goal.label}
          </Typography>
          <Typography variant="small" color={colors.textTertiary}>
            {format(parseISO(goal.startDate), "MMM d")} –{" "}
            {format(parseISO(goal.endDate), "MMM d, yyyy")}
          </Typography>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Avg blood pressure"
            value={`${report.avgSystolic}/${report.avgDiastolic}`}
            valueColor={classification.color}
          />
          <StatCard
            label="Compliance rate"
            value={`${report.complianceRate}%`}
            valueColor={colors.accentPrimary}
          />
          <StatCard
            label="Days logged"
            value={`${new Set(readings.map((r) => r.loggedAt.split("T")[0])).size} of ${goal.durationDays}`}
            valueColor={colors.textPrimary}
          />
          {report.avgBpm && (
            <StatCard
              label="Avg heart rate"
              value={`${report.avgBpm} bpm`}
              valueColor={colors.textPrimary}
            />
          )}
        </View>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
          >
            Summary
          </Typography>
          <Typography
            variant="small"
            color={colors.textSecondary}
            style={styles.summaryText}
          >
            {report.summary}
          </Typography>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="Export report for doctor"
            onPress={handleExportPDF}
            loading={generating}
          />
          <TouchableOpacity
            style={styles.newGoalButton}
            onPress={handleNewGoal}
            activeOpacity={0.8}
          >
            <RotateCcw size={16} color={colors.textSecondary} />
            <Typography variant="small" color={colors.textSecondary}>
              Start a new goal
            </Typography>
          </TouchableOpacity>
        </View>

        <Typography
          variant="tiny"
          color={colors.textTertiary}
          style={styles.disclaimer}
        >
          Not a medical diagnosis. Always consult your doctor.
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  valueColor: string;
};

function StatCard({ label, value, valueColor }: StatCardProps) {
  return (
    <Card style={styles.statCard} elevated>
      <Typography
        variant="title"
        style={[styles.statValue, { color: valueColor }]}
      >
        {value}
      </Typography>
      <Typography
        variant="tiny"
        color={colors.textTertiary}
        uppercase
      >
        {label}
      </Typography>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: fonts.light,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontFamily: fonts.medium,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  summaryText: {
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
  },
  newGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  disclaimer: {
    textAlign: "center",
  },
});
