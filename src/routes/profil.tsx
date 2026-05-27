import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, User, RotateCcw } from "lucide-react";
import { useProfile, useLocalStorage } from "@/lib/storage";
import { auras, recipes } from "@/lib/hair-data";
import { toast } from "sonner";

export const Route = createFileRoute("/profil")({ component: Profil });

function Profil() {
  const [profile, setProfile] = useProfile();
  const [favs] = useLocalStorage<number[]>("hairbloom_fav_recipes", []);
  const [lang, setLang] = useLocalStorage<string>("hairbloom_lang", "Français");
  const aura = profile.hairType ? auras[profile.hairType] : null;

  const reset = () => {
    localStorage.removeItem("hairbloom_onboarded");
    localStorage.removeItem("hairbloom_profile");
    toast.success("Profil réinitialisé. Rechargez la page.");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-primary text-primary-foreground grid place-items-center">
          <User className="size-8" />
        </div>
        <div>
          <h1 className="font-display text-2xl">{profile.name || "Anonyme"}</h1>
          <p className="text-muted-foreground text-sm">{profile.profileType || "Profil non défini"}</p>
        </div>
      </header>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">Mon profil capillaire</h3>
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
              <div className="text-xs uppercase text-muted-foreground">Mon Aura</div>
              <div className="font-display text-lg">{aura.name}</div>
            </div>
            <Sparkles className="size-4 text-primary ml-auto" />
          </div>
        </Link>
      )}

      <div>
        <h3 className="font-medium mb-2">Mes recettes favorites ({favs.length})</h3>
        {favs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune favorite. Explorez les <Link to="/recipes" className="text-primary underline">recettes</Link>.</p>
        ) : (
          <div className="space-y-2">
            {recipes.filter((r) => favs.includes(r.id)).map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-3 text-sm">{r.title}</div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <h3 className="font-medium">Langue</h3>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm">
          <option>Français</option><option>English</option><option>العربية</option>
        </select>
      </div>

      <button onClick={reset} className="w-full py-3 rounded-2xl border border-destructive/40 text-destructive text-sm flex items-center justify-center gap-2">
        <RotateCcw className="size-4" /> Réinitialiser mon profil
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