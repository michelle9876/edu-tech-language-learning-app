import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { gameModeLabels } from "@/constants/options";
import { buildGameDeck } from "@/lib/content";
import { createGameSession } from "@/lib/repository";
import { useAppStore } from "@/state/app-store";
import type { GameMode } from "@/types/domain";

const asMode = (value: string): GameMode => {
  if (value === "recall" || value === "matching" || value === "flashcards") {
    return value;
  }
  return "flashcards";
};

export default function GameModeScreen() {
  const { mode } = useLocalSearchParams<{ mode: string | string[] }>();
  const rawMode = Array.isArray(mode) ? mode[0] : mode;
  const gameMode = asMode(rawMode ?? "flashcards");
  const savedCards = useAppStore((state) => state.savedCards);
  const recordGameSession = useAppStore((state) => state.recordGameSession);
  const adjustCardMastery = useAppStore((state) => state.adjustCardMastery);

  const deck = buildGameDeck(savedCards, 6);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentCard = deck[index];

  if (!currentCard) {
    return (
      <Screen>
        <SectionCard>
          <Text style={styles.sectionTitle}>No review deck ready</Text>
          <Text style={styles.body}>Save a few cards from lessons first, then come back here.</Text>
          <PrimaryButton label="Go save cards" onPress={() => router.replace("/curriculum")} />
        </SectionCard>
      </Screen>
    );
  }

  const baseOptions = gameMode === "matching" ? deck.map((card) => card.front) : deck.map((card) => card.back);
  const options = [...baseOptions.slice(index), ...baseOptions.slice(0, index)];

  const finish = async (finalScore: number) => {
    const session = recordGameSession(gameMode, deck.map((card) => card.id), finalScore);
    adjustCardMastery(deck.map((card) => card.id), finalScore >= 70 ? 0.12 : 0.04);
    if (session) {
      await createGameSession(session);
    }
    router.replace("/games");
  };

  const moveNext = async (correct: boolean) => {
    const nextScore = correct ? score + Math.round(100 / deck.length) : score;
    setScore(nextScore);

    if (index === deck.length - 1) {
      await finish(nextScore);
      return;
    }

    setIndex(index + 1);
    setSelectedOption(null);
    setRevealed(false);
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Game mode</Text>
      <Text style={styles.title}>{gameModeLabels[gameMode].title}</Text>
      <Text style={styles.body}>{gameModeLabels[gameMode].subtitle}</Text>

      <SectionCard>
        <Text style={styles.progress}>
          Card {index + 1}/{deck.length} • Score {score}
        </Text>

        {gameMode === "flashcards" ? (
          <>
            <Text style={styles.front}>{currentCard.front}</Text>
            <Text style={styles.body}>{revealed ? currentCard.back : "Tap reveal when you’re ready."}</Text>
            <Text style={styles.example}>{revealed ? currentCard.example : ""}</Text>
            {!revealed ? (
              <PrimaryButton label="Reveal answer" onPress={() => setRevealed(true)} />
            ) : (
              <>
                <PrimaryButton label="I knew it" onPress={() => moveNext(true)} />
                <PrimaryButton label="Need more review" onPress={() => moveNext(false)} variant="secondary" />
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.front}>
              {gameMode === "matching" ? currentCard.back : currentCard.front}
            </Text>
            <Text style={styles.body}>
              {gameMode === "matching"
                ? "Pick the Korean or English expression that matches this meaning."
                : "Choose the correct meaning or translation."}
            </Text>
            {options.map((option) => {
              const isCorrect = option === (gameMode === "matching" ? currentCard.front : currentCard.back);
              const isSelected = selectedOption === option;
              return (
                <Pressable
                  key={option}
                  onPress={async () => {
                    if (selectedOption) {
                      return;
                    }
                    setSelectedOption(option);
                    await moveNext(isCorrect);
                  }}
                  style={[
                    styles.option,
                    isSelected && styles.selectedOption,
                    isSelected && isCorrect && styles.correctOption,
                  ]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              );
            })}
          </>
        )}
      </SectionCard>
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
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  body: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  progress: {
    color: theme.colors.accent,
    fontFamily: theme.typography.heading,
    fontSize: 14,
  },
  front: {
    color: theme.colors.coral,
    fontFamily: theme.typography.display,
    fontSize: 28,
    lineHeight: 32,
  },
  example: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 13,
  },
  option: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  selectedOption: {
    borderColor: theme.colors.accent,
  },
  correctOption: {
    backgroundColor: theme.colors.accentSoft,
  },
  optionText: {
    color: theme.colors.ink,
    fontFamily: theme.typography.body,
    fontSize: 15,
  },
});
