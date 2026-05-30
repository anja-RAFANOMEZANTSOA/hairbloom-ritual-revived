import { useEffect, useState } from "react";

export type CartItem = { id: string; qty: number };
const CART_KEY = "hairbloom_cart";
const WISH_KEY = "hairbloom_wishlist";
const CLICKS_KEY = "hairbloom_affiliate_clicks";

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? fb; } catch { return fb; }
}
function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event("hairbloom:cart"));
}

export function getCart(): CartItem[] { return read<CartItem[]>(CART_KEY, []); }
export function getWishlist(): string[] { return read<string[]>(WISH_KEY, []); }

export function addToCart(id: string) {
  const c = getCart();
  const ex = c.find((x) => x.id === id);
  if (ex) ex.qty += 1; else c.push({ id, qty: 1 });
  write(CART_KEY, c);
}
export function setQty(id: string, qty: number) {
  const c = getCart().map((x) => x.id === id ? { ...x, qty } : x).filter((x) => x.qty > 0);
  write(CART_KEY, c);
}
export function removeFromCart(id: string) {
  write(CART_KEY, getCart().filter((x) => x.id !== id));
}
export function clearCart() { write(CART_KEY, []); }

export function toggleWishlist(id: string) {
  const w = getWishlist();
  write(WISH_KEY, w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
}

export function trackAffiliateClick(id: string) {
  const c = read<Record<string, number>>(CLICKS_KEY, {});
  c[id] = (c[id] || 0) + 1;
  write(CLICKS_KEY, c);
}

function useStore<T>(getter: () => T): T {
  const [v, setV] = useState<T>(getter());
  useEffect(() => {
    setV(getter());
    const h = () => setV(getter());
    window.addEventListener("hairbloom:cart", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("hairbloom:cart", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return v;
}
export const useCart = () => useStore(getCart);
export const useWishlist = () => useStore(getWishlist);