import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Clock, RotateCcw, X, AlertTriangle } from "lucide-react";
import { recipes, recipeCategories, unsplash, type Recipe } from "@/lib/hair-data";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/recipes")({ component: Recipes });

function Recipes() {
  const [cat, setCat] = useState("Tous");
  const [open, setOpen] = useState<Recipe | null>(null);
  const [favs, setFavs] = useLocalStorage<number[]>("hairbloom_fav_recipes", []);

  const list = cat === "Tous" ? recipes : recipes.filter((r) => r.category.includes(cat));
  const toggleFav = (id: number) => setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Recettes naturelles</h1>
        <p className="text-muted-foreground text-sm">{recipes.length} recettes DIY testées</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {recipeCategories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((r) => (
          <motion.div key={r.id} whileHover={{ y: -3 }} className="bg-card rounded-3xl overflow-hidden border border-border cursor-pointer" onClick={() => setOpen(r)}>
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${unsplash(r.cover, 600)})` }} />
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-primary font-medium">{r.benefit}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}>
                  <Heart className={`size-4 ${favs.includes(r.id) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                </button>
              </div>
              <h3 className="font-display text-base leading-tight mb-2">{r.title}</h3>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3" />{r.duration}</span>
                <span className="flex items-center gap-1"><RotateCcw className="size-3" />{r.frequency}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setOpen(null)}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-background rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${unsplash(open.cover, 900)})` }}>
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 size-9 rounded-full bg-white/90 flex items-center justify-center"><X className="size-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <span className="text-xs uppercase tracking-wider text-primary font-medium">{open.benefit}</span>
              <h2 className="font-display text-2xl">{open.title}</h2>
              <div className="flex gap-3 text-xs">
                <span className="px-3 py-1 rounded-full bg-secondary flex items-center gap-1"><Clock className="size-3" />{open.duration}</span>
                <span className="px-3 py-1 rounded-full bg-secondary flex items-center gap-1"><RotateCcw className="size-3" />{open.frequency}</span>
              </div>
              {open.warning && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-2xl text-sm flex gap-2"><AlertTriangle className="size-4 shrink-0 mt-0.5" />{open.warning}</div>
              )}
              {open.ingredients.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-sm">Ingrédients</h3>
                  <div className="flex flex-wrap gap-3">
                    {open.ingredients.map((i) => (
                      <div key={i.name} className="flex flex-col items-center gap-1 w-16">
                        <img src={i.photo} alt={i.name} className="size-14 rounded-full object-cover border border-border" />
                        <span className="text-[10px] text-center">{i.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-medium mb-2 text-sm">Étapes</h3>
                <ol className="space-y-2">
                  {open.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="size-6 shrink-0 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}