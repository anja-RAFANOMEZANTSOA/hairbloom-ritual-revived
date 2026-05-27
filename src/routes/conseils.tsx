import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { tipsDont, tipsDo } from "@/lib/hair-data";

export const Route = createFileRoute("/conseils")({ component: Conseils });

function Conseils() {
  const [tab, setTab] = useState<"dont" | "do">("dont");
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Conseils</h1>
        <p className="text-muted-foreground text-sm">Les bons et mauvais réflexes</p>
      </header>

      <div className="grid grid-cols-2 gap-2 bg-card p-1.5 rounded-2xl border border-border">
        {([
          { k: "dont", l: "À ne pas faire" },
          { k: "do", l: "Conseils quotidiens" },
        ] as const).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t.l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === "dont" ? (
            <div className="space-y-2">
              {tipsDont.map((t, i) => (
                <div key={i} className="bg-destructive/10 border border-destructive/30 rounded-2xl p-3 flex gap-3">
                  <div className="size-7 shrink-0 rounded-full bg-destructive text-destructive-foreground grid place-items-center"><X className="size-4" /></div>
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(tipsDo).map(([cat, list]) => (
                <div key={cat}>
                  <h3 className="font-display text-lg mb-2">{cat}</h3>
                  <div className="space-y-2">
                    {list.map((t, i) => (
                      <div key={i} className="bg-card border border-border rounded-2xl p-3 flex gap-3">
                        <div className="size-7 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center"><Check className="size-4" /></div>
                        <p className="text-sm">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}