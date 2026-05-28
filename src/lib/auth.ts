import { useEffect, useState } from "react";

export type AgeRange = "Enfant" | "Adolescent" | "Adulte" | "Senior" | "Âgé";
export type ProfileType = "Femme" | "Homme" | "Enfant";

export type StoredUser = {
  id: string;
  firstName: string;
  email: string;
  passwordHash: string;
  profileType: ProfileType;
  ageRange: AgeRange;
  createdAt: number;
};

const USERS_KEY = "hairbloom_users";
const SESSION_KEY = "hairbloom_session";

// Simple non-cryptographic hash (FNV-1a) + salt. localStorage only — not for real security.
export function hashPassword(password: string): string {
  const salted = `hairbloom::${password}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < salted.length; i++) {
    h ^= salted.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser(): StoredUser | null {
  const id = getSession();
  if (!id) return null;
  return readUsers().find((u) => u.id === id) ?? null;
}

function emit() {
  window.dispatchEvent(new Event("hairbloom:auth"));
}

export function registerUser(input: {
  firstName: string;
  email: string;
  password: string;
  profileType: ProfileType;
  ageRange: AgeRange;
}): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const users = readUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "Un compte existe déjà avec cet email." };
  }
  const user: StoredUser = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    firstName: input.firstName.trim(),
    email,
    passwordHash: hashPassword(input.password),
    profileType: input.profileType,
    ageRange: input.ageRange,
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, user.id);
  emit();
  return { ok: true, user };
}

export function loginUser(email: string, password: string):
  | { ok: true; user: StoredUser }
  | { ok: false; error: string } {
  const users = readUsers();
  const u = users.find((x) => x.email === email.trim().toLowerCase());
  if (!u) return { ok: false, error: "Aucun compte avec cet email." };
  if (u.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Mot de passe incorrect." };
  }
  localStorage.setItem(SESSION_KEY, u.id);
  emit();
  return { ok: true, user: u };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  emit();
}

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    sync();
    setReady(true);
    window.addEventListener("hairbloom:auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hairbloom:auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { user, ready, isAuthenticated: !!user };
}

export const PUBLIC_ROUTES = ["/login", "/register"];