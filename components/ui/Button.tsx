import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import {
  colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";
import { Typography } from "./Typography";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  labelStyle,
  fullWidth = true,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary"
              ? colors.textOnAccent
              : colors.accentPrimary
          }
        />
      ) : (
        <Typography
          variant="body"
          style={[
            styles.label,
            styles[
              `${variant}Label` as keyof typeof styles
            ] as TextStyle,
            labelStyle,
          ]}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: colors.accentPrimary,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: "600",
  },
  primaryLabel: {
    color: colors.textOnAccent,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  ghostLabel: {
    color: colors.textSecondary,
  },
});
