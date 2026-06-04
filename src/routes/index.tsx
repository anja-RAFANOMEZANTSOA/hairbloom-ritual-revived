import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Camera, HelpCircle, Sprout, ShoppingBag, Sparkles, CloudRain, Stethoscope, Trophy, ChevronRight, Heart } from "lucide-react";
import { useProfile } from "@/lib/storage";
import { unsplash, dailyTips, hairTypePhotos, recipes, products, auras } from "@/lib/hair-data";
import { useEffect, useState } from "react";
import { resetInitialAnalysis } from "@/lib/initial-analysis";
import { useBadges } from "@/lib/badges";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Reveal, CountUp } from "@/components/Reveal";
import { usePosts } from "@/lib/community";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [profile] = useProfile();
  const navigate = useNavigate();
  const { next, unlocked, total } = useBadges();
  const posts = usePosts();
  const redoAnalysis = () => {
    resetInitialAnalysis();
    navigate({ to: "/analyse-initiale" });
  };
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
  const streakCount = streak.filter(Boolean).length;
  const aura = auras[profile.hairType || "3b"] || auras["3b"];
  const featuredRecipe = recipes[(new Date().getDate()) % recipes.length];
  const featuredProduct = products[(new Date().getDate()) % products.length];
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto">
      <HeroSlideshow name={profile.name} />

      <div className="p-4 md:p-6 space-y-6">
        {/* Profil capillaire summary */}
        <Reveal delay={0}>
          <Link
            to="/profil"
            className="flex items-center gap-4 rounded-2xl p-4 bg-card border border-border card-lux hover:border-primary transition-colors"
          >
            <div
              className="size-14 rounded-full grid place-items-center text-2xl shrink-0"
              style={{ background: `${aura.color}33`, boxShadow: `0 0 24px ${aura.color}66`, border: `2px solid ${aura.color}` }}
            >
              {aura.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Votre profil capillaire</div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-display text-lg">{aura.name}</span>
                {profile.hairType && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">Type {profile.hairType}</span>}
                {profile.porosity && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary inline-block" /> {profile.porosity}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground shrink-0" />
          </Link>
        </Reveal>

        {next && (
          <Reveal delay={0.05}>
          <Link to="/badges" className="flex items-center gap-3 rounded-2xl px-4 py-3 border card-lux"
            style={{ background: `linear-gradient(135deg, ${next.def.color}1a, ${next.def.color}0a)`, borderColor: `${next.def.color}55` }}>
            <span className="size-10 rounded-full grid place-items-center text-xl shrink-0"
              style={{ background: `${next.def.color}33`, border: `1px solid ${next.def.color}66` }}>
              {next.def.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Prochain trophée</div>
              <div className="text-sm font-medium truncate">{next.def.name}</div>
              <div className="text-xs text-muted-foreground">
                Encore {Math.max(0, next.target - next.current)} {next.target - next.current === 1 ? "étape" : "étapes"} — {unlocked.length}/{total} débloqués
              </div>
            </div>
            <Trophy className="size-4 text-primary shrink-0" />
          </Link>
          </Reveal>
        )}
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <button
            onClick={redoAnalysis}
            className="px-5 py-3 rounded-2xl bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" /> Refaire mon analyse
          </button>
          <Link
            to="/resultats"
            search={{ tab: "defi" }}
            className="glow-pulse px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2"
          >
            <Trophy className="size-4" /> Rejoindre le défi 21 jours
          </Link>
        </Reveal>

        {/* Daily tip */}
        <Reveal delay={0.15}>
          <motion.div
            key={tipIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl p-4 border-l-4 border-primary card-lux"
          >
            <div className="text-xs uppercase tracking-wider text-primary font-medium mb-1">Conseil du jour</div>
            <div className="text-sm">{dailyTips[tipIdx]}</div>
          </motion.div>
        </Reveal>

        {/* Streak */}
        <Reveal delay={0.2}>
        <div className="bg-card rounded-2xl p-4 border border-border card-lux">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">Mon rituel — 7 jours</div>
            <div className="text-xs text-muted-foreground"><CountUp to={streakCount} />/7</div>
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
        </Reveal>

        {/* Featured recipe + product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Reveal delay={0.25}>
            <Link to="/recipes" className="block group relative h-52 rounded-2xl overflow-hidden card-lux">
              <img src={unsplash(featuredRecipe.cover, 600)} alt={featuredRecipe.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--caramel)] mb-1">Recette du moment</div>
                <div className="font-display text-xl leading-tight mb-3">{featuredRecipe.title}</div>
                <span className="self-start text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-medium">Essayer maintenant →</span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.3}>
            <Link to="/shop" className="flex h-52 rounded-2xl overflow-hidden card-lux bg-card border border-border group">
              <img src={unsplash(featuredProduct.photo, 400)} alt={featuredProduct.name} className="w-2/5 h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="flex-1 p-5 flex flex-col justify-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Produit tendance</div>
                <div className="text-xs text-muted-foreground">{featuredProduct.brand}</div>
                <div className="font-display text-lg leading-tight mt-1">{featuredProduct.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{featuredProduct.benefit}</div>
                <span className="mt-3 self-start text-xs px-3 py-1.5 rounded-full bg-primary/15 text-primary font-medium border border-primary/30">Voir →</span>
              </div>
            </Link>
          </Reveal>
        </div>

        {/* Explore by type — horizontal scroll */}
        <Reveal delay={0.35}>
          <h2 className="font-display text-xl mb-3">Explorez par type</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {Object.keys(hairTypePhotos).map((t) => (
              <Link key={t} to="/recipes" className="flex flex-col items-center gap-1.5 shrink-0 snap-start">
                <div className="size-[60px] rounded-full overflow-hidden border-2 border-[var(--caramel)] avatar-glow">
                  <img src={unsplash(hairTypePhotos[t], 120)} alt={`Type ${t}`} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-medium">{t}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Discover */}
        <Reveal delay={0.4}>
          <h2 className="font-display text-xl mb-3">Découvrez votre type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/photo" className="group relative h-40 rounded-2xl overflow-hidden card-lux">
              <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${unsplash("photo-1522337360788-8b13dee7a37e", 600)})` }} />
              <div className="absolute inset-0 bg-[rgba(44,24,16,0.55)]" />
              <div className="relative h-full p-5 flex flex-col justify-end text-white">
                <Camera className="size-6 mb-2" />
                <div className="font-display text-lg">Analyser ma photo</div>
                <div className="text-xs opacity-80">Détection IA en 10 secondes</div>
              </div>
            </Link>
            <Link to="/quiz" className="group relative h-40 rounded-2xl overflow-hidden card-lux">
              <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${unsplash("photo-1492106087820-71f1a00d2b11", 600)})` }} />
              <div className="absolute inset-0 bg-[rgba(44,24,16,0.55)]" />
              <div className="relative h-full p-5 flex flex-col justify-end text-white">
                <HelpCircle className="size-6 mb-2" />
                <div className="font-display text-lg">Faire le quiz</div>
                <div className="text-xs opacity-80">12 questions guidées</div>
              </div>
            </Link>
          </div>
        </Reveal>

        {/* Community preview */}
        {recentPosts.length > 0 && (
          <Reveal delay={0.45}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl">Communauté — Derniers posts</h2>
              <Link to="/communaute" className="text-xs text-primary">Voir tout →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentPosts.map((p) => (
                <Link key={p.id} to="/communaute" className="bg-card rounded-2xl p-4 border border-border card-lux hover:border-primary transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-9 rounded-full bg-primary/15 grid place-items-center text-lg">{p.avatar}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{p.user}</div>
                      <div className="text-[10px] text-muted-foreground">{p.topic} · {p.hairType}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-3">{p.text}</div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2">
                    <Heart className="size-3 text-primary" /> {p.likes}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* Hair type grid */}
        <Reveal delay={0.5}>
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
        </Reveal>

        {/* Quick access */}
        <Reveal delay={0.55}>
          <h2 className="font-display text-xl mb-3">Accès rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { to: "/photo", label: "Photo IA", Icon: Camera },
              { to: "/diagnostic", label: "Diagnostic", Icon: Stethoscope },
              { to: "/recipes", label: "Recettes", Icon: Sprout },
              { to: "/shop", label: "Boutique", Icon: ShoppingBag },
              { to: "/aura", label: "Aura", Icon: Sparkles },
              { to: "/meteo", label: "Météo", Icon: CloudRain },
            ].map(({ to, label, Icon }) => (
              <Link key={to} to={to} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary card-lux transition-colors">
                <Icon className="size-6 text-primary" strokeWidth={1.75} />
                <span className="text-xs font-medium text-center">{label}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
