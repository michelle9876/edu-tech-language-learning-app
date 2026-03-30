import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
}>;

export const Screen = ({ children, scroll = true, padded = true }: ScreenProps) => {
  const content = (
    <View style={[styles.content, padded && styles.padded]}>
      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="always"
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  blobOne: {
    position: "absolute",
    top: -90,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: theme.colors.surfaceStrong,
  },
  blobTwo: {
    position: "absolute",
    top: 140,
    left: -70,
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: theme.colors.accentSoft,
    opacity: 0.55,
  },
});

