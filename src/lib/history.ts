import { useEffect, useState } from "react";

export type HistoryType = "photo" | "diagnostic" | "quiz";

export type HistoryEntry = {
  id: string;
  type: HistoryType;
  createdAt: number;
  summary: string;
  data: any;
};

const KEY = "hairbloom_history";

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(v: HistoryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
  window.dispatchEvent(new Event("hairbloom:history"));
}

export function addHistory(type: HistoryType, summary: string, data: any) {
  const entry: HistoryEntry = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type, summary, data, createdAt: Date.now(),
  };
  write([entry, ...read()].slice(0, 200));
}

export function removeHistory(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function clearHistory() { write([]); }

export function useHistory() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener("hairbloom:history", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hairbloom:history", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}