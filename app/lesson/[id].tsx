import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { findLessonById, getSavedCardsForLesson } from "@/lib/content";
import { upsertLessonProgress, upsertSavedCard } from "@/lib/repository";
import { useAppStore } from "@/state/app-store";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessonId ? findLessonById(lessonId) : undefined;
  const session = useAppStore((state) => state.session);
  const savedCards = useAppStore((state) => state.savedCards);
  const saveCard = useAppStore((state) => state.saveCard);
  const markLessonCompleted = useAppStore((state) => state.markLessonCompleted);

  if (!lesson || !session) {
    return (
      <Screen>
        <SectionCard>
          <Text style={styles.sectionTitle}>Lesson unavailable</Text>
          <PrimaryButton label="Back to curriculum" onPress={() => router.replace("/curriculum")} />
        </SectionCard>
      </Screen>
    );
  }

  const lessonSavedCards = getSavedCardsForLesson(lesson.id, savedCards);

  return (
    <Screen>
      <Text style={styles.eyebrow}>Lesson</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.body}>{lesson.summary}</Text>

      <SectionCard>
        <Text style={styles.sectionTitle}>Objectives</Text>
        {lesson.objectives.map((objective) => (
          <Text key={objective.id} style={styles.bullet}>
            • {objective.text}
          </Text>
        ))}
        <Text style={styles.practice}>Practice prompt: {lesson.practicePrompt}</Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Save vocabulary and expressions</Text>
        {lesson.cards.map((card) => {
          const alreadySaved = lessonSavedCards.some((saved) => saved.front === card.front && saved.back === card.back);
          return (
            <View key={card.id} style={styles.cardRow}>
              <Text style={styles.cardFront}>{card.front}</Text>
              <Text style={styles.cardBack}>{card.back}</Text>
              <Text style={styles.body}>{card.example}</Text>
              <PrimaryButton
                label={alreadySaved ? "Saved" : "Save card"}
                variant={alreadySaved ? "secondary" : "primary"}
                onPress={async () => {
                  const saved = saveCard({
                    userId: session.userId,
                    type: card.type,
                    sourceLessonId: lesson.id,
                    front: card.front,
                    back: card.back,
                    example: card.example,
                    tags: card.tags,
                  });
                  await upsertSavedCard(saved);
                }}
              />
            </View>
          );
        })}
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Lesson progress</Text>
        <PrimaryButton
          label="Mark lesson complete"
          onPress={async () => {
            const progress = markLessonCompleted(lesson.id, true);
            if (progress) {
              await upsertLessonProgress(progress);
            }
          }}
        />
        <PrimaryButton
          label="Practice saved cards now"
          onPress={() => router.push("/games")}
          variant="secondary"
        />
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
  bullet: {
    color: theme.colors.ink,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  practice: {
    color: theme.colors.coral,
    fontFamily: theme.typography.bodyBold,
    fontSize: 14,
  },
  cardRow: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  cardFront: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  cardBack: {
    color: theme.colors.coral,
    fontFamily: theme.typography.bodyBold,
    fontSize: 15,
  },
});
