import { useEffect, useState } from "react";

const KEY = "hairbloom_challenge_v1";

export type ChallengeState = {
  startedAt: string | null;
  done: Record<number, boolean>;
};

function read(): ChallengeState {
  if (typeof window === "undefined") return { startedAt: null, done: {} };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") || { startedAt: null, done: {} };
  } catch {
    return { startedAt: null, done: {} };
  }
}

function write(s: ChallengeState) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("hairbloom:challenge"));
}

export function startChallenge() {
  const cur = read();
  if (!cur.startedAt) write({ ...cur, startedAt: new Date().toISOString() });
}

export function resetChallenge() {
  write({ startedAt: null, done: {} });
}

export function toggleDay(n: number) {
  const cur = read();
  cur.done[n] = !cur.done[n];
  if (!cur.startedAt) cur.startedAt = new Date().toISOString();
  write(cur);
}

export function useChallenge() {
  const [s, setS] = useState<ChallengeState>({ startedAt: null, done: {} });
  useEffect(() => {
    setS(read());
    const h = () => setS(read());
    window.addEventListener("hairbloom:challenge", h);
    return () => window.removeEventListener("hairbloom:challenge", h);
  }, []);
  return s;
}

export function progress(s: ChallengeState) {
  const total = 21;
  const done = Object.values(s.done).filter(Boolean).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function streak(s: ChallengeState) {
  let st = 0;
  for (let i = 21; i >= 1; i--) {
    if (s.done[i]) st++;
    else if (st > 0) break;
  }
  return st;
}

const PHRASES = [
  "Chaque geste compte pour vos cheveux. ✨",
  "Vos racines vous remercient déjà.",
  "La constance est votre meilleur soin.",
  "Aujourd'hui, vous nourrissez votre futur.",
  "Une routine d'amour, jour après jour.",
  "Vos boucles racontent votre patience.",
  "Petit pas, grande transformation.",
  "Le rituel est votre superpouvoir.",
  "Vous fleurissez de l'intérieur.",
  "La beauté naît de la régularité.",
  "Vos cheveux écoutent votre intention.",
  "Restez douce avec vous-même.",
  "Chaque jour vous rapproche du résultat.",
  "L'éclat est en chemin.",
  "Vous êtes votre meilleur soin.",
  "Respirez, hydratez, recommencez.",
  "Votre couronne se révèle.",
  "Constance > intensité.",
  "Vos cheveux ont besoin de vous, là maintenant.",
  "Vous y êtes presque.",
  "Célébrez-vous aujourd'hui. 🌸",
];

export function dailyPhrase(startedAt: string | null) {
  if (!startedAt) return PHRASES[0];
  const d = Math.floor((Date.now() - new Date(startedAt).getTime()) / 86400000);
  return PHRASES[Math.max(0, Math.min(20, d))];
}