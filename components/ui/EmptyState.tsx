import { View, StyleSheet } from "react-native";
import { Typography } from "./Typography";
import { colors, spacing } from "../../constants/theme";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>{icon}</View>
      <Typography variant="label" style={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="small"
          color={colors.textTertiary}
          style={styles.subtitle}
        >
          {subtitle}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  iconWrap: {
    marginBottom: spacing.xs,
    opacity: 0.5,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
});
