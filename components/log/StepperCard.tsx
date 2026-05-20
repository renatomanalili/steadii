import { useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Minus, Plus } from "lucide-react-native";
import { Typography } from "../ui/Typography";
import { colors, radius, spacing, fonts } from "../../constants/theme";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ticksRef = useRef(0);

  const scale = useSharedValue(1);
  const animatedValueStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.14, { duration: 70 }),
      withSpring(1, { stiffness: 300, damping: 15 }),
    );
  }, [value]);

  function startRepeat(action: () => void) {
    ticksRef.current = 0;
    intervalRef.current = setInterval(() => {
      action();
      ticksRef.current += 1;
      // Accelerate after 8 ticks — clear and restart at a faster rate
      if (ticksRef.current === 8) {
        clearInterval(intervalRef.current!);
        intervalRef.current = setInterval(action, 60);
      }
    }, 150);
  }

  function stopRepeat() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    ticksRef.current = 0;
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.button}
        onPress={onIncrement}
        onLongPress={() => startRepeat(onIncrement)}
        onPressOut={stopRepeat}
        delayLongPress={300}
        disabled={value >= max}
        activeOpacity={0.8}
      >
        <Plus
          size={24}
          color={value >= max ? colors.textTertiary : colors.textOnAccent}
        />
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Animated.View style={animatedValueStyle}>
          <Typography variant="hero" style={styles.value}>
            {value}
          </Typography>
        </Animated.View>
        <Typography variant="tiny" color={colors.textSecondary} uppercase>
          {label}
        </Typography>
        <Typography variant="tiny" color={colors.textTertiary}>
          mmHg
        </Typography>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onDecrement}
        onLongPress={() => startRepeat(onDecrement)}
        onPressOut={stopRepeat}
        delayLongPress={300}
        disabled={value <= min}
        activeOpacity={0.8}
      >
        <Minus
          size={24}
          color={value <= min ? colors.textTertiary : colors.textOnAccent}
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
    fontFamily: fonts.light,
    color: colors.textPrimary,
    lineHeight: 80,
  },
});
