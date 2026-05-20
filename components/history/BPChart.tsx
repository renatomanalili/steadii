import { View, StyleSheet } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { Circle } from "@shopify/react-native-skia";
import { format, parseISO } from "date-fns";
import { Typography } from "../ui/Typography";
import { BPReading } from "../../types";
import { colors, spacing, radius } from "../../constants/theme";

type Props = {
  readings: BPReading[];
};

type ChartPoint = {
  index: number;
  systolic: number;
  diastolic: number;
};

const CHART_HEIGHT = 220;

export function BPChart({ readings }: Props) {
  const sorted = [...readings]
    .sort(
      (a, b) =>
        new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime(),
    )
    .slice(-20);

  const data: ChartPoint[] = sorted.map((r, i) => ({
    index: i,
    systolic: r.systolic,
    diastolic: r.diastolic,
  }));

  const dateRange =
    sorted.length >= 2
      ? `${format(parseISO(sorted[0].loggedAt), "MMM d")} – ${format(parseISO(sorted[sorted.length - 1].loggedAt), "MMM d")}`
      : sorted.length === 1
        ? format(parseISO(sorted[0].loggedAt), "MMM d")
        : "";

  return (
    <View style={styles.container}>
      {/* Chart */}
      <View style={styles.chartContainer}>
        {data.length >= 2 ? (
          <CartesianChart
            data={data}
            xKey="index"
            yKeys={["systolic", "diastolic"]}
            domain={{ y: [40, 200] }}
            domainPadding={{ left: 16, right: 16, top: 16, bottom: 8 }}
          >
            {({ points }) => (
              <>
                <Line
                  points={points.systolic}
                  color={colors.accentPrimary}
                  strokeWidth={2}
                  animate={{ type: "spring", duration: 400 }}
                />
                {points.systolic.map((p, i) =>
                  p.x != null && p.y != null ? (
                    <Circle
                      key={`sys-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      color={colors.accentPrimary}
                    />
                  ) : null,
                )}
                <Line
                  points={points.diastolic}
                  color={colors.textSecondary}
                  strokeWidth={2}
                  animate={{ type: "spring", duration: 400 }}
                />
                {points.diastolic.map((p, i) =>
                  p.x != null && p.y != null ? (
                    <Circle
                      key={`dia-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      color={colors.textSecondary}
                    />
                  ) : null,
                )}
              </>
            )}
          </CartesianChart>
        ) : (
          <View style={styles.notEnough}>
            <Typography variant="small" color={colors.textTertiary}>
              Add at least 2 readings to see the chart.
            </Typography>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.accentPrimary }]} />
          <Typography variant="tiny" color={colors.textSecondary}>Systolic</Typography>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textSecondary }]} />
          <Typography variant="tiny" color={colors.textSecondary}>Diastolic</Typography>
        </View>
        {dateRange ? (
          <Typography variant="tiny" color={colors.textTertiary} style={styles.dateRange}>
            {dateRange}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  chartContainer: {
    height: CHART_HEIGHT,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  notEnough: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dateRange: {
    marginLeft: "auto",
  },
});
