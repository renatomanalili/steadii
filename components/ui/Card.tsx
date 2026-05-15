import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../../constants/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padded?: boolean;
};

export function Card({
  children,
  style,
  elevated = false,
  padded = true,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        elevated ? styles.elevated : styles.surface,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  elevated: {
    backgroundColor: colors.card,
  },
  padded: {
    padding: spacing.lg,
  },
});
