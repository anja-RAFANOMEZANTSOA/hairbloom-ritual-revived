import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function extractJSON(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export const planHairMonth = createServerFn({ method: "POST" })
  .inputValidator((data: { hairType?: string; goal?: string; problem?: string; startDate: string; weeks?: number }) => data)
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { error: "AI non configuré", events: [] as any[] };
    const weeks = Math.min(Math.max(data.weeks ?? 4, 1), 8);
    const prompt = `Tu es un expert capillaire. Crée un planning capillaire personnalisé sur ${weeks} semaines à partir du ${data.startDate} pour cheveux type ${data.hairType || "inconnu"}, objectif: ${data.goal || "santé générale"}, problème principal: ${data.problem || "aucun"}.
Réponds UNIQUEMENT en JSON français avec ce format strict:
{"events":[{"date":"YYYY-MM-DD","kind":"masque|shampoing|bain-huile|coupe|soin-protéiné|hydratation|coiffure-protectrice|autre","title":"string court","notes":"string court"}]}
Règles: shampoing 1-2x/semaine adapté au type, masque hebdomadaire, bain d'huile bi-mensuel, hydratation régulière. Aucune date ne doit être antérieure à ${data.startDate}.`;
    try {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok) {
        if (res.status === 429) return { error: "Trop de requêtes. Réessayez dans un instant.", events: [] };
        if (res.status === 402) return { error: "Crédits AI épuisés.", events: [] };
        return { error: `Erreur AI ${res.status}`, events: [] };
      }
      const j = await res.json();
      const text = j.choices?.[0]?.message?.content || "";
      const parsed = extractJSON(text);
      if (!parsed?.events) return { error: "Réponse AI invalide", events: [] };
      return { error: null, events: parsed.events as Array<{ date: string; kind: string; title: string; notes?: string }> };
    } catch (e: any) {
      return { error: e?.message || "Erreur AI", events: [] };
    }
  });