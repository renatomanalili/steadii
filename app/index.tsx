import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export default function Index() {
  useEffect(() => {
    checkOnboarding();
  }, []);

  async function checkOnboarding() {
    await AsyncStorage.clear();
    try {
      const onboarded = await AsyncStorage.getItem(
        "@steadii/onboarded",
      );
      if (onboarded === "true") {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/onboarding/welcome");
      }
    } catch {
      router.replace("/onboarding/welcome");
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accentPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
