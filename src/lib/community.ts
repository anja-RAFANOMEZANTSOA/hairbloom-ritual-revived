import { useEffect, useState } from "react";

export type CommunityPost = {
  id: string;
  user: string;
  avatar: string;
  hairType: string;
  topic: string;
  text: string;
  photo?: string;
  date: number;
  likes: number;
  liked?: boolean;
  comments: { id: string; user: string; text: string; date: number }[];
  featured?: boolean;
  mine?: boolean;
};

const KEY = "hairbloom_community";

const SEED: CommunityPost[] = [
  { id: "1", user: "Sofia M.", avatar: "👩🏻", hairType: "3b", topic: "✨ Transformation", featured: true, text: "Après 3 mois de soins maison, mes boucles sont enfin définies! Le secret? Hydratation + huile de jojoba chaque nuit.", photo: "photo-1522337360788-8b13dee7a37e", date: Date.now() - 86400000, likes: 124, comments: [{ id: "c1", user: "Léa", text: "Magnifique! 😍", date: Date.now() - 3600000 }] },
  { id: "2", user: "Amina K.", avatar: "👩🏾", hairType: "4a", topic: "🌿 Recette DIY", text: "Mon masque karité + avocat + miel — 1x/semaine, mes 4a sont en feu! Recette dans les commentaires.", date: Date.now() - 172800000, likes: 89, comments: [] },
  { id: "3", user: "Marie C.", avatar: "👩🏼", hairType: "2c", topic: "❓ Question", text: "Comment éviter les frisottis en saison humide? Mes ondulés deviennent un nid d'oiseau 😅", date: Date.now() - 259200000, likes: 34, comments: [{ id: "c2", user: "Sofia M.", text: "Sérum à l'argan + diffuseur basse chaleur!", date: Date.now() - 200000000 }] },
  { id: "4", user: "Inès B.", avatar: "👩🏽", hairType: "3c", topic: "💡 Conseil", text: "Astuce: dormez sur taie en soie. Mes boucles tiennent 3 jours au lieu d'1. Game changer.", date: Date.now() - 345600000, likes: 201, comments: [] },
  { id: "5", user: "Fatou D.", avatar: "👩🏿", hairType: "4c", topic: "🛍️ Produit favori", text: "Le beurre de mangue Cantu — 8€ et meilleur que les marques à 30€. Validé pour mes 4c.", date: Date.now() - 432000000, likes: 67, comments: [] },
  { id: "6", user: "Chloé R.", avatar: "👱🏻‍♀️", hairType: "1b", topic: "📸 Avant-Après", text: "6 mois sans chaleur, juste co-wash et masques. Différence incroyable sur la brillance.", photo: "photo-1492106087820-71f1a00d2b11", date: Date.now() - 518400000, likes: 156, comments: [] },
  { id: "7", user: "Yasmine T.", avatar: "👩🏻‍🦱", hairType: "3a", topic: "❓ Question", text: "Quelle huile pour la pousse? J'hésite entre ricin et romarin.", date: Date.now() - 604800000, likes: 22, comments: [{ id: "c3", user: "Amina K.", text: "Mélange les deux! Massage 3x/semaine.", date: Date.now() - 500000000 }] },
  { id: "8", user: "Léa P.", avatar: "👩🏼‍🦰", hairType: "2a", topic: "🌿 Recette DIY", text: "Rinçage vinaigre de cidre dilué — 1 fois/semaine. Brillance instantanée!", date: Date.now() - 691200000, likes: 78, comments: [] },
];

export const TRENDING = ["#CheveuxNaturels", "#MasqueDIY", "#PousseCheveux", "#AntiChute", "#BouclesDéfinies"];
export const TOPICS = ["🌿 Recette DIY", "✨ Transformation", "💡 Conseil", "❓ Question", "🛍️ Produit favori", "📸 Avant-Après"];

export function getPosts(): CommunityPost[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(SEED)); return SEED; }
    return JSON.parse(raw);
  } catch { return SEED; }
}
function save(list: CommunityPost[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("hairbloom:community"));
}
export function addPost(p: Omit<CommunityPost, "id" | "date" | "likes" | "comments">) {
  const post: CommunityPost = { ...p, id: crypto.randomUUID(), date: Date.now(), likes: 0, comments: [], mine: true };
  save([post, ...getPosts()]);
}
export function deletePost(id: string) { save(getPosts().filter((p) => p.id !== id)); }
export function toggleLike(id: string) {
  save(getPosts().map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
}
export function addComment(postId: string, text: string, user = "Vous") {
  save(getPosts().map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: crypto.randomUUID(), user, text, date: Date.now() }] } : p));
}

export function usePosts(): CommunityPost[] {
  const [v, setV] = useState<CommunityPost[]>([]);
  useEffect(() => {
    setV(getPosts());
    const h = () => setV(getPosts());
    window.addEventListener("hairbloom:community", h);
    return () => window.removeEventListener("hairbloom:community", h);
  }, []);
  return v;
}