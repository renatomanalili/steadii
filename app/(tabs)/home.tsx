import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
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
import { GoalBanner } from "../../components/home/GoalBanner";
import { colors, spacing, radius, fonts } from "../../constants/theme";

export default function Home() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">(() =>
    new Date().getHours() < 12 ? "AM" : "PM",
  );
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [bpm, setBpm] = useState<number | null>(null);

  const {
    readings,
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
      const storedName = await AsyncStorage.getItem("steadii_name");
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
        <Animated.View
          entering={FadeInDown.delay(0).duration(500).springify()}
        >
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
        </Animated.View>

        {/* Greeting */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(500).springify()}
        >
          <View style={styles.greeting}>
            <Typography variant="title">
              {name
                ? `Hey, ${name.split(" ")[0]} 👋`
                : "Hey there 👋"}
            </Typography>
            <Typography variant="body" color={colors.textSecondary}>
              How are you feeling today?
            </Typography>
          </View>
        </Animated.View>

        {/* Goal Banner */}
        {activeGoal && (
          <Animated.View
            entering={FadeInDown.delay(160).duration(500).springify()}
          >
            <GoalBanner goal={activeGoal} readings={readings} />
          </Animated.View>
        )}

        {/* AM/PM Toggle */}
        <Animated.View
          entering={FadeInDown.delay(260).duration(500).springify()}
        >
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
        </Animated.View>

        {/* Steppers */}
        <Animated.View
          entering={FadeInDown.delay(310).duration(500).springify()}
          style={styles.steppers}
        >
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
        </Animated.View>

        {/* Classification Badge */}
        <Animated.View
          entering={FadeInDown.delay(360).duration(500).springify()}
        >
          <ClassificationBadge
            systolic={systolic}
            diastolic={diastolic}
          />
        </Animated.View>

        {/* BPM Input */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500).springify()}
        >
          <BpmInput value={bpm} onChange={setBpm} />
        </Animated.View>

        {/* Save Button */}
        <Animated.View
          entering={FadeInDown.delay(440).duration(500).springify()}
        >
          <Button
            label="Save reading"
            onPress={handleSave}
            loading={saving}
          />
        </Animated.View>

        {/* Tip of the Day */}
        <Animated.View
          entering={FadeInDown.delay(520).duration(500).springify()}
        >
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
        </Animated.View>

        {/* Bottom padding for floating tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
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
    fontFamily: fonts.semibold,
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
  bottomPadding: {
    height: 100,
  },
});
