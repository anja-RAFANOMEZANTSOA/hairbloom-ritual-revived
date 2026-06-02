import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { saveProfile } from "@/lib/storage";
import { toast } from "sonner";
import { addHistory } from "@/lib/history";
import { markInitialAnalysisDone } from "@/lib/initial-analysis";

export const Route = createFileRoute("/quiz")({
  validateSearch: (s: Record<string, unknown>) => ({ initial: s.initial === "1" ? "1" : undefined }),
  component: Quiz,
});

const questions = [
  { q: "Pour qui est ce diagnostic ?", o: ["Femme", "Homme", "Enfant", "Tous"] },
  { q: "Longueur des cheveux ?", o: ["Court", "Moyen", "Long", "Très long"] },
  { q: "Après le lavage, sans produits, vos cheveux sont…", o: ["Raides", "Légèrement ondulés", "Bouclés", "Très frisés"] },
  { q: "Au toucher, cheveux secs ?", o: ["Soyeux", "Normal", "Rugueux", "Comme de la paille"] },
  { q: "Densité ?", o: ["Fins", "Moyens", "Épais", "Très épais"] },
  { q: "Vos cheveux s'emmêlent…", o: ["Jamais", "Parfois", "Souvent", "Toujours"] },
  { q: "Temps de séchage ?", o: ["< 1h", "1-2h", "> 2h", "Très long"] },
  { q: "Cuir chevelu après 2 jours ?", o: ["Normal", "Gras", "Sec", "Qui démange"] },
  { q: "Goutte d'eau sur cheveux ?", o: ["Absorbe vite", "Moyen", "Perle", "Très lent"] },
  { q: "Effet de l'humidité ?", o: ["Aucun", "Gonflé", "Très frisé", "Boucles resserrées"] },
  { q: "Objectif principal ?", o: ["Hydratation", "Croissance", "Volume", "Réparation"] },
  { q: "Chaleur (fer, sèche-cheveux) ?", o: ["Jamais", "Parfois", "Souvent", "Quotidien"] },
];

function Quiz() {
  const navigate = useNavigate();
  const { initial } = useSearch({ from: "/quiz" });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const pick = (a: string) => {
    const next = [...answers, a];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
    else {
      // Map curl pattern → hairType
      const curlMap: Record<string, string> = { Raides: "1b", "Légèrement ondulés": "2b", Bouclés: "3b", "Très frisés": "4b" };
      const porosityMap: Record<string, string> = { "Absorbe vite": "Haute", Moyen: "Moyenne", Perle: "Basse", "Très lent": "Basse" };
      const hairType = curlMap[next[2]] || "2b";
      const porosity = porosityMap[next[8]] || "Moyenne";
      saveProfile({ hairType, texture: next[2], porosity, problem: next[10], goal: next[10] });
      addHistory("quiz", `Type ${hairType} · porosité ${porosity}`, { hairType, porosity, texture: next[2], goal: next[10], answers: next });
      try { localStorage.setItem("hairbloom_last_analysis", JSON.stringify({ hairType, porosity, texture: next[2], mainProblems: [next[10]] })); } catch {}
      try { localStorage.setItem("hairbloom_quiz_done", "1"); window.dispatchEvent(new Event("hairbloom:badges-tick")); } catch {}
      setDone(true);
      toast.success("Profil enregistré");
      if (initial === "1") {
        markInitialAnalysisDone();
      }
      setTimeout(() => navigate({ to: "/resultats", replace: true }), 1200);
    }
  };

  if (done) {
    const curl = answers[2];
    const porosity = answers[8];
    return (
      <div className="max-w-xl mx-auto p-6 space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-6 text-center">
          <Sparkles className="size-10 text-primary mx-auto mb-3" />
          <h2 className="font-display text-3xl mb-2">Votre profil</h2>
          <p className="text-muted-foreground mb-4">Vos cheveux sont <strong className="text-primary">{curl}</strong> avec une porosité <strong className="text-primary">{porosity}</strong>.</p>
          <div className="text-left bg-secondary rounded-2xl p-4 space-y-2 text-sm">
            <div><strong>Routine :</strong> Lavage 1-2x/sem, masque hydratant hebdo, leave-in quotidien.</div>
            <div><strong>Objectif :</strong> {answers[10]} — voir nos recettes et plan 30 jours.</div>
          </div>
        </motion.div>
      </div>
    );
  }

  const Q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2"><span>Question {step + 1}/{questions.length}</span><span>{Math.round(progress)}%</span></div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden"><motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} /></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
          <h2 className="font-display text-2xl mb-6">{Q.q}</h2>
          <div className="space-y-2">
            {Q.o.map((o) => (
              <button key={o} onClick={() => pick(o)} className="w-full text-left px-5 py-4 rounded-2xl bg-card border-2 border-border hover:border-primary transition-colors flex items-center justify-between group">
                {o} <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}