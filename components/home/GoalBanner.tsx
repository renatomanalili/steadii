import { useState, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react-native";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { GoalCalendar } from "./GoalCalendar";
import { useGoal } from "../../hooks/useGoal";
import { BPReading, Goal } from "../../types";
import { colors, spacing, radius } from "../../constants/theme";

type Props = {
  goal: Goal;
  readings: BPReading[];
};

export function GoalBanner({ goal, readings }: Props) {
  const { progress } = useGoal();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loggedDays = useMemo(() => {
    const startStr = goal.startDate.slice(0, 10);
    const uniqueDays = new Set(
      readings
        .filter((r) => r.loggedAt.slice(0, 10) >= startStr)
        .map((r) => r.loggedAt.slice(0, 10)),
    );
    return uniqueDays.size;
  }, [readings, goal.startDate]);

  if (!progress) return null;

  return (
    <>
      <TouchableOpacity onPress={() => setCalendarOpen(true)} activeOpacity={0.85}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <Typography variant="tiny" color={colors.textTertiary} uppercase>
                Tracking program
              </Typography>
              <Typography variant="label">{goal.label}</Typography>
            </View>
            <View style={styles.right}>
              <Typography
                variant="title"
                color={colors.accentPrimary}
                style={styles.dayCount}
              >
                Day {loggedDays}
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

          <View style={styles.footer}>
            <Typography variant="tiny" color={colors.textTertiary}>
              Started {format(parseISO(goal.startDate), "MMM d")}
            </Typography>
            <View style={styles.footerRight}>
              <CalendarDays size={12} color={colors.textTertiary} />
              <Typography variant="tiny" color={colors.textTertiary}>
                {progress.percentComplete}% · {progress.daysLeft} days left
              </Typography>
            </View>
          </View>
        </Card>
      </TouchableOpacity>

      <GoalCalendar
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        goal={goal}
        readings={readings}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  left: {
    gap: spacing.xs,
  },
  right: {
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
