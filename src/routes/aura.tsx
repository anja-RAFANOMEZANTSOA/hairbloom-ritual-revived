import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useProfile } from "@/lib/storage";
import { auras } from "@/lib/hair-data";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/aura")({ component: Aura });

function Aura() {
  const [profile] = useProfile();
  const type = profile.hairType || "3b";
  const aura = auras[type] || auras["3b"];

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Mon Aura</h1>
        <p className="text-muted-foreground text-sm">Votre essence capillaire unique</p>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl overflow-hidden p-8 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${aura.color}, var(--brown))` }}
      >
        <div className="flex items-center justify-between text-xs opacity-70 mb-6">
          <div className="flex items-center gap-2"><Logo size={24} /><span>HairBloom</span></div>
          <span>{profile.name || "Vous"}</span>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto mb-6 size-40 rounded-full grid place-items-center text-6xl shadow-2xl"
          style={{ background: `radial-gradient(circle, ${aura.color}, transparent)`, boxShadow: `0 0 80px ${aura.color}` }}
        >
          {aura.emoji}
        </motion.div>

        <div className="text-xs uppercase tracking-[0.3em] opacity-70 mb-2">Type {aura.type}</div>
        <h2 className="font-display text-4xl mb-4">{aura.name}</h2>
        <p className="text-sm opacity-90 leading-relaxed mb-6 italic">{aura.description}</p>

        <div className="space-y-2">
          {aura.affirmations.map((a) => (
            <div key={a} className="bg-white/15 backdrop-blur px-4 py-2 rounded-xl text-sm">{a}</div>
          ))}
        </div>
      </motion.div>

      <button onClick={() => navigator.share?.({ title: `Mon aura ${aura.name}`, text: aura.description }).catch(() => {})} className="w-full py-3 rounded-2xl border-2 border-primary text-primary font-medium flex items-center justify-center gap-2">
        <Share2 className="size-4" /> Partager mon aura
      </button>
    </div>
  );
}