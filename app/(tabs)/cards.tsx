import { StyleSheet, Text } from "react-native";

import { CardPreview } from "@/components/CardPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { useAppStore } from "@/state/app-store";
import { router } from "expo-router";

export default function CardsScreen() {
  const savedCards = useAppStore((state) => state.savedCards);

  return (
    <Screen>
      <Text style={styles.eyebrow}>Card bank</Text>
      <Text style={styles.title}>Keep the most useful words and expressions close.</Text>
      <Text style={styles.body}>
        Saved cards are stored for repeat review and prioritized by lower mastery first.
      </Text>

      {savedCards.length === 0 ? (
        <SectionCard>
          <Text style={styles.emptyTitle}>No saved cards yet</Text>
          <Text style={styles.body}>
            Open any lesson and tap save on the vocabulary or expression cards you want to keep.
          </Text>
          <PrimaryButton label="Go to curriculum" onPress={() => router.push("/curriculum")} />
        </SectionCard>
      ) : (
        <SectionCard>
          <Text style={styles.sectionTitle}>Saved for later recall</Text>
          {savedCards.map((card) => (
            <CardPreview key={card.id} card={card} />
          ))}
        </SectionCard>
      )}
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
    marginBottom: 4,
  },
  emptyTitle: {
    color: theme.colors.coral,
    fontFamily: theme.typography.display,
    fontSize: 24,
  },
});
