import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callAI(messages: any[], model = "google/gemini-2.5-flash"): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Trop de requêtes. Réessayez dans un instant.");
    if (res.status === 402) throw new Error("Crédits AI épuisés.");
    throw new Error(`AI error ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function extractJSON(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export const analyzeHairPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: { imageBase64: string }) => data)
  .handler(async ({ data }) => {
    try {
      const content = await callAI([
        {
          role: "user",
          content: [
            { type: "text", text: "You are a professional hair expert. Analyze this hair photo and return ONLY a JSON object with: hairType (1a-4c), texture (fine/medium/coarse), porosity (low/medium/high), condition (healthy/dry/damaged/oily), scalpType, mainProblems (array of strings in French), recommendations (array of strings in French). No markdown, just JSON." },
            { type: "image_url", image_url: { url: data.imageBase64 } },
          ],
        },
      ]);
      const parsed = extractJSON(content);
      if (!parsed) return { error: "Analyse impossible, réessayez avec une photo plus claire.", result: null };
      return { error: null, result: parsed };
    } catch (e: any) {
      return { error: e.message || "Erreur AI", result: null };
    }
  });

export const diagnoseHair = createServerFn({ method: "POST" })
  .inputValidator((data: { problems: string[]; description: string; hairType?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const prompt = `Tu es un expert capillaire. Pour un profil avec type ${data.hairType || "inconnu"}, problèmes: ${data.problems.join(", ")}, description: "${data.description}", réponds UNIQUEMENT en JSON français: {"cause": string, "severity": "léger"|"modéré"|"sévère", "routine": {"lundi":string,"mardi":string,"mercredi":string,"jeudi":string,"vendredi":string,"samedi":string,"dimanche":string}, "produits": [{"name":string,"brand":string,"benefit":string}], "nutrition": [string]}`;
      const content = await callAI([{ role: "user", content: prompt }]);
      const parsed = extractJSON(content);
      if (!parsed) return { error: "Erreur d'analyse", result: null };
      return { error: null, result: parsed };
    } catch (e: any) {
      return { error: e.message, result: null };
    }
  });

export const scanINCI = createServerFn({ method: "POST" })
  .inputValidator((data: { inci: string; hairType?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const prompt = `Analyse cette liste INCI pour cheveux type ${data.hairType || "tous"}: "${data.inci}". Réponds UNIQUEMENT en JSON français: {"ingredients":[{"name":string,"verdict":"bon"|"neutre"|"mauvais","score":number 0-10,"explanation":string}], "globalScore": number 0-10, "verdict": string, "alternative": string}`;
      const content = await callAI([{ role: "user", content: prompt }]);
      const parsed = extractJSON(content);
      if (!parsed) return { error: "Erreur d'analyse", result: null };
      return { error: null, result: parsed };
    } catch (e: any) {
      return { error: e.message, result: null };
    }
  });