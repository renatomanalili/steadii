import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { colors, spacing, fonts } from "../../constants/theme";

export default function WelcomeScreen() {
  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconContainer}>
            <View style={styles.iconInner} />
          </View>
          <Typography variant="hero" style={styles.appName}>
            Steadii
          </Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.tagline}
          >
            Stay steady.
          </Typography>
        </View>

        <View style={styles.features}>
          <FeatureRow
            emoji="🩺"
            text="Track your blood pressure daily"
          />
          <FeatureRow
            emoji="📋"
            text="Follow your doctor's program"
          />
          <FeatureRow
            emoji="📊"
            text="Generate reports for your doctor"
          />
          <FeatureRow
            emoji="🧠"
            text="Smart insights powered by Apple Intelligence"
          />
        </View>

        <View style={styles.footer}>
          <Button
            label="Get started"
            onPress={() => router.push("/onboarding/setup")}
          />
          <Typography
            variant="tiny"
            color={colors.textTertiary}
            style={styles.disclaimer}
          >
            Not a medical device. Always consult your doctor.
          </Typography>
        </View>
      </View>
    </ScreenWrapper>
  );
}

type FeatureRowProps = {
  emoji: string;
  text: string;
};

function FeatureRow({ emoji, text }: FeatureRowProps) {
  return (
    <View style={styles.featureRow}>
      <Typography variant="body" style={styles.emoji}>
        {emoji}
      </Typography>
      <Typography
        variant="body"
        color={colors.textSecondary}
        style={styles.featureText}
      >
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacing.xxl,
  },
  hero: {
    alignItems: "center",
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  iconInner: {
    width: 40,
    height: 3,
    backgroundColor: colors.accentPrimary,
    borderRadius: 2,
  },
  appName: {
    fontSize: 42,
    fontFamily: fonts.light,
    letterSpacing: 2,
  },
  tagline: {
    letterSpacing: 1,
  },
  features: {
    gap: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  emoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  footer: {
    gap: spacing.md,
  },
  disclaimer: {
    textAlign: "center",
  },
});
