import type { AppLanguage, GameMode, LanguageLevel } from "@/types/domain";

export const languageOptions: { label: string; value: AppLanguage }[] = [
  { label: "English", value: "en" },
  { label: "Korean", value: "ko" },
];

export const levelOptions: { label: string; value: LanguageLevel }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Elementary", value: "elementary" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Upper-Intermediate", value: "upper_intermediate" },
  { label: "Advanced", value: "advanced" },
];

export const gameModeLabels: Record<GameMode, { title: string; subtitle: string }> = {
  flashcards: {
    title: "Flashcards",
    subtitle: "Reveal, remember, and rate confidence quickly.",
  },
  recall: {
    title: "Recall Quiz",
    subtitle: "Choose the correct translation from focused options.",
  },
  matching: {
    title: "Matching Sprint",
    subtitle: "Pair terms and meanings under light time pressure.",
  },
};

