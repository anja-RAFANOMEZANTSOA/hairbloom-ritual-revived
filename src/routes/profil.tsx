import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, RotateCcw, LogOut, History as HistoryIcon, ChevronRight } from "lucide-react";
import { useProfile, useLocalStorage } from "@/lib/storage";
import { auras, recipes } from "@/lib/hair-data";
import { toast } from "sonner";
import { logout, useAuth } from "@/lib/auth";
import { usePrefs, type NotifPrefs } from "@/lib/notifications";

export const Route = createFileRoute("/profil")({ component: Profil });

const AGE_EMOJI: Record<string, string> = { "Enfant": "🧒", "Adolescent": "🧑", "Adulte": "👩", "Senior": "🧓", "Âgé": "👴" };
const PROFILE_EMOJI: Record<string, string> = { "Femme": "👩‍🦱", "Homme": "👨", "Enfant": "🧒" };

const NOTIF_LABELS: { key: keyof NotifPrefs; label: string; emoji: string }[] = [
  { key: "hydration", label: "Hydratation", emoji: "💧" },
  { key: "mask", label: "Masque DIY", emoji: "🌿" },
  { key: "growth", label: "Repousse", emoji: "📏" },
  { key: "weather", label: "Météo capillaire", emoji: "🌦️" },
  { key: "tip", label: "Conseil du jour", emoji: "⭐" },
  { key: "plan", label: "Plan 30 jours", emoji: "🎯" },
];

function Profil() {
  const [profile, setProfile] = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favs] = useLocalStorage<number[]>("hairbloom_fav_recipes", []);
  const [lang, setLang] = useLocalStorage<string>("hairbloom_lang", "Français");
  const [prefs, togglePref] = usePrefs();
  const aura = profile.hairType ? auras[profile.hairType] : null;

  const reset = () => {
    localStorage.removeItem("hairbloom_profile");
    if (user) localStorage.removeItem("hairbloom_onboarded_" + user.id);
    toast.success("Profil réinitialisé. Rechargez la page.");
  };

  const handleLogout = () => {
    logout();
    toast.success("À bientôt 🌸");
    navigate({ to: "/login" });
  };

  const initial = (user?.firstName || profile.name || "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header className="flex items-center gap-4">
        <div className="size-20 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center font-display text-3xl shadow-md">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl truncate">{user?.firstName || profile.name || "Anonyme"}</h1>
          <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {user?.profileType && (
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[11px]">{PROFILE_EMOJI[user.profileType]} {user.profileType}</span>
            )}
            {user?.ageRange && (
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[11px]">{AGE_EMOJI[user.ageRange]} {user.ageRange}</span>
            )}
          </div>
        </div>
      </header>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">💇 Mon profil capillaire</h3>
        {profile.hairType && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">Type {profile.hairType}</span>
          </div>
        )}
        <Row label="Type" value={profile.hairType} />
        <Row label="Texture" value={profile.texture} />
        <Row label="Porosité" value={profile.porosity} />
        <Row label="Problème" value={profile.problem} />
        <Row label="Objectif" value={profile.goal} />
      </div>

      {aura && (
        <Link to="/aura" className="block bg-gradient-to-br from-primary/15 to-accent/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full grid place-items-center text-2xl" style={{ background: aura.color }}>{aura.emoji}</div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">✨ Mon Aura</div>
              <div className="font-display text-lg">{aura.name}</div>
            </div>
            <Sparkles className="size-4 text-primary ml-auto" />
          </div>
        </Link>
      )}

      <Link to="/historique" className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary transition-colors">
        <div className="size-10 rounded-full bg-secondary grid place-items-center text-lg">📖</div>
        <div className="flex-1">
          <div className="font-medium text-sm">Mon historique</div>
          <div className="text-xs text-muted-foreground">Analyses, diagnostics, quiz</div>
        </div>
        <HistoryIcon className="size-4 text-muted-foreground" />
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <div>
        <h3 className="font-medium mb-2">💖 Mes recettes favorites ({favs.length})</h3>
        {favs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune favorite. Explorez les <Link to="/recipes" className="text-primary underline">recettes</Link>.</p>
        ) : (
          <div className="space-y-2">
            {recipes.filter((r) => favs.includes(r.id)).map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-3 text-sm">🌿 {r.title}</div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h3 className="font-medium">🔔 Notifications</h3>
        <div className="space-y-2">
          {NOTIF_LABELS.map((n) => (
            <label key={n.key} className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-sm">{n.emoji} {n.label}</span>
              <button
                type="button"
                onClick={() => togglePref(n.key, !prefs[n.key])}
                className={`relative w-10 h-6 rounded-full transition-colors ${prefs[n.key] ? "bg-primary" : "bg-border"}`}
                aria-pressed={prefs[n.key]}
              >
                <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${prefs[n.key] ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">🌍 Langue</h3>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm">
          <option>Français</option><option>English</option><option>العربية</option>
        </select>
      </div>

      <button onClick={reset} className="w-full py-3 rounded-2xl border border-destructive/40 text-destructive text-sm flex items-center justify-center gap-2">
        <RotateCcw className="size-4" /> Réinitialiser mon profil
      </button>

      <button onClick={handleLogout} className="w-full py-3 rounded-2xl bg-destructive text-destructive-foreground text-sm font-medium flex items-center justify-center gap-2 shadow-md">
        <LogOut className="size-4" /> Se déconnecter
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}