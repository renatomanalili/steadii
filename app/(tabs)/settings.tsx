import { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearDatabase } from "../../db/client";
import {
  User,
  Target,
  Bell,
  ChevronRight,
  LogOut,
  Trophy,
} from "lucide-react-native";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { Card } from "../../components/ui/Card";
import { useGoal } from "../../hooks/useGoal";
import { useReadings } from "../../hooks/useReadings";
import { useNotifications } from "../../hooks/useNotifications";
import { colors, spacing, radius } from "../../constants/theme";

export default function Settings() {
  const [name, setName] = useState("");
  const { activeGoal, pastGoals } = useGoal();
  const { readings } = useReadings();
  const { enabled: notificationsEnabled, toggle: toggleNotifications } = useNotifications();

  const loggedDays = useMemo(() => {
    if (!activeGoal) return 0;
    const startStr = activeGoal.startDate.slice(0, 10);
    const uniqueDays = new Set(
      readings
        .filter((r) => r.loggedAt.slice(0, 10) >= startStr)
        .map((r) => r.loggedAt.slice(0, 10)),
    );
    return uniqueDays.size;
  }, [readings, activeGoal]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function loadData() {
    try {
      const storedName = await AsyncStorage.getItem("steadii_name");
      if (storedName) setName(storedName);
    } catch (error) {
      console.error(error);
    }
  }

  function handleResetOnboarding() {
    Alert.alert(
      "Reset app",
      "This will clear all your data and restart the onboarding. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await Promise.all([
              AsyncStorage.clear(),
              clearDatabase(),
            ]);
            router.replace("/onboarding/welcome");
          },
        },
      ],
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Typography variant="title" style={styles.pageTitle}>
          Settings
        </Typography>

        {/* Profile */}
        <View style={styles.section}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
            style={styles.sectionLabel}
          >
            Profile
          </Typography>
          <Card>
            <SettingsRow
              icon={<User size={16} color={colors.accentPrimary} />}
              label="Name"
              value={name}
            />
          </Card>
        </View>

        {/* Tracking Goal */}
        <View style={styles.section}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
            style={styles.sectionLabel}
          >
            Tracking goal
          </Typography>
          <Card style={styles.goalCard}>
            {activeGoal ? (
              <View style={styles.activeGoal}>
                <View style={styles.activeGoalLeft}>
                  <Target size={16} color={colors.accentPrimary} />
                  <View style={styles.activeGoalText}>
                    <Typography variant="small">
                      {activeGoal.label}
                    </Typography>
                    {loggedDays > 0 && (
                      <Typography
                        variant="tiny"
                        color={colors.accentPrimary}
                      >
                        Day {loggedDays} of {activeGoal.durationDays}
                      </Typography>
                    )}
                  </View>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.newGoalRow}
                onPress={() => router.push("/onboarding/goal")}
                activeOpacity={0.8}
              >
                <Target size={16} color={colors.textTertiary} />
                <Typography
                  variant="small"
                  color={colors.textSecondary}
                >
                  Start a new goal
                </Typography>
                <ChevronRight size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </Card>

          {pastGoals.length > 0 && (
            <Card style={styles.pastGoals}>
              <View style={styles.pastGoalsHeader}>
                <Trophy size={14} color={colors.textTertiary} />
                <Typography
                  variant="tiny"
                  color={colors.textTertiary}
                  uppercase
                >
                  Completed goals
                </Typography>
              </View>
              {pastGoals.map((goal) => (
                <View key={goal.id} style={styles.pastGoalRow}>
                  <Typography variant="small">
                    {goal.label}
                  </Typography>
                  <Typography
                    variant="tiny"
                    color={colors.textTertiary}
                  >
                    {goal.durationDays} days
                  </Typography>
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            uppercase
            style={styles.sectionLabel}
          >
            App
          </Typography>
          <Card>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Bell size={16} color={colors.accentPrimary} />
                <View style={styles.switchText}>
                  <Typography variant="small">
                    Daily reminder
                  </Typography>
                  <Typography
                    variant="tiny"
                    color={colors.textSecondary}
                  >
                    Get notified to log your BP
                  </Typography>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: colors.card,
                  true: colors.accentPrimary,
                }}
                thumbColor={colors.textPrimary}
              />
            </View>
          </Card>
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetOnboarding}
          activeOpacity={0.8}
        >
          <LogOut size={16} color={colors.statusStage2} />
          <Typography variant="small" color={colors.statusStage2}>
            Reset app data
          </Typography>
        </TouchableOpacity>

        <Typography
          variant="tiny"
          color={colors.textTertiary}
          style={styles.version}
        >
          Steadii v1.0.0 · Not a medical device
        </Typography>
      </View>
    </ScreenWrapper>
  );
}

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
};

function SettingsRow({
  icon,
  label,
  value,
  onPress,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.settingsRowLeft}>
        {icon}
        <Typography variant="small">{label}</Typography>
      </View>
      <View style={styles.settingsRowRight}>
        {value && (
          <Typography variant="small" color={colors.textSecondary}>
            {value}
          </Typography>
        )}
        {onPress && (
          <ChevronRight size={16} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  pageTitle: {
    marginBottom: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: spacing.xs,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  settingsRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  goalCard: {
    gap: spacing.md,
  },
  activeGoal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeGoalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  activeGoalText: {
    gap: spacing.xs,
  },
  newGoalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pastGoals: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  pastGoalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pastGoalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderDefault,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  switchText: {
    gap: spacing.xs,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: `${colors.statusStage2}66`,
    backgroundColor: `${colors.statusStage2}15`,
  },
  version: {
    textAlign: "center",
  },
});
