import { useEffect, useState } from "react";

const KEY = "hairbloom_dark_mode";
const EVT = "hairbloom:theme";

export type Theme = "light" | "dark";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const raw = localStorage.getItem(KEY);
  if (raw === "true") return "dark";
  if (raw === "false") return "light";
  return systemPrefersDark() ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function setTheme(t: Theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, t === "dark" ? "true" : "false");
  applyTheme(t);
  window.dispatchEvent(new Event(EVT));
}

export function useTheme(): [Theme, (t: Theme) => void, () => void] {
  const [theme, setT] = useState<Theme>("light");
  useEffect(() => {
    const t = getTheme();
    setT(t);
    applyTheme(t);
    const sync = () => setT(getTheme());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return [theme, setTheme, toggle];
}