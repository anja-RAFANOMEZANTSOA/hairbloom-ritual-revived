import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Camera, Sparkles, ShoppingBag, User, HelpCircle, FlaskConical,
  Leaf, Images, CloudSun, Ruler, ScanSearch, CalendarDays, BookOpen,
} from "lucide-react";
import { Logo } from "./Logo";

const allLinks = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/photo", label: "Photo IA", icon: Camera },
  { to: "/quiz", label: "Quiz", icon: HelpCircle },
  { to: "/diagnostic", label: "Diagnostic", icon: FlaskConical },
  { to: "/recipes", label: "Recettes", icon: Leaf },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/avant-apres", label: "Avant / Après", icon: Images },
  { to: "/meteo", label: "Météo", icon: CloudSun },
  { to: "/repousse", label: "Repousse", icon: Ruler },
  { to: "/inci", label: "Scanner INCI", icon: ScanSearch },
  { to: "/aura", label: "Mon Aura", icon: Sparkles },
  { to: "/plan", label: "Plan 30 jours", icon: CalendarDays },
  { to: "/conseils", label: "Conseils", icon: BookOpen },
  { to: "/profil", label: "Profil", icon: User },
] as const;

const bottomNav = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/photo", label: "Photo IA", icon: Camera },
  { to: "/recipes", label: "Recettes", icon: Leaf },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/profil", label: "Profil", icon: User },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-card flex-col">
        <Link to="/" className="flex items-center gap-3 p-6 border-b border-border">
          <Logo size={40} />
          <div>
            <div className="font-display text-xl font-semibold leading-none">HairBloom</div>
            <div className="text-xs text-muted-foreground mt-1">Your hair. Your ritual.</div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto p-3">
          {allLinks.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 text-sm transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5">
          {bottomNav.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}