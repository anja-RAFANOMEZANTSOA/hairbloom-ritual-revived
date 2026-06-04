import { useEffect, useState } from "react";

export type EventKind =
  | "masque"
  | "shampoing"
  | "bain-huile"
  | "coupe"
  | "soin-protéiné"
  | "hydratation"
  | "coiffure-protectrice"
  | "autre";

export const EVENT_KINDS: { v: EventKind; label: string; emoji: string; color: string }[] = [
  { v: "masque", label: "Masque", emoji: "🪷", color: "#c08552" },
  { v: "shampoing", label: "Shampoing", emoji: "🫧", color: "#7aa1c4" },
  { v: "bain-huile", label: "Bain d'huile", emoji: "🫒", color: "#a08a5a" },
  { v: "coupe", label: "Coupe / Pointes", emoji: "✂️", color: "#b07c8a" },
  { v: "soin-protéiné", label: "Soin protéiné", emoji: "🥚", color: "#d4a574" },
  { v: "hydratation", label: "Hydratation", emoji: "💧", color: "#88b0c4" },
  { v: "coiffure-protectrice", label: "Coiffure protectrice", emoji: "🎀", color: "#c98a9a" },
  { v: "autre", label: "Autre", emoji: "🌿", color: "#9aab8b" },
];

export type CalEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  kind: EventKind;
  title: string;
  notes?: string;
  done?: boolean;
};

const KEY = "hairbloom_calendar";

export function getEvents(): CalEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function persist(list: CalEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("hairbloom:calendar"));
}

export function saveEvent(e: CalEvent) {
  const list = getEvents().filter((x) => x.id !== e.id);
  list.push(e);
  list.sort((a, b) => a.date.localeCompare(b.date));
  persist(list);
}

export function saveManyEvents(events: CalEvent[]) {
  const existing = getEvents();
  const ids = new Set(events.map((e) => e.id));
  const merged = [...existing.filter((e) => !ids.has(e.id)), ...events];
  merged.sort((a, b) => a.date.localeCompare(b.date));
  persist(merged);
}

export function deleteEvent(id: string) {
  persist(getEvents().filter((e) => e.id !== id));
}

export function toggleEventDone(id: string) {
  persist(getEvents().map((e) => (e.id === id ? { ...e, done: !e.done } : e)));
}

export function useCalendar(): CalEvent[] {
  const [v, setV] = useState<CalEvent[]>([]);
  useEffect(() => {
    setV(getEvents());
    const h = () => setV(getEvents());
    window.addEventListener("hairbloom:calendar", h);
    return () => window.removeEventListener("hairbloom:calendar", h);
  }, []);
  return v;
}

export function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getMonthGrid(year: number, month: number): Date[] {
  // month: 0-11. Returns 6x7 = 42 days starting Monday.
  const first = new Date(year, month, 1);
  const dayOfWeek = (first.getDay() + 6) % 7; // Mon=0
  const start = new Date(year, month, 1 - dayOfWeek);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}