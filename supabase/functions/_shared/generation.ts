import { createStructuredResponse } from "./openai.ts";
import { dailyContentPackFormat, lessonCardSetFormat, type DailyContentPack, type LanguageLevel, type LessonCardSet } from "./schemas.ts";

export const openAiModels = {
  review: Deno.env.get("OPENAI_REVIEW_MODEL") ?? "gpt-5.4",
  dailyContent: Deno.env.get("OPENAI_DAILY_CONTENT_MODEL") ?? "gpt-5-mini",
  lessonCards: Deno.env.get("OPENAI_CARD_SET_MODEL") ?? "gpt-5-mini",
  tagging: Deno.env.get("OPENAI_TAGGING_MODEL") ?? "gpt-5-nano",
} as const;

const dailyFallback = (language: DailyContentPack["language"], level: LanguageLevel): DailyContentPack => ({
  language,
  level,
  title:
    language === "en"
      ? "Daily English fallback"
      : "오늘의 한국어 fallback",
  body:
    language === "en"
      ? "Use one saved expression in a new sentence today, then replay it aloud twice."
      : "오늘은 저장한 표현 하나를 골라 새로운 문장으로 바꿔 말해 보세요.",
  glossary: [
    {
      term: language === "en" ? "review" : "복습",
      definition: language === "en" ? "to study again" : "study again",
      example: language === "en" ? "I review three cards every day." : "매일 카드 세 장을 복습해요.",
    },
    {
      term: language === "en" ? "habit" : "습관",
      definition: language === "en" ? "something repeated regularly" : "something you do regularly",
      example: language === "en" ? "A small habit grows over time." : "작은 습관이 쌓이면 커져요.",
    },
  ],
  quiz: [
    {
      prompt: language === "en" ? "What does review mean?" : "‘복습’은 무슨 뜻인가요?",
      options:
        language === "en"
          ? ["To study again", "To delete", "To cook", "To skip"]
          : ["study again", "skip class", "buy coffee", "open the app"],
      answer: language === "en" ? "To study again" : "study again",
      explanation:
        language === "en"
          ? "Review means going back over something you learned before."
          : "복습은 전에 배운 내용을 다시 보는 것이에요.",
    },
  ],
});

export const generateDailyContent = async (input: {
  language: DailyContentPack["language"];
  level: LanguageLevel;
}): Promise<DailyContentPack> => {
  try {
    return await createStructuredResponse<DailyContentPack>({
      model: openAiModels.dailyContent,
      instructions:
        "You generate one short mobile-friendly language-learning content pack for a bilingual learning app. Keep the reading approachable, practical, and tied to either English or Korean learning. The body should be concise enough for a notification-driven lesson.",
      input: `Generate a daily pack for language=${input.language} and level=${input.level}. Include 2-4 glossary items and 1-3 quiz questions.`,
      format: dailyContentPackFormat,
      promptId: Deno.env.get("OPENAI_DAILY_CONTENT_PROMPT_ID"),
      promptVariables: {
        language: input.language,
        level: input.level,
      },
    });
  } catch (_error) {
    return dailyFallback(input.language, input.level);
  }
};

export const generateLessonCardSet = async (input: {
  lessonId: string;
  title: string;
  summary: string;
  practicePrompt: string;
}): Promise<LessonCardSet> => {
  try {
    return await createStructuredResponse<LessonCardSet>({
      model: openAiModels.lessonCards,
      instructions:
        "You create mobile flashcards for a language-learning lesson. Return a balanced mix of words and expressions, each with practical examples.",
      input: `lesson_id=${input.lessonId}\ntitle=${input.title}\nsummary=${input.summary}\npractice_prompt=${input.practicePrompt}\nGenerate 4-8 cards.`,
      format: lessonCardSetFormat,
      promptId: Deno.env.get("OPENAI_CARD_SET_PROMPT_ID"),
      promptVariables: {
        lesson_id: input.lessonId,
        title: input.title,
      },
    });
  } catch (_error) {
    return {
      lessonId: input.lessonId,
      cards: [
        {
          id: `${input.lessonId}-fallback-1`,
          type: "expression",
          front: input.title,
          back: input.summary,
          example: input.practicePrompt,
          tags: ["fallback"],
        },
      ],
    };
  }
};
