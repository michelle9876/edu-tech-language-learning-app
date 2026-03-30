import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";
import { AppProvider } from "@/providers/AppProvider";
import { useAppStore } from "@/state/app-store";

const RootNavigator = () => {
  const router = useRouter();
  const segments = useSegments();
  const isHydrated = useAppStore((state) => state.isHydrated);
  const session = useAppStore((state) => state.session);
  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const topSegment = segments[0];
    const inAuthGroup = topSegment === "(auth)";
    const inOnboardingGroup = topSegment === "(onboarding)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      return;
    }

    if (session && !profile?.completedOnboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)");
      return;
    }

    if (session && profile?.completedOnboarding && (inAuthGroup || inOnboardingGroup)) {
      router.replace("/(tabs)");
    }
  }, [isHydrated, profile?.completedOnboarding, router, segments, session]);

  if (!isHydrated) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="module/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="game/[mode]" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});

