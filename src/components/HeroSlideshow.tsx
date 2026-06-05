import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

const PHOTOS = [
  "photo-1522337360788-8b13dee7a37e",
  "photo-1560869713-7d0a29430803",
  "photo-1595163153849-cb1d2a07a4b6",
  "photo-1571781926291-c477ebfd024b",
  "photo-1556228720-195a672e8a03",
  "photo-1614707267537-b85aaf00c4b7",
  "photo-1598440947619-2c35fc9aa908",
  "photo-1585751119414-ef2636f8aede",
];

const url = (id: string) =>
  `https://images.unsplash.com/${id}?w=1600&q=90&fit=crop&auto=format`;

export function HeroSlideshow({ name }: { name?: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (dir: 1 | -1) =>
    setIdx((i) => (i + dir + PHOTOS.length) % PHOTOS.length);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden gradient-hero"
      style={{ height: "clamp(280px, 42vw, 460px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.img
            src={url(PHOTOS[idx])}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.15}px)`, background: "#F5C4B3" }}
            onError={(e) => { (e.currentTarget.style.background = "#F5C4B3"); }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.18 }}
            transition={{ duration: 5, ease: "easeOut" }}
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay (bottom + slight top) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none hero-grain opacity-40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 z-10">
        <div className="flex items-center gap-2 lg:hidden text-white drop-shadow">
          <Logo size={36} />
          <span className="font-display text-xl">HairBloom</span>
        </div>
        <div className="text-white drop-shadow-lg">
          <motion.h1
            key={`title-${idx}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-5xl"
          >
            Bonjour {name || "vous"} <Sparkles className="inline size-6 text-primary" />
          </motion.h1>
          <p className="opacity-90 mt-2 italic">Your hair. Your ritual.</p>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Photo précédente"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur text-white grid place-items-center transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Photo suivante"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur text-white grid place-items-center transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Aller à la photo ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-[var(--caramel)]" : "w-1.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}