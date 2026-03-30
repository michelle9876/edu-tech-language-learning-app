import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import type { SavedCard } from "@/types/domain";

type CardPreviewProps = {
  card: SavedCard;
};

export const CardPreview = ({ card }: CardPreviewProps) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.badge}>{card.type === "word" ? "Word" : "Expression"}</Text>
      <Text style={styles.mastery}>{Math.round(card.masteryScore * 100)}%</Text>
    </View>
    <Text style={styles.front}>{card.front}</Text>
    <Text style={styles.back}>{card.back}</Text>
    <Text style={styles.example}>{card.example}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffdf9",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: theme.colors.surfaceStrong,
    color: theme.colors.ink,
    borderRadius: theme.radius.pill,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: theme.typography.heading,
    fontSize: 12,
  },
  mastery: {
    color: theme.colors.accent,
    fontFamily: theme.typography.heading,
    fontSize: 12,
  },
  front: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  back: {
    color: theme.colors.coral,
    fontFamily: theme.typography.bodyBold,
    fontSize: 15,
  },
  example: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 13,
    lineHeight: 19,
  },
});

