import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

export const SectionCard = ({ children }: PropsWithChildren) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
    gap: theme.spacing.sm,
  },
});

