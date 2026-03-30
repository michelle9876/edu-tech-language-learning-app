import { corsHeaders } from "../_shared/cors.ts";
import { generateLessonCardSet } from "../_shared/generation.ts";
import { createAdminClient } from "../_shared/supabase.ts";

type ImportLesson = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: string;
  practicePrompt: string;
  objectives: Array<{ id: string; text: string }>;
  cards?: Array<{
    id: string;
    type: "word" | "expression";
    front: string;
    back: string;
    example: string;
    tags: string[];
  }>;
};

type ImportModule = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: ImportLesson[];
};

type ImportTrack = {
  id: string;
  nativeLanguage: "en" | "ko";
  targetLanguage: "en" | "ko";
  level: string;
  title: string;
  subtitle: string;
  description: string;
  modules: ImportModule[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const track = body.track as ImportTrack | undefined;

    if (!track) {
      return new Response(JSON.stringify({ error: "Body must include track." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createAdminClient();

    await admin.from("curriculum_tracks").upsert({
      id: track.id,
      native_language: track.nativeLanguage,
      target_language: track.targetLanguage,
      level: track.level,
      title: track.title,
      subtitle: track.subtitle,
      description: track.description,
    });

    for (const module of track.modules) {
      await admin.from("curriculum_modules").upsert({
        id: module.id,
        track_id: track.id,
        title: module.title,
        description: module.description,
        order_index: module.orderIndex,
      });

      for (const lesson of module.lessons) {
        await admin.from("lessons").upsert({
          id: lesson.id,
          module_id: module.id,
          title: lesson.title,
          summary: lesson.summary,
          estimated_minutes: lesson.estimatedMinutes,
          difficulty: lesson.difficulty,
          practice_prompt: lesson.practicePrompt,
          objectives: lesson.objectives,
        });

        const cardSource =
          lesson.cards && lesson.cards.length > 0
            ? { lessonId: lesson.id, cards: lesson.cards }
            : await generateLessonCardSet({
                lessonId: lesson.id,
                title: lesson.title,
                summary: lesson.summary,
                practicePrompt: lesson.practicePrompt,
              });

        for (const card of cardSource.cards) {
          await admin.from("lesson_card_seeds").upsert({
            id: card.id,
            lesson_id: lesson.id,
            type: card.type,
            front: card.front,
            back: card.back,
            example: card.example,
            tags: card.tags,
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, trackId: track.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

