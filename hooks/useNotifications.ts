import { useState, useEffect } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@steadii/reminders_enabled";

async function requestPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function scheduleReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Morning check-in",
      body: "Time to log your morning blood pressure reading.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Evening check-in",
      body: "Don't forget your evening blood pressure reading.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => setEnabled(!!val));
  }, []);

  async function toggle(value: boolean) {
    setLoading(true);
    try {
      if (value) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permission required",
            "Enable notifications for Steadii in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }
        await scheduleReminders();
        await AsyncStorage.setItem(STORAGE_KEY, "true");
        setEnabled(true);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem(STORAGE_KEY);
        setEnabled(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return { enabled, loading, toggle };
}
