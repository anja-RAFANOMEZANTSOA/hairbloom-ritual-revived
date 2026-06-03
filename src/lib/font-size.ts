import { useEffect, useState } from "react";

export type FontSize = "small" | "medium" | "large";
const KEY = "hairbloom_font_size";
const EVT = "hairbloom:font-size";

export function getFontSize(): FontSize {
  if (typeof window === "undefined") return "medium";
  const raw = localStorage.getItem(KEY);
  if (raw === "small" || raw === "medium" || raw === "large") return raw;
  return "medium";
}

export function applyFontSize(f: FontSize) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
  root.classList.add(`font-size-${f}`);
}

export function setFontSize(f: FontSize) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, f);
  applyFontSize(f);
  window.dispatchEvent(new Event(EVT));
}

export function useFontSize(): [FontSize, (f: FontSize) => void] {
  const [f, setF] = useState<FontSize>("medium");
  useEffect(() => {
    const cur = getFontSize();
    setF(cur);
    applyFontSize(cur);
    const sync = () => setF(getFontSize());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return [f, setFontSize];
}