import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Camera, Sparkle, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { Logo } from "./Logo";
import { saveProfile, type HairProfile } from "@/lib/storage";
import { unsplash } from "@/lib/hair-data";
import { getCurrentUser } from "@/lib/auth";

const KEY_PREFIX = "hairbloom_onboarded_";

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [celebrate, setCelebrate] = useState(false);
  const [draft, setDraft] = useState<HairProfile>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = getCurrentUser();
    if (!u) return;
    if (localStorage.getItem(KEY_PREFIX + u.id) !== "true") {
      setDraft({ name: u.firstName, profileType: u.profileType as HairProfile["profileType"] });
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };

  const finish = () => {
    saveProfile(draft);
    const u = getCurrentUser();
    if (u) localStorage.setItem(KEY_PREFIX + u.id, "true");
    setCelebrate(true);
    const end = Date.now() + 900;
    const colors = ["#C9956A", "#F5E6DA", "#E8B596", "#F5C4B3"];
    (function frame() {
      confetti({ particleCount: 7, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    setTimeout(() => setOpen(false), 2400);
  };

  const TOTAL = 4;

  if (celebrate) {
    return (
      <div className="fixed inset-0 grid place-items-center px-6" style={{ background: "linear-gradient(135deg, #F5E6DA, #F5C4B3)", zIndex: 9999 }}>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 140 }} className="text-center max-w-sm">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 100 }} className="mx-auto w-28 h-28 rounded-full grid place-items-center mb-5 shadow-xl" style={{ background: "linear-gradient(135deg, #C9956A, #F5C4B3)" }}>
            <span className="text-5xl">🌸</span>
          </motion.div>
          <h2 className="font-display text-4xl mb-2" style={{ color: "#6B3A2A" }}>Bienvenue dans HairBloom{draft.name ? ` ${draft.name}` : ""} !</h2>
          <p className="text-base" style={{ color: "#8B7355" }}>Votre rituel personnalisé vous attend ✨</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: "var(--cream)", zIndex: 9999 }}
    >
      <div className="min-h-screen flex flex-col">
        <div className="px-6 pt-6 flex items-center justify-between">
          <button onClick={() => step > 1 && go(step - 1)} disabled={step === 1} className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30 hover:text-primary transition-colors">
            <ArrowLeft className="size-4" /> {step > 1 ? "Retour" : ""}
          </button>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-base">HairBloom</span>
          </div>
          <span className="text-xs text-muted-foreground">Étape {step}/{TOTAL}</span>
        </div>
        <div className="px-6 mt-3">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full" style={{ background: "linear-gradient(90deg, #C9956A, #E8B596)" }} animate={{ width: `${(step / TOTAL) * 100}%` }} transition={{ type: "spring", stiffness: 80 }} />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {step === 1 && (
              <div className="flex-1 flex flex-col">
                <div
                  className="relative h-80 mx-6 mt-4 rounded-3xl overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${unsplash("photo-1560869713-7d0a29430803", 900)})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(44,24,16,0.65)]" />
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <h1 className="font-display text-4xl leading-tight">Your hair.<br />Your ritual.</h1>
                  </div>
                </div>
                <div className="px-6 py-8 flex-1 flex flex-col">
                  <h2 className="font-display text-2xl mb-3">Bienvenue dans HairBloom</h2>
                  <p className="text-muted-foreground mb-8">Découvrez la routine parfaite pour vos cheveux, en 3 étapes simples.</p>
                  <button
                    onClick={() => go(2)}
                    className="mt-auto w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg"
                  >
                    Commencer <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col px-6 py-8">
                <h2 className="font-display text-2xl mb-2">Faisons connaissance</h2>
                <p className="text-muted-foreground mb-6">Votre prénom et qui sont ces cheveux ?</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="Votre prénom"
                  value={draft.name || ""}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-card border border-border outline-none focus:border-primary"
                />
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {(["Femme", "Homme", "Enfant"] as const).map((p) => {
                    const active = draft.profileType === p;
                    const emoji = { Femme: "👩", Homme: "👨", Enfant: "🧒" }[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setDraft({ ...draft, profileType: p })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          active ? "border-primary bg-primary/10" : "border-border bg-card"
                        }`}
                      >
                        <div className="text-3xl mb-1">{emoji}</div>
                        <div className="text-sm">{p}</div>
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={!draft.name || !draft.profileType}
                  onClick={() => go(3)}
                  className="mt-auto w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Continuer <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex flex-col px-6 py-8">
                <h2 className="font-display text-2xl mb-2">3 questions rapides</h2>
                <p className="text-muted-foreground mb-6">Pour personnaliser votre rituel.</p>
                <Quick label="Type de cheveux" options={["Raides", "Ondulés", "Bouclés", "Crépus"]} value={draft.texture} onChange={(v) => setDraft({ ...draft, texture: v })} />
                <Quick label="Problème principal" options={["Sécheresse", "Chute", "Pellicules", "Frisottis"]} value={draft.problem} onChange={(v) => setDraft({ ...draft, problem: v })} />
                <Quick label="Objectif" options={["Hydratation", "Croissance", "Volume", "Réparation"]} value={draft.goal} onChange={(v) => setDraft({ ...draft, goal: v })} />
                <button
                  disabled={!draft.texture || !draft.problem || !draft.goal}
                  onClick={() => go(4)}
                  className="mt-auto w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Continuer <ArrowRight className="size-4" />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col px-6 py-8">
                <h2 className="font-display text-2xl mb-2">Ce qui vous attend</h2>
                <p className="text-muted-foreground mb-6">Quelques fonctionnalités phares de votre rituel HairBloom.</p>
                <div className="mx-auto relative w-full max-w-[260px] aspect-[9/16] rounded-[2.2rem] border-[6px] border-[#3D2535] bg-gradient-to-b from-[#F5E6DA] to-[#F5C4B3] shadow-xl p-3 overflow-hidden">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#3D2535] rounded-b-2xl" />
                  <div className="mt-5 space-y-2.5">
                    {[
                      { Icon: Camera, t: "Photo IA", s: "Analyse de votre chevelure" },
                      { Icon: Sparkle, t: "Recettes DIY", s: "30+ recettes naturelles" },
                      { Icon: Heart, t: "Aura & badges", s: "Suivez vos progrès" },
                    ].map(({ Icon, t, s }, i) => (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.12 }}
                        className="bg-white/85 backdrop-blur rounded-2xl p-3 flex items-center gap-3 shadow-sm"
                      >
                        <div className="size-9 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg, #C9956A, #F5C4B3)" }}>
                          <Icon className="size-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-display text-sm" style={{ color: "#6B3A2A" }}>{t}</div>
                          <div className="text-[10px]" style={{ color: "#8B7355" }}>{s}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={finish}
                  className="mt-auto w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="size-4" /> Découvrir mon rituel
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Quick({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-5">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`py-3 rounded-xl text-sm border-2 transition-all ${
                active ? "border-primary bg-primary/10 font-medium" : "border-border bg-card"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}