import { useState } from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { Typography } from "../../components/ui/Typography";
import { ClipboardList } from "lucide-react-native";
import { WeekGroup } from "../../components/history/WeekGroup";
import { BPChart } from "../../components/history/BPChart";
import { BPStats } from "../../components/history/BPStats";
import { EmptyState } from "../../components/ui/EmptyState";
import { useReadings } from "../../hooks/useReadings";
import { colors, spacing, radius, fonts } from "../../constants/theme";

type ViewMode = "list" | "graph";

export default function History() {
  const { readings, grouped, weekKeys, loading, refresh, removeReading } = useReadings();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const header = (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerText}>
          <Typography variant="title">History</Typography>
          <Typography variant="body" color={colors.textSecondary}>
            {readings.length} reading{readings.length !== 1 ? "s" : ""} logged
          </Typography>
        </View>
        <View style={styles.toggle}>
          {(["list", "graph"] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.toggleItem,
                viewMode === mode && styles.toggleItemActive,
              ]}
              onPress={() => setViewMode(mode)}
              activeOpacity={0.8}
            >
              <Typography
                variant="tiny"
                color={
                  viewMode === mode
                    ? colors.textOnAccent
                    : colors.textSecondary
                }
                style={styles.toggleLabel}
              >
                {mode === "list" ? "List" : "Graph"}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <BPStats readings={readings} />
    </View>
  );

  if (!loading && readings.length === 0) {
    return (
      <ScreenWrapper>
        <EmptyState
          icon={<ClipboardList size={36} color={colors.textTertiary} />}
          title="No readings yet"
          subtitle="Your logged readings will appear here."
        />
      </ScreenWrapper>
    );
  }

  if (viewMode === "graph") {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor={colors.accentPrimary}
            />
          }
        >
          {header}
          <BPChart readings={readings} />
          <View style={styles.bottomPadding} />
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <FlatList
        data={weekKeys}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <WeekGroup weekLabel={item} readings={grouped[item]} onDeleteReading={removeReading} />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.accentPrimary}
          />
        }
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  header: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    gap: spacing.xs,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  toggleItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  toggleItemActive: {
    backgroundColor: colors.accentPrimary,
  },
  toggleLabel: {
    fontFamily: fonts.semibold,
  },
  separator: {
    height: spacing.lg,
  },
  bottomPadding: {
    height: 100,
  },
});
