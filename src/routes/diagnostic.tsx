import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Droplet, Wind, Scissors, Sparkles, Flame, Leaf, Loader2, AlertCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { diagnoseHair } from "@/lib/ai.functions";
import { useProfile } from "@/lib/storage";
import { toast } from "sonner";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/diagnostic")({ component: Diagnostic });

const items = [
  { label: "Sécheresse extrême", Icon: Droplet },
  { label: "Cuir chevelu gras", Icon: Droplet },
  { label: "Chute de cheveux", Icon: AlertCircle },
  { label: "Pellicules", Icon: Wind },
  { label: "Frisottis", Icon: Wind },
  { label: "Casse", Icon: Scissors },
  { label: "Pousse lente", Icon: Sparkles },
  { label: "Pointes fourchues", Icon: Scissors },
  { label: "Démangeaisons", Icon: AlertCircle },
  { label: "Dommages thermiques", Icon: Flame },
  { label: "Cheveux colorés", Icon: Sparkles },
  { label: "Perte post-partum", Icon: AlertCircle },
  { label: "Amincissement masculin", Icon: AlertCircle },
  { label: "Cheveux d'enfant", Icon: Leaf },
];

function Diagnostic() {
  const [profile] = useProfile();
  const diagnose = useServerFn(diagnoseHair);
  const [selected, setSelected] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState<"diag" | "routine" | "produits" | "nutrition">("diag");

  const toggle = (l: string) => setSelected((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));

  const run = async () => {
    if (selected.length === 0 && !desc) return toast.error("Sélectionnez un problème ou décrivez-le");
    setLoading(true);
    try {
      const r = await diagnose({ data: { problems: selected, description: desc, hairType: profile.hairType } });
      if (r.error) toast.error(r.error);
      else {
        setResult(r.result);
        addHistory(
          "diagnostic",
          `${selected.length} problème(s) · ${r.result?.cause ?? "routine générée"}`,
          { problems: selected, description: desc, result: r.result }
        );
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Diagnostic</h1>
        <p className="text-muted-foreground text-sm">Identifiez précisément vos besoins capillaires</p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        {items.map(({ label, Icon }) => {
          const active = selected.includes(label);
          return (
            <button key={label} onClick={() => toggle(label)} className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-sm text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <Icon className="size-4 text-primary shrink-0" /> {label}
            </button>
          );
        })}
      </div>

      <textarea
        placeholder="Décrivez votre problème en détail…"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-card border border-border outline-none focus:border-primary min-h-24 resize-y"
      />

      <button onClick={run} disabled={loading} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        Analyser
      </button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto">
            {[
              { k: "diag", l: "Diagnostic" },
              { k: "routine", l: "Routine" },
              { k: "produits", l: "Produits" },
              { k: "nutrition", l: "Nutrition" },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k as any)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${tab === t.k ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>{t.l}</button>
            ))}
          </div>
          <div className="p-5">
            {tab === "diag" && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Cause probable</div>
                <p className="mt-1 mb-3">{result.cause}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/30 text-xs">Sévérité : {result.severity}</span>
              </div>
            )}
            {tab === "routine" && result.routine && (
              <ul className="space-y-2">
                {Object.entries(result.routine).map(([k, v]) => (
                  <li key={k} className="flex gap-3"><span className="capitalize font-medium w-20 shrink-0">{k}</span><span className="text-sm text-muted-foreground">{v as string}</span></li>
                ))}
              </ul>
            )}
            {tab === "produits" && result.produits && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.produits.map((p: any, i: number) => (
                  <div key={i} className="bg-secondary rounded-xl p-3">
                    <div className="text-xs text-primary">{p.brand}</div>
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.benefit}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === "nutrition" && result.nutrition && (
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {result.nutrition.map((n: string, i: number) => <li key={i} className="flex gap-2"><Leaf className="size-4 text-primary shrink-0 mt-0.5" />{n}</li>)}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}