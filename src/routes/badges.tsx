import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Trophy } from "lucide-react";
import { useBadges, type BadgeStatus } from "@/lib/badges";

export const Route = createFileRoute("/badges")({ component: Badges });

function Badges() {
  const { all, unlocked, total, next } = useBadges();
  const pct = Math.round((unlocked.length / total) * 100);
  const R = 56;
  const C = 2 * Math.PI * R;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <header className="flex items-center gap-4">
        <div className="relative" style={{ width: 128, height: 128 }}>
          <svg viewBox="0 0 128 128" className="absolute inset-0">
            <circle cx="64" cy="64" r={R} stroke="var(--color-border)" strokeWidth="8" fill="none" />
            <circle cx="64" cy="64" r={R} stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" fill="none"
              strokeDasharray={C} strokeDashoffset={C * (1 - unlocked.length / total)}
              transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 0.6s" }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-3xl text-foreground leading-none">{unlocked.length}<span className="text-muted-foreground text-xl">/{total}</span></div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{pct}%</div>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl flex items-center gap-2">Mes Trophées <Trophy className="size-6 text-primary" /></h1>
          <p className="text-muted-foreground text-sm">Débloquez {total} trophées en prenant soin de vos cheveux</p>
          {next && (
            <p className="text-xs mt-2 text-foreground">
              Prochain : <span className="font-medium">{next.def.name} {next.def.emoji}</span>{" "}
              <span className="text-muted-foreground">({next.current}/{next.target})</span>
            </p>
          )}
        </div>
      </header>

      <section>
        <h2 className="font-display text-xl mb-3">Débloqués ({unlocked.length})</h2>
        {unlocked.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Aucun trophée débloqué pour l'instant. Commencez votre rituel !</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked.map((b) => <BadgeCard key={b.def.id} b={b} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">À débloquer ({all.length - unlocked.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {all.filter((b) => !b.unlocked).map((b) => <BadgeCard key={b.def.id} b={b} />)}
        </div>
      </section>

      <Link to="/" className="block text-center text-sm text-primary py-2">← Retour à l'accueil</Link>
    </div>
  );
}

function BadgeCard({ b }: { b: BadgeStatus }) {
  const { def, unlocked, progress, current, target, unlockedAt } = b;
  const Icon = def.icon;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative bg-card rounded-3xl p-4 border border-border text-center overflow-hidden"
      style={unlocked ? { boxShadow: `0 0 0 0.5px ${def.color}55, 0 6px 18px -8px ${def.color}55` } : undefined}
    >
      {!unlocked && (
        <div className="absolute top-2 right-2 size-7 rounded-full bg-background/80 grid place-items-center border border-border">
          <Lock className="size-3 text-muted-foreground" />
        </div>
      )}
      <div
        className={`mx-auto size-16 rounded-full grid place-items-center mb-2 ${unlocked ? "" : "grayscale opacity-50 blur-[0.5px]"}`}
        style={{
          background: `radial-gradient(circle, ${def.color}33 0%, ${def.color}0a 70%)`,
          border: `1.5px solid ${def.color}66`,
        }}
      >
        <Icon className="size-7" style={{ color: def.color }} strokeWidth={1.75} />
      </div>
      <div className="text-xl mb-0.5">{def.emoji}</div>
      <h3 className="font-display text-sm leading-tight text-foreground">{def.name}</h3>
      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 min-h-[28px]">{def.description}</p>
      <div className="mt-2">
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(progress * 100)}%`, background: def.color }} />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">{current}/{target}</div>
      </div>
      {unlocked && unlockedAt && (
        <div className="text-[10px] text-primary mt-1">
          {new Date(unlockedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
        </div>
      )}
    </motion.div>
  );
}