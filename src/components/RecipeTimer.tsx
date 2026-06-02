import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Square, X, PartyPopper } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  useTimer, pauseTimer, resumeTimer, stopTimer,
  markFinished, playChime, formatTime, markRecipeMade,
} from "@/lib/timer";

export function RecipeTimerOverlay() {
  const { state, remainingSeconds, progress } = useTimer();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!state) { firedRef.current = false; return; }
    if (!state.finished && !state.paused && remainingSeconds <= 0 && !firedRef.current) {
      firedRef.current = true;
      markFinished();
      playChime();
      const minutes = Math.round(state.totalSeconds / 60);
      markRecipeMade(state.recipeId, minutes);
    }
  }, [state, remainingSeconds]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key="timer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: "rgba(20, 10, 16, 0.55)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            className="relative w-full max-w-sm rounded-[2.2rem] p-8 text-center"
            style={{
              background: "linear-gradient(160deg, #FBF3EA 0%, #F5E3D0 100%)",
              boxShadow: "0 30px 80px -20px rgba(120, 60, 40, 0.45), 0 0 0 1px rgba(201,149,106,0.25)",
            }}
          >
            <button
              onClick={stopTimer}
              aria-label="Fermer"
              className="absolute top-4 right-4 size-9 rounded-full bg-[#2C1810]/10 hover:bg-[#2C1810]/20 grid place-items-center text-[#2C1810] transition-colors"
            >
              <X className="size-4" />
            </button>

            {state.finished ? (
              <FinishedView name={state.recipeName} />
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B6F5E] mb-1">Minuteur</p>
                <h3 className="font-display text-xl text-[#2C1810] leading-tight px-2 mb-6 line-clamp-2">
                  {state.recipeName}
                </h3>

                <CountdownRing
                  progress={progress}
                  paused={state.paused}
                  label={formatTime(remainingSeconds)}
                />

                <div className="mt-7 flex items-center justify-center gap-3">
                  {state.paused ? (
                    <button
                      onClick={resumeTimer}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9956A] text-white font-medium shadow-lg hover:bg-[#b88358] transition-colors"
                    >
                      <Play className="size-4 fill-white" /> Reprendre
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9956A] text-white font-medium shadow-lg hover:bg-[#b88358] transition-colors"
                    >
                      <Pause className="size-4 fill-white" /> Pause
                    </button>
                  )}
                  <button
                    onClick={stopTimer}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 text-[#2C1810] font-medium border border-[#C9956A]/30 hover:bg-white transition-colors"
                  >
                    <Square className="size-4" /> Arrêter
                  </button>
                </div>
                <p className="mt-5 text-xs text-[#8B6F5E]">
                  Vous pouvez naviguer dans l'app, le minuteur continue.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CountdownRing({ progress, paused, label }: { progress: number; paused: boolean; label: string }) {
  const R = 96;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - progress);
  return (
    <div className="relative mx-auto" style={{ width: 224, height: 224 }}>
      {/* soft pulsing halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,149,106,0.35) 0%, transparent 65%)" }}
        animate={paused ? { opacity: 0.4, scale: 1 } : { opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg viewBox="0 0 224 224" className="absolute inset-0">
        <circle cx="112" cy="112" r={R} stroke="rgba(201,149,106,0.18)" strokeWidth="10" fill="none" />
        <circle
          cx="112" cy="112" r={R}
          stroke="#C9956A" strokeWidth="10" strokeLinecap="round" fill="none"
          strokeDasharray={C}
          strokeDashoffset={dash}
          transform="rotate(-90 112 112)"
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="font-display text-5xl tracking-tight text-[#C9956A] tabular-nums">{label}</div>
      </div>
    </div>
  );
}

function FinishedView({ name }: { name: string }) {
  return (
    <div className="py-2">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14 }}
        className="mx-auto size-24 rounded-full grid place-items-center mb-4"
        style={{ background: "linear-gradient(135deg, #C9956A, #E8B4B8)" }}
      >
        <PartyPopper className="size-12 text-white" />
      </motion.div>
      <h3 className="font-display text-2xl text-[#2C1810] leading-tight mb-2">
        Votre masque est prêt à rincer ! 🎉
      </h3>
      <p className="text-sm text-[#5a3a28] mb-6">{name}</p>
      <button
        onClick={stopTimer}
        className="px-6 py-3 rounded-full bg-[#C9956A] text-white font-medium shadow-lg hover:bg-[#b88358] transition-colors"
      >
        Merci 🌸
      </button>
    </div>
  );
}

/** Small header badge shown while timer is running. */
export function HeaderTimerBadge() {
  const { state, remainingSeconds } = useTimer();
  if (!state) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden xs:flex sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: "linear-gradient(135deg, rgba(201,149,106,0.18), rgba(232,180,184,0.18))",
        border: "1px solid rgba(201,149,106,0.4)",
        color: "var(--color-foreground)",
      }}
      title="Masque en cours"
    >
      <span className="size-1.5 rounded-full bg-[#C9956A] animate-pulse" />
      <span className="hidden sm:inline">Masque</span>
      <span className="tabular-nums">{formatTime(remainingSeconds)}</span>
    </motion.div>
  );
}