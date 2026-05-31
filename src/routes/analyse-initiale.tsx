import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Camera, ClipboardList, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { unsplash } from "@/lib/hair-data";
import { markInitialAnalysisDone } from "@/lib/initial-analysis";

export const Route = createFileRoute("/analyse-initiale")({ component: AnalyseInitiale });

function AnalyseInitiale() {
  const navigate = useNavigate();
  const skip = () => {
    markInitialAnalysisDone();
    navigate({ to: "/", replace: true });
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        zIndex: 9998,
        background:
          "linear-gradient(135deg, #F5E6D8 0%, #E8C4A8 35%, #E8A8B8 70%, #F5C4D8 100%)",
      }}
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              width: 8 + (i % 4) * 6,
              height: 8 + (i % 4) * 6,
              background:
                i % 2 ? "rgba(255,255,255,0.5)" : "rgba(201,149,106,0.35)",
              filter: "blur(2px)",
            }}
            animate={{ y: [0, -30, 0], x: [0, 12, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex flex-col items-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <Logo size={42} />
          <span className="font-display text-2xl text-[#3a2418]">HairBloom</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-xl mb-8"
        >
          <h1 className="font-display text-3xl md:text-5xl text-[#3a2418] leading-tight">
            Découvrons vos cheveux <Sparkles className="inline size-7 text-primary" />
          </h1>
          <p className="text-[#5a3a28] mt-3 text-base md:text-lg">
            Choisissez comment vous souhaitez commencer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          <Choice
            to="/photo"
            search={{ initial: "1" }}
            delay={0.2}
            icon={<Camera className="size-7" />}
            emoji="📸"
            title="Analyser ma photo"
            subtitle="L'IA détecte votre type en 10 secondes"
            bg={unsplash("photo-1560869713-7d0a29430803", 900)}
          />
          <Choice
            to="/quiz"
            search={{ initial: "1" }}
            delay={0.3}
            icon={<ClipboardList className="size-7" />}
            emoji="💆"
            title="Diagnostic manuel"
            subtitle="Répondez à quelques questions"
            bg={unsplash("photo-1522337360788-8b13dee7a37e", 900)}
          />
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={skip}
          className="mt-8 text-sm text-[#5a3a28]/80 underline-offset-4 hover:underline flex items-center gap-1"
        >
          Passer cette étape <ArrowRight className="size-3" />
        </motion.button>
      </div>
    </div>
  );
}

function Choice({
  to,
  search,
  delay,
  icon,
  emoji,
  title,
  subtitle,
  bg,
}: {
  to: string;
  search?: Record<string, string>;
  delay: number;
  icon: React.ReactNode;
  emoji: string;
  title: string;
  subtitle: string;
  bg: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <Link
        to={to as any}
        search={search as any}
        className="group relative block h-72 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/85" />
        <div className="relative h-full p-6 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="text-4xl drop-shadow-lg">{emoji}</span>
            <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl leading-tight mb-1">{title}</h3>
            <p className="text-sm text-white/85 mb-4">{subtitle}</p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg">
              Choisir <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}