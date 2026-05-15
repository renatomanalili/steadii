import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, ActivitySquare, Clock } from "lucide-react-native";
import { colors, spacing, radius } from "../../constants/theme";
import { Typography } from "../../components/ui/Typography";

const TABS = [
  { name: "home", label: "Home", Icon: Home },
  { name: "log", label: "Log", Icon: ActivitySquare },
  { name: "history", label: "History", Icon: Clock },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { bottom: insets.bottom + spacing.lg }]}>
      {TABS.map(({ name, label, Icon }, index) => {
        const focused = state.index === index;
        return (
          <TouchableOpacity
            key={name}
            style={[styles.tabItem, focused && styles.tabItemActive]}
            onPress={() => navigation.navigate(name)}
            activeOpacity={0.8}
          >
            <Icon
              size={16}
              color={focused ? colors.textOnAccent : colors.textTertiary}
            />
            <Typography
              variant="tiny"
              color={focused ? colors.textOnAccent : colors.textTertiary}
              style={styles.tabLabel}
            >
              {label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="log" />
      <Tabs.Screen name="history" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: spacing.xxl,
    right: spacing.xxl,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    minWidth: 80,
  },
  tabItemActive: {
    backgroundColor: colors.accentPrimary,
  },
  tabLabel: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
