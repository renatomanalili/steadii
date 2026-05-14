import { Text, StyleSheet, TextStyle } from "react-native";
import { colors, typography } from "../../constants/theme";

type Variant = "hero" | "title" | "body" | "label" | "small" | "tiny";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: TextStyle;
  uppercase?: boolean;
};

export function Typography({
  children,
  variant = "body",
  color = colors.textPrimary,
  style,
  uppercase = false,
}: Props) {
  return (
    <Text
      style={[
        styles.base,
        typography[variant],
        { color },
        uppercase && styles.uppercase,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
  uppercase: {
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});
