import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { Typography } from "../ui/Typography";
import { colors, radius, spacing } from "../../constants/theme";

type Props = {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
};

export function StepperCard({
  label,
  value,
  onIncrement,
  onDecrement,
  min = 40,
  max = 250,
}: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.button}
        onPress={onIncrement}
        disabled={value >= max}
        activeOpacity={0.8}
      >
        <Plus
          size={24}
          color={
            value >= max ? colors.textTertiary : colors.textOnAccent
          }
        />
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Typography variant="hero" style={styles.value}>
          {value}
        </Typography>
        <Typography
          variant="tiny"
          color={colors.textSecondary}
          uppercase
        >
          {label}
        </Typography>
        <Typography variant="tiny" color={colors.textTertiary}>
          mmHg
        </Typography>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onDecrement}
        disabled={value <= min}
        activeOpacity={0.8}
      >
        <Minus
          size={24}
          color={
            value <= min ? colors.textTertiary : colors.textOnAccent
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  button: {
    width: "100%",
    height: 52,
    backgroundColor: colors.accentPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  valueContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  value: {
    fontSize: 72,
    fontWeight: "300",
    color: colors.textPrimary,
    lineHeight: 80,
  },
});
