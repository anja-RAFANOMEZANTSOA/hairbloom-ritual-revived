import { useEffect, useState } from "react";

export type Lang = "fr" | "en" | "ar" | "mg";
export const LANG_KEY = "hairbloom_language";
export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "mg", flag: "🇲🇬", label: "Malagasy" },
];

type Dict = Record<string, string>;
const dicts: Record<Lang, Dict> = {
  fr: {
    home: "Accueil", photo: "Photo IA", recipes: "Recettes", shop: "Shop", profile: "Profil",
    cart: "Panier", wishlist: "Favoris", journal: "Journal", community: "Communauté",
    plan: "Plan 30 jours", history: "Historique", notifications: "Notifications",
    add_cart: "Ajouter au panier", checkout: "Commander", view_product: "Voir le produit",
    logout: "Se déconnecter", greeting: "Bonjour",
  },
  en: {
    home: "Home", photo: "AI Photo", recipes: "Recipes", shop: "Shop", profile: "Profile",
    cart: "Cart", wishlist: "Wishlist", journal: "Journal", community: "Community",
    plan: "30-day Plan", history: "History", notifications: "Notifications",
    add_cart: "Add to cart", checkout: "Checkout", view_product: "View product",
    logout: "Sign out", greeting: "Hello",
  },
  ar: {
    home: "الرئيسية", photo: "صورة الذكاء", recipes: "الوصفات", shop: "المتجر", profile: "الملف",
    cart: "السلة", wishlist: "المفضلة", journal: "اليوميات", community: "المجتمع",
    plan: "خطة 30 يوم", history: "السجل", notifications: "الإشعارات",
    add_cart: "أضف إلى السلة", checkout: "اطلب الآن", view_product: "عرض المنتج",
    logout: "تسجيل خروج", greeting: "مرحبا",
  },
  mg: {
    home: "Fandraisana", photo: "Sary AI", recipes: "Reseta", shop: "Fivarotana", profile: "Mombamomba",
    cart: "Harona", wishlist: "Tiana", journal: "Diary", community: "Vondrona",
    plan: "Drafitra 30 andro", history: "Tantara", notifications: "Fampandrenesana",
    add_cart: "Ampio amin'ny harona", checkout: "Mividy", view_product: "Hijery",
    logout: "Hivoaka", greeting: "Salama",
  },
};

export function getLang(): Lang {
  if (typeof window === "undefined") return "fr";
  return (localStorage.getItem(LANG_KEY) as Lang) || "fr";
}
export function setLang(l: Lang) {
  localStorage.setItem(LANG_KEY, l);
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new Event("hairbloom:lang"));
}

export function useLang(): [Lang, (l: Lang) => void, (k: string) => string] {
  const [lang, setL] = useState<Lang>("fr");
  useEffect(() => {
    const l = getLang();
    setL(l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    const h = () => setL(getLang());
    window.addEventListener("hairbloom:lang", h);
    return () => window.removeEventListener("hairbloom:lang", h);
  }, []);
  const t = (k: string) => dicts[lang][k] || dicts.fr[k] || k;
  return [lang, setLang, t];
}