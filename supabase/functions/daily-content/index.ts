import { corsHeaders } from "../_shared/cors.ts";
import { getLocalDateKey } from "../_shared/dates.ts";
import { generateDailyContent } from "../_shared/generation.ts";
import { createAdminClient } from "../_shared/supabase.ts";
import type { AppLanguage, LanguageLevel } from "../_shared/schemas.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const userId = body.userId as string;
    const language = body.language as AppLanguage;
    const level = body.level as LanguageLevel;
    const slotLabel = (body.slotLabel as string | undefined) ?? "primary";
    const timezone = (body.timezone as string | undefined) ?? "UTC";

    if (!userId || !language || !level) {
      return new Response(JSON.stringify({ error: "userId, language, and level are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createAdminClient();
    const deliveryDate = getLocalDateKey(timezone);

    const existing = await admin
      .from("daily_content_cache")
      .select("language, level, title, body, glossary, quiz")
      .eq("user_id", userId)
      .eq("delivery_date", deliveryDate)
      .eq("slot_label", slotLabel)
      .maybeSingle();

    if (existing.data) {
      return new Response(JSON.stringify(existing.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pack = await generateDailyContent({ language, level });

    await admin.from("daily_content_cache").upsert(
      {
        user_id: userId,
        language,
        level,
        title: pack.title,
        body: pack.body,
        glossary: pack.glossary,
        quiz: pack.quiz,
        delivery_date: deliveryDate,
        slot_label: slotLabel,
      },
      {
        onConflict: "user_id,delivery_date,slot_label",
      },
    );

    return new Response(JSON.stringify(pack), {
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
