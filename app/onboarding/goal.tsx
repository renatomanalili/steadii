import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, format } from "date-fns";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { insertGoal } from "../../db/goals";
import { colors, spacing, radius } from "../../constants/theme";

type DoctorChoice = "yes" | "no" | null;
type Duration = 30 | 60 | 90;

export default function Goal() {
  const [doctorChoice, setDoctorChoice] =
    useState<DoctorChoice>(null);
  const [duration, setDuration] = useState<Duration>(90);
  const [loading, setLoading] = useState(false);

  const durations: Duration[] = [30, 60, 90];

  function getEndDate(days: number): string {
    return format(addDays(new Date(), days), "MMM d, yyyy");
  }

  function getGoalLabel(): string {
    if (doctorChoice === "yes") {
      return `Dr's ${duration}-Day Program`;
    }
    return `${duration}-Day Tracking Goal`;
  }

  async function handleStart() {
    setLoading(true);
    try {
      if (doctorChoice === "yes" || doctorChoice === "no") {
        const startDate = new Date().toISOString();
        const endDate = addDays(new Date(), duration).toISOString();
        await insertGoal(
          getGoalLabel(),
          duration,
          startDate,
          endDate,
        );
      }
      await AsyncStorage.setItem("@steadii/onboarded", "true");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    await AsyncStorage.setItem("@steadii/onboarded", "true");
    router.replace("/(tabs)/home");
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="title">
            Set your tracking goal
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}
          >
            Did your doctor ask you to monitor your BP?
          </Typography>
        </View>

        <View style={styles.choices}>
          <TouchableOpacity
            style={[
              styles.choiceCard,
              doctorChoice === "yes" && styles.choiceCardActive,
            ]}
            onPress={() => setDoctorChoice("yes")}
            activeOpacity={0.8}
          >
            <Typography variant="body" style={styles.choiceEmoji}>
              🩺
            </Typography>
            <View style={styles.choiceText}>
              <Typography variant="body">
                Yes, my doctor gave me a program
              </Typography>
              <Typography
                variant="small"
                color={colors.textSecondary}
              >
                I'll set a duration below
              </Typography>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceCard,
              doctorChoice === "no" && styles.choiceCardActive,
            ]}
            onPress={() => setDoctorChoice("no")}
            activeOpacity={0.8}
          >
            <Typography variant="body" style={styles.choiceEmoji}>
              👤
            </Typography>
            <View style={styles.choiceText}>
              <Typography variant="body">
                No, I'm tracking on my own
              </Typography>
              <Typography
                variant="small"
                color={colors.textSecondary}
              >
                I'll set my own goal
              </Typography>
            </View>
          </TouchableOpacity>
        </View>

        {doctorChoice !== null && (
          <View style={styles.durationSection}>
            <Typography
              variant="tiny"
              color={colors.textTertiary}
              uppercase
              style={styles.durationLabel}
            >
              Tracking duration
            </Typography>

            <View style={styles.durationPills}>
              {durations.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.pill,
                    duration === d && styles.pillActive,
                  ]}
                  onPress={() => setDuration(d)}
                  activeOpacity={0.8}
                >
                  <Typography
                    variant="small"
                    color={
                      duration === d
                        ? colors.textOnAccent
                        : colors.textSecondary
                    }
                  >
                    {d === 30
                      ? "1 month"
                      : d === 60
                        ? "2 months"
                        : "3 months"}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            <Card style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Typography
                  variant="tiny"
                  color={colors.textTertiary}
                  uppercase
                >
                  Goal
                </Typography>
                <Typography
                  variant="small"
                  color={colors.accentPrimary}
                >
                  {getGoalLabel()}
                </Typography>
              </View>
              <View style={styles.previewRow}>
                <Typography
                  variant="tiny"
                  color={colors.textTertiary}
                  uppercase
                >
                  Ends
                </Typography>
                <Typography
                  variant="small"
                  color={colors.textSecondary}
                >
                  {getEndDate(duration)}
                </Typography>
              </View>
            </Card>
          </View>
        )}

        <View style={styles.footer}>
          <Button
            label="Start tracking"
            onPress={handleStart}
            loading={loading}
            disabled={doctorChoice === null}
          />
          <TouchableOpacity onPress={handleSkip}>
            <Typography
              variant="small"
              color={colors.textTertiary}
              style={styles.skip}
            >
              Skip for now
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  header: {
    gap: spacing.sm,
  },
  subtitle: {
    lineHeight: 22,
  },
  choices: {
    gap: spacing.md,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  choiceCardActive: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.card,
  },
  choiceEmoji: {
    fontSize: 24,
  },
  choiceText: {
    flex: 1,
    gap: spacing.xs,
  },
  durationSection: {
    gap: spacing.md,
  },
  durationLabel: {
    marginBottom: spacing.xs,
  },
  durationPills: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  previewCard: {
    gap: spacing.sm,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    gap: spacing.md,
    marginTop: "auto",
  },
  skip: {
    textAlign: "center",
  },
});
