import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { Typography } from "../ui/Typography";
import { colors, spacing, radius, fonts } from "../../constants/theme";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
};

export function BpmInput({ value, onChange }: Props) {
  function handleDigitPress(digit: number) {
    if (value === null) {
      onChange(digit);
      return;
    }

    const newValue = parseInt(`${value}${digit}`);
    if (newValue <= 250) {
      onChange(newValue);
    }
  }

  function handleDelete() {
    if (value === null) return;
    const str = value.toString();
    if (str.length <= 1) {
      onChange(null);
      return;
    }
    onChange(parseInt(str.slice(0, -1)));
  }

  function handleClear() {
    onChange(null);
  }

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, -1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography
          variant="tiny"
          color={colors.textTertiary}
          uppercase
        >
          Heart rate
        </Typography>
        <View style={styles.display}>
          <Typography
            variant="title"
            color={
              value !== null
                ? colors.textPrimary
                : colors.textTertiary
            }
          >
            {value !== null ? value : "---"}
          </Typography>
          <Typography variant="small" color={colors.textSecondary}>
            BPM
          </Typography>
        </View>
      </View>

      <View style={styles.keypad}>
        {digits.map((digit, index) => {
          if (digit === null) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.key}
                onPress={handleClear}
                activeOpacity={0.7}
              >
                <Typography
                  variant="small"
                  color={colors.textTertiary}
                >
                  C
                </Typography>
              </TouchableOpacity>
            );
          }

          if (digit === -1) {
            return (
              <TouchableOpacity
                key={index}
                style={styles.key}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Typography
                  variant="small"
                  color={colors.textSecondary}
                >
                  ⌫
                </Typography>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => handleDigitPress(digit)}
              activeOpacity={0.7}
            >
              <Typography
                variant="body"
                color={colors.textPrimary}
                style={styles.digitLabel}
              >
                {digit}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    overflow: "hidden",
  },
  header: {
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
  },
  display: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  key: {
    width: "33.33%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: colors.borderSubtle,
  },
  digitLabel: {
    fontFamily: fonts.regular,
  },
});
