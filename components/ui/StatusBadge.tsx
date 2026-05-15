import { View, StyleSheet, ViewStyle } from "react-native";
import { Typography } from "./Typography";
import { radius, spacing } from "../../constants/theme";
import { getBPClassification } from "../../utils/bpClassify";

type Props = {
  systolic: number;
  diastolic: number;
  style?: ViewStyle;
};

export function StatusBadge({ systolic, diastolic, style }: Props) {
  const classification = getBPClassification(systolic, diastolic);

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: `${classification.color}26`,
          borderColor: `${classification.color}66`,
        },
        style,
      ]}
    >
      <Typography
        variant="small"
        style={[styles.label, { color: classification.color }]}
      >
        {classification.label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    alignSelf: "stretch",
  },
  label: {
    fontWeight: "600",
  },
});
