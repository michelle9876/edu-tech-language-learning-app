import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { gameModeLabels } from "@/constants/options";
import { buildGameDeck } from "@/lib/content";
import { useAppStore } from "@/state/app-store";
import type { GameMode } from "@/types/domain";

const modes: GameMode[] = ["flashcards", "recall", "matching"];

export default function GamesScreen() {
  const savedCards = useAppStore((state) => state.savedCards);
  const deck = buildGameDeck(savedCards);

  return (
    <Screen>
      <Text style={styles.eyebrow}>Games</Text>
      <Text style={styles.title}>Review should feel light, fast, and repeatable.</Text>
      <Text style={styles.body}>
        Each mode uses your saved cards first, so the practice becomes more personal as you learn.
      </Text>

      {savedCards.length === 0 ? (
        <SectionCard>
          <Text style={styles.emptyTitle}>Save cards to unlock games</Text>
          <Text style={styles.body}>
            Start from a lesson, keep the expressions you want, and come back here for practice.
          </Text>
          <PrimaryButton label="Open lessons" onPress={() => router.push("/curriculum")} />
        </SectionCard>
      ) : (
        <SectionCard>
          <Text style={styles.sectionTitle}>Ready deck</Text>
          <Text style={styles.body}>
            {deck.length} cards are ready, starting with the ones that need the most repetition.
          </Text>
        </SectionCard>
      )}

      {modes.map((mode) => (
        <SectionCard key={mode}>
          <Text style={styles.modeTitle}>{gameModeLabels[mode].title}</Text>
          <Text style={styles.body}>{gameModeLabels[mode].subtitle}</Text>
          <View style={styles.ctaRow}>
            <PrimaryButton
              label="Start"
              onPress={() => router.push(`/game/${mode}`)}
              disabled={savedCards.length === 0}
            />
          </View>
        </SectionCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    marginTop: theme.spacing.lg,
    color: theme.colors.accent,
    fontFamily: theme.typography.heading,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 30,
    lineHeight: 36,
  },
  body: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  modeTitle: {
    color: theme.colors.coral,
    fontFamily: theme.typography.display,
    fontSize: 24,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 24,
  },
  ctaRow: {
    marginTop: 6,
  },
});
