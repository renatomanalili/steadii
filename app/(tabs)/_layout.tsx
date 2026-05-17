import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Clock, Settings } from "lucide-react-native";
import { colors, spacing, radius } from "../../constants/theme";
import { Typography } from "../../components/ui/Typography";

type TabItemProps = {
  focused: boolean;
  label: string;
  icon: React.ReactNode;
};

function TabItem({ focused, label, icon }: TabItemProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      {icon}
      <Typography
        variant="tiny"
        color={focused ? colors.textOnAccent : colors.textTertiary}
        style={styles.tabLabel}
      >
        {label}
      </Typography>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { bottom: insets.bottom + spacing.lg },
        ],
        tabBarShowLabel: false,
        tabBarBackground: () => null,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Home"
              icon={
                <Home
                  size={16}
                  color={
                    focused
                      ? colors.textOnAccent
                      : colors.textTertiary
                  }
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="History"
              icon={
                <Clock
                  size={16}
                  color={
                    focused
                      ? colors.textOnAccent
                      : colors.textTertiary
                  }
                />
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              label="Settings"
              icon={
                <Settings
                  size={16}
                  color={
                    focused
                      ? colors.textOnAccent
                      : colors.textTertiary
                  }
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: spacing.xxl * 2,
    right: spacing.xxl * 2,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderTopWidth: 0,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
    elevation: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    paddingBottom: 0,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    minWidth: 100,
    justifyContent: "center",
  },
  tabItemActive: {
    backgroundColor: colors.accentPrimary,
  },
  tabLabel: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
