import { useEffect, useState } from "react";

export type Mood = "parfait" | "bien" | "moyen" | "difficile" | "horrible";
export const MOODS: { v: Mood; e: string; label: string; color: string }[] = [
  { v: "parfait", e: "😍", label: "Parfait", color: "#4ade80" },
  { v: "bien", e: "😊", label: "Bien", color: "#fbbf24" },
  { v: "moyen", e: "😐", label: "Moyen", color: "#9ca3af" },
  { v: "difficile", e: "😕", label: "Difficile", color: "#fb923c" },
  { v: "horrible", e: "😤", label: "Horrible", color: "#ef4444" },
];

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  products: string[];
  stylingTime: number;
  notes: string;
  weather?: { humidity?: number; temp?: number };
};

const KEY = "hairbloom_journal";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveEntry(e: JournalEntry) {
  const list = getEntries().filter((x) => x.date !== e.date);
  list.push(e);
  list.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("hairbloom:journal"));
}
export function deleteEntry(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getEntries().filter((x) => x.id !== id)));
  window.dispatchEvent(new Event("hairbloom:journal"));
}

export function useJournal(): JournalEntry[] {
  const [v, setV] = useState<JournalEntry[]>([]);
  useEffect(() => {
    setV(getEntries());
    const h = () => setV(getEntries());
    window.addEventListener("hairbloom:journal", h);
    return () => window.removeEventListener("hairbloom:journal", h);
  }, []);
  return v;
}