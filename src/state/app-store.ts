import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getCurriculumCatalog, getDailyContentFallback } from "@/lib/content";
import type {
  AppSession,
  CurriculumTrack,
  DailyContentPack,
  GameMode,
  GameSession,
  LessonProgress,
  RemoteSnapshot,
  SavedCard,
  UserProfile,
} from "@/types/domain";
import { isoNow } from "@/utils/date";
import { buildSavedCardDedupeKey } from "@/utils/dedupe";

type AppStore = {
  isHydrated: boolean;
  session: AppSession | null;
  profile: UserProfile | null;
  tracks: CurriculumTrack[];
  selectedTrackId: string | null;
  savedCards: SavedCard[];
  lessonProgress: LessonProgress[];
  gameSessions: GameSession[];
  dailyContent: DailyContentPack | null;
  expoPushToken: string | null;
  setHydrated: (value: boolean) => void;
  setSession: (session: AppSession | null) => void;
  completeOnboarding: (
    input: Pick<
      UserProfile,
      "nativeLanguage" | "targetLanguage" | "level" | "timezone" | "notificationTime" | "notificationOptIn"
    >,
  ) => UserProfile | null;
  mergeRemoteSnapshot: (snapshot: RemoteSnapshot) => void;
  selectTrack: (trackId: string) => void;
  saveCard: (input: Omit<SavedCard, "id" | "createdAt" | "updatedAt" | "dedupeKey" | "masteryScore">) => SavedCard;
  setSavedCards: (cards: SavedCard[]) => void;
  markLessonCompleted: (lessonId: string, completed: boolean) => LessonProgress | null;
  adjustCardMastery: (cardIds: string[], delta: number) => void;
  recordGameSession: (mode: GameMode, cardIds: string[], score: number) => GameSession | null;
  setDailyContent: (pack: DailyContentPack) => void;
  setExpoPushToken: (token: string | null) => void;
  resetLocalState: () => void;
};

const resetState = () => ({
  session: null,
  profile: null,
  tracks: getCurriculumCatalog(),
  selectedTrackId: getCurriculumCatalog()[0]?.id ?? null,
  savedCards: [] as SavedCard[],
  lessonProgress: [] as LessonProgress[],
  gameSessions: [] as GameSession[],
  dailyContent: null as DailyContentPack | null,
  expoPushToken: null as string | null,
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      ...resetState(),
      setHydrated: (value) => set({ isHydrated: value }),
      setSession: (session) => {
        if (!session) {
          set({ ...resetState(), isHydrated: true });
          return;
        }

        set({ session });
      },
      completeOnboarding: (input) => {
        const { session, tracks } = get();
        if (!session) {
          return null;
        }

        const timestamp = isoNow();
        const nextTrack =
          tracks.find(
            (track) =>
              track.nativeLanguage === input.nativeLanguage &&
              track.targetLanguage === input.targetLanguage &&
              track.level === input.level,
          ) ?? tracks[0];

        const profile: UserProfile = {
          userId: session.userId,
          completedOnboarding: true,
          nativeLanguage: input.nativeLanguage,
          targetLanguage: input.targetLanguage,
          level: input.level,
          timezone: input.timezone,
          notificationTime: input.notificationTime,
          notificationOptIn: input.notificationOptIn,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set({
          profile,
          selectedTrackId: nextTrack?.id ?? null,
          dailyContent: getDailyContentFallback(input.targetLanguage, input.level),
        });

        return profile;
      },
      mergeRemoteSnapshot: (snapshot) => {
        set((state) => ({
          profile: snapshot.profile ?? state.profile,
          savedCards: snapshot.savedCards.length > 0 ? snapshot.savedCards : state.savedCards,
          lessonProgress:
            snapshot.progress.length > 0 ? snapshot.progress : state.lessonProgress,
          dailyContent: snapshot.dailyContent ?? state.dailyContent,
        }));
      },
      selectTrack: (trackId) => set({ selectedTrackId: trackId }),
      saveCard: (input) => {
        const existing = get().savedCards.find(
          (card) => card.dedupeKey === buildSavedCardDedupeKey(input),
        );

        if (existing) {
          return existing;
        }

        const card: SavedCard = {
          ...input,
          id: `${input.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          masteryScore: 0,
          dedupeKey: buildSavedCardDedupeKey(input),
          createdAt: isoNow(),
          updatedAt: isoNow(),
        };

        set((state) => ({ savedCards: [card, ...state.savedCards] }));
        return card;
      },
      setSavedCards: (cards) => set({ savedCards: cards }),
      markLessonCompleted: (lessonId, completed) => {
        const { session } = get();
        if (!session) {
          return null;
        }

        const nextProgress: LessonProgress = {
          userId: session.userId,
          lessonId,
          completed,
          lastViewedAt: isoNow(),
          completedAt: completed ? isoNow() : null,
        };

        set((state) => ({
          lessonProgress: [
            nextProgress,
            ...state.lessonProgress.filter((item) => item.lessonId !== lessonId),
          ],
        }));

        return nextProgress;
      },
      adjustCardMastery: (cardIds, delta) =>
        set((state) => ({
          savedCards: state.savedCards.map((card) =>
            cardIds.includes(card.id)
              ? {
                  ...card,
                  masteryScore: Math.max(0, Math.min(1, Number((card.masteryScore + delta).toFixed(2)))),
                  updatedAt: isoNow(),
                }
              : card,
          ),
        })),
      recordGameSession: (mode, cardIds, score) => {
        const { session } = get();
        if (!session) {
          return null;
        }

        const gameSession: GameSession = {
          id: `${mode}-${Date.now()}`,
          userId: session.userId,
          mode,
          cardIds,
          score,
          completedAt: isoNow(),
        };

        set((state) => ({
          gameSessions: [gameSession, ...state.gameSessions],
        }));

        return gameSession;
      },
      setDailyContent: (pack) => set({ dailyContent: pack }),
      setExpoPushToken: (token) => set({ expoPushToken: token }),
      resetLocalState: () => set({ ...resetState(), isHydrated: true }),
    }),
    {
      name: "lingua-bridge-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        tracks: state.tracks,
        selectedTrackId: state.selectedTrackId,
        savedCards: state.savedCards,
        lessonProgress: state.lessonProgress,
        gameSessions: state.gameSessions,
        dailyContent: state.dailyContent,
        expoPushToken: state.expoPushToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

