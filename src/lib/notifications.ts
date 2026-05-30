import { useEffect, useState } from "react";

export type NotifKind =
  | "hydration"
  | "mask"
  | "growth"
  | "weather"
  | "tip"
  | "plan"
  | "aura"
  | "nutrition";

export const KIND_COLORS: Record<NotifKind, string> = {
  hydration: "#3b82f6",
  mask: "#16a34a",
  growth: "#16a34a",
  weather: "#3b82f6",
  tip: "#C9956A",
  plan: "#C9956A",
  aura: "#a855f7",
  nutrition: "#ef4444",
};

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
const PREFS_KEY = "hairbloom_notif_prefs";

export type NotifPrefs = Record<NotifKind, boolean>;
const DEFAULT_PREFS: NotifPrefs = { hydration: true, mask: true, growth: true, weather: true, tip: true, plan: true, aura: true, nutrition: true };

export function getPrefs(): NotifPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") }; } catch { return DEFAULT_PREFS; }
}
export function setPref(kind: NotifKind, on: boolean) {
  const next = { ...getPrefs(), [kind]: on };
  localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("hairbloom:notif"));
}
export function usePrefs(): [NotifPrefs, (k: NotifKind, v: boolean) => void] {
  const [p, setP] = useState<NotifPrefs>(DEFAULT_PREFS);
  useEffect(() => {
    const sync = () => setP(getPrefs());
    sync();
    window.addEventListener("hairbloom:notif", sync);
    return () => window.removeEventListener("hairbloom:notif", sync);
  }, []);
  return [p, (k, v) => setPref(k, v)];
}

const DAY = 24 * 60 * 60 * 1000;

const SCHEDULES: Record<NotifKind, { intervalMs: number; emoji: string; title: string; message: string }> = {
  hydration: { intervalMs: 3 * DAY, emoji: "💧", title: "Rappel hydratation", message: "Vos cheveux bouclés ont besoin d'hydratation aujourd'hui. Appliquez votre leave-in!" },
  mask: { intervalMs: 7 * DAY, emoji: "🌿", title: "Masque de la semaine", message: "C'est le moment de faire votre masque Avocat + Miel + Aloe Vera. 30 minutes pour des cheveux transformés!" },
  growth: { intervalMs: 30 * DAY, emoji: "📏", title: "Mesure mensuelle", message: "Un mois s'est écoulé. Mesurez vos cheveux et mettez à jour votre tracker de repousse!" },
  tip: { intervalMs: 1 * DAY, emoji: "⭐", title: "Conseil du jour", message: "Dormez sur une taie d'oreiller en satin pour réduire les frisottis de 43%." },
  plan: { intervalMs: 1 * DAY, emoji: "🎯", title: "Plan 30 Jours — Jour 3", message: "Aujourd'hui : massage du cuir chevelu 5 minutes avec huile de ricin." },
  weather: { intervalMs: 6 * 60 * 60 * 1000, emoji: "🌦️", title: "Alerte météo capillaire", message: "Humidité 85% prévue demain. Appliquez un sérum anti-frisottis ce soir!" },
  aura: { intervalMs: 1 * DAY, emoji: "🌸", title: "Votre Aura du jour", message: "Rose Nacré vous accompagne aujourd'hui. Prenez soin de vos boucles précieuses." },
  nutrition: { intervalMs: 1 * DAY, emoji: "💊", title: "Rappel nutrition", message: "N'oubliez pas vos compléments biotine et fer aujourd'hui pour des cheveux forts!" },
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
  if (!getPrefs()[kind]) return;
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

export function markRead(id: string) {
  write(read().map((n) => (n.id === id ? { ...n, read: true } : n)));
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