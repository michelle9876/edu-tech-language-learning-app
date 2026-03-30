import { mockCurriculumTracks } from "@/data/mockCurriculum";
import { mockDailyContentPacks } from "@/data/mockDailyContent";
import type {
  CurriculumModule,
  CurriculumTrack,
  DailyContentPack,
  LanguageLevel,
  Lesson,
  SavedCard,
  UserProfile,
} from "@/types/domain";

const levelFallbackOrder: LanguageLevel[] = [
  "beginner",
  "elementary",
  "intermediate",
  "upper_intermediate",
  "advanced",
];

export const getCurriculumCatalog = () => mockCurriculumTracks;

export const getRecommendedTracks = (profile: Pick<UserProfile, "nativeLanguage" | "targetLanguage" | "level">) => {
  const exact = mockCurriculumTracks.filter(
    (track) =>
      track.nativeLanguage === profile.nativeLanguage &&
      track.targetLanguage === profile.targetLanguage &&
      track.level === profile.level,
  );

  if (exact.length > 0) {
    return exact;
  }

  const currentIndex = levelFallbackOrder.indexOf(profile.level);
  const fallbackLevels = levelFallbackOrder
    .slice(0, Math.max(currentIndex + 1, 1))
    .reverse();

  return mockCurriculumTracks.filter(
    (track) =>
      track.nativeLanguage === profile.nativeLanguage &&
      track.targetLanguage === profile.targetLanguage &&
      fallbackLevels.includes(track.level),
  );
};

export const findTrackById = (trackId: string): CurriculumTrack | undefined =>
  mockCurriculumTracks.find((track) => track.id === trackId);

export const findModuleById = (moduleId: string): CurriculumModule | undefined =>
  mockCurriculumTracks.flatMap((track) => track.modules).find((module) => module.id === moduleId);

export const findLessonById = (lessonId: string): Lesson | undefined =>
  mockCurriculumTracks
    .flatMap((track) => track.modules)
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.id === lessonId);

export const getSavedCardsForLesson = (lessonId: string, savedCards: SavedCard[]) =>
  savedCards.filter((card) => card.sourceLessonId === lessonId);

export const getDailyContentFallback = (
  language: UserProfile["targetLanguage"],
  level: UserProfile["level"],
): DailyContentPack =>
  mockDailyContentPacks[`${language}-${level}`] ??
  mockDailyContentPacks[`${language}-beginner`];

export const buildGameDeck = (savedCards: SavedCard[], size = 8) =>
  [...savedCards].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, size);

