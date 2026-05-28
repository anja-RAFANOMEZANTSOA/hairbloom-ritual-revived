import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { saveProfile, type HairProfile } from "@/lib/storage";
import { unsplash } from "@/lib/hair-data";
import { getCurrentUser } from "@/lib/auth";

const KEY_PREFIX = "hairbloom_onboarded_";

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
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

  const finish = () => {
    saveProfile(draft);
    const u = getCurrentUser();
    if (u) localStorage.setItem(KEY_PREFIX + u.id, "true");
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: "var(--cream)", zIndex: 9999 }}
    >
      <div className="min-h-screen flex flex-col">
        <div className="px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display text-lg">HairBloom</span>
          </div>
          <span className="text-xs text-muted-foreground">Étape {step}/3</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
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
                    onClick={() => setStep(2)}
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
                  onClick={() => setStep(3)}
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
                  onClick={finish}
                  className="mt-auto w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium disabled:opacity-40 flex items-center justify-center gap-2"
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