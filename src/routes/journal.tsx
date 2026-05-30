import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MOODS, Mood, saveEntry, deleteEntry, useJournal } from "@/lib/journal";

export const Route = createFileRoute("/journal")({ component: Journal });

const PRODUCTS = ["Shampoing", "Conditionneur", "Masque", "Huile", "Sérum", "Leave-in", "Rien"];

function todayISO() { return new Date().toISOString().slice(0, 10); }

function Journal() {
  const entries = useJournal();
  const [date, setDate] = useState(todayISO());
  const [mood, setMood] = useState<Mood>("bien");
  const [products, setProducts] = useState<string[]>([]);
  const [time, setTime] = useState(15);
  const [notes, setNotes] = useState("");
  const [insight, setInsight] = useState<string | null>(null);

  const toggle = (p: string) => setProducts((x) => x.includes(p) ? x.filter((y) => y !== p) : [...x, p]);

  const submit = () => {
    saveEntry({ id: crypto.randomUUID(), date, mood, products, stylingTime: time, notes });
    toast.success("Entrée enregistrée 📔");
    setNotes(""); setProducts([]); setTime(15);
  };

  const month = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear(), m = d.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const dd = String(i + 1).padStart(2, "0");
      const iso = `${y}-${String(m + 1).padStart(2, "0")}-${dd}`;
      const e = entries.find((x) => x.date === iso);
      return { day: i + 1, mood: e?.mood };
    });
  }, [entries]);

  const moodColor = (m?: Mood) => MOODS.find((x) => x.v === m)?.color || "#e5e7eb";
  const avg = entries.length ? (entries.reduce((s, e) => s + (MOODS.findIndex((m) => m.v === e.mood) === -1 ? 0 : 5 - MOODS.findIndex((m) => m.v === e.mood)), 0) / entries.length).toFixed(1) : "—";

  const aiInsight = () => {
    const last = entries.slice(0, 30);
    if (last.length < 3) { setInsight("Ajoutez au moins 3 entrées pour obtenir une analyse personnalisée."); return; }
    const oily = last.filter((e) => e.products.includes("Huile"));
    const oilyGood = oily.filter((e) => e.mood === "parfait" || e.mood === "bien").length / Math.max(oily.length, 1);
    const msgs = [
      oilyGood > 0.6 ? "🌿 Vos cheveux sont meilleurs les jours où vous utilisez de l'huile." : "💧 Essayez d'intégrer plus d'huile à votre routine.",
      `📊 Vous avez ${last.filter((e) => e.mood === "parfait").length} jours parfaits sur les ${last.length} derniers.`,
      `⏱️ Temps de coiffage moyen : ${Math.round(last.reduce((s, e) => s + e.stylingTime, 0) / last.length)} min.`,
    ];
    setInsight(msgs.join("\n"));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl text-primary">📔 Journal Capillaire</h1>
        <p className="text-sm text-muted-foreground">Suivez vos jours cheveux pour mieux les comprendre.</p>
      </header>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="flex gap-3 items-center">
          <label className="text-sm">Date :</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card border border-border rounded-xl px-3 py-1.5 text-sm" />
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Humeur cheveux</div>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button key={m.v} onClick={() => setMood(m.v)} className={`p-2 rounded-2xl border-2 transition-all ${mood === m.v ? "border-primary bg-secondary scale-105" : "border-transparent bg-card"}`}>
                <div className="text-2xl">{m.e}</div>
                <div className="text-[10px]">{m.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Produits utilisés</div>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCTS.map((p) => (
              <button key={p} onClick={() => toggle(p)} className={`px-3 py-1 rounded-full text-xs border ${products.includes(p) ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"}`}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Temps de coiffage : {time} min</div>
          <input type="range" min={0} max={120} step={5} value={time} onChange={(e) => setTime(+e.target.value)} className="w-full accent-primary" />
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes du jour…" className="w-full bg-card border border-border rounded-2xl p-3 text-sm" rows={3} />
        <button onClick={submit} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-medium">Enregistrer l'entrée</button>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="font-display text-xl">Calendrier du mois</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {month.map((d) => (
            <div key={d.day} className="aspect-square rounded-xl bg-card border border-border flex flex-col items-center justify-center text-[10px]">
              <span className="text-muted-foreground">{d.day}</span>
              <span className="size-2.5 rounded-full mt-0.5" style={{ background: moodColor(d.mood) }} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl">Statistiques</h2>
          <button onClick={aiInsight} className="text-xs bg-primary text-primary-foreground rounded-full px-3 py-1.5 flex items-center gap-1"><Sparkles className="size-3" /> Insight IA</button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-card rounded-xl p-3"><div className="text-2xl font-display text-primary">{entries.length}</div><div className="text-[10px] text-muted-foreground">Entrées</div></div>
          <div className="bg-card rounded-xl p-3"><div className="text-2xl font-display text-primary">{avg}/5</div><div className="text-[10px] text-muted-foreground">Humeur moy.</div></div>
          <div className="bg-card rounded-xl p-3"><div className="text-2xl font-display text-primary">{entries.filter((e) => e.mood === "parfait").length}</div><div className="text-[10px] text-muted-foreground">Jours parfaits</div></div>
        </div>
        {insight && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-secondary rounded-xl p-3 text-sm whitespace-pre-line">{insight}</motion.div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-xl">Historique</h2>
        {entries.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Aucune entrée pour l'instant 🌸</div>}
        {entries.map((e) => (
          <div key={e.id} className="bg-card rounded-2xl p-3 flex items-center gap-3 border border-border">
            <div className="text-2xl">{MOODS.find((m) => m.v === e.mood)?.e}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{e.date}</div>
              <div className="text-xs text-muted-foreground truncate">{e.products.join(", ") || "Aucun produit"} · {e.stylingTime} min</div>
              {e.notes && <div className="text-xs mt-1 italic">"{e.notes}"</div>}
            </div>
            <button onClick={() => deleteEntry(e.id)} className="text-destructive p-2"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}