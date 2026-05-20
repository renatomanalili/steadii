import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Clock, Settings } from "lucide-react-native";
import { colors, spacing, radius, fonts } from "../../constants/theme";
import { Typography } from "../../components/ui/Typography";

// Uncomment after: sudo chown -R $(whoami) node_modules/packages && npm install expo-blur --legacy-peer-deps
// import { BlurView } from "expo-blur";

const TABS = [
  {
    name: "home",
    label: "Home",
    Icon: Home,
  },
  {
    name: "history",
    label: "History",
    Icon: Clock,
  },
  {
    name: "settings",
    label: "Settings",
    Icon: Settings,
  },
] as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View
          style={[
            styles.wrapper,
            { bottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.pill}>
            {/* Glass background — swap View for BlurView once expo-blur is installed */}
            <View style={StyleSheet.absoluteFill}>
              <View style={styles.glass} />
            </View>

            {TABS.map((tab, index) => {
              const focused = state.index === index;
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.tabItem, focused && styles.tabItemActive]}
                  onPress={() => navigation.navigate(tab.name)}
                  activeOpacity={0.8}
                >
                  <tab.Icon
                    size={16}
                    color={
                      focused ? colors.textOnAccent : colors.textSecondary
                    }
                  />
                  <Typography
                    variant="tiny"
                    color={
                      focused ? colors.textOnAccent : colors.textSecondary
                    }
                    style={styles.label}
                  >
                    {tab.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  glass: {
    flex: 1,
    backgroundColor: "rgba(22, 28, 46, 0.85)",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
  },
  tabItemActive: {
    backgroundColor: colors.accentPrimary,
  },
  label: {
    fontFamily: fonts.semibold,
    letterSpacing: 0.3,
  },
});
