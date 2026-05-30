import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Heart, ShoppingCart, Info } from "lucide-react";
import { products, productHairTypes, productProblems, unsplash } from "@/lib/hair-data";
import { useProfile } from "@/lib/storage";
import { addToCart, toggleWishlist, trackAffiliateClick, useWishlist } from "@/lib/cart";
import { toast } from "sonner";

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
  const wish = useWishlist();
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

  const favorites = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl text-primary">🛍️ Shop</h1>
        <p className="text-muted-foreground text-sm">Sélection de produits validés par notre équipe</p>
      </header>

      <div className="glass rounded-2xl p-3 flex items-start gap-2 text-xs">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p>🌸 HairBloom peut recevoir une commission sur les achats effectués via nos liens. Cela nous aide à garder l'app gratuite!</p>
      </div>

      <section>
        <h2 className="font-display text-xl mb-3 text-primary">💝 Nos Favoris</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {favorites.map((pr) => (
            <motion.div key={pr.id} whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden">
              <img src={unsplash(pr.photo, 600)} alt={pr.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="text-[10px] text-primary uppercase">{pr.brand}</div>
                <div className="font-display text-sm truncate">{pr.name}</div>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="flex items-center gap-1"><Star className="size-3 fill-primary text-primary" />{pr.rating}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">🏆 Top</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="space-y-2">
        <Filter label="Type" options={productHairTypes} value={t} onChange={setT} />
        <Filter label="Problème" options={productProblems} value={p} onChange={setP} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((pr) => (
          <motion.div key={pr.id} whileHover={{ y: -3, scale: 1.02 }} className="glass rounded-2xl p-3 flex gap-3 items-center">
            <div className="relative shrink-0">
              <img src={unsplash(pr.photo, 200)} alt={pr.name} className="w-20 h-20 rounded-xl object-cover" onError={(e) => { (e.currentTarget.style.background = "#F5C4B3"); }} />
              {isRecommended(pr) && (
                <span className="absolute -top-1 -left-1 text-[9px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium" title="Pour vous">🏆 Pour vous</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] text-primary uppercase tracking-wide truncate">{pr.brand}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium shrink-0">{pr.price}</span>
              </div>
              <h3 className="font-display text-sm leading-tight mb-1 truncate">{pr.name}</h3>
              <div className="text-[11px] text-muted-foreground line-clamp-1 mb-1">🌟 {pr.benefit}</div>
              <div className="flex items-center justify-between gap-1 text-[10px] mb-1.5">
                <span className="flex items-center gap-1"><Star className="size-3 fill-primary text-primary" />{pr.rating}</span>
                <span className="text-muted-foreground">💰 Affilié</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { addToCart(pr.id); toast.success("Ajouté au panier 🛒"); }} className="flex-1 bg-primary text-primary-foreground rounded-full px-2 py-1 text-[11px] flex items-center justify-center gap-1"><ShoppingCart className="size-3" />Panier</button>
                <button onClick={() => toggleWishlist(pr.id)} className={`size-7 rounded-full grid place-items-center border ${wish.includes(pr.id) ? "bg-destructive/10 border-destructive text-destructive" : "border-border"}`}><Heart className={`size-3.5 ${wish.includes(pr.id) ? "fill-destructive" : ""}`} /></button>
                <a href={`https://${pr.url}`} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick(pr.id)} className="size-7 rounded-full grid place-items-center border border-border text-primary"><ExternalLink className="size-3.5" /></a>
              </div>
            </div>
          </motion.div>
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