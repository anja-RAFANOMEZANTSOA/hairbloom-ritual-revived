import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { useWishlist, toggleWishlist, addToCart, trackAffiliateClick } from "@/lib/cart";
import { products, unsplash } from "@/lib/hair-data";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({ component: Wishlist });

function Wishlist() {
  const ids = useWishlist();
  const items = ids.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
      <h1 className="font-display text-3xl text-primary">❤️ Mes Favoris</h1>
      {items.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <div className="text-6xl mb-3">🌸</div>
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore de favoris.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-sm"><ShoppingBag className="size-4" /> Découvrir</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-3 flex gap-3 items-center">
              <img src={unsplash(p.photo, 200)} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-primary uppercase">{p.brand}</div>
                <div className="font-display text-sm truncate">{p.name}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { addToCart(p.id); toast.success("Ajouté au panier 🛒"); }} className="text-xs bg-primary text-primary-foreground rounded-full px-3 py-1">+ Panier</button>
                  <a href={`https://${p.url}`} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick(p.id)} className="text-xs flex items-center gap-1 text-primary"><ExternalLink className="size-3" /></a>
                  <button onClick={() => toggleWishlist(p.id)} className="text-xs ml-auto text-destructive"><Heart className="size-4 fill-destructive" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}