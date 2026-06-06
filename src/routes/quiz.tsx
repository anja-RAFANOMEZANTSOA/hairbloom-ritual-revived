import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { saveProfile } from "@/lib/storage";
import { toast } from "sonner";
import { addHistory } from "@/lib/history";
import { markInitialAnalysisDone } from "@/lib/initial-analysis";
import { unsplash } from "@/lib/hair-data";

export const Route = createFileRoute("/quiz")({
  validateSearch: (s: Record<string, unknown>) => ({ initial: s.initial === "1" ? "1" : undefined }),
  component: Quiz,
});

type Opt = { label: string; photo: string };
type Q = { q: string; hint: string; o: Opt[] };

const questions: Q[] = [
  { q: "Pour qui est ce diagnostic ?", hint: "Pas de bonne ou mauvaise réponse",
    o: [
      { label: "Femme", photo: "photo-1522337360788-8b13dee7a37e" },
      { label: "Homme", photo: "photo-1583195764036-6dc248ac07d9" },
      { label: "Enfant", photo: "photo-1503454537195-1dcabb73ffb9" },
      { label: "Tous", photo: "photo-1556228720-195a672e8a03" },
    ] },
  { q: "Longueur des cheveux ?", hint: "Indiquez la longueur actuelle",
    o: [
      { label: "Court", photo: "photo-1583195764036-6dc248ac07d9" },
      { label: "Moyen", photo: "photo-1560869713-7d0a29430803" },
      { label: "Long", photo: "photo-1522337360788-8b13dee7a37e" },
      { label: "Très long", photo: "photo-1595163153849-cb1d2a07a4b6" },
    ] },
  { q: "Après le lavage, sans produits, vos cheveux sont…", hint: "Observez votre texture naturelle",
    o: [
      { label: "Raides", photo: "photo-1560869713-7d0a29430803" },
      { label: "Légèrement ondulés", photo: "photo-1522337360788-8b13dee7a37e" },
      { label: "Bouclés", photo: "photo-1595163153849-cb1d2a07a4b6" },
      { label: "Très frisés", photo: "photo-1598440947619-2c35fc9aa908" },
    ] },
  { q: "Au toucher, cheveux secs ?", hint: "Soyez honnête avec vous-même",
    o: [
      { label: "Soyeux", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Normal", photo: "photo-1556228720-195a672e8a03" },
      { label: "Rugueux", photo: "photo-1598440947619-2c35fc9aa908" },
      { label: "Comme de la paille", photo: "photo-1559599101-f09722fb4948" },
    ] },
  { q: "Densité ?", hint: "Combien de cheveux sur votre tête",
    o: [
      { label: "Fins", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Moyens", photo: "photo-1560869713-7d0a29430803" },
      { label: "Épais", photo: "photo-1595163153849-cb1d2a07a4b6" },
      { label: "Très épais", photo: "photo-1598440947619-2c35fc9aa908" },
    ] },
  { q: "Vos cheveux s'emmêlent…", hint: "Au quotidien",
    o: [
      { label: "Jamais", photo: "photo-1556228720-195a672e8a03" },
      { label: "Parfois", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Souvent", photo: "photo-1595163153849-cb1d2a07a4b6" },
      { label: "Toujours", photo: "photo-1598440947619-2c35fc9aa908" },
    ] },
  { q: "Temps de séchage ?", hint: "À l'air libre, sans sèche-cheveux",
    o: [
      { label: "< 1h", photo: "photo-1560869713-7d0a29430803" },
      { label: "1-2h", photo: "photo-1522337360788-8b13dee7a37e" },
      { label: "> 2h", photo: "photo-1595163153849-cb1d2a07a4b6" },
      { label: "Très long", photo: "photo-1598440947619-2c35fc9aa908" },
    ] },
  { q: "Cuir chevelu après 2 jours ?", hint: "Sans shampooing",
    o: [
      { label: "Normal", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Gras", photo: "photo-1556228720-195a672e8a03" },
      { label: "Sec", photo: "photo-1598440947619-2c35fc9aa908" },
      { label: "Qui démange", photo: "photo-1559599101-f09722fb4948" },
    ] },
  { q: "Goutte d'eau sur cheveux ?", hint: "Test de porosité maison",
    o: [
      { label: "Absorbe vite", photo: "photo-1559599101-f09722fb4948" },
      { label: "Moyen", photo: "photo-1556228720-195a672e8a03" },
      { label: "Perle", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Très lent", photo: "photo-1560869713-7d0a29430803" },
    ] },
  { q: "Effet de l'humidité ?", hint: "Pluie, brume, chaleur tropicale…",
    o: [
      { label: "Aucun", photo: "photo-1556228720-195a672e8a03" },
      { label: "Gonflé", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Très frisé", photo: "photo-1598440947619-2c35fc9aa908" },
      { label: "Boucles resserrées", photo: "photo-1595163153849-cb1d2a07a4b6" },
    ] },
  { q: "Objectif principal ?", hint: "Choisissez celui qui compte le plus",
    o: [
      { label: "Hydratation", photo: "photo-1556228720-195a672e8a03" },
      { label: "Croissance", photo: "photo-1535585209827-a15fcdbc4c2d" },
      { label: "Volume", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Réparation", photo: "photo-1598440947619-2c35fc9aa908" },
    ] },
  { q: "Chaleur (fer, sèche-cheveux) ?", hint: "Fréquence d'utilisation",
    o: [
      { label: "Jamais", photo: "photo-1556228720-195a672e8a03" },
      { label: "Parfois", photo: "photo-1560869713-7d0a29430803" },
      { label: "Souvent", photo: "photo-1571781926291-c477ebfd024b" },
      { label: "Quotidien", photo: "photo-1559599101-f09722fb4948" },
    ] },
];

const curlMap: Record<string, string> = { Raides: "1b", "Légèrement ondulés": "2b", Bouclés: "3b", "Très frisés": "4b" };
const porosityMap: Record<string, string> = { "Absorbe vite": "Haute", Moyen: "Moyenne", Perle: "Basse", "Très lent": "Basse" };
const typeLabel: Record<string, string> = { "1b": "Raides", "2b": "Ondulés 2b", "3b": "Bouclés 3b", "4b": "Crépus 4b" };

function Quiz() {
  const navigate = useNavigate();
  const { initial } = useSearch({ from: "/quiz" });
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<(string | undefined)[]>(Array(questions.length).fill(undefined));
  const [done, setDone] = useState(false);

  const finalize = (final: (string | undefined)[]) => {
    const hairType = curlMap[final[2] || ""] || "2b";
    const porosity = porosityMap[final[8] || ""] || "Moyenne";
    saveProfile({ hairType, texture: final[2], porosity, problem: final[10], goal: final[10] });
    addHistory("quiz", `Type ${hairType} · porosité ${porosity}`, { hairType, porosity, texture: final[2], goal: final[10], answers: final });
    try { localStorage.setItem("hairbloom_last_analysis", JSON.stringify({ hairType, porosity, texture: final[2], mainProblems: [final[10]] })); } catch {}
    try { localStorage.setItem("hairbloom_quiz_done", "1"); window.dispatchEvent(new Event("hairbloom:badges-tick")); } catch {}
    if (initial === "1") markInitialAnalysisDone();
    toast.success("Profil enregistré");
    setDone(true);
  };

  const pick = (a: string) => {
    const next = [...answers];
    next[step] = a;
    setAnswers(next);
    setDir(1);
    if (step < questions.length - 1) setTimeout(() => setStep(step + 1), 180);
    else finalize(next);
  };

  const back = () => { if (step > 0) { setDir(-1); setStep(step - 1); } };

  useEffect(() => {
    if (!done) return;
    const end = Date.now() + 800;
    const colors = ["#C9956A", "#F5E6DA", "#E8B596"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    const t = setTimeout(() => navigate({ to: "/resultats", replace: true }), 3200);
    return () => clearTimeout(t);
  }, [done, navigate]);

  if (done) {
    const hairType = curlMap[answers[2] || ""] || "2b";
    const goal = answers[10] || "Hydratation";
    return (
      <div className="max-w-xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 120 }} className="card-lux rounded-3xl p-8 text-center overflow-hidden relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #C9956A, #F5C4B3)" }}
          >
            <span className="text-6xl">✨</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="font-display text-3xl mb-2 text-primary">Votre profil est prêt !</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg mb-1">Vous avez les cheveux <strong className="text-primary">{typeLabel[hairType]}</strong></motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-muted-foreground">voici votre rituel personnalisé pour <strong>{goal.toLowerCase()}</strong></motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-5 text-xs text-muted-foreground">Redirection…</motion.div>
        </motion.div>
      </div>
    );
  }

  const Q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center justify-between mb-3">
        <button onClick={back} disabled={step === 0} className="flex items-center gap-1 text-sm text-muted-foreground disabled:opacity-30 hover:text-primary transition-colors">
          <ArrowLeft className="size-4" /> Précédent
        </button>
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">Quitter</Link>
      </div>
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">Question {step + 1} sur {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full" style={{ background: "linear-gradient(90deg, #C9956A, #E8B596)" }} animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 80 }} />
        </div>
      </div>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.28 }}
        >
          <h2 className="font-display text-2xl md:text-3xl mb-1">{Q.q}</h2>
          <p className="text-xs text-muted-foreground mb-5 italic">💫 {Q.hint}</p>
          <div className="grid grid-cols-2 gap-3">
            {Q.o.map((o) => {
              const active = answers[step] === o.label;
              return (
                <motion.button
                  key={o.label}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -3 }}
                  onClick={() => pick(o.label)}
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all text-left ${active ? "border-primary ring-2 ring-primary/40" : "border-border"}`}
                  style={{ background: "#F5C4B3" }}
                >
                  <img
                    src={unsplash(o.photo, 500)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 size-7 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg">
                      <Check className="size-4" />
                    </motion.div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <div className="font-display text-base md:text-lg leading-tight drop-shadow">{o.label}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}