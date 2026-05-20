import { View, StyleSheet } from "react-native";
import { Typography } from "../ui/Typography";
import { ReadingRow } from "./ReadingRow";
import { BPReading } from "../../types";
import { colors, spacing } from "../../constants/theme";

type Props = {
  weekLabel: string;
  readings: BPReading[];
  onDeleteReading?: (id: number) => void;
};

export function WeekGroup({ weekLabel, readings, onDeleteReading }: Props) {
  const avgSystolic = Math.round(
    readings.reduce((sum, r) => sum + r.systolic, 0) /
      readings.length,
  );
  const avgDiastolic = Math.round(
    readings.reduce((sum, r) => sum + r.diastolic, 0) /
      readings.length,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          variant="tiny"
          color={colors.textTertiary}
          uppercase
        >
          Week of {weekLabel}
        </Typography>
        <Typography variant="tiny" color={colors.textSecondary}>
          Avg {avgSystolic}/{avgDiastolic}
        </Typography>
      </View>

      <View style={styles.readings}>
        {readings.map((reading) => (
          <ReadingRow key={reading.id} reading={reading} onDelete={onDeleteReading} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
  },
  readings: {
    gap: spacing.sm,
  },
});
