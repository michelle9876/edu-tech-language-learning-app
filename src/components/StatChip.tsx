import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

type StatChipProps = {
  label: string;
  value: string;
};

export const StatChip = ({ label, value }: StatChipProps) => (
  <View style={styles.container}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minWidth: 92,
    gap: 4,
  },
  value: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  label: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
});

