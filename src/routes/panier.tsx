import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ExternalLink } from "lucide-react";
import { useCart, setQty, removeFromCart, clearCart, trackAffiliateClick } from "@/lib/cart";
import { products, unsplash } from "@/lib/hair-data";
import { toast } from "sonner";

export const Route = createFileRoute("/panier")({ component: Panier });

function Panier() {
  const cart = useCart();
  const [openOrder, setOpenOrder] = useState(false);
  const [delivery, setDelivery] = useState<"std" | "express" | "pickup">("std");
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id)! })).filter((x) => x.product);
  const count = items.reduce((s, x) => s + x.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
        <h1 className="font-display text-3xl text-primary">🛒 Mon Panier</h1>
        <div className="glass rounded-3xl p-10">
          <div className="text-6xl mb-3">🌸</div>
          <p className="text-muted-foreground mb-4">Votre panier est vide pour l'instant.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-sm">
            <ShoppingBag className="size-4" /> Explorer le Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
      <h1 className="font-display text-3xl text-primary">🛒 Mon Panier ({count})</h1>
      <div className="space-y-3">
        {items.map(({ product: p, qty }) => (
          <motion.div key={p.id} layout className="glass rounded-2xl p-3 flex gap-3 items-center">
            <img src={unsplash(p.photo, 200)} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-primary uppercase">{p.brand}</div>
              <div className="font-display text-sm truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.price}</div>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary rounded-full px-2 py-1">
              <button onClick={() => setQty(p.id, qty - 1)} className="size-6 rounded-full bg-card grid place-items-center"><Minus className="size-3" /></button>
              <span className="text-sm font-medium w-5 text-center">{qty}</span>
              <button onClick={() => setQty(p.id, qty + 1)} className="size-6 rounded-full bg-card grid place-items-center"><Plus className="size-3" /></button>
            </div>
            <button onClick={() => removeFromCart(p.id)} className="text-destructive p-2"><Trash2 className="size-4" /></button>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4 flex justify-between items-center">
        <div>
          <div className="text-xs text-muted-foreground">Sous-total</div>
          <div className="font-display text-2xl text-primary">{count} produit{count > 1 ? "s" : ""}</div>
        </div>
        <button onClick={() => setOpenOrder(true)} className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-medium hover:scale-[1.02] transition-transform">Commander →</button>
      </div>

      {openOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur grid place-items-center p-4" onClick={() => setOpenOrder(false)}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-card rounded-3xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl">Récapitulatif</h2>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {items.map(({ product: p, qty }) => (
                <div key={p.id} className="flex justify-between text-sm"><span className="truncate">{p.name} × {qty}</span><span className="text-muted-foreground">{p.price}</span></div>
              ))}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Livraison</div>
              <div className="grid grid-cols-3 gap-2">
                {[{ k: "std", l: "🚚 Standard" }, { k: "express", l: "⚡ Express" }, { k: "pickup", l: "🏪 Retrait" }].map((o) => (
                  <button key={o.k} onClick={() => setDelivery(o.k as never)} className={`p-2 rounded-xl text-xs border-2 transition-colors ${delivery === o.k ? "border-primary bg-secondary" : "border-border"}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Acheter chez la marque</div>
              {items.map(({ product: p }) => (
                <a key={p.id} href={`https://${p.url}`} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick(p.id)} className="flex items-center justify-between bg-secondary rounded-xl px-3 py-2 text-sm hover:bg-primary/10">
                  <span className="truncate">{p.brand}</span>
                  <ExternalLink className="size-3.5 text-primary shrink-0" />
                </a>
              ))}
            </div>
            <button onClick={() => { clearCart(); setOpenOrder(false); toast.success("Commande enregistrée 🌸"); }} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-medium">Confirmer la commande</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}