import type { Session } from "@supabase/supabase-js";

import { getCurriculumCatalog, getDailyContentFallback } from "@/lib/content";
import { supabase } from "@/lib/supabase";
import type {
  AppLanguage,
  AppSession,
  CurriculumTrack,
  DailyContentPack,
  GameSession,
  LessonProgress,
  RemoteSnapshot,
  SavedCard,
  UserProfile,
} from "@/types/domain";
import { isoNow } from "@/utils/date";
import { buildSavedCardDedupeKey } from "@/utils/dedupe";

type DbProfile = {
  user_id: string;
  completed_onboarding: boolean;
  native_language: AppLanguage;
  target_language: AppLanguage;
  level: UserProfile["level"];
  timezone: string;
  notification_time: string;
  notification_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

type DbSavedCard = {
  id: string;
  user_id: string;
  type: SavedCard["type"];
  source_lesson_id: string;
  front: string;
  back: string;
  example: string;
  tags: string[];
  mastery_score: number;
  dedupe_key: string;
  created_at: string;
  updated_at: string;
};

type DbLessonProgress = {
  user_id: string;
  lesson_id: string;
  completed: boolean;
  last_viewed_at: string;
  completed_at: string | null;
};

const mapProfile = (profile: DbProfile): UserProfile => ({
  userId: profile.user_id,
  completedOnboarding: profile.completed_onboarding,
  nativeLanguage: profile.native_language,
  targetLanguage: profile.target_language,
  level: profile.level,
  timezone: profile.timezone,
  notificationTime: profile.notification_time,
  notificationOptIn: profile.notification_opt_in,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

const mapSavedCard = (card: DbSavedCard): SavedCard => ({
  id: card.id,
  userId: card.user_id,
  type: card.type,
  sourceLessonId: card.source_lesson_id,
  front: card.front,
  back: card.back,
  example: card.example,
  tags: card.tags,
  masteryScore: card.mastery_score,
  dedupeKey: card.dedupe_key,
  createdAt: card.created_at,
  updatedAt: card.updated_at,
});

const mapProgress = (progress: DbLessonProgress): LessonProgress => ({
  userId: progress.user_id,
  lessonId: progress.lesson_id,
  completed: progress.completed,
  lastViewedAt: progress.last_viewed_at,
  completedAt: progress.completed_at,
});

export const createDemoSession = (): AppSession => ({
  userId: "demo-user",
  email: "demo@saylo.local",
  provider: "demo",
  isDemo: true,
});

export const mapSupabaseSession = (session: Session | null): AppSession | null => {
  if (!session?.user) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    provider: session.user.app_metadata.provider ?? null,
  };
};

export const getCatalog = async (): Promise<CurriculumTrack[]> => getCurriculumCatalog();

export const hydrateRemoteState = async (userId: string): Promise<RemoteSnapshot> => {
  if (!supabase) {
    return {
      profile: null,
      savedCards: [],
      progress: [],
      dailyContent: null,
    };
  }

  const [profileResult, cardsResult, progressResult] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("saved_cards").select("*").eq("user_id", userId),
    supabase.from("lesson_progress").select("*").eq("user_id", userId),
  ]);

  return {
    profile: profileResult.data ? mapProfile(profileResult.data as DbProfile) : null,
    savedCards: ((cardsResult.data ?? []) as DbSavedCard[]).map(mapSavedCard),
    progress: ((progressResult.data ?? []) as DbLessonProgress[]).map(mapProgress),
    dailyContent: null,
  };
};

export const upsertUserProfile = async (profile: UserProfile) => {
  if (!supabase || profile.userId === "demo-user") {
    return;
  }

  await supabase.from("user_profiles").upsert({
    user_id: profile.userId,
    completed_onboarding: profile.completedOnboarding,
    native_language: profile.nativeLanguage,
    target_language: profile.targetLanguage,
    level: profile.level,
    timezone: profile.timezone,
    notification_time: profile.notificationTime,
    notification_opt_in: profile.notificationOptIn,
    updated_at: isoNow(),
  });
};

export const upsertSavedCard = async (card: SavedCard) => {
  if (!supabase || card.userId === "demo-user") {
    return;
  }

  await supabase.from("saved_cards").upsert(
    {
      id: card.id,
      user_id: card.userId,
      type: card.type,
      source_lesson_id: card.sourceLessonId,
      front: card.front,
      back: card.back,
      example: card.example,
      tags: card.tags,
      mastery_score: card.masteryScore,
      dedupe_key: card.dedupeKey || buildSavedCardDedupeKey(card),
      updated_at: isoNow(),
    },
    { onConflict: "user_id,dedupe_key" },
  );
};

export const upsertLessonProgress = async (progress: LessonProgress) => {
  if (!supabase || progress.userId === "demo-user") {
    return;
  }

  await supabase.from("lesson_progress").upsert(
    {
      user_id: progress.userId,
      lesson_id: progress.lessonId,
      completed: progress.completed,
      last_viewed_at: progress.lastViewedAt,
      completed_at: progress.completedAt ?? null,
    },
    { onConflict: "user_id,lesson_id" },
  );
};

export const createGameSession = async (session: GameSession) => {
  if (!supabase || session.userId === "demo-user") {
    return;
  }

  await supabase.from("game_sessions").insert({
    id: session.id,
    user_id: session.userId,
    mode: session.mode,
    card_ids: session.cardIds,
    score: session.score,
    completed_at: session.completedAt,
  });
};

export const fetchDailyContent = async (profile: UserProfile): Promise<DailyContentPack> => {
  if (!supabase || profile.userId === "demo-user") {
    return getDailyContentFallback(profile.targetLanguage, profile.level);
  }

  const response = await supabase.functions.invoke("daily-content", {
    body: {
      userId: profile.userId,
      language: profile.targetLanguage,
      level: profile.level,
      timezone: profile.timezone,
      slotLabel: "primary",
    },
  });

  if (response.error || !response.data) {
    return getDailyContentFallback(profile.targetLanguage, profile.level);
  }

  return response.data as DailyContentPack;
};

export const registerPushToken = async (input: {
  userId: string;
  expoPushToken: string;
  platform: string;
}) => {
  if (!supabase || input.userId === "demo-user") {
    return;
  }

  await supabase.from("user_push_tokens").upsert(
    {
      user_id: input.userId,
      expo_push_token: input.expoPushToken,
      platform: input.platform,
      last_seen_at: isoNow(),
    },
    { onConflict: "expo_push_token" },
  );
};

export const requestAccountDeletion = async () => {
  if (!supabase) {
    return;
  }

  await supabase.functions.invoke("delete-account", {
    body: {},
  });
};
