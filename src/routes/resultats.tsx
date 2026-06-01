import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Droplet, Star, ExternalLink, Clock, ArrowRight, Check, Trophy,
  Home, Flame, Share2,
} from "lucide-react";
import { useProfile, saveProfile } from "@/lib/storage";
import { unsplash, recipes, products } from "@/lib/hair-data";
import {
  matchRecipes, matchProducts, whyProduct, buildRoutine, CHALLENGE_DAYS,
  healthScore, problemsFromProfile, HAIR_SPECTRUM,
} from "@/lib/recommendations";
import {
  useChallenge, toggleDay, startChallenge, progress, streak, dailyPhrase,
} from "@/lib/challenge";
import { toast } from "sonner";

type LastAnalysis = {
  hairType?: string; texture?: string; porosity?: string;
  condition?: string; scalpType?: string; mainProblems?: string[];
};

const TABS = [
  { k: "bilan", label: "Mon Bilan" },
  { k: "recettes", label: "Mes Recettes" },
  { k: "produits", label: "Mes Produits" },
  { k: "routine", label: "Ma Routine" },
  { k: "defi", label: "Mon Défi" },
] as const;

type TabKey = typeof TABS[number]["k"];

export const Route = createFileRoute("/resultats")({
  validateSearch: (s: Record<string, unknown>) => ({ tab: (s.tab as TabKey) ?? "bilan" }),
  component: Resultats,
});

function Resultats() {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/resultats" });
  const [profile] = useProfile();
  const [active, setActive] = useState<TabKey>(tab);
  const [last, setLast] = useState<LastAnalysis>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hairbloom_last_analysis");
      if (raw) setLast(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => { setActive(tab); }, [tab]);

  const merged: LastAnalysis = useMemo(() => ({
    hairType: last.hairType || profile.hairType,
    texture: last.texture || profile.texture,
    porosity: last.porosity || profile.porosity,
    condition: last.condition,
    scalpType: last.scalpType || profile.scalp,
    mainProblems: last.mainProblems,
  }), [last, profile]);

  const problems = problemsFromProfile(profile, merged.mainProblems);
  const score = healthScore(profile, problems);

  const recs = useMemo(() => matchRecipes(profile, 4), [profile]);
  const prods = useMemo(() => matchProducts(profile, 5), [profile]);
  const routine = useMemo(() => buildRoutine(profile), [profile]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
      <header className="text-center space-y-1">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] uppercase tracking-wider">
          <Sparkles className="size-3" /> Analyse personnalisée
        </div>
        <h1 className="font-display text-3xl md:text-4xl">Vos résultats</h1>
        <p className="text-muted-foreground text-sm">Tout ce que vos cheveux ont à vous dire ✨</p>
      </header>

      {/* Tabs */}
      <div className="sticky top-12 z-10 -mx-4 px-4">
        <div className="glass rounded-full p-1 flex overflow-x-auto">
          {TABS.map((t) => {
            const isActive = active === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setActive(t.k)}
                className={`relative flex-1 min-w-fit px-3 py-2 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${isActive ? "text-primary-foreground" : "text-foreground/70"}`}
              >
                {isActive && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 bg-primary rounded-full" transition={{ type: "spring", stiffness: 300, damping: 28 }} />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {active === "bilan" && <Bilan a={merged} problems={problems} score={score} />}
          {active === "recettes" && <Recettes recs={recs} />}
          {active === "produits" && <Produits prods={prods} profileLike={profile} />}
          {active === "routine" && <Routine days={routine} />}
          {active === "defi" && <Defi />}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
        <button
          onClick={() => { saveProfile({ hairType: merged.hairType, texture: merged.texture, porosity: merged.porosity, scalp: merged.scalpType }); toast.success("Profil sauvegardé"); }}
          className="py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
        >
          Sauvegarder mon profil
        </button>
        <button
          onClick={() => { startChallenge(); setActive("defi"); toast.success("Défi 21 jours commencé !"); }}
          className="py-3 rounded-2xl border-2 border-primary text-primary font-medium text-sm"
        >
          Commencer le défi
        </button>
        <button
          onClick={() => navigate({ to: "/" })}
          className="py-3 rounded-2xl bg-secondary text-foreground font-medium text-sm flex items-center justify-center gap-2"
        >
          <Home className="size-4" /> Aller à l'accueil
        </button>
      </div>
    </div>
  );
}

function Bilan({ a, problems, score }: { a: LastAnalysis; problems: string[]; score: number }) {
  const hairType = a.hairType || "—";
  const pIdx = HAIR_SPECTRUM.indexOf(hairType as never);
  const porIndex = a.porosity === "Basse" ? 1 : a.porosity === "Haute" ? 3 : 2;

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Type détecté</div>
            <div className="font-display text-3xl text-primary">{hairType}</div>
          </div>
          <ScoreRing value={score} />
        </div>

        {/* Curl spectrum */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Spectre de boucle</div>
          <div className="relative h-9 rounded-full bg-gradient-to-r from-[#f7e9d8] via-[#e5b893] to-[#7a4b2a]">
            {HAIR_SPECTRUM.map((t, i) => (
              <div key={t} className="absolute top-full -translate-x-1/2 mt-1 text-[9px] text-muted-foreground" style={{ left: `${(i / 11) * 100}%` }}>{t}</div>
            ))}
            {pIdx >= 0 && (
              <motion.div
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: `${(pIdx / 11) * 100}%`, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              >
                <div className="size-5 rounded-full bg-primary border-2 border-white shadow" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <Field label="Porosité">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <span key={i} className={`size-3 rounded-full ${i <= porIndex ? "bg-primary" : "bg-secondary"}`} />
              ))}
              <span className="ml-2 text-sm">{a.porosity || "—"}</span>
            </div>
          </Field>
          <Field label="Texture"><span className="text-sm capitalize">{a.texture || "—"}</span></Field>
          <Field label="Condition"><span className="px-2 py-0.5 rounded-full bg-accent/30 text-xs">{a.condition || "—"}</span></Field>
          <Field label="Cuir chevelu"><span className="px-2 py-0.5 rounded-full bg-accent/30 text-xs">{a.scalpType || "—"}</span></Field>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Top 3 problèmes</div>
        {problems.length === 0 && <div className="text-sm text-muted-foreground">Aucun problème majeur détecté ✨</div>}
        <div className="space-y-3">
          {problems.map((p, i) => {
            const severity = [85, 60, 40][i] || 30;
            return (
              <div key={p}>
                <div className="flex justify-between text-xs mb-1"><span className="font-medium">{p}</span><span className="text-muted-foreground">{severity}%</span></div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${severity}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full bg-primary" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const R = 30;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative size-20">
      <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="oklch(0.96 0.02 70)" strokeWidth="8" />
        <motion.circle
          cx="40" cy="40" r={R} fill="none"
          stroke="oklch(0.72 0.09 60)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - (value / 100) * C }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className="font-display text-xl">{value}</div>
          <div className="text-[9px] text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-secondary/60 rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}

function Recettes({ recs }: { recs: ReturnType<typeof matchRecipes> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {recs.map((r) => (
        <motion.div key={r.id} whileHover={{ y: -3 }} className="glass rounded-3xl overflow-hidden">
          <div className="h-[100px] bg-cover bg-center" style={{ backgroundImage: `url(${unsplash(r.cover, 600)})` }} />
          <div className="p-3 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-display text-sm leading-tight">{r.title}</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider shrink-0">{r.benefit}</span>
            </div>
            <div className="flex gap-1">
              {r.ingredients.slice(0, 4).map((i) => (
                <img key={i.name} src={i.photo} alt={i.name} title={i.name} className="size-[35px] rounded-full object-cover border border-border" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="size-3" />{r.duration}</span>
              <Link to="/recipes" className="text-[11px] text-primary font-medium flex items-center gap-0.5">Voir <ArrowRight className="size-3" /></Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Produits({ prods, profileLike }: { prods: ReturnType<typeof matchProducts>; profileLike: any }) {
  return (
    <div className="space-y-2">
      {prods.map((p) => (
        <motion.div key={p.id} whileHover={{ scale: 1.01 }} className="glass rounded-2xl p-3 flex gap-3">
          <img src={unsplash(p.photo, 200)} alt={p.name} className="size-[70px] rounded-xl object-cover shrink-0" onError={(e) => { (e.currentTarget.style.background = "#F5C4B3"); }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] tracking-wider uppercase text-primary truncate">{p.brand}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary">{p.price}</span>
            </div>
            <h3 className="font-display text-sm leading-tight truncate">{p.name}</h3>
            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{whyProduct(p, profileLike)}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1 text-[11px]"><Star className="size-3 fill-primary text-primary" />{p.rating}</span>
              <a href={`https://${p.url}`} target="_blank" rel="noopener noreferrer sponsored" className="text-[11px] text-primary font-medium flex items-center gap-1">Voir le produit <ExternalLink className="size-3" /></a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Routine({ days }: { days: ReturnType<typeof buildRoutine> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {days.map((d, i) => {
        const Icon = d.icon;
        return (
          <motion.div key={d.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-display text-lg">{d.day}</div>
              <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center"><Icon className="size-[18px]" /></div>
            </div>
            <div className="text-sm font-medium">{d.task}</div>
            <div className="text-xs text-muted-foreground mt-1">{d.use} · {d.time}</div>
            <div className="text-[11px] text-primary/80 mt-2 italic">💡 {d.tip}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Defi() {
  const state = useChallenge();
  const p = progress(state);
  const st = streak(state);
  const phrase = dailyPhrase(state.startedAt);
  const startedLabel = state.startedAt ? new Date(state.startedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "Non commencé";

  const isDone = p.done >= 21;

  if (isDone) return <Celebration state={state} />;

  const byPhase = [1, 2, 3].map((ph) => CHALLENGE_DAYS.filter((d) => d.phase === ph));
  const phaseTitles: Record<number, string> = { 1: "Semaine 1 — Purification", 2: "Semaine 2 — Nourrissement", 3: "Semaine 3 — Éclat" };

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-5 flex items-center gap-4">
        <ScoreRing value={p.pct} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider text-primary">Défi Transformation</div>
          <div className="font-display text-xl leading-tight">21 Jours ✨</div>
          <div className="text-xs text-muted-foreground mt-1">Démarré le {startedLabel}</div>
          <div className="text-xs italic mt-1">{phrase}</div>
        </div>
        <div className="text-center shrink-0">
          <div className="font-display text-2xl text-primary">{st}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Streak</div>
        </div>
      </div>

      {!state.startedAt && (
        <button onClick={() => startChallenge()} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium">
          Rejoindre le défi
        </button>
      )}

      {byPhase.map((days, idx) => {
        const phase = (idx + 1) as 1 | 2 | 3;
        const completed = days.filter((d) => state.done[d.n]).length;
        const pct = Math.round((completed / 7) * 100);
        return (
          <div key={phase} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="font-display text-base">{phaseTitles[phase]}</div>
              <div className="text-[11px] text-muted-foreground">{completed}/7</div>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div animate={{ width: `${pct}%` }} className="h-full bg-primary" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {days.map((d) => <DayCard key={d.n} d={d} done={!!state.done[d.n]} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayCard({ d, done }: { d: typeof CHALLENGE_DAYS[number]; done: boolean }) {
  const Icon = d.icon;
  const linkLabel = d.link?.type === "recipe" ? recipes.find((r) => r.id === d.link!.id)?.title : products.find((p) => p.id === d.link!.id)?.name;
  return (
    <motion.div whileTap={{ scale: 0.99 }} className={`glass rounded-2xl p-3 flex gap-3 items-start ${done ? "opacity-70" : ""}`}>
      <button
        onClick={() => toggleDay(d.n)}
        aria-label="Marquer"
        className={`mt-0.5 size-7 rounded-full grid place-items-center border-2 shrink-0 transition-colors ${done ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"}`}
      >
        {done && <Check className="size-4" />}
      </button>
      <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0"><Icon className="size-[18px]" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium text-sm">Jour {d.n} — {d.title}</div>
          <div className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1"><Clock className="size-3" />{d.time}</div>
        </div>
        <div className="text-xs text-muted-foreground leading-snug">{d.instructions}</div>
        {d.link && linkLabel && (
          <Link to={d.link.type === "recipe" ? "/recipes" : "/shop"} className="text-[11px] text-primary mt-1 inline-flex items-center gap-0.5">
            {linkLabel} <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function Celebration({ state }: { state: ReturnType<typeof useChallenge> }) {
  const days = Math.floor((Date.now() - new Date(state.startedAt!).getTime()) / 86400000) + 1;
  return (
    <div className="relative overflow-hidden glass rounded-3xl p-8 text-center space-y-4">
      <Confetti />
      <Trophy className="size-12 text-primary mx-auto" />
      <h2 className="font-display text-3xl">Bravo, c'est fait ! ✨</h2>
      <p className="text-sm text-muted-foreground">Vous avez complété le Défi Transformation 21 Jours en {days} jours.</p>
      <ul className="text-sm space-y-1 inline-block text-left">
        <li className="flex items-center gap-2"><Check className="size-4 text-primary" />Routine de purification maîtrisée</li>
        <li className="flex items-center gap-2"><Check className="size-4 text-primary" />Nutrition & hydratation profondes</li>
        <li className="flex items-center gap-2"><Check className="size-4 text-primary" />Brillance et éclat retrouvés</li>
      </ul>
      <button
        onClick={() => { navigator.share?.({ title: "Défi HairBloom 21 jours", text: "J'ai terminé mon défi capillaire HairBloom ✨" }).catch(() => {}); }}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-medium"
      >
        <Share2 className="size-4" /> Partager
      </button>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 });
  const colors = ["#C9956A", "#E8B4B8", "#F4C7CB", "#E8C77A", "#B85565"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 400, opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          className="absolute top-0 size-2 rounded-sm"
          style={{ left: `${Math.random() * 100}%`, background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}