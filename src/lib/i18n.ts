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
    home: "Accueil", photo: "Photo IA", quiz: "Quiz", diagnostic: "Diagnostic",
    inci: "Scanner INCI", aura: "Mon Aura", recipes: "Recettes", shop: "Boutique",
    cart: "Panier", wishlist: "Favoris", journal: "Journal", calendar: "Calendrier",
    plan: "Plan 30 jours", repousse: "Repousse", before_after: "Avant / Après",
    weather: "Météo", history: "Historique", community: "Communauté",
    advice: "Conseils", badges: "Trophées", profile: "Profil",
    notifications: "Notifications", search_placeholder: "Rechercher recettes, produits, conseils...",
    section_analysis: "Analyse", section_care: "Soins", section_tracking: "Suivi",
    section_community: "Communauté", section_account: "Compte",
    add_cart: "Ajouter au panier", checkout: "Commander", view_product: "Voir le produit",
    logout: "Se déconnecter", greeting: "Bonjour", tagline: "Your hair. Your ritual.",
    daily_tip: "Conseil du jour", my_ritual: "Mon rituel — 7 jours",
    redo_analysis: "Refaire mon analyse", join_challenge: "Rejoindre le défi 21 jours",
    explore_by_type: "Explorez par type", discover_type: "Découvrez votre type",
    quick_access: "Accès rapide", featured_recipe: "Recette du moment",
    trending_product: "Produit tendance", try_now: "Essayer maintenant",
    see_all: "Voir tout", community_latest: "Communauté — Derniers posts",
  },
  en: {
    home: "Home", photo: "AI Photo", quiz: "Quiz", diagnostic: "Diagnostic",
    inci: "INCI Scanner", aura: "My Aura", recipes: "Recipes", shop: "Shop",
    cart: "Cart", wishlist: "Wishlist", journal: "Journal", calendar: "Calendar",
    plan: "30-day Plan", repousse: "Regrowth", before_after: "Before / After",
    weather: "Weather", history: "History", community: "Community",
    advice: "Tips", badges: "Trophies", profile: "Profile",
    notifications: "Notifications", search_placeholder: "Search recipes, products, tips...",
    section_analysis: "Analysis", section_care: "Care", section_tracking: "Tracking",
    section_community: "Community", section_account: "Account",
    add_cart: "Add to cart", checkout: "Checkout", view_product: "View product",
    logout: "Sign out", greeting: "Hello", tagline: "Your hair. Your ritual.",
    daily_tip: "Daily tip", my_ritual: "My ritual — 7 days",
    redo_analysis: "Redo my analysis", join_challenge: "Join the 21-day challenge",
    explore_by_type: "Explore by type", discover_type: "Discover your type",
    quick_access: "Quick access", featured_recipe: "Featured recipe",
    trending_product: "Trending product", try_now: "Try now",
    see_all: "See all", community_latest: "Community — Latest posts",
  },
  ar: {
    home: "الرئيسية", photo: "صورة الذكاء", quiz: "اختبار", diagnostic: "تشخيص",
    inci: "ماسح INCI", aura: "هالتي", recipes: "الوصفات", shop: "المتجر",
    cart: "السلة", wishlist: "المفضلة", journal: "اليوميات", calendar: "التقويم",
    plan: "خطة 30 يوم", repousse: "إعادة النمو", before_after: "قبل / بعد",
    weather: "الطقس", history: "السجل", community: "المجتمع",
    advice: "نصائح", badges: "الجوائز", profile: "الملف",
    notifications: "الإشعارات", search_placeholder: "ابحث عن وصفات، منتجات، نصائح...",
    section_analysis: "تحليل", section_care: "العناية", section_tracking: "متابعة",
    section_community: "المجتمع", section_account: "الحساب",
    add_cart: "أضف إلى السلة", checkout: "اطلب الآن", view_product: "عرض المنتج",
    logout: "تسجيل خروج", greeting: "مرحبا", tagline: "شعرك. طقوسك.",
    daily_tip: "نصيحة اليوم", my_ritual: "طقوسي — 7 أيام",
    redo_analysis: "إعادة التحليل", join_challenge: "انضم لتحدي 21 يوم",
    explore_by_type: "استكشف حسب النوع", discover_type: "اكتشف نوع شعرك",
    quick_access: "وصول سريع", featured_recipe: "وصفة اللحظة",
    trending_product: "منتج رائج", try_now: "جرب الآن",
    see_all: "عرض الكل", community_latest: "المجتمع — أحدث المنشورات",
  },
  mg: {
    home: "Fandraisana", photo: "Sary AI", quiz: "Fanontaniana", diagnostic: "Fitiliana",
    inci: "Scanner INCI", aura: "Aura-ko", recipes: "Reseta", shop: "Fivarotana",
    cart: "Harona", wishlist: "Tiana", journal: "Diary", calendar: "Kalandrie",
    plan: "Drafitra 30 andro", repousse: "Fitomboana", before_after: "Talohan' / Aorian'",
    weather: "Toetr'andro", history: "Tantara", community: "Vondrona",
    advice: "Torohevitra", badges: "Loka", profile: "Mombamomba",
    notifications: "Fampandrenesana", search_placeholder: "Mitady reseta, vokatra, torohevitra...",
    section_analysis: "Fandinihana", section_care: "Fikarakarana", section_tracking: "Fanaraha-maso",
    section_community: "Vondrona", section_account: "Kaonty",
    add_cart: "Ampio amin'ny harona", checkout: "Mividy", view_product: "Hijery",
    logout: "Hivoaka", greeting: "Salama", tagline: "Ny volonao. Ny fombafombanao.",
    daily_tip: "Torohevitry ny andro", my_ritual: "Fombafombako — 7 andro",
    redo_analysis: "Averina ny fanadihadiana", join_challenge: "Hiditra amin'ny fihaikana 21 andro",
    explore_by_type: "Zahao araka ny karazana", discover_type: "Fantaro ny karazanao",
    quick_access: "Fidirana haingana", featured_recipe: "Resetan'ny fotoana",
    trending_product: "Vokatra malaza", try_now: "Andramo izao",
    see_all: "Jereo rehetra", community_latest: "Vondrona — Lahatsoratra farany",
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