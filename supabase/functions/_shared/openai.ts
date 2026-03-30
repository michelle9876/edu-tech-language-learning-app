import { dailyContentPackFormat, lessonCardSetFormat } from "./schemas.ts";

type StructuredRequest = {
  model: string;
  instructions: string;
  input: string;
  format: typeof dailyContentPackFormat | typeof lessonCardSetFormat;
  promptId?: string | null;
  promptVariables?: Record<string, string>;
};

const extractOutputText = (payload: any) => {
  const messages = Array.isArray(payload?.output) ? payload.output : [];
  const textItems = messages
    .flatMap((item: any) => item?.content ?? [])
    .filter((content: any) => content?.type === "output_text")
    .map((content: any) => content?.text ?? "");

  const refusal = messages
    .flatMap((item: any) => item?.content ?? [])
    .find((content: any) => content?.type === "refusal");

  if (refusal) {
    throw new Error(refusal.refusal ?? "OpenAI refused the request.");
  }

  const combined = textItems.join("").trim();

  if (!combined) {
    throw new Error("OpenAI returned no structured text.");
  }

  return combined;
};

export const createStructuredResponse = async <T>({
  model,
  instructions,
  input,
  format,
  promptId,
  promptVariables,
}: StructuredRequest): Promise<T> => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const body: Record<string, unknown> = {
    model,
    store: false,
    instructions,
    input,
    text: {
      format,
    },
  };

  if (promptId) {
    body.prompt = {
      id: promptId,
      variables: promptVariables ?? {},
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = extractOutputText(payload);
  return JSON.parse(text) as T;
};
