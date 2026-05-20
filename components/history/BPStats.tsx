import { View, StyleSheet } from "react-native";
import { Typography } from "../ui/Typography";
import { getBPClassification } from "../../utils/bpClassify";
import { BPReading } from "../../types";
import { colors, spacing, radius } from "../../constants/theme";

type Props = {
  readings: BPReading[];
};

export function BPStats({ readings }: Props) {
  if (readings.length === 0) return null;

  const avgSystolic = Math.round(
    readings.reduce((s, r) => s + r.systolic, 0) / readings.length,
  );
  const avgDiastolic = Math.round(
    readings.reduce((s, r) => s + r.diastolic, 0) / readings.length,
  );
  const classification = getBPClassification(avgSystolic, avgDiastolic);

  return (
    <View style={styles.container}>
      {/* Row 1: Systolic + Diastolic side by side */}
      <View style={styles.row}>
        <View style={[styles.statCard, styles.statCardLeft]}>
          <Typography variant="tiny" color={colors.textTertiary} uppercase>
            Avg Systolic
          </Typography>
          <View style={styles.valueRow}>
            <Typography variant="title" style={{ color: colors.accentPrimary }}>
              {avgSystolic}
            </Typography>
            <Typography variant="tiny" color={colors.textTertiary}>
              mmHg
            </Typography>
          </View>
        </View>

        <View style={[styles.statCard, styles.statCardRight]}>
          <Typography variant="tiny" color={colors.textTertiary} uppercase>
            Avg Diastolic
          </Typography>
          <View style={styles.valueRow}>
            <Typography variant="title" style={{ color: colors.textSecondary }}>
              {avgDiastolic}
            </Typography>
            <Typography variant="tiny" color={colors.textTertiary}>
              mmHg
            </Typography>
          </View>
        </View>
      </View>

      {/* Row 2: Status */}
      <View
        style={[
          styles.statusRow,
          {
            backgroundColor: `${classification.color}15`,
            borderColor: `${classification.color}40`,
          },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: classification.color },
          ]}
        />
        <Typography variant="small" style={{ color: classification.color }}>
          {classification.label}
        </Typography>
        <Typography variant="tiny" color={colors.textTertiary} style={styles.readingCount}>
          based on {readings.length} reading{readings.length !== 1 ? "s" : ""}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  statCardLeft: {},
  statCardRight: {},
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    padding: spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  readingCount: {
    marginLeft: "auto",
  },
});
