import { useState, useMemo } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react-native";
import { Typography } from "../ui/Typography";
import { EmptyState } from "../ui/EmptyState";
import { ReadingRow } from "../history/ReadingRow";
import { getBPClassification } from "../../utils/bpClassify";
import { BPReading, Goal } from "../../types";
import { colors, spacing, radius, fonts } from "../../constants/theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const LEGEND = [
  { label: "Normal", color: colors.statusNormal },
  { label: "Elevated", color: colors.statusElevated },
  { label: "Stage 1", color: colors.statusStage1 },
  { label: "Stage 2+", color: colors.statusStage2 },
];

type DayData = {
  count: number;
  color: string;
};

function buildDayMap(readings: BPReading[]): Record<string, DayData> {
  const byDay: Record<string, BPReading[]> = {};
  readings.forEach((r) => {
    const day = r.loggedAt.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(r);
  });

  const result: Record<string, DayData> = {};
  Object.entries(byDay).forEach(([day, list]) => {
    const avgSys = Math.round(
      list.reduce((s, r) => s + r.systolic, 0) / list.length,
    );
    const avgDia = Math.round(
      list.reduce((s, r) => s + r.diastolic, 0) / list.length,
    );
    result[day] = {
      count: list.length,
      color: getBPClassification(avgSys, avgDia).color,
    };
  });
  return result;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  goal: Goal;
  readings: BPReading[];
};

export function GoalCalendar({ visible, onClose, goal, readings }: Props) {
  const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dayMap = useMemo(() => buildDayMap(readings), [readings]);

  const startDay = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startDay,
    end: endOfMonth(currentMonth),
  });

  const offset = (getDay(startDay) + 6) % 7;
  const cells: (Date | null)[] = [...Array(offset).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const selectedReadings = selectedDate
    ? readings
        .filter((r) => r.loggedAt.slice(0, 10) === selectedDate)
        .sort(
          (a, b) =>
            new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime(),
        )
    : [];

  function handleMonthChange(fn: (d: Date) => Date) {
    setCurrentMonth(fn);
    setSelectedDate(null);
  }

  function handleDayPress(dayStr: string) {
    setSelectedDate((prev) => (prev === dayStr ? null : dayStr));
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Fixed header — goal label + month nav + grid */}
          <View style={styles.goalLabel}>
            <Typography variant="tiny" color={colors.textTertiary} uppercase>
              {goal.label}
            </Typography>
          </View>

          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={() => handleMonthChange((m) => subMonths(m, 1))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <Typography variant="label">
              {format(currentMonth, "MMMM yyyy")}
            </Typography>
            <TouchableOpacity
              onPress={() => handleMonthChange((m) => addMonths(m, 1))}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.row}>
            {DAYS.map((d) => (
              <View key={d} style={styles.cell}>
                <Typography variant="tiny" color={colors.textTertiary}>
                  {d}
                </Typography>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map((day, ci) => {
                if (!day) {
                  return <View key={`e-${ri}-${ci}`} style={styles.cell} />;
                }
                const dayStr = format(day, "yyyy-MM-dd");
                const data = dayMap[dayStr];
                const today = isToday(day);
                const selected = selectedDate === dayStr;

                return (
                  <TouchableOpacity
                    key={dayStr}
                    style={[
                      styles.cell,
                      styles.dayCell,
                      data && {
                        backgroundColor: `${data.color}22`,
                        borderColor: `${data.color}55`,
                      },
                      today && styles.dayCellToday,
                      selected && styles.dayCellSelected,
                    ]}
                    onPress={() => handleDayPress(dayStr)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="tiny"
                      color={
                        selected
                          ? colors.textPrimary
                          : today
                            ? colors.accentPrimary
                            : data
                              ? colors.textPrimary
                              : colors.textTertiary
                      }
                      style={styles.dateNum}
                    >
                      {format(day, "d")}
                    </Typography>
                    {data && (
                      <View
                        style={[
                          styles.countBadge,
                          { backgroundColor: data.color },
                        ]}
                      >
                        <Typography style={styles.countText}>
                          {data.count}
                        </Typography>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Legend */}
          <View style={styles.legend}>
            {LEGEND.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Typography variant="tiny" color={colors.textTertiary}>
                  {item.label}
                </Typography>
              </View>
            ))}
          </View>

          {/* Day detail */}
          {selectedDate && (
            <View style={styles.detail}>
              <View style={styles.detailDivider} />
              <Typography variant="label" style={styles.detailDate}>
                {format(parseISO(selectedDate), "EEEE, MMM d")}
              </Typography>

              {selectedReadings.length > 0 ? (
                <ScrollView
                  style={styles.detailScroll}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  <View style={styles.detailList}>
                    {selectedReadings.map((r) => (
                      <ReadingRow key={r.id} reading={r} />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <EmptyState
                  icon={<CalendarX size={32} color={colors.textTertiary} />}
                  title="No readings"
                  subtitle="Nothing was logged on this day."
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg * 2,
    borderTopRightRadius: radius.lg * 2,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderColor: colors.borderDefault,
    maxHeight: "90%",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.borderDefault,
    marginBottom: spacing.lg,
  },
  goalLabel: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCell: {
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: "transparent",
    gap: 2,
  },
  dayCellToday: {
    borderColor: colors.accentPrimary,
    borderWidth: 1,
  },
  dayCellSelected: {
    borderColor: colors.textPrimary,
    borderWidth: 1.5,
    backgroundColor: colors.card,
  },
  dateNum: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  countBadge: {
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  countText: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: "#fff",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
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
  detail: {
    marginTop: spacing.sm,
  },
  detailDivider: {
    height: 0.5,
    backgroundColor: colors.borderDefault,
    marginBottom: spacing.lg,
  },
  detailDate: {
    marginBottom: spacing.md,
  },
  detailScroll: {
    maxHeight: 240,
  },
  detailList: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
});
