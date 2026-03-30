import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { findModuleById } from "@/lib/content";
import { useAppStore } from "@/state/app-store";

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const moduleId = Array.isArray(id) ? id[0] : id;
  const module = moduleId ? findModuleById(moduleId) : undefined;
  const lessonProgress = useAppStore((state) => state.lessonProgress);

  if (!module) {
    return (
      <Screen>
        <SectionCard>
          <Text style={styles.moduleTitle}>Module not found</Text>
          <PrimaryButton label="Back to curriculum" onPress={() => router.replace("/curriculum")} />
        </SectionCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.eyebrow}>Module</Text>
      <Text style={styles.title}>{module.title}</Text>
      <Text style={styles.body}>{module.description}</Text>

      <SectionCard>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {module.lessons.map((lesson) => {
          const completed = lessonProgress.some((item) => item.lessonId === lesson.id && item.completed);
          return (
            <View key={lesson.id} style={styles.lessonRow}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.body}>{lesson.summary}</Text>
              <Text style={styles.meta}>
                {lesson.estimatedMinutes} min • {lesson.difficulty.replace("_", " ")} •{" "}
                {completed ? "completed" : "up next"}
              </Text>
              <PrimaryButton label="Open lesson" onPress={() => router.push(`/lesson/${lesson.id}`)} />
            </View>
          );
        })}
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
  moduleTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 24,
  },
  lessonRow: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  lessonTitle: {
    color: theme.colors.coral,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  meta: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 13,
  },
});
