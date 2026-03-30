export type AppLanguage = "en" | "ko";

export type LanguageLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced";

export type CardType = "word" | "expression";

export type GameMode = "flashcards" | "recall" | "matching";

export type AppSession = {
  userId: string;
  email: string | null;
  provider: string | null;
  isDemo?: boolean;
};

export type NotificationPreference = {
  userId: string;
  timezone: string;
  notificationTime: string;
  notificationOptIn: boolean;
  expoPushToken?: string | null;
};

export type UserProfile = NotificationPreference & {
  completedOnboarding: boolean;
  nativeLanguage: AppLanguage;
  targetLanguage: AppLanguage;
  level: LanguageLevel;
  createdAt: string;
  updatedAt: string;
};

export type LessonObjective = {
  id: string;
  text: string;
};

export type LessonCardSeed = {
  id: string;
  type: CardType;
  front: string;
  back: string;
  example: string;
  tags: string[];
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: LanguageLevel;
  objectives: LessonObjective[];
  practicePrompt: string;
  cards: LessonCardSeed[];
};

export type CurriculumModule = {
  id: string;
  trackId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
};

export type CurriculumTrack = {
  id: string;
  nativeLanguage: AppLanguage;
  targetLanguage: AppLanguage;
  level: LanguageLevel;
  title: string;
  subtitle: string;
  description: string;
  modules: CurriculumModule[];
};

export type SavedCard = {
  id: string;
  userId: string;
  type: CardType;
  sourceLessonId: string;
  front: string;
  back: string;
  example: string;
  tags: string[];
  masteryScore: number;
  dedupeKey: string;
  createdAt: string;
  updatedAt: string;
};

export type LessonProgress = {
  userId: string;
  lessonId: string;
  completed: boolean;
  lastViewedAt: string;
  completedAt?: string | null;
};

export type GameSession = {
  id: string;
  userId: string;
  mode: GameMode;
  cardIds: string[];
  score: number;
  completedAt: string;
};

export type DailyGlossaryItem = {
  term: string;
  definition: string;
  example: string;
};

export type DailyQuizQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type DailyContentPack = {
  language: AppLanguage;
  level: LanguageLevel;
  title: string;
  body: string;
  glossary: DailyGlossaryItem[];
  quiz: DailyQuizQuestion[];
};

export type LessonCardSet = {
  lessonId: string;
  cards: LessonCardSeed[];
};

export type RemoteSnapshot = {
  profile: UserProfile | null;
  savedCards: SavedCard[];
  progress: LessonProgress[];
  dailyContent: DailyContentPack | null;
};

