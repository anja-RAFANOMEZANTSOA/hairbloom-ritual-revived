import { useEffect, useState } from "react";

export type HairProfile = {
  name?: string;
  profileType?: "Femme" | "Homme" | "Enfant";
  hairType?: string; // 1a..4c
  texture?: string;
  porosity?: string;
  problem?: string;
  goal?: string;
  scalp?: string;
  selectedTypes?: string[];
};

const KEY = "hairbloom_profile";

export function getProfile(): HairProfile {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProfile(p: Partial<HairProfile>) {
  if (typeof window === "undefined") return;
  const next = { ...getProfile(), ...p };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("hairbloom:profile"));
}

export function useProfile(): [HairProfile, (p: Partial<HairProfile>) => void] {
  const [profile, setProfile] = useState<HairProfile>({});
  useEffect(() => {
    setProfile(getProfile());
    const handler = () => setProfile(getProfile());
    window.addEventListener("hairbloom:profile", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("hairbloom:profile", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return [profile, saveProfile];
}

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVal(JSON.parse(raw));
    } catch {}
  }, [key]);
  const set = (v: T) => {
    setVal(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  };
  return [val, set];
}