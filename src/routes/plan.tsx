import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, PartyPopper } from "lucide-react";
import { planDays, dailyTips } from "@/lib/hair-data";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/plan")({ component: Plan });

function Plan() {
  const [done, setDone] = useLocalStorage<number[]>("hairbloom_plan_done", []);
  const toggle = (d: number) => setDone(done.includes(d) ? done.filter((x) => x !== d) : [...done, d]);
  const completed = done.length;
  const progress = (completed / 30) * 100;
  const today = planDays[Math.min(completed, 29)];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Plan 30 jours</h1>
        <p className="text-muted-foreground text-sm">Votre rituel structuré en 4 phases</p>
      </header>

      <div className="relative bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary),var(--brown)_40%)] rounded-3xl p-6 text-white overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 44} animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100) }} transition={{ duration: 0.8 }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl">{completed}<span className="text-sm opacity-70">/30</span></div>
          </div>
          <div>
            <div className="text-xs uppercase opacity-80">Jour {today.day} — {today.phase}</div>
            <div className="font-display text-lg mt-1">{today.task}</div>
            <div className="text-xs opacity-80 mt-2 italic">{dailyTips[completed % dailyTips.length]}</div>
          </div>
        </div>
      </div>

      {completed === 30 && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-accent/30 rounded-2xl p-5 text-center">
          <PartyPopper className="size-10 text-primary mx-auto mb-2" />
          <h3 className="font-display text-2xl">Félicitations !</h3>
          <p className="text-sm">Vous avez complété votre rituel 30 jours.</p>
        </motion.div>
      )}

      {[1, 2, 3, 4].map((w) => (
        <div key={w}>
          <h2 className="font-display text-xl mb-2">Semaine {w} — {planDays.find((d) => d.week === w)?.phase}</h2>
          <div className="space-y-2">
            {planDays.filter((d) => d.week === w).map((d) => {
              const isDone = done.includes(d.day);
              return (
                <motion.button
                  key={d.day}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(d.day)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${isDone ? "bg-primary/10 border-primary" : "bg-card border-border"}`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {isDone ? <Check className="size-4" /> : <span className="text-xs">{d.day}</span>}
                  </div>
                  <div className="text-sm">{d.task}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}