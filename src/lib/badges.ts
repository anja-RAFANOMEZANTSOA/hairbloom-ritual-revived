import { useEffect, useMemo, useState } from "react";
import {
  Sparkles, Star, Gem, Crown, FlaskConical, Leaf, Trophy, Zap,
  Search, ScanSearch, HelpCircle, Microscope,
  Target, Dumbbell, Wand2, Camera,
  Users, Heart, Flower2, Award,
  type LucideIcon,
} from "lucide-react";
import { useChallenge } from "./challenge";
import { recipes } from "./hair-data";

export type BadgeId =
  | "first_routine" | "perfect_week" | "month_discipline" | "ritual_confirmed"
  | "first_mask" | "kitchen_hair" | "chef_care" | "express_mask"
  | "explorer" | "type_revealed" | "quiz_expert" | "scanner_pro"
  | "challenge_started" | "halfway" | "transformed" | "shared_before_after"
  | "first_post" | "inspiring" | "advice_expert"
  | "vip";

export type BadgeCategory = "Routine" | "Recettes" | "Découverte" | "Défi" | "Communauté" | "Spécial";

export type BadgeDef = {
  id: BadgeId;
  name: string;
  emoji: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: BadgeCategory;
  /** progress 0..1 + current value & target for display */
  evaluate: (ctx: BadgeContext) => { unlocked: boolean; progress: number; current: number; target: number };
};

export type BadgeContext = {
  challengeDoneCount: number;
  challengeStreak: number;
  challengeStarted: boolean;
  totalRoutineDays: number;
  recipesMade: number[];
  expressMask: boolean;
  visitedScreens: string[];
  photoAnalysisDone: boolean;
  quizDone: boolean;
  inciScans: number;
  beforeAfterShared: boolean;
  myPostsCount: number;
  postLikesMax: number;
  helpfulReplies: number;
};

export const TRACKABLE_SCREENS = [
  "/", "/photo", "/quiz", "/diagnostic", "/recipes", "/shop", "/panier",
  "/wishlist", "/journal", "/communaute", "/avant-apres", "/meteo",
  "/repousse", "/inci", "/aura", "/plan", "/conseils", "/historique",
  "/profil",
];

export const BADGES: BadgeDef[] = [
  // ROUTINE
  { id: "first_routine", name: "Première Routine", emoji: "✨", description: "Complétez votre premier jour", icon: Sparkles, color: "#C9956A", category: "Routine",
    evaluate: (c) => ({ unlocked: c.totalRoutineDays >= 1, progress: Math.min(1, c.totalRoutineDays), current: Math.min(1, c.totalRoutineDays), target: 1 }) },
  { id: "perfect_week", name: "Semaine Parfaite", emoji: "🌟", description: "7 jours consécutifs", icon: Star, color: "#E8B4B8", category: "Routine",
    evaluate: (c) => ({ unlocked: c.challengeStreak >= 7, progress: Math.min(1, c.challengeStreak / 7), current: c.challengeStreak, target: 7 }) },
  { id: "month_discipline", name: "Mois de Discipline", emoji: "💎", description: "30 jours consécutifs", icon: Gem, color: "#9B72CF", category: "Routine",
    evaluate: (c) => ({ unlocked: c.challengeStreak >= 30, progress: Math.min(1, c.challengeStreak / 30), current: c.challengeStreak, target: 30 }) },
  { id: "ritual_confirmed", name: "Rituelle Confirmée", emoji: "👑", description: "100 jours de routine au total", icon: Crown, color: "#D4A574", category: "Routine",
    evaluate: (c) => ({ unlocked: c.totalRoutineDays >= 100, progress: Math.min(1, c.totalRoutineDays / 100), current: c.totalRoutineDays, target: 100 }) },

  // RECIPES
  { id: "first_mask", name: "Premier Masque", emoji: "🫙", description: "Réalisez votre première recette DIY", icon: FlaskConical, color: "#87A878", category: "Recettes",
    evaluate: (c) => ({ unlocked: c.recipesMade.length >= 1, progress: Math.min(1, c.recipesMade.length), current: Math.min(1, c.recipesMade.length), target: 1 }) },
  { id: "kitchen_hair", name: "Cuisine Capillaire", emoji: "🌿", description: "5 recettes différentes", icon: Leaf, color: "#5C8A5C", category: "Recettes",
    evaluate: (c) => ({ unlocked: c.recipesMade.length >= 5, progress: Math.min(1, c.recipesMade.length / 5), current: c.recipesMade.length, target: 5 }) },
  { id: "chef_care", name: "Chef des Soins", emoji: "🏆", description: "Toutes les recettes (25)", icon: Trophy, color: "#C9A84C", category: "Recettes",
    evaluate: (c) => ({ unlocked: c.recipesMade.length >= 25, progress: Math.min(1, c.recipesMade.length / 25), current: c.recipesMade.length, target: 25 }) },
  { id: "express_mask", name: "Masque Express", emoji: "⚡", description: "Masque terminé en moins de 20 min", icon: Zap, color: "#E8C07A", category: "Recettes",
    evaluate: (c) => ({ unlocked: c.expressMask, progress: c.expressMask ? 1 : 0, current: c.expressMask ? 1 : 0, target: 1 }) },

  // DISCOVERY
  { id: "explorer", name: "Explorateur", emoji: "🔍", description: "Visitez tous les écrans de l'app", icon: Search, color: "#3B82F6", category: "Découverte",
    evaluate: (c) => ({ unlocked: c.visitedScreens.length >= TRACKABLE_SCREENS.length, progress: Math.min(1, c.visitedScreens.length / TRACKABLE_SCREENS.length), current: c.visitedScreens.length, target: TRACKABLE_SCREENS.length }) },
  { id: "type_revealed", name: "Mon Type Révélé", emoji: "🪞", description: "Analyse photo IA terminée", icon: ScanSearch, color: "#C9956A", category: "Découverte",
    evaluate: (c) => ({ unlocked: c.photoAnalysisDone, progress: c.photoAnalysisDone ? 1 : 0, current: c.photoAnalysisDone ? 1 : 0, target: 1 }) },
  { id: "quiz_expert", name: "Quiz Expert", emoji: "❓", description: "Complétez le quiz cheveux", icon: HelpCircle, color: "#E8B4B8", category: "Découverte",
    evaluate: (c) => ({ unlocked: c.quizDone, progress: c.quizDone ? 1 : 0, current: c.quizDone ? 1 : 0, target: 1 }) },
  { id: "scanner_pro", name: "Scanner Pro", emoji: "🔬", description: "Scannez 3 produits avec INCI", icon: Microscope, color: "#5CBDB9", category: "Découverte",
    evaluate: (c) => ({ unlocked: c.inciScans >= 3, progress: Math.min(1, c.inciScans / 3), current: c.inciScans, target: 3 }) },

  // CHALLENGE
  { id: "challenge_started", name: "Défi Accepté", emoji: "🎯", description: "Lancez le défi 21 jours", icon: Target, color: "#E85D3A", category: "Défi",
    evaluate: (c) => ({ unlocked: c.challengeStarted, progress: c.challengeStarted ? 1 : 0, current: c.challengeStarted ? 1 : 0, target: 1 }) },
  { id: "halfway", name: "Mi-Chemin", emoji: "💪", description: "Jour 11 du défi atteint", icon: Dumbbell, color: "#F7931E", category: "Défi",
    evaluate: (c) => ({ unlocked: c.challengeDoneCount >= 11, progress: Math.min(1, c.challengeDoneCount / 11), current: c.challengeDoneCount, target: 11 }) },
  { id: "transformed", name: "Transformée", emoji: "✨", description: "Défi 21 jours complété", icon: Wand2, color: "#9B72CF", category: "Défi",
    evaluate: (c) => ({ unlocked: c.challengeDoneCount >= 21, progress: Math.min(1, c.challengeDoneCount / 21), current: c.challengeDoneCount, target: 21 }) },
  { id: "shared_before_after", name: "Avant-Après Partagé", emoji: "📸", description: "Partagez une transformation", icon: Camera, color: "#C44569", category: "Défi",
    evaluate: (c) => ({ unlocked: c.beforeAfterShared, progress: c.beforeAfterShared ? 1 : 0, current: c.beforeAfterShared ? 1 : 0, target: 1 }) },

  // COMMUNITY
  { id: "first_post", name: "Première Publication", emoji: "🤝", description: "Publiez dans la communauté", icon: Users, color: "#3B82F6", category: "Communauté",
    evaluate: (c) => ({ unlocked: c.myPostsCount >= 1, progress: Math.min(1, c.myPostsCount), current: Math.min(1, c.myPostsCount), target: 1 }) },
  { id: "inspiring", name: "Inspirante", emoji: "💫", description: "Recevez 10 likes sur un post", icon: Heart, color: "#E94560", category: "Communauté",
    evaluate: (c) => ({ unlocked: c.postLikesMax >= 10, progress: Math.min(1, c.postLikesMax / 10), current: c.postLikesMax, target: 10 }) },
  { id: "advice_expert", name: "Experte Conseils", emoji: "🌸", description: "5 réponses utiles données", icon: Flower2, color: "#E8B4B8", category: "Communauté",
    evaluate: (c) => ({ unlocked: c.helpfulReplies >= 5, progress: Math.min(1, c.helpfulReplies / 5), current: c.helpfulReplies, target: 5 }) },

  // SPECIAL — evaluated specially
  { id: "vip", name: "HairBloom VIP", emoji: "💜", description: "Débloquez tous les autres trophées", icon: Award, color: "#9B72CF", category: "Spécial",
    evaluate: () => ({ unlocked: false, progress: 0, current: 0, target: 19 }) },
];

const VISITED_KEY = "hairbloom_visited_screens";
const UNLOCKED_KEY = "hairbloom_badges_unlocked"; // Record<BadgeId, ISO date>
const INCI_KEY = "hairbloom_inci_scans";
const HELPFUL_KEY = "hairbloom_helpful_replies";
const BEFORE_AFTER_KEY = "hairbloom_before_after_shared";
const ROUTINE_TOTAL_KEY = "hairbloom_routine_total_days";

export function trackVisit(path: string) {
  if (typeof window === "undefined") return;
  if (!TRACKABLE_SCREENS.includes(path)) return;
  try {
    const raw = localStorage.getItem(VISITED_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(path)) {
      list.push(path);
      localStorage.setItem(VISITED_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("hairbloom:badges-tick"));
    }
  } catch {}
}

export function bumpInciScan() {
  if (typeof window === "undefined") return;
  const n = parseInt(localStorage.getItem(INCI_KEY) || "0", 10) + 1;
  localStorage.setItem(INCI_KEY, String(n));
  window.dispatchEvent(new Event("hairbloom:badges-tick"));
}

export function bumpHelpfulReply() {
  if (typeof window === "undefined") return;
  const n = parseInt(localStorage.getItem(HELPFUL_KEY) || "0", 10) + 1;
  localStorage.setItem(HELPFUL_KEY, String(n));
  window.dispatchEvent(new Event("hairbloom:badges-tick"));
}

export function markBeforeAfterShared() {
  if (typeof window === "undefined") return;
  localStorage.setItem(BEFORE_AFTER_KEY, "1");
  window.dispatchEvent(new Event("hairbloom:badges-tick"));
}

function readUnlocked(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(UNLOCKED_KEY) || "{}"); } catch { return {}; }
}

function writeUnlocked(v: Record<string, string>) {
  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(v));
  window.dispatchEvent(new Event("hairbloom:badges-unlock"));
}

function buildContext(): BadgeContext {
  // Read everything from localStorage
  const ls = typeof window === "undefined" ? null : window.localStorage;
  const get = (k: string) => (ls ? ls.getItem(k) : null);

  let challengeDoneCount = 0;
  let challengeStreak = 0;
  let challengeStarted = false;
  try {
    const ch = JSON.parse(get("hairbloom_challenge_v1") || "null");
    if (ch) {
      challengeStarted = !!ch.startedAt;
      const done = Object.values(ch.done || {}).filter(Boolean) as boolean[];
      challengeDoneCount = done.length;
      let st = 0;
      for (let i = 21; i >= 1; i--) {
        if (ch.done?.[i]) st++;
        else if (st > 0) break;
      }
      challengeStreak = st;
    }
  } catch {}

  let recipesMade: number[] = [];
  try { recipesMade = JSON.parse(get("hairbloom_recipes_made") || "[]"); } catch {}

  let visitedScreens: string[] = [];
  try { visitedScreens = JSON.parse(get(VISITED_KEY) || "[]"); } catch {}

  const photoAnalysisDone = !!get("hairbloom_photo_done");
  const quizDone = !!get("hairbloom_quiz_done");
  const expressMask = get("hairbloom_express_mask") === "1";
  const inciScans = parseInt(get(INCI_KEY) || "0", 10);
  const helpfulReplies = parseInt(get(HELPFUL_KEY) || "0", 10);
  const beforeAfterShared = !!get(BEFORE_AFTER_KEY);
  const totalRoutineDays = parseInt(get(ROUTINE_TOTAL_KEY) || "0", 10) || challengeDoneCount;

  let myPostsCount = 0;
  let postLikesMax = 0;
  try {
    const posts = JSON.parse(get("hairbloom_community") || "[]");
    const mine = posts.filter((p: any) => p.mine);
    myPostsCount = mine.length;
    postLikesMax = mine.reduce((m: number, p: any) => Math.max(m, p.likes || 0), 0);
  } catch {}

  return {
    challengeDoneCount, challengeStreak, challengeStarted,
    totalRoutineDays,
    recipesMade, expressMask,
    visitedScreens, photoAnalysisDone, quizDone, inciScans,
    beforeAfterShared,
    myPostsCount, postLikesMax, helpfulReplies,
  };
}

export type BadgeStatus = {
  def: BadgeDef;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  current: number;
  target: number;
};

function evaluateAll(ctx: BadgeContext): BadgeStatus[] {
  const stored = readUnlocked();
  const list = BADGES.filter((b) => b.id !== "vip").map((def) => {
    const r = def.evaluate(ctx);
    return {
      def,
      unlocked: r.unlocked,
      unlockedAt: stored[def.id] ?? (r.unlocked ? new Date().toISOString() : null),
      progress: r.progress,
      current: r.current,
      target: r.target,
    };
  });
  const unlockedCount = list.filter((b) => b.unlocked).length;
  const vipDef = BADGES.find((b) => b.id === "vip")!;
  const vipUnlocked = unlockedCount >= list.length;
  list.push({
    def: vipDef,
    unlocked: vipUnlocked,
    unlockedAt: stored.vip ?? (vipUnlocked ? new Date().toISOString() : null),
    progress: list.length ? unlockedCount / list.length : 0,
    current: unlockedCount,
    target: list.length,
  });
  return list;
}

export function useBadges() {
  const challenge = useChallenge(); // reactive
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((n) => n + 1);
    window.addEventListener("hairbloom:badges-tick", handler);
    window.addEventListener("hairbloom:badges-unlock", handler);
    window.addEventListener("hairbloom:recipes-made", handler);
    window.addEventListener("hairbloom:community", handler);
    window.addEventListener("hairbloom:challenge", handler);
    window.addEventListener("hairbloom:initial-analysis", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("hairbloom:badges-tick", handler);
      window.removeEventListener("hairbloom:badges-unlock", handler);
      window.removeEventListener("hairbloom:recipes-made", handler);
      window.removeEventListener("hairbloom:community", handler);
      window.removeEventListener("hairbloom:challenge", handler);
      window.removeEventListener("hairbloom:initial-analysis", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return useMemo(() => {
    const ctx = buildContext();
    const all = evaluateAll(ctx);
    const unlocked = all.filter((b) => b.unlocked);
    const locked = all.filter((b) => !b.unlocked);
    // Persist freshly unlocked + dispatch celebration via separate observer.
    const stored = readUnlocked();
    let dirty = false;
    const newlyUnlocked: BadgeStatus[] = [];
    for (const b of unlocked) {
      if (!stored[b.def.id]) {
        stored[b.def.id] = new Date().toISOString();
        dirty = true;
        newlyUnlocked.push(b);
      }
    }
    if (dirty) {
      writeUnlocked(stored);
      const w = typeof window !== "undefined" ? window : null;
      if (w) {
        // Defer to next tick so UI subscribers can fire
        setTimeout(() => {
          newlyUnlocked.forEach((b) => {
            w.dispatchEvent(new CustomEvent("hairbloom:badge-newly-unlocked", { detail: b.def.id }));
          });
        }, 0);
      }
    }
    // Sort: unlocked first
    const sorted = [...unlocked, ...locked];
    // next-to-unlock (most progress)
    const next = [...locked].sort((a, b) => b.progress - a.progress)[0] ?? null;
    return { all: sorted, unlocked, locked, next, total: all.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, challenge]);
}

/** Convenience: dispatch celebration listener. */
export function useBadgeUnlockListener(onUnlock: (id: BadgeId) => void) {
  useEffect(() => {
    const h = (e: Event) => onUnlock((e as CustomEvent).detail as BadgeId);
    window.addEventListener("hairbloom:badge-newly-unlocked", h);
    return () => window.removeEventListener("hairbloom:badge-newly-unlocked", h);
  }, [onUnlock]);
}

export function getBadge(id: BadgeId): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

export const RECIPE_TOTAL = recipes.length;