import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { getRecommendedTracks } from "@/lib/content";
import { useAppStore } from "@/state/app-store";

export default function CurriculumScreen() {
  const profile = useAppStore((state) => state.profile);
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const selectTrack = useAppStore((state) => state.selectTrack);

  const tracks = profile ? getRecommendedTracks(profile) : [];
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0];

  return (
    <Screen>
      <Text style={styles.eyebrow}>Curriculum</Text>
      <Text style={styles.title}>Pick the path that matches your current language direction.</Text>
      <Text style={styles.body}>
        Tracks are filtered by native language, target language, and your chosen level.
      </Text>

      {tracks.map((track) => (
        <SectionCard key={track.id}>
          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.body}>{track.description}</Text>
          <PrimaryButton
            label={selectedTrack?.id === track.id ? "Selected track" : "Use this track"}
            onPress={() => selectTrack(track.id)}
            variant={selectedTrack?.id === track.id ? "secondary" : "primary"}
          />
        </SectionCard>
      ))}

      {selectedTrack ? (
        <SectionCard>
          <Text style={styles.sectionTitle}>Modules in this track</Text>
          {selectedTrack.modules.map((module) => (
            <View key={module.id} style={styles.moduleRow}>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.body}>{module.description}</Text>
              </View>
              <PrimaryButton
                label="Open"
                onPress={() => router.push(`/module/${module.id}`)}
                variant="secondary"
              />
            </View>
          ))}
        </SectionCard>
      ) : null}
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
  trackTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 24,
    lineHeight: 30,
  },
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
  moduleRow: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  moduleText: {
    gap: 4,
  },
  moduleTitle: {
    color: theme.colors.coral,
    fontFamily: theme.typography.heading,
    fontSize: 18,
  },
});

