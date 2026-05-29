import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `Tu es Bloom 🌸, l'assistante capillaire de HairBloom. Tu réponds toujours en français, avec bienveillance et expertise. Donne des conseils concrets, courts (3-6 phrases max), naturels, adaptés au type de cheveux quand il est mentionné. Utilise quelques emojis pertinents sans en abuser. Suggère parfois une recette DIY ou un ingrédient naturel.`;

export const askBloom = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: ChatMsg[]; profile?: any }) => data)
  .handler(async ({ data }) => {
    try {
      const key = process.env.LOVABLE_API_KEY;
      if (!key) return { error: "AI non configurée", reply: null };
      const profileLine = data.profile
        ? `Profil utilisateur: type ${data.profile.hairType ?? "?"}, texture ${data.profile.texture ?? "?"}, porosité ${data.profile.porosity ?? "?"}, problème ${data.profile.problem ?? "?"}.`
        : "";
      const messages: ChatMsg[] = [
        { role: "system", content: SYSTEM + (profileLine ? "\n" + profileLine : "") },
        ...data.messages.slice(-12),
      ];
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
      });
      if (!res.ok) {
        if (res.status === 429) return { error: "Trop de requêtes, réessayez dans un instant.", reply: null };
        if (res.status === 402) return { error: "Crédits AI épuisés.", reply: null };
        return { error: `Erreur ${res.status}`, reply: null };
      }
      const json = await res.json();
      const reply = json.choices?.[0]?.message?.content ?? "";
      return { error: null, reply };
    } catch (e: any) {
      return { error: e.message || "Erreur AI", reply: null };
    }
  });