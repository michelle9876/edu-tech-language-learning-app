import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <Screen>
      <SectionCard>
        <Text style={styles.eyebrow}>Lost page</Text>
        <Text style={styles.title}>This route is not part of the current learning map.</Text>
        <Text style={styles.body}>
          Go back to the main app and keep building your English or Korean habit.
        </Text>
        <PrimaryButton label="Go Home" onPress={() => router.replace("/(tabs)")} />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: theme.colors.accent,
    fontFamily: theme.typography.heading,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
});

