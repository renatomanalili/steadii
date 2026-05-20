import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Typography } from "../ui/Typography";
import { getBPClassification } from "../../utils/bpClassify";
import { radius, spacing, fonts } from "../../constants/theme";

type Props = {
  systolic: number;
  diastolic: number;
};

export function ClassificationBadge({ systolic, diastolic }: Props) {
  const classification = getBPClassification(systolic, diastolic);

  return (
    <Animated.View
      key={classification.label}
      entering={FadeIn.duration(350)}
      style={[
        styles.container,
        {
          backgroundColor: `${classification.color}26`,
          borderColor: `${classification.color}66`,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: classification.color },
        ]}
      />
      <Typography
        variant="small"
        style={[styles.label, { color: classification.color }]}
      >
        {classification.label}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: "stretch",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: fonts.semibold,
  },
});
