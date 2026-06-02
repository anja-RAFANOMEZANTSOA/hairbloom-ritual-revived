import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import {
  getBadge, useBadgeUnlockListener, type BadgeId,
} from "@/lib/badges";
import { toast } from "sonner";

export function BadgeCelebration() {
  const [activeId, setActiveId] = useState<BadgeId | null>(null);
  const [queue, setQueue] = useState<BadgeId[]>([]);

  useBadgeUnlockListener((id) => {
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
  });

  useEffect(() => {
    if (!activeId && queue.length > 0) {
      setActiveId(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [activeId, queue]);

  const def = activeId ? getBadge(activeId) : null;
  const close = () => setActiveId(null);

  const share = async () => {
    if (!def) return;
    const text = `J'ai débloqué le trophée « ${def.name} ${def.emoji} » sur HairBloom ! 🌸`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "HairBloom", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Copié dans le presse-papier");
    } catch {}
  };

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          key={def.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4"
          style={{ background: "rgba(20,10,16,0.55)", backdropFilter: "blur(12px)" }}
          onClick={close}
        >
          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const colors = ["#C9956A", "#E8B4B8", "#F5E6DA", "#9B72CF", "#E8C07A"];
              return (
                <motion.span
                  key={i}
                  initial={{ y: -40, x: (i - 20) * 10, opacity: 0, rotate: 0 }}
                  animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 + i * 18 }}
                  transition={{ duration: 3 + (i % 5) * 0.4, delay: i * 0.04, ease: "easeIn" }}
                  className="absolute left-1/2 top-0 block"
                  style={{
                    width: 8 + (i % 3) * 4,
                    height: 12 + (i % 3) * 4,
                    background: colors[i % colors.length],
                    borderRadius: i % 2 ? "50%" : "2px",
                  }}
                />
              );
            })}
          </div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-[2rem] p-7 text-center"
            style={{
              background: "linear-gradient(160deg, #FBF3EA 0%, #F5E3D0 100%)",
              boxShadow: "0 30px 80px -20px rgba(120,60,40,0.5), 0 0 0 1px rgba(201,149,106,0.3)",
            }}
          >
            <button onClick={close} aria-label="Fermer" className="absolute top-4 right-4 size-8 rounded-full bg-black/5 hover:bg-black/10 grid place-items-center text-[#2C1810]">
              <X className="size-4" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B6F5E]">Nouveau trophée</p>
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mx-auto mt-3 size-24 rounded-full grid place-items-center text-5xl"
              style={{ background: `radial-gradient(circle, ${def.color}33 0%, ${def.color}10 70%)`, border: `2px solid ${def.color}66` }}
            >
              {def.emoji}
            </motion.div>
            <h3 className="font-display text-2xl text-[#2C1810] mt-4">{def.name}</h3>
            <p className="text-sm text-[#5a3a28] mt-1">{def.description}</p>
            <button
              onClick={share}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9956A] text-white font-medium shadow-lg hover:bg-[#b88358] transition-colors"
            >
              <Share2 className="size-4" /> Partager ce trophée
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}