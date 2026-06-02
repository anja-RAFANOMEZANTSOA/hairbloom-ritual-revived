import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { scanINCI } from "@/lib/ai.functions";
import { useProfile } from "@/lib/storage";
import { toast } from "sonner";
import { bumpInciScan } from "@/lib/badges";

export const Route = createFileRoute("/inci")({ component: INCI });

function INCI() {
  const [profile] = useProfile();
  const scan = useServerFn(scanINCI);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [r, setR] = useState<any>(null);

  const run = async () => {
    if (!text.trim()) return toast.error("Collez une liste INCI");
    setLoading(true);
    try {
      const res = await scan({ data: { inci: text, hairType: profile.hairType } });
      if (res.error) toast.error(res.error);
      else { setR(res.result); bumpInciScan(); }
    } finally { setLoading(false); }
  };

  const colorFor = (v: string) => v === "bon" ? "bg-green-100 text-green-800 border-green-300" : v === "mauvais" ? "bg-red-100 text-red-800 border-red-300" : "bg-yellow-100 text-yellow-800 border-yellow-300";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Scanner INCI</h1>
        <p className="text-muted-foreground text-sm">Analysez la composition d'un produit</p>
      </header>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Collez la liste INCI ici (Aqua, Sodium Laureth Sulfate, …)" className="w-full min-h-32 px-4 py-3 rounded-2xl bg-card border border-border outline-none focus:border-primary text-sm" />
      <button onClick={run} disabled={loading} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Analyser
      </button>

      {r && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <div className="text-xs uppercase text-muted-foreground">Score global</div>
            <div className="text-5xl font-display text-primary">{r.globalScore}<span className="text-2xl text-muted-foreground">/10</span></div>
            <p className="text-sm mt-2">{r.verdict}</p>
          </div>
          <div className="space-y-2">
            {r.ingredients.map((i: any, k: number) => (
              <div key={k} className={`border-2 rounded-xl p-3 ${colorFor(i.verdict)}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{i.name}</span>
                  <span className="text-xs">{i.score}/10</span>
                </div>
                <p className="text-xs opacity-80 mt-1">{i.explanation}</p>
              </div>
            ))}
          </div>
          {r.alternative && (
            <div className="bg-accent/20 rounded-2xl p-4 text-sm">
              <strong className="text-primary">Alternative naturelle :</strong> {r.alternative}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}