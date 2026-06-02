import { useEffect, useState } from "react";

const KEY = "hairbloom_timer_v1";
const EVT = "hairbloom:timer";

export type TimerState = {
  recipeId: number;
  recipeName: string;
  totalSeconds: number;
  /** epoch ms when timer should end (when running) */
  endsAt: number | null;
  /** remaining seconds when paused */
  remaining: number;
  paused: boolean;
  finished: boolean;
};

function read(): TimerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TimerState) : null;
  } catch {
    return null;
  }
}

function write(s: TimerState | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

/** Parse a recipe.duration string into seconds; returns null if not timeable. */
export function parseDurationSeconds(d: string): number | null {
  if (!d) return null;
  const lc = d.toLowerCase().trim();
  if (lc.includes("leave") || lc.includes("sans rinç")) return null;
  if (lc === "nuit" || lc.includes("nuit")) return 8 * 60 * 60;
  const h = lc.match(/(\d+)\s*h/);
  const m = lc.match(/(\d+)\s*min/);
  let s = 0;
  if (h) s += parseInt(h[1], 10) * 3600;
  if (m) s += parseInt(m[1], 10) * 60;
  if (s > 0) return s;
  const num = lc.match(/^(\d+)$/);
  if (num) return parseInt(num[1], 10) * 60;
  return null;
}

export function startTimer(recipeId: number, recipeName: string, totalSeconds: number) {
  const s: TimerState = {
    recipeId,
    recipeName,
    totalSeconds,
    endsAt: Date.now() + totalSeconds * 1000,
    remaining: totalSeconds,
    paused: false,
    finished: false,
  };
  write(s);
}

export function pauseTimer() {
  const cur = read();
  if (!cur || cur.paused || cur.finished) return;
  const remaining = Math.max(0, Math.round(((cur.endsAt ?? Date.now()) - Date.now()) / 1000));
  write({ ...cur, paused: true, remaining, endsAt: null });
}

export function resumeTimer() {
  const cur = read();
  if (!cur || !cur.paused || cur.finished) return;
  write({ ...cur, paused: false, endsAt: Date.now() + cur.remaining * 1000 });
}

export function stopTimer() {
  write(null);
}

export function markFinished() {
  const cur = read();
  if (!cur || cur.finished) return;
  write({ ...cur, finished: true, paused: true, remaining: 0, endsAt: null });
}

export function useTimer() {
  const [state, setState] = useState<TimerState | null>(() => read());
  const [, force] = useState(0);
  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    const tick = setInterval(() => force((n) => n + 1), 500);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
      clearInterval(tick);
    };
  }, []);

  if (!state) return { state: null as TimerState | null, remainingSeconds: 0, progress: 0 };
  const remainingSeconds = state.paused
    ? state.remaining
    : Math.max(0, Math.round(((state.endsAt ?? Date.now()) - Date.now()) / 1000));
  const progress = state.totalSeconds > 0 ? 1 - remainingSeconds / state.totalSeconds : 0;
  return { state, remainingSeconds, progress };
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Web Audio chime — soft 3-note arpeggio. */
export function playChime() {
  if (typeof window === "undefined") return;
  try {
    const Ctx: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 1);
    });
    setTimeout(() => ctx.close().catch(() => {}), 2200);
  } catch {}
  try {
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
  } catch {}
}

/** Tracking helper: mark a recipe as "made" once timer completes. */
export function markRecipeMade(recipeId: number, durationMinutes: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("hairbloom_recipes_made");
    const list: number[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(recipeId)) list.push(recipeId);
    localStorage.setItem("hairbloom_recipes_made", JSON.stringify(list));
    if (durationMinutes > 0 && durationMinutes < 20) {
      localStorage.setItem("hairbloom_express_mask", "1");
    }
    window.dispatchEvent(new Event("hairbloom:recipes-made"));
  } catch {}
}