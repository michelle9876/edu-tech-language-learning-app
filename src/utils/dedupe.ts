import type { CardType } from "@/types/domain";

const normalize = (value: string) => value.trim().toLowerCase();

export const buildSavedCardDedupeKey = (input: {
  sourceLessonId: string;
  type: CardType;
  front: string;
  back: string;
}) =>
  [input.sourceLessonId, input.type, normalize(input.front), normalize(input.back)].join("::");

