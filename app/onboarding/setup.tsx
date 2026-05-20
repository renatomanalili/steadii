import { useState } from "react";
import { View, TextInput, Switch, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { colors, spacing, radius } from "../../constants/theme";

export default function SetupScreen() {
  const [name, setName] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await AsyncStorage.setItem("steadii_name", name.trim());
      await AsyncStorage.setItem(
        "@steadii/reminder_time",
        reminderEnabled ? reminderTime : "",
      );
      router.push("/onboarding/goal");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="title">Let's set you up</Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.subtitle}
          >
            Just a few quick things before you start tracking.
          </Typography>
        </View>

        <View style={styles.fields}>
          <View style={styles.fieldGroup}>
            <Typography
              variant="tiny"
              color={colors.textTertiary}
              uppercase
              style={styles.fieldLabel}
            >
              Your name
            </Typography>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Juan dela Cruz"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <Card style={styles.reminderCard}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderLeft}>
                <Typography variant="body">Daily reminder</Typography>
                <Typography
                  variant="small"
                  color={colors.textSecondary}
                >
                  Get notified to log your BP
                </Typography>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{
                  false: colors.card,
                  true: colors.accentPrimary,
                }}
                thumbColor={colors.textPrimary}
              />
            </View>

            {reminderEnabled && (
              <View style={styles.timeRow}>
                <Typography
                  variant="tiny"
                  color={colors.textTertiary}
                  uppercase
                >
                  Reminder time
                </Typography>
                <Typography
                  variant="body"
                  color={colors.accentPrimary}
                >
                  {reminderTime}
                </Typography>
              </View>
            )}
          </Card>
        </View>

        <View style={styles.footer}>
          <Button
            label="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={!name.trim()}
          />
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
  fields: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    color: colors.textPrimary,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  reminderCard: {
    gap: spacing.md,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reminderLeft: {
    gap: spacing.xs,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderDefault,
  },
  footer: {
    gap: spacing.md,
    marginTop: "auto",
  },
});
