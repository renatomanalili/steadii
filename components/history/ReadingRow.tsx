import { View, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Typography } from "../ui/Typography";
import { getBPClassification } from "../../utils/bpClassify";
import {
  formatReadingDate,
  formatReadingTime,
} from "../../utils/dateHelpers";
import { BPReading } from "../../types";
import { colors, spacing, radius, fonts } from "../../constants/theme";

type Props = {
  reading: BPReading;
  onDelete?: (id: number) => void;
};

export function ReadingRow({ reading, onDelete }: Props) {
  const classification = getBPClassification(
    reading.systolic,
    reading.diastolic,
  );

  function handleLongPress() {
    if (!onDelete) return;
    Alert.alert(
      "Delete reading?",
      `${reading.systolic}/${reading.diastolic} mmHg · ${formatReadingDate(reading.loggedAt)} ${formatReadingTime(reading.loggedAt)}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(reading.id),
        },
      ],
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(300)}>
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleLongPress}
      delayLongPress={400}
      activeOpacity={onDelete ? 0.7 : 1}
    >
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: classification.color }]} />
        <View style={styles.dateContainer}>
          <Typography variant="small">
            {formatReadingDate(reading.loggedAt)}
          </Typography>
          <View style={styles.timeRow}>
            <Typography variant="tiny" color={colors.textTertiary}>
              {formatReadingTime(reading.loggedAt)}
            </Typography>
            <View style={styles.periodBadge}>
              <Typography variant="tiny" color={colors.textTertiary}>
                {reading.period}
              </Typography>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <Typography variant="body" style={styles.reading}>
          {reading.systolic}
          <Typography variant="small" color={colors.textTertiary}>
            {" "}/ {reading.diastolic}
          </Typography>
        </Typography>
        <View style={styles.meta}>
          {reading.bpm !== null && (
            <Typography variant="tiny" color={colors.textTertiary}>
              {reading.bpm} bpm
            </Typography>
          )}
          <View
            style={[
              styles.statusPill,
              { backgroundColor: `${classification.color}26` },
            ]}
          >
            <Typography variant="tiny" style={{ color: classification.color }}>
              {classification.label}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  dateContainer: {
    gap: spacing.xs,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  periodBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  reading: {
    fontFamily: fonts.semibold,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
});
