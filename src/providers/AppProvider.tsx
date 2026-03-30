import type { PropsWithChildren } from "react";
import { Manrope_600SemiBold, Manrope_700Bold, useFonts as useManropeFonts } from "@expo-google-fonts/manrope";
import {
  NotoSansKR_400Regular,
  NotoSansKR_700Bold,
  useFonts as useNotoSansKRFonts,
} from "@expo-google-fonts/noto-sans-kr";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { fetchDailyContent, hydrateRemoteState, mapSupabaseSession, registerPushToken } from "@/lib/repository";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/state/app-store";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [manropeLoaded] = useManropeFonts({
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [notoLoaded] = useNotoSansKRFonts({
    NotoSansKR_400Regular,
    NotoSansKR_700Bold,
  });

  const setSession = useAppStore((state) => state.setSession);
  const mergeRemoteSnapshot = useAppStore((state) => state.mergeRemoteSnapshot);
  const profile = useAppStore((state) => state.profile);
  const setDailyContent = useAppStore((state) => state.setDailyContent);
  const setExpoPushToken = useAppStore((state) => state.setExpoPushToken);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const mappedSession = mapSupabaseSession(data.session);
      setSession(mappedSession);

      if (mappedSession) {
        const snapshot = await hydrateRemoteState(mappedSession.userId);
        mergeRemoteSnapshot(snapshot);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const mappedSession = mapSupabaseSession(session);
      setSession(mappedSession);

      if (mappedSession) {
        const snapshot = await hydrateRemoteState(mappedSession.userId);
        mergeRemoteSnapshot(snapshot);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mergeRemoteSnapshot, setSession]);

  useEffect(() => {
    if (!profile?.notificationOptIn) {
      return;
    }

    registerForPushNotificationsAsync().then(async (token) => {
      if (!token || !profile) {
        return;
      }

      setExpoPushToken(token);
      await registerPushToken({
        userId: profile.userId,
        expoPushToken: token,
        platform: "expo",
      });
    });
  }, [profile, setExpoPushToken]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    fetchDailyContent(profile).then(setDailyContent).catch(() => undefined);
  }, [profile, setDailyContent]);

  useEffect(() => {
    if (manropeLoaded && notoLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [manropeLoaded, notoLoaded]);

  if (!manropeLoaded || !notoLoaded) {
    return null;
  }

  return <>{children}</>;
};
