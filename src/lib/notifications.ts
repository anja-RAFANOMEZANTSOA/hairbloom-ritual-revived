import { useEffect, useState } from "react";

export type NotifKind =
  | "hydration"
  | "mask"
  | "growth"
  | "weather"
  | "tip"
  | "plan";

export type Notification = {
  id: string;
  kind: NotifKind;
  emoji: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
};

const KEY = "hairbloom_notifications";
const LAST_KEY = "hairbloom_notifications_last"; // per-kind last generation

const DAY = 24 * 60 * 60 * 1000;

const SCHEDULES: Record<NotifKind, { intervalMs: number; emoji: string; title: string; message: string }> = {
  hydration: { intervalMs: 3 * DAY, emoji: "💧", title: "Rappel hydratation", message: "Pensez à boire de l'eau et à appliquer un soin hydratant aujourd'hui." },
  mask: { intervalMs: 7 * DAY, emoji: "🌿", title: "Masque DIY hebdomadaire", message: "C'est l'heure de votre masque maison. Découvrez une recette adaptée." },
  growth: { intervalMs: 30 * DAY, emoji: "📏", title: "Mesure de repousse", message: "Mesurez la repousse de vos cheveux et suivez votre progression." },
  tip: { intervalMs: 1 * DAY, emoji: "⭐", title: "Conseil du jour", message: "Massez votre cuir chevelu 2 minutes pour stimuler la microcirculation." },
  plan: { intervalMs: 1 * DAY, emoji: "🎯", title: "Plan 30 jours — tâche du jour", message: "Une nouvelle étape vous attend dans votre plan personnalisé." },
  weather: { intervalMs: 6 * 60 * 60 * 1000, emoji: "🌦️", title: "Alerte météo capillaire", message: "Humidité élevée prévue — protégez vos longueurs avec un sérum anti-frisottis." },
};

function read(): Notification[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(n: Notification[]) {
  localStorage.setItem(KEY, JSON.stringify(n));
  window.dispatchEvent(new Event("hairbloom:notif"));
}
function readLast(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LAST_KEY) || "{}"); } catch { return {}; }
}
function writeLast(v: Record<string, number>) {
  localStorage.setItem(LAST_KEY, JSON.stringify(v));
}

export function addNotification(kind: NotifKind, overrides?: Partial<Notification>) {
  const cfg = SCHEDULES[kind];
  const n: Notification = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    kind,
    emoji: cfg.emoji,
    title: cfg.title,
    message: cfg.message,
    createdAt: Date.now(),
    read: false,
    ...overrides,
  };
  const all = [n, ...read()].slice(0, 100);
  write(all);
}

export function ensureScheduled() {
  if (typeof window === "undefined") return;
  const last = readLast();
  const now = Date.now();
  let changed = false;
  (Object.keys(SCHEDULES) as NotifKind[]).forEach((kind) => {
    if (kind === "weather") return; // weather is event-driven
    const cfg = SCHEDULES[kind];
    const prev = last[kind] || 0;
    if (now - prev >= cfg.intervalMs) {
      addNotification(kind);
      last[kind] = now;
      changed = true;
    }
  });
  if (changed) writeLast(last);
}

export function markAllRead() {
  write(read().map((n) => ({ ...n, read: true })));
}

export function removeNotification(id: string) {
  write(read().filter((n) => n.id !== id));
}

export function useNotifications() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener("hairbloom:notif", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hairbloom:notif", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { items, unread: items.filter((n) => !n.read).length };
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d} j`;
  return new Date(ts).toLocaleDateString("fr-FR");
}