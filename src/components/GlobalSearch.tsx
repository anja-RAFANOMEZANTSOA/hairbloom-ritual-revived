import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, Sparkles, BookOpen, ShoppingBag, Sprout, Droplet } from "lucide-react";
import { recipes, products, auras, dailyTips, tipsDont, unsplash } from "@/lib/hair-data";

const RECENT_KEY = "hairbloom_recent_searches";
const POPULAR = ["masque avocat", "cheveux crépus", "Olaplex", "anti-chute", "porosité"];

type Result =
  | { kind: "recipe"; id: number; title: string; benefit: string; photo: string }
  | { kind: "product"; id: number; name: string; brand: string; hairType: string; photo: string }
  | { kind: "tip"; id: string; text: string; category: string }
  | { kind: "hair"; id: string; name: string; description: string; emoji: string };

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function pushRecent(q: string) {
  const v = q.trim(); if (!v) return;
  const cur = loadRecent().filter((x) => x.toLowerCase() !== v.toLowerCase());
  const next = [v, ...cur].slice(0, 5);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
}

function matches(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setRecent(loadRecent());
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const v = q.trim();
    if (!v) return null;
    const recipeR = recipes.filter((r) => matches(r.title, v) || matches(r.benefit, v) || r.category.some((c) => matches(c, v))).slice(0, 6)
      .map((r): Result => ({ kind: "recipe", id: r.id, title: r.title, benefit: r.benefit, photo: unsplash(r.cover, 120) }));
    const productR = products.filter((p) => matches(p.name, v) || matches(p.brand, v) || matches(p.benefit, v) || p.hairType.some((h) => matches(h, v))).slice(0, 6)
      .map((p): Result => ({ kind: "product", id: p.id, name: p.name, brand: p.brand, hairType: p.hairType[0], photo: unsplash(p.photo, 120) }));
    const tipR: Result[] = [
      ...dailyTips.filter((t) => matches(t, v)).slice(0, 3).map((t, i): Result => ({ kind: "tip", id: `do-${i}`, text: t, category: "À faire" })),
      ...tipsDont.filter((t) => matches(t, v)).slice(0, 3).map((t, i): Result => ({ kind: "tip", id: `dont-${i}`, text: t, category: "À éviter" })),
    ].slice(0, 5);
    const hairR = Object.entries(auras).filter(([k, a]) => matches(k, v) || matches(a.name, v) || matches(a.description, v)).slice(0, 5)
      .map(([k, a]): Result => ({ kind: "hair", id: k, name: `Type ${k} — ${a.name}`, description: a.description, emoji: a.emoji }));
    return { recipes: recipeR, products: productR, tips: tipR, hair: hairR };
  }, [q]);

  const total = results ? results.recipes.length + results.products.length + results.tips.length + results.hair.length : 0;

  const go = (path: string) => {
    pushRecent(q);
    onClose();
    navigate({ to: path });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
          role="dialog" aria-modal="true" aria-label="Recherche globale"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="border-b border-border bg-card/80">
            <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
              <Search className="size-5 text-primary shrink-0" aria-hidden />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher recettes, produits, conseils..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                aria-label="Champ de recherche"
              />
              <button onClick={onClose} aria-label="Fermer la recherche" className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto p-4 space-y-6">
              {!results && (
                <>
                  {recent.length > 0 && (
                    <section>
                      <h3 className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                        <Clock className="size-3.5" /> Récents
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button key={r} onClick={() => setQ(r)} className="px-3 py-1.5 rounded-full bg-secondary text-sm hover:bg-primary/15 transition-colors">
                            {r}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                  <section>
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      <TrendingUp className="size-3.5" /> Populaires
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((p) => (
                        <button key={p} onClick={() => setQ(p)} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
                          {p}
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {results && total === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl">🌸</div>
                  <div className="font-display text-xl">Aucun résultat</div>
                  <p className="text-sm text-muted-foreground">Essayez de demander à Bloom, votre assistante capillaire.</p>
                </div>
              )}

              {results && results.recipes.length > 0 && (
                <Section title="RECETTES" icon={<Sprout className="size-3.5" />}>
                  {results.recipes.map((r) => r.kind === "recipe" && (
                    <ResultRow key={`r-${r.id}`} onClick={() => go("/recipes")} aria-label={`Recette ${r.title}`}>
                      <img src={r.photo} alt="" className="size-10 rounded-lg object-cover shrink-0" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{r.title}</div>
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">{r.benefit}</span>
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {results && results.products.length > 0 && (
                <Section title="PRODUITS" icon={<ShoppingBag className="size-3.5" />}>
                  {results.products.map((p) => p.kind === "product" && (
                    <ResultRow key={`p-${p.id}`} onClick={() => go("/shop")} aria-label={`Produit ${p.name}`}>
                      <img src={p.photo} alt="" className="size-10 rounded-lg object-cover shrink-0" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{p.brand} — {p.name}</div>
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary">{p.hairType}</span>
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {results && results.tips.length > 0 && (
                <Section title="CONSEILS" icon={<BookOpen className="size-3.5" />}>
                  {results.tips.map((t) => t.kind === "tip" && (
                    <ResultRow key={t.id} onClick={() => go("/conseils")} aria-label={`Conseil ${t.category}`}>
                      <div className="size-10 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0">
                        <Sparkles className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase text-muted-foreground">{t.category}</div>
                        <div className="text-sm truncate">{t.text}</div>
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}

              {results && results.hair.length > 0 && (
                <Section title="TYPES DE CHEVEUX" icon={<Droplet className="size-3.5" />}>
                  {results.hair.map((h) => h.kind === "hair" && (
                    <ResultRow key={h.id} onClick={() => go("/aura")} aria-label={`Type ${h.id}`}>
                      <div className="size-10 rounded-lg bg-accent/20 grid place-items-center text-xl shrink-0">{h.emoji}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{h.description}</div>
                      </div>
                    </ResultRow>
                  ))}
                </Section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
        {icon} {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function ResultRow({ children, onClick, ...rest }: { children: React.ReactNode; onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      {...rest}
    >
      {children}
    </button>
  );
}