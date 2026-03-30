import { z } from "zod";

export const lessonCardSeedSchema = z.object({
  id: z.string(),
  type: z.enum(["word", "expression"]),
  front: z.string(),
  back: z.string(),
  example: z.string(),
  tags: z.array(z.string()),
});

export const lessonCardSetSchema = z.object({
  lessonId: z.string(),
  cards: z.array(lessonCardSeedSchema).min(1).max(12),
});

export const dailyGlossaryItemSchema = z.object({
  term: z.string(),
  definition: z.string(),
  example: z.string(),
});

export const dailyQuizQuestionSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()).min(3).max(5),
  answer: z.string(),
  explanation: z.string(),
});

export const dailyContentPackSchema = z.object({
  language: z.enum(["en", "ko"]),
  level: z.enum([
    "beginner",
    "elementary",
    "intermediate",
    "upper_intermediate",
    "advanced",
  ]),
  title: z.string(),
  body: z.string(),
  glossary: z.array(dailyGlossaryItemSchema).min(2).max(6),
  quiz: z.array(dailyQuizQuestionSchema).min(1).max(3),
});

export const lessonCardSetJsonSchema = {
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
};

export const dailyContentPackJsonSchema = {
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
};

export type LessonCardSetInput = z.infer<typeof lessonCardSetSchema>;
export type DailyContentPackInput = z.infer<typeof dailyContentPackSchema>;
