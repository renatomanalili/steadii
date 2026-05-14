import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { colors, typography, spacing, radius } from "../../constants/theme";

export default function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup</Text>
      <Text style={styles.subtitle}>Let's configure your profile.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding/goal")}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.accentPrimary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  buttonText: {
    ...typography.label,
    color: colors.textOnAccent,
  },
});
