import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionCard } from "@/components/SectionCard";
import { StatChip } from "@/components/StatChip";
import { theme } from "@/constants/theme";
import { signInWithApple, signInWithGoogle } from "@/lib/auth";
import { env } from "@/lib/env";
import { createDemoSession } from "@/lib/repository";
import { useAppStore } from "@/state/app-store";

export default function SignInScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const setSession = useAppStore((state) => state.setSession);

  const runAuth = async (runner: () => Promise<void>) => {
    try {
      setBusy(true);
      setStatus(null);
      await runner();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.eyebrow}>Lingua Bridge</Text>
      <Text style={styles.title}>Learn English and Korean in one focused daily loop.</Text>
      <Text style={styles.body}>
        Build your curriculum, save useful words and expressions, then keep them alive with games
        and daily study prompts.
      </Text>

      <SectionCard>
        <Text style={styles.cardTitle}>MVP flow included</Text>
        <Text style={styles.body}>
          Sign in, choose your language level, move through lessons, save cards, and revisit them
          in quick game sessions.
        </Text>
        <Text style={styles.cardCaption}>Apple Sign-In stays enabled for iOS review compliance.</Text>

        <PrimaryButton
          label={busy ? "Connecting..." : "Continue with Google"}
          disabled={busy}
          onPress={() => runAuth(signInWithGoogle)}
        />
        <PrimaryButton
          label={busy ? "Connecting..." : "Continue with Apple"}
          disabled={busy}
          onPress={() => runAuth(signInWithApple)}
          variant="secondary"
        />

        {env.allowDemoAuth ? (
          <PrimaryButton
            label="Open Demo Workspace"
            disabled={busy}
            onPress={() => setSession(createDemoSession())}
            variant="ghost"
          />
        ) : null}

        {status ? <Text style={styles.error}>{status}</Text> : null}
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardTitle}>What learners see right away</Text>
        <Text style={styles.body}>
          Short lessons, saved expression cards, and one calm dashboard for daily learning momentum.
        </Text>
        <Text style={styles.rowTitle}>MVP pillars</Text>
        <Text style={styles.pillList}>Login • Onboarding • Curriculum • Cards • Games • Daily content</Text>
        <Text style={styles.rowTitle}>Targeted habits</Text>
        <Text style={styles.pillList}>2 daily notifications • light review • clear progression</Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.cardTitle}>North-star metrics</Text>
        <Text style={styles.body}>Track the habit, not just raw screen time.</Text>
        <StatChip label="Onboarding" value="D0" />
        <StatChip label="Save Card" value="Core" />
        <StatChip label="Retention" value="D7" />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    marginTop: theme.spacing.lg,
    color: theme.colors.accent,
    fontFamily: theme.typography.heading,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.typography.display,
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 23,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 20,
  },
  cardCaption: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 13,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: theme.typography.body,
    fontSize: 13,
  },
  rowTitle: {
    color: theme.colors.ink,
    fontFamily: theme.typography.heading,
    fontSize: 14,
    marginTop: 4,
  },
  pillList: {
    color: theme.colors.inkMuted,
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
});

