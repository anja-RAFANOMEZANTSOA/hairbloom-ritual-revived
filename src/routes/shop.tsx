import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Sparkles } from "lucide-react";
import { products, productHairTypes, productProblems, unsplash } from "@/lib/hair-data";
import { useProfile } from "@/lib/storage";

export const Route = createFileRoute("/shop")({ component: Shop });

function inferTypeFromHair(h?: string) {
  if (!h) return "Tous";
  if (h.startsWith("1")) return "Raides";
  if (h.startsWith("2")) return "Ondulés";
  if (h.startsWith("3")) return "Bouclés";
  if (h.startsWith("4")) return "Crépus";
  return "Tous";
}

function Shop() {
  const [profile] = useProfile();
  const [t, setT] = useState("Tous");
  const [p, setP] = useState("Tous");
  const myType = inferTypeFromHair(profile.hairType);

  const list = products.filter((pr) => {
    const typeOk = t === "Tous" || pr.hairType.includes(t) || pr.hairType.includes("Tous");
    const probOk = p === "Tous" || pr.problem.includes(p);
    return typeOk && probOk;
  });

  const isRecommended = (pr: typeof products[number]) =>
    profile.hairType && (pr.hairType.includes(myType) || pr.problem.includes(profile.problem || ""));

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Shop</h1>
        <p className="text-muted-foreground text-sm">Sélection de produits validés par notre équipe</p>
      </header>

      <div className="space-y-2">
        <Filter label="Type" options={productHairTypes} value={t} onChange={setT} />
        <Filter label="Problème" options={productProblems} value={p} onChange={setP} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((pr) => (
          <motion.a key={pr.id} href={`https://${pr.url}`} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} className="bg-card rounded-3xl overflow-hidden border border-border block">
            <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${unsplash(pr.photo, 600)})` }}>
              {isRecommended(pr) && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center gap-1"><Sparkles className="size-3" />Pour vous</span>
              )}
              <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/95 text-[10px] font-medium">{pr.price}</span>
            </div>
            <div className="p-4">
              <div className="text-xs text-primary mb-1">{pr.brand}</div>
              <h3 className="font-display text-base leading-tight mb-1">{pr.name}</h3>
              <div className="text-xs text-muted-foreground mb-2">{pr.benefit}</div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-xs"><Star className="size-3 fill-primary text-primary" />{pr.rating}</span>
                <span className="text-xs text-primary flex items-center gap-1">Voir <ExternalLink className="size-3" /></span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function Filter({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-xs text-muted-foreground shrink-0 w-16">{label} :</span>
      <div className="flex gap-1.5">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all ${value === o ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}