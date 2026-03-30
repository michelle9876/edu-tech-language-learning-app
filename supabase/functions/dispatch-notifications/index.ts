import { corsHeaders } from "../_shared/cors.ts";
import { getLocalDateKey, getLocalTimeParts } from "../_shared/dates.ts";
import { generateDailyContent } from "../_shared/generation.ts";
import { createAdminClient } from "../_shared/supabase.ts";

const pushUrl = Deno.env.get("EXPO_PUSH_URL") ?? "https://exp.host/--/api/v2/push/send";

const buildSlots = (timeValue: string) => {
  const [hour, minute] = timeValue.split(":").map(Number);
  const morning = { hour, minute };
  const evening = { hour: (hour + 8) % 24, minute };
  return [
    { label: "primary", ...morning },
    { label: "secondary", ...evening },
  ];
};

const isDueNow = (timezone: string, notificationTime: string) => {
  const { hour, minute } = getLocalTimeParts(timezone);

  return buildSlots(notificationTime).find(
    (slot) => slot.hour === hour && Math.abs(slot.minute - minute) <= 15,
  );
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const admin = createAdminClient();
    const { data: profiles, error } = await admin
      .from("user_profiles")
      .select("user_id, timezone, notification_time, notification_opt_in, target_language, level");

    if (error) {
      throw error;
    }

    const summary: Array<{ userId: string; slot: string; deliveryDate: string; sent: boolean }> = [];

    for (const profile of profiles ?? []) {
      if (!profile.notification_opt_in) {
        continue;
      }

      const dueSlot = isDueNow(profile.timezone, profile.notification_time);
      if (!dueSlot) {
        continue;
      }

      const deliveryDate = getLocalDateKey(profile.timezone);
      const existing = await admin
        .from("daily_content_cache")
        .select("id")
        .eq("user_id", profile.user_id)
        .eq("delivery_date", deliveryDate)
        .eq("slot_label", dueSlot.label)
        .maybeSingle();

      const pack =
        existing.data
          ? await admin
              .from("daily_content_cache")
              .select("title, body")
              .eq("id", existing.data.id)
              .single()
          : null;

      let title = pack?.data?.title;
      let body = pack?.data?.body;

      if (!title || !body) {
        const generated = await generateDailyContent({
          language: profile.target_language,
          level: profile.level,
        });

        title = generated.title;
        body = generated.body;

        await admin.from("daily_content_cache").upsert(
          {
            user_id: profile.user_id,
            language: profile.target_language,
            level: profile.level,
            title: generated.title,
            body: generated.body,
            glossary: generated.glossary,
            quiz: generated.quiz,
            delivery_date: deliveryDate,
            slot_label: dueSlot.label,
          },
          {
            onConflict: "user_id,delivery_date,slot_label",
          },
        );
      }

      const { data: tokens } = await admin
        .from("user_push_tokens")
        .select("expo_push_token")
        .eq("user_id", profile.user_id);

      for (const token of tokens ?? []) {
        await fetch(pushUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token.expo_push_token,
            sound: "default",
            title,
            body,
            data: {
              screen: "(tabs)/index",
              slot: dueSlot.label,
            },
          }),
        });
      }

      summary.push({
        userId: profile.user_id,
        slot: dueSlot.label,
        deliveryDate,
        sent: true,
      });
    }

    return new Response(JSON.stringify({ sent: summary.length, summary }), {
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
