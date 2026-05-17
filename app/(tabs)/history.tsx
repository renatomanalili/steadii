import { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { WeekGroup } from "../../components/history/WeekGroup";
import { getAllReadings } from "../../db/readings";
import { groupReadingsByWeek } from "../../utils/dateHelpers";
import { BPReading } from "../../types";
import { colors, spacing } from "../../constants/theme";

export default function History() {
  const [readings, setReadings] = useState<BPReading[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReadings();
    }, []),
  );

  async function loadReadings() {
    try {
      const all = await getAllReadings();
      setReadings(all);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadReadings();
    setRefreshing(false);
  }

  const grouped = groupReadingsByWeek(readings);
  const weekKeys = Object.keys(grouped);

  if (readings.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.empty}>
          <Typography variant="title">No readings yet</Typography>
          <Typography
            variant="body"
            color={colors.textSecondary}
            style={styles.emptySubtitle}
          >
            Your logged readings will appear here, grouped by week.
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <FlatList
        data={weekKeys}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <WeekGroup weekLabel={item} readings={grouped[item]} />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accentPrimary}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Typography variant="title">History</Typography>
            <Typography variant="body" color={colors.textSecondary}>
              {readings.length} reading
              {readings.length !== 1 ? "s" : ""} logged
            </Typography>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 22,
  },
  separator: {
    height: spacing.xxl,
  },
  bottomPadding: {
    height: 100,
  },
});
