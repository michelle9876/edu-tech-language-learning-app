import { router } from "expo-router";
import { Alert, StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { theme } from "@/constants/theme";
import { signOut } from "@/lib/auth";
import { requestAccountDeletion } from "@/lib/repository";
import { useAppStore } from "@/state/app-store";
import { formatNotificationLabel } from "@/utils/date";

export default function SettingsScreen() {
  const profile = useAppStore((state) => state.profile);
  const resetLocalState = useAppStore((state) => state.resetLocalState);
  const setSession = useAppStore((state) => state.setSession);

  const handleSignOut = async () => {
    await signOut();
    resetLocalState();
    setSession(null);
    router.replace("/(auth)/sign-in");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete account?",
      "This should remove your profile, saved cards, progress, and push token registrations.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await requestAccountDeletion();
            await handleSignOut();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Settings</Text>
      <Text style={styles.title}>Keep the learning habit aligned with your real life.</Text>

      <SectionCard>
        <Text style={styles.sectionTitle}>Learning profile</Text>
        <Text style={styles.body}>Native language: {profile?.nativeLanguage ?? "-"}</Text>
        <Text style={styles.body}>Target language: {profile?.targetLanguage ?? "-"}</Text>
        <Text style={styles.body}>Level: {profile?.level ?? "-"}</Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.body}>
          Status: {profile?.notificationOptIn ? "enabled" : "disabled"}
        </Text>
        <Text style={styles.body}>
          Preferred time: {profile ? formatNotificationLabel(profile.notificationTime) : "-"}
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Account actions</Text>
        <PrimaryButton label="Sign out" onPress={handleSignOut} variant="secondary" />
        <PrimaryButton label="Delete account" onPress={handleDelete} />
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
});

