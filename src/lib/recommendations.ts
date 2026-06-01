import { recipes, products, type Recipe, type Product } from "./hair-data";
import type { HairProfile } from "./storage";
import {
  Sparkles, Droplet, Wind, Sun, Moon, Scissors, Ruler, Camera, Flame,
  Leaf, Heart, FlaskConical, type LucideIcon,
} from "lucide-react";

function hairFamily(h?: string): "Raides" | "Ondulés" | "Bouclés" | "Crépus" {
  if (!h) return "Bouclés";
  if (h.startsWith("1")) return "Raides";
  if (h.startsWith("2")) return "Ondulés";
  if (h.startsWith("3")) return "Bouclés";
  return "Crépus";
}

const FAMILY_TO_CATEGORY: Record<string, string[]> = {
  Raides: ["Brillance", "Protéine"],
  Ondulés: ["Hydratation", "Brillance"],
  Bouclés: ["Hydratation", "Croissance"],
  Crépus: ["Hydratation", "Cuir chevelu"],
};

export function matchRecipes(profile: HairProfile, n = 4): Recipe[] {
  const fam = hairFamily(profile.hairType);
  const wanted = FAMILY_TO_CATEGORY[fam];
  const scored = recipes.map((r) => {
    let s = 0;
    for (const w of wanted) if (r.category.includes(w)) s += 3;
    if (profile.problem && r.benefit.toLowerCase().includes(profile.problem.toLowerCase().slice(0, 5))) s += 2;
    if (profile.goal && r.benefit.toLowerCase().includes(profile.goal.toLowerCase().slice(0, 5))) s += 2;
    return { r, s };
  });
  scored.sort((a, b) => b.s - a.s || a.r.id - b.r.id);
  const out: Recipe[] = [];
  const ids = new Set<number>();
  for (const { r } of scored) {
    if (out.length >= n) break;
    if (!ids.has(r.id)) { out.push(r); ids.add(r.id); }
  }
  return out;
}

export function matchProducts(profile: HairProfile, n = 5): Product[] {
  const fam = hairFamily(profile.hairType);
  const scored = products.map((p) => {
    let s = 0;
    if (p.hairType.includes(fam)) s += 3;
    if (p.hairType.includes("Tous")) s += 1;
    if (profile.problem && p.problem.some((x) => profile.problem!.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(profile.problem!.toLowerCase().slice(0, 5)))) s += 3;
    s += (p.rating - 4.5) * 2;
    return { p, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, n).map((x) => x.p);
}

export function whyProduct(p: Product, profile: HairProfile): string {
  const fam = hairFamily(profile.hairType);
  if (p.hairType.includes(fam)) return `Formulé pour cheveux ${fam.toLowerCase()} — ${p.benefit.toLowerCase()}.`;
  if (profile.problem) return `Ciblé pour ${profile.problem.toLowerCase()} — ${p.benefit.toLowerCase()}.`;
  return `Universel et plébiscité — ${p.benefit.toLowerCase()}.`;
}

export type RoutineDay = { day: string; icon: LucideIcon; task: string; use: string; time: string; tip: string };

export function buildRoutine(profile: HairProfile): RoutineDay[] {
  const fam = hairFamily(profile.hairType);
  const isDry = fam === "Bouclés" || fam === "Crépus";
  return [
    { day: "Lundi", icon: Droplet, task: "Shampoing doux + massage cuir chevelu", use: isDry ? "Shampoing sans sulfate" : "Shampoing clarifiant léger", time: "10 min", tip: "Massez en cercles pendant 3 minutes." },
    { day: "Mardi", icon: Sun, task: "Spritz hydratant matin", use: "Eau + leave-in", time: "2 min", tip: "Hydratez avant de coiffer." },
    { day: "Mercredi", icon: Leaf, task: "Masque hydratant maison", use: "Recette Avocat-Miel-Aloe", time: "30 min", tip: "Sous bonnet chaud pour pénétration." },
    { day: "Jeudi", icon: Wind, task: "Repos & coiffure protectrice", use: "Satin scrunchie", time: "5 min", tip: "Évitez la chaleur aujourd'hui." },
    { day: "Vendredi", icon: Droplet, task: "Huile nourrissante sur pointes", use: "Argan ou jojoba", time: "3 min", tip: "Seulement 2 gouttes, ça suffit." },
    { day: "Samedi", icon: Scissors, task: "Démêlage doux + soin léger", use: "Peigne large + conditioner", time: "15 min", tip: "Toujours sur cheveux humides." },
    { day: "Dimanche", icon: Sparkles, task: "Bilan semaine + soin protéine si besoin", use: "Masque œuf-yaourt", time: "25 min", tip: "Notez vos ressentis dans le journal." },
  ];
}

export type ChallengeDay = {
  n: number;
  phase: 1 | 2 | 3;
  title: string;
  icon: LucideIcon;
  instructions: string;
  time: string;
  link?: { type: "recipe" | "product"; id: number };
};

export const CHALLENGE_DAYS: ChallengeDay[] = [
  // Phase 1 — Purification
  { n: 1, phase: 1, title: "Shampoing clarifiant", icon: Droplet, instructions: "Lavez avec un clarifiant pour repartir sur une base propre.", time: "15 min", link: { type: "recipe", id: 17 } },
  { n: 2, phase: 1, title: "Massage cuir chevelu romarin", icon: Sparkles, instructions: "Massez 5 min avec huile de romarin diluée.", time: "5 min", link: { type: "recipe", id: 13 } },
  { n: 3, phase: 1, title: "Masque hydratation profonde", icon: Droplet, instructions: "Appliquez un masque hydratant sous bonnet 30 min.", time: "30 min", link: { type: "recipe", id: 1 } },
  { n: 4, phase: 1, title: "Massage cuir chevelu romarin", icon: Sparkles, instructions: "Re-stimulez la circulation 5 min.", time: "5 min" },
  { n: 5, phase: 1, title: "No-heat day", icon: Wind, instructions: "Coiffure protectrice — pas de chaleur.", time: "—" },
  { n: 6, phase: 1, title: "Massage cuir chevelu romarin", icon: Sparkles, instructions: "Dernière stimulation de la semaine.", time: "5 min" },
  { n: 7, phase: 1, title: "Mesure de longueur initiale", icon: Ruler, instructions: "Notez votre longueur de référence.", time: "5 min" },
  // Phase 2 — Nourrissement
  { n: 8, phase: 2, title: "Traitement protéine", icon: FlaskConical, instructions: "Masque œuf-yaourt, rinçage froid impératif.", time: "30 min", link: { type: "recipe", id: 6 } },
  { n: 9, phase: 2, title: "Méthode LOC", icon: Droplet, instructions: "Liquide → Huile → Crème dans cet ordre.", time: "10 min" },
  { n: 10, phase: 2, title: "Masque avocat maison", icon: Leaf, instructions: "Avocat, miel, aloe vera — 30 min.", time: "30 min", link: { type: "recipe", id: 1 } },
  { n: 11, phase: 2, title: "Méthode LOC", icon: Droplet, instructions: "Renouvelez le LOC pour sceller.", time: "10 min" },
  { n: 12, phase: 2, title: "No-heat day", icon: Wind, instructions: "Reposez vos cheveux de la chaleur.", time: "—" },
  { n: 13, phase: 2, title: "Méthode LOC", icon: Droplet, instructions: "Hydratation et scellage.", time: "10 min" },
  { n: 14, phase: 2, title: "Photo de progression", icon: Camera, instructions: "Photo dans la même lumière qu'au jour 1.", time: "5 min" },
  // Phase 3 — Éclat
  { n: 15, phase: 3, title: "Soin brillance", icon: Sparkles, instructions: "Rinçage vinaigre de cidre dilué.", time: "5 min", link: { type: "recipe", id: 17 } },
  { n: 16, phase: 3, title: "Massage huile de ricin", icon: Flame, instructions: "Massez le cuir chevelu 10 min.", time: "10 min", link: { type: "recipe", id: 11 } },
  { n: 17, phase: 3, title: "Rinçage à l'eau de riz", icon: Droplet, instructions: "Versez après shampoing, ne pas rincer.", time: "5 min", link: { type: "recipe", id: 21 } },
  { n: 18, phase: 3, title: "Massage huile de ricin", icon: Flame, instructions: "Stimulez les follicules.", time: "10 min" },
  { n: 19, phase: 3, title: "Établir la routine finale", icon: Heart, instructions: "Notez la routine qui marche pour vous.", time: "15 min" },
  { n: 20, phase: 3, title: "Massage huile de ricin", icon: Flame, instructions: "Dernier massage du défi.", time: "10 min" },
  { n: 21, phase: 3, title: "Photo avant / après", icon: Camera, instructions: "Comparez avec le jour 1 — célébrez !", time: "10 min" },
];

export function challengeForProfile(_p: HairProfile) {
  return CHALLENGE_DAYS;
}

export function healthScore(profile: HairProfile, problems: string[] = []): number {
  let s = 78;
  if (profile.porosity === "Haute") s -= 6;
  if (profile.porosity === "Basse") s -= 3;
  s -= Math.min(20, problems.length * 6);
  if (profile.goal) s += 2;
  return Math.max(20, Math.min(98, s));
}

export function problemsFromProfile(profile: HairProfile, fromAnalysis?: string[]): string[] {
  const out = new Set<string>();
  if (fromAnalysis) fromAnalysis.forEach((x) => out.add(x));
  if (profile.problem) out.add(profile.problem);
  return Array.from(out).slice(0, 3);
}

export const HAIR_SPECTRUM = ["1a","1b","1c","2a","2b","2c","3a","3b","3c","4a","4b","4c"] as const;