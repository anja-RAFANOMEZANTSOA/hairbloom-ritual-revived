import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

const KEY = "hairbloom_splash_seen";

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY) === "1") return;
    setShow(true);
    const t = setTimeout(() => {
      localStorage.setItem(KEY, "1");
      setShow(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 grid place-items-center"
          style={{ zIndex: 10000, background: "linear-gradient(135deg, #F5E6DA, #F5C4B3)" }}
        >
          <div className="relative flex flex-col items-center gap-4">
            {/* Bloom petals */}
            <div className="relative w-40 h-40">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                  key={angle}
                  className="absolute left-1/2 top-1/2 w-12 h-20 rounded-full origin-bottom"
                  style={{
                    background: "linear-gradient(180deg, #C9956A, #F5C4B3)",
                    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                    opacity: 0.85,
                  }}
                  initial={{ scale: 0, rotate: angle - 30 }}
                  animate={{ scale: 1, rotate: angle }}
                  transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 120 }}
                />
              ))}
              <motion.div
                className="absolute inset-0 grid place-items-center"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
              >
                <div className="size-16 rounded-full bg-white/80 backdrop-blur grid place-items-center shadow-xl">
                  <Logo size={40} />
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center"
            >
              <div className="font-display text-3xl" style={{ color: "#6B3A2A" }}>HairBloom</div>
              <div className="text-xs italic" style={{ color: "#8B7355" }}>Your hair. Your ritual.</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}