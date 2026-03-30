import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { StatChip } from "@/components/StatChip";
import { theme } from "@/constants/theme";
import { findTrackById } from "@/lib/content";
import { useAppStore } from "@/state/app-store";

export default function DashboardScreen() {
  const profile = useAppStore((state) => state.profile);
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const lessonProgress = useAppStore((state) => state.lessonProgress);
  const savedCards = useAppStore((state) => state.savedCards);
  const dailyContent = useAppStore((state) => state.dailyContent);

  const track = selectedTrackId ? findTrackById(selectedTrackId) : undefined;
  const firstModule = track?.modules[0];
  const firstLesson = firstModule?.lessons[0];
  const completedLessons = lessonProgress.filter((item) => item.completed).length;

  return (
    <Screen>
      <Text style={styles.eyebrow}>Today’s loop</Text>
      <Text style={styles.title}>
        {profile?.targetLanguage === "en" ? "English habit, one step at a time." : "한국어 습관을 매일 조금씩 쌓아가요."}
      </Text>
      <Text style={styles.body}>
        Move through one focused lesson, save the best expressions, then bring them back in a quick
        review game.
      </Text>

      <View style={styles.statsRow}>
        <StatChip label="Completed" value={String(completedLessons)} />
        <StatChip label="Saved Cards" value={String(savedCards.length)} />
        <StatChip label="Track" value={track ? track.level.replace("_", " ") : "Setup"} />
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>Recommended next lesson</Text>
        <Text style={styles.lessonTitle}>{firstLesson?.title ?? "Finish onboarding to unlock lessons"}</Text>
        <Text style={styles.body}>
          {firstLesson?.summary ??
            "Choose a native language, target language, and level to start the first curriculum track."}
        </Text>
        {firstLesson ? (
          <PrimaryButton
            label="Open lesson"
            onPress={() => router.push(`/lesson/${firstLesson.id}`)}
          />
        ) : null}
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Daily content pack</Text>
        <Text style={styles.lessonTitle}>{dailyContent?.title ?? "Loading today’s learning pack..."}</Text>
        <Text style={styles.body}>{dailyContent?.body ?? "We’ll use your level and target language to fill this in."}</Text>
        <PrimaryButton label="Go to card bank" onPress={() => router.push("/cards")} variant="secondary" />
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <PrimaryButton label="Browse curriculum" onPress={() => router.push("/curriculum")} />
        <PrimaryButton label="Practice games" onPress={() => router.push("/games")} variant="secondary" />
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
    fontSize: 32,
    lineHeight: 38,
  },
  body: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  lessonTitle: {
    color: theme.colors.coral,
    fontFamily: theme.typography.display,
    fontSize: 24,
    lineHeight: 28,
  },
});
