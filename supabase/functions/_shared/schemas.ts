export type AppLanguage = "en" | "ko";
export type LanguageLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced";

export type DailyContentPack = {
  language: AppLanguage;
  level: LanguageLevel;
  title: string;
  body: string;
  glossary: Array<{
    term: string;
    definition: string;
    example: string;
  }>;
  quiz: Array<{
    prompt: string;
    options: string[];
    answer: string;
    explanation: string;
  }>;
};

export type LessonCardSet = {
  lessonId: string;
  cards: Array<{
    id: string;
    type: "word" | "expression";
    front: string;
    back: string;
    example: string;
    tags: string[];
  }>;
};

export const dailyContentPackFormat = {
  type: "json_schema",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["language", "level", "title", "body", "glossary", "quiz"],
    properties: {
      language: {
        type: "string",
        enum: ["en", "ko"],
      },
      level: {
        type: "string",
        enum: [
          "beginner",
          "elementary",
          "intermediate",
          "upper_intermediate",
          "advanced",
        ],
      },
      title: { type: "string" },
      body: { type: "string" },
      glossary: {
        type: "array",
        minItems: 2,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["term", "definition", "example"],
          properties: {
            term: { type: "string" },
            definition: { type: "string" },
            example: { type: "string" },
          },
        },
      },
      quiz: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["prompt", "options", "answer", "explanation"],
          properties: {
            prompt: { type: "string" },
            options: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string" },
            },
            answer: { type: "string" },
            explanation: { type: "string" },
          },
        },
      },
    },
  },
} as const;

export const lessonCardSetFormat = {
  type: "json_schema",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["lessonId", "cards"],
    properties: {
      lessonId: { type: "string" },
      cards: {
        type: "array",
        minItems: 1,
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "type", "front", "back", "example", "tags"],
          properties: {
            id: { type: "string" },
            type: { type: "string", enum: ["word", "expression"] },
            front: { type: "string" },
            back: { type: "string" },
            example: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

