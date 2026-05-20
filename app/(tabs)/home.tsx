import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { format, parseISO, isAfter } from "date-fns";
import { Lightbulb } from "lucide-react-native";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StepperCard } from "../../components/log/StepperCard";
import { BpmInput } from "../../components/log/BpmInput";
import { ClassificationBadge } from "../../components/log/ClassificationBadge";
import { getTipOfTheDay } from "../../constants/tips";
import { useReadings } from "../../hooks/useReadings";
import { useGoal } from "../../hooks/useGoal";
import { Goal } from "../../types";
import { colors, spacing, radius } from "../../constants/theme";

export default function Home() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">(() =>
    new Date().getHours() < 12 ? "AM" : "PM",
  );
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [bpm, setBpm] = useState<number | null>(null);

  const {
    saving,
    saveReading,
    refresh: refreshReadings,
  } = useReadings();
  const {
    activeGoal,
    isGoalComplete,
    refresh: refreshGoal,
  } = useGoal();
  const tip = getTipOfTheDay();

  useFocusEffect(
    useCallback(() => {
      loadName();
      if (isGoalComplete && activeGoal) {
        router.push("/goal-complete");
      }
    }, [isGoalComplete]),
  );

  async function loadName() {
    try {
      const storedName =
        await SecureStore.getItemAsync("steadii_name");
      if (storedName) setName(storedName);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    await saveReading(systolic, diastolic, bpm, period);
  }

  async function handleRefresh() {
    await Promise.all([refreshReadings(), refreshGoal()]);
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={colors.accentPrimary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.dot} />
            <Typography variant="label" uppercase>
              Steadii
            </Typography>
          </View>
          <Typography variant="tiny" color={colors.textTertiary}>
            {format(new Date(), "EEE, d MMM yyyy")}
          </Typography>
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Typography variant="title">
            {name ? `Hey, ${name.split(" ")[0]} 👋` : "Hey there 👋"}
          </Typography>
          <Typography variant="body" color={colors.textSecondary}>
            How are you feeling today?
          </Typography>
        </View>

        {/* Goal Banner */}
        {activeGoal && <GoalBanner goal={activeGoal} />}

        {/* AM/PM Toggle */}
        <View style={styles.toggleRow}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
          >
            Log Today
          </Typography>
          <View style={styles.toggle}>
            {(["AM", "PM"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.toggleItem,
                  period === p && styles.toggleItemActive,
                ]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.8}
              >
                <Typography
                  variant="tiny"
                  color={
                    period === p
                      ? colors.textOnAccent
                      : colors.textSecondary
                  }
                  style={styles.toggleLabel}
                >
                  {p}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Steppers */}
        <View style={styles.steppers}>
          <StepperCard
            label="SYS"
            value={systolic}
            onIncrement={() =>
              setSystolic((v) => Math.min(v + 1, 250))
            }
            onDecrement={() =>
              setSystolic((v) => Math.max(v - 1, 40))
            }
          />
          <StepperCard
            label="DIA"
            value={diastolic}
            onIncrement={() =>
              setDiastolic((v) => Math.min(v + 1, 150))
            }
            onDecrement={() =>
              setDiastolic((v) => Math.max(v - 1, 40))
            }
          />
        </View>

        {/* Classification Badge */}
        <ClassificationBadge
          systolic={systolic}
          diastolic={diastolic}
        />

        {/* BPM Input */}
        <BpmInput value={bpm} onChange={setBpm} />

        {/* Save Button */}
        <Button
          label="Save reading"
          onPress={handleSave}
          loading={saving}
        />

        {/* Tip of the Day */}
        <Card style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Lightbulb size={14} color={colors.accentPrimary} />
            <Typography
              variant="tiny"
              color={colors.accentPrimary}
              uppercase
            >
              Tip of the day
            </Typography>
          </View>
          <Typography variant="small" color={colors.textSecondary}>
            {tip.body}
          </Typography>
        </Card>

        {/* Bottom padding for floating tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
}

type GoalBannerProps = {
  goal: Goal;
};

function GoalBanner({ goal }: GoalBannerProps) {
  const { progress } = useGoal();

  if (!progress) return null;

  return (
    <Card style={styles.goalCard}>
      <View style={styles.goalRow}>
        <View style={styles.goalLeft}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
          >
            Tracking program
          </Typography>
          <Typography variant="label">{goal.label}</Typography>
        </View>
        <View style={styles.goalRight}>
          <Typography
            variant="title"
            color={colors.accentPrimary}
            style={styles.dayCount}
          >
            Day {progress.daysPassed}
          </Typography>
          <Typography variant="tiny" color={colors.textTertiary}>
            of {progress.totalDays}
          </Typography>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress.percentComplete}%` },
          ]}
        />
      </View>

      <View style={styles.goalFooter}>
        <Typography variant="tiny" color={colors.textTertiary}>
          Started {format(parseISO(goal.startDate), "MMM d")}
        </Typography>
        <Typography variant="tiny" color={colors.textTertiary}>
          {progress.percentComplete}% · {progress.daysLeft} days left
        </Typography>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentPrimary,
  },
  greeting: {
    gap: spacing.xs,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  toggleItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  toggleItemActive: {
    backgroundColor: colors.accentPrimary,
  },
  toggleLabel: {
    fontWeight: "600",
  },
  steppers: {
    flexDirection: "row",
    gap: spacing.md,
  },
  tipCard: {
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentPrimary,
    borderRadius: radius.md,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  goalCard: {
    gap: spacing.md,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  goalLeft: {
    gap: spacing.xs,
  },
  goalRight: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  dayCount: {
    fontSize: 22,
    fontWeight: "300",
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.full,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomPadding: {
    height: 100,
  },
});
