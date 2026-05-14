import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { colors, spacing } from "../../constants/theme";

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
};

export function ScreenWrapper({
  children,
  scrollable = true,
  padded = true,
}: Props) {
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            padded && styles.padded,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, padded && styles.padded]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
});
