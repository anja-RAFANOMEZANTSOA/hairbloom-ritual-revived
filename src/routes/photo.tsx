import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Sparkles, Share2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeHairPhoto } from "@/lib/ai.functions";
import { saveProfile } from "@/lib/storage";
import { toast } from "sonner";
import { addHistory } from "@/lib/history";
import { markInitialAnalysisDone } from "@/lib/initial-analysis";

export const Route = createFileRoute("/photo")({
  validateSearch: (s: Record<string, unknown>) => ({ initial: s.initial === "1" ? "1" : undefined }),
  component: Photo,
});

function Photo() {
  const analyze = useServerFn(analyzeHairPhoto);
  const navigate = useNavigate();
  const { initial } = useSearch({ from: "/photo" });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const run = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const r = await analyze({ data: { imageBase64: preview } });
      if (r.error) toast.error(r.error);
      else {
        setResult(r.result);
        if (r.result?.hairType) saveProfile({ hairType: r.result.hairType, texture: r.result.texture, porosity: r.result.porosity });
        addHistory("photo", `Type ${r.result?.hairType ?? "—"} · ${r.result?.condition ?? ""}`.trim(), r.result);
        try { localStorage.setItem("hairbloom_last_analysis", JSON.stringify(r.result)); } catch {}
        try { localStorage.setItem("hairbloom_photo_done", "1"); window.dispatchEvent(new Event("hairbloom:badges-tick")); } catch {}
        toast.success("Analyse terminée");
        if (initial === "1") {
          markInitialAnalysisDone();
        }
        setTimeout(() => navigate({ to: "/resultats", replace: true }), 900);
      }
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">📸 Photo IA</h1>
        <p className="text-muted-foreground text-sm">Analyse de vos cheveux par intelligence artificielle</p>
      </header>

      <label className="block border-2 border-dashed border-primary rounded-3xl text-center cursor-pointer bg-card transition-colors hover:bg-secondary overflow-hidden">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {preview ? (
          <img src={preview} alt="aperçu" className="h-[200px] w-full object-cover" />
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center px-4">
            <Camera className="size-10 text-primary mb-2" />
            <div className="font-medium text-sm">📷 Téléchargez une photo de vos cheveux</div>
            <div className="text-xs text-muted-foreground mt-1">JPG, PNG — bien éclairée</div>
          </div>
        )}
      </label>

      <button
        onClick={run}
        disabled={!preview || loading}
        className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Analyse en cours…" : "Analyser mes cheveux"}
      </button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Votre profil</h2>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{result.hairType}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Texture" value={result.texture} />
            <Field label="Porosité" value={result.porosity} />
            <Field label="État" value={result.condition} />
            <Field label="Cuir chevelu" value={result.scalpType} />
          </div>
          {result.mainProblems?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Problèmes détectés</div>
              <div className="flex flex-wrap gap-2">{result.mainProblems.map((p: string) => <span key={p} className="px-3 py-1 rounded-full bg-accent/30 text-xs">{p}</span>)}</div>
            </div>
          )}
          {result.recommendations?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recommandations</div>
              <ul className="space-y-1.5 text-sm">{result.recommendations.map((r: string, i: number) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{r}</li>)}</ul>
            </div>
          )}
          <button onClick={() => { navigator.share?.({ title: "Mon profil HairBloom", text: `Type ${result.hairType}` }).catch(() => {}); toast.success("Profil sauvegardé"); }} className="w-full py-3 rounded-2xl border-2 border-primary text-primary font-medium flex items-center justify-center gap-2">
            <Share2 className="size-4" /> Partager mon profil
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-secondary rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium capitalize">{value || "—"}</div>
    </div>
  );
}