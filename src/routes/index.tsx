import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Camera, HelpCircle, Leaf, ShoppingBag, Sparkles, CloudSun, FlaskConical } from "lucide-react";
import { useProfile } from "@/lib/storage";
import { unsplash, dailyTips, hairTypePhotos } from "@/lib/hair-data";
import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [profile] = useProfile();
  const [tipIdx, setTipIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % dailyTips.length), 6000);
    return () => clearInterval(t);
  }, []);
  const [streak, setStreak] = useState<boolean[]>([true, true, true, false, false, false, false]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(profile.selectedTypes || []);
  const toggleType = (t: string) => {
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <section
        className="relative h-72 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${unsplash("photo-1560869713-7d0a29430803", 1400)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(44,24,16,0.3)] via-transparent to-[rgba(44,24,16,0.7)]" />
        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Logo size={36} />
            <span className="font-display text-xl text-white">HairBloom</span>
          </div>
          <div className="text-white">
            <h1 className="font-display text-3xl md:text-5xl">
              Bonjour {profile.name || "vous"} <Sparkles className="inline size-6" />
            </h1>
            <p className="opacity-90 mt-2 italic">Your hair. Your ritual.</p>
          </div>
        </div>
      </section>

      <div className="p-4 md:p-6 space-y-6">
        {/* Daily tip */}
        <motion.div
          key={tipIdx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl p-4 border-l-4 border-primary shadow-sm"
        >
          <div className="text-xs uppercase tracking-wider text-primary font-medium mb-1">Conseil du jour</div>
          <div className="text-sm">{dailyTips[tipIdx]}</div>
        </motion.div>

        {/* Streak */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">Mon rituel — 7 jours</div>
            <div className="text-xs text-muted-foreground">{streak.filter(Boolean).length}/7</div>
          </div>
          <div className="flex gap-2 justify-between">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <button
                key={i}
                onClick={() => setStreak((s) => s.map((v, idx) => (idx === i ? !v : v)))}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted-foreground">{d}</span>
                <span className={`size-7 rounded-full border-2 transition-all ${streak[i] ? "bg-primary border-primary" : "border-border bg-card"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Discover */}
        <div>
          <h2 className="font-display text-xl mb-3">Découvrez votre type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/photo" className="group relative h-40 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${unsplash("photo-1522337360788-8b13dee7a37e", 600)})` }} />
              <div className="absolute inset-0 bg-[rgba(44,24,16,0.55)]" />
              <div className="relative h-full p-5 flex flex-col justify-end text-white">
                <Camera className="size-6 mb-2" />
                <div className="font-display text-lg">Analyser ma photo</div>
                <div className="text-xs opacity-80">Détection IA en 10 secondes</div>
              </div>
            </Link>
            <Link to="/quiz" className="group relative h-40 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${unsplash("photo-1492106087820-71f1a00d2b11", 600)})` }} />
              <div className="absolute inset-0 bg-[rgba(44,24,16,0.55)]" />
              <div className="relative h-full p-5 flex flex-col justify-end text-white">
                <HelpCircle className="size-6 mb-2" />
                <div className="font-display text-lg">Faire le quiz</div>
                <div className="text-xs opacity-80">12 questions guidées</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Hair type grid */}
        <div>
          <h2 className="font-display text-xl mb-1">Quel est votre type ?</h2>
          <p className="text-xs text-muted-foreground mb-3">Sélection multiple — affinez votre profil</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Object.keys(hairTypePhotos).map((t) => {
              const active = selectedTypes.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${active ? "border-primary ring-2 ring-primary/30" : "border-transparent"}`}
                >
                  <img src={unsplash(hairTypePhotos[t], 200)} alt={t} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1 inset-x-0 text-center text-white font-semibold text-sm">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick access */}
        <div>
          <h2 className="font-display text-xl mb-3">⚡ Accès rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { to: "/photo", label: "Photo IA", emoji: "📸" },
              { to: "/diagnostic", label: "Diagnostic", emoji: "💆" },
              { to: "/recipes", label: "Recettes", emoji: "🌿" },
              { to: "/shop", label: "Shop", emoji: "🛍️" },
              { to: "/aura", label: "Aura", emoji: "✨" },
              { to: "/meteo", label: "Météo", emoji: "🌦️" },
            ].map(({ to, label, emoji }) => (
              <Link key={to} to={to} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary transition-colors">
                <span className="text-2xl" aria-hidden>{emoji}</span>
                <span className="text-xs font-medium text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
