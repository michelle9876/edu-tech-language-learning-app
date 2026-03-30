import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChoiceChip } from "@/components/ChoiceChip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { languageOptions, levelOptions } from "@/constants/options";
import { upsertUserProfile } from "@/lib/repository";
import { useAppStore } from "@/state/app-store";
import type { AppLanguage, LanguageLevel } from "@/types/domain";
import { formatNotificationLabel, getCurrentTimezone } from "@/utils/date";

const notificationTimes = ["08:00", "12:30", "18:00", "20:30"];

export default function OnboardingScreen() {
  const [nativeLanguage, setNativeLanguage] = useState<AppLanguage>("ko");
  const [targetLanguage, setTargetLanguage] = useState<AppLanguage>("en");
  const [level, setLevel] = useState<LanguageLevel>("beginner");
  const [notificationTime, setNotificationTime] = useState("20:30");
  const [notificationOptIn, setNotificationOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const canSubmit = nativeLanguage !== targetLanguage && !submitting;

  const handleSubmit = async () => {
    const profile = completeOnboarding({
      nativeLanguage,
      targetLanguage,
      level,
      timezone: getCurrentTimezone(),
      notificationTime,
      notificationOptIn,
    });

    if (!profile) {
      return;
    }

    setSubmitting(true);

    try {
      await upsertUserProfile(profile);
      router.replace("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Onboarding</Text>
      <Text style={styles.title}>Shape the first learning path around your actual goal.</Text>
      <Text style={styles.body}>
        Choose the language you speak now, the language you want to learn, your level, and your
        preferred daily check-in time.
      </Text>

      <SectionCard>
        <Text style={styles.sectionTitle}>Your native language</Text>
        <View style={styles.row}>
          {languageOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={nativeLanguage === option.value}
              onPress={() => setNativeLanguage(option.value)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Target language</Text>
        <View style={styles.row}>
          {languageOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={targetLanguage === option.value}
              onPress={() => setTargetLanguage(option.value)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Current level</Text>
        <View style={styles.wrapRow}>
          {levelOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={level === option.value}
              onPress={() => setLevel(option.value)}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Daily reminder time</Text>
        <Text style={styles.body}>You’ll receive two micro-learning pushes near this local-time window.</Text>
        <View style={styles.wrapRow}>
          {notificationTimes.map((time) => (
            <ChoiceChip
              key={time}
              label={formatNotificationLabel(time)}
              selected={notificationTime === time}
              onPress={() => setNotificationTime(time)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Notification preference</Text>
        <View style={styles.row}>
          <ChoiceChip
            label="Keep notifications on"
            selected={notificationOptIn}
            onPress={() => setNotificationOptIn(true)}
          />
          <ChoiceChip
            label="I’ll decide later"
            selected={!notificationOptIn}
            onPress={() => setNotificationOptIn(false)}
          />
        </View>
      </SectionCard>

      {!canSubmit ? (
        <Text style={styles.error}>Your native language and target language need to be different.</Text>
      ) : null}

      <PrimaryButton
        label={submitting ? "Preparing your curriculum..." : "Start learning"}
        onPress={handleSubmit}
        disabled={!canSubmit}
      />
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
  sectionTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: theme.typography.body,
    fontSize: 13,
  },
});

