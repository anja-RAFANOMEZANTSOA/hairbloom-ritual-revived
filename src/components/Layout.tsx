import { ReactNode, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Camera, Sparkles, ShoppingBag, UserCircle2, HelpCircle, Stethoscope,
  Sprout, Images, CloudRain, Ruler, ScanLine, CalendarCheck, BookOpen, History,
  ShoppingCart, Heart, Notebook, Users, Droplet, Trophy, Moon, Sun,
  Search as SearchIcon, CalendarDays,
} from "lucide-react";
import { Logo } from "./Logo";
import { NotificationBell } from "./NotificationBell";
import { AIChat } from "./AIChat";
import { ensureScheduled } from "@/lib/notifications";
import { useCart } from "@/lib/cart";
import { LANGS, useLang } from "@/lib/i18n";
import { useProfile } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { trackVisit, useBadges } from "@/lib/badges";
import { HeaderTimerBadge, RecipeTimerOverlay } from "./RecipeTimer";
import { BadgeCelebration } from "./BadgeCelebration";
import { GlobalSearch } from "./GlobalSearch";
import { useFontSize } from "@/lib/font-size";
import { OfflineBanner } from "./OfflineBanner";
import { auras } from "@/lib/hair-data";

type NavItem = { to: string; key: string; icon: typeof Home; pro?: boolean };
type NavSection = { titleKey: string; items: NavItem[] };

const sections: NavSection[] = [
  { titleKey: "section_analysis", items: [
    { to: "/photo", key: "photo", icon: Camera, pro: true },
    { to: "/quiz", key: "quiz", icon: HelpCircle },
    { to: "/diagnostic", key: "diagnostic", icon: Stethoscope, pro: true },
    { to: "/inci", key: "inci", icon: ScanLine },
    { to: "/aura", key: "aura", icon: Sparkles },
  ]},
  { titleKey: "section_care", items: [
    { to: "/recipes", key: "recipes", icon: Sprout },
    { to: "/shop", key: "shop", icon: ShoppingBag },
    { to: "/panier", key: "cart", icon: ShoppingCart },
    { to: "/wishlist", key: "wishlist", icon: Heart },
  ]},
  { titleKey: "section_tracking", items: [
    { to: "/journal", key: "journal", icon: Notebook },
    { to: "/calendrier", key: "calendar", icon: CalendarDays },
    { to: "/plan", key: "plan", icon: CalendarCheck },
    { to: "/repousse", key: "repousse", icon: Ruler },
    { to: "/avant-apres", key: "before_after", icon: Images },
    { to: "/meteo", key: "weather", icon: CloudRain },
    { to: "/historique", key: "history", icon: History },
  ]},
  { titleKey: "section_community", items: [
    { to: "/communaute", key: "community", icon: Users },
    { to: "/conseils", key: "advice", icon: BookOpen },
    { to: "/badges", key: "badges", icon: Trophy },
  ]},
  { titleKey: "section_account", items: [
    { to: "/profil", key: "profile", icon: UserCircle2 },
  ]},
];

function SidebarSections({ pathname, t }: { pathname: string; t: (k: string) => string }) {
  return (
    <>
      <Link
        to="/"
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3 text-sm transition-all relative ${
          pathname === "/" ? "nav-active bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-white/60"
        }`}
      >
        {pathname === "/" && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[var(--caramel)]" />}
        <Home className="size-5 shrink-0" strokeWidth={1.75} />
        <span>{t("home")}</span>
      </Link>
      {sections.map((sec) => (
        <div key={sec.titleKey} className="mb-3">
          <div className="sidebar-section-label px-4 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--caramel)] font-semibold">{t(sec.titleKey)}</div>
          {sec.items.map((l) => {
            const active = pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-0.5 text-sm transition-all relative ${
                  active ? "nav-active bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-white/60"
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[var(--caramel)]" />}
                <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="flex-1">{t(l.key)}</span>
                {l.pro && <span className="pro-badge">Pro</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

const bottomNav = [
  { to: "/", key: "home", icon: Home },
  { to: "/photo", key: "photo", icon: Camera },
  { to: "/recipes", key: "recipes", icon: Sprout },
  { to: "/shop", key: "shop", icon: ShoppingBag },
  { to: "/profil", key: "profile", icon: UserCircle2 },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cart = useCart();
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const [lang, setLang, t] = useLang();
  const [profile] = useProfile();
  const [theme, , toggleTheme] = useTheme();
  // Subscribe so newly-unlocked badges fire celebrations app-wide.
  useBadges();
  useFontSize(); // applies stored font-size class to <html>
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => { ensureScheduled(); }, []);
  useEffect(() => { trackVisit(pathname); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const allItems = [{ to: "/", key: "home" }, ...sections.flatMap((s) => s.items.map((i) => ({ to: i.to, key: i.key })))];
  const titleKey = allItems.find((l) => l.to === pathname)?.key;
  const titleFor = titleKey ? t(titleKey) : "HairBloom";
  const initials = (profile.name || "U").slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <div className="top-strip" />
      {/* Desktop sidebar */}
      <aside className="hb-sidebar hidden lg:flex w-64 shrink-0 border-r border-border flex-col" style={{ background: "linear-gradient(180deg, #FDF9F6 0%, #FFF8F0 100%)" }}>
        <Link to="/" className="logo-bloom flex items-center gap-3 p-6 border-b border-border">
          <Logo size={40} />
          <div>
            <div className="hb-logo-title font-display text-xl font-semibold leading-none">HairBloom</div>
            <div className="hb-logo-tag text-xs text-muted-foreground mt-1">{t("tagline")}</div>
          </div>
        </Link>
        <Link to="/profil" className="hb-user-card flex items-center gap-3 px-4 py-3 mx-3 mt-3 rounded-2xl glass">
          <div className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-display avatar-glow">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{profile.name || t("profile")}</div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {profile.hairType && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">{profile.hairType}</span>
              )}
              <span className="text-[10px] text-muted-foreground truncate">
                {profile.hairType ? (auras[profile.hairType]?.name ?? "Aura") : "Définir profil"}
              </span>
            </div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto p-3">
          <SidebarSections pathname={pathname} t={t} />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 glass border-b border-border flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2 lg:hidden">
            <Logo size={28} />
            <span className="font-display text-lg">{titleFor}</span>
          </div>
          <div className="hidden lg:block font-display text-lg">{titleFor}</div>
          <div className="flex items-center gap-1">
            <HeaderTimerBadge />
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher dans HairBloom"
              className="p-2 rounded-full hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <SearchIcon className="size-5" />
            </button>
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
              className="p-2 rounded-full hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as never)}
              className="bg-transparent text-base outline-none cursor-pointer pr-1 rounded-full px-2 py-1 hover:bg-secondary"
              aria-label="Language"
            >
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
            <Link to="/panier" aria-label={`Panier${cartCount ? `, ${cartCount} article${cartCount > 1 ? "s" : ""}` : ""}`} className="relative p-2 rounded-full hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: [1.4, 1] }} className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center font-medium">{cartCount}</motion.span>
              )}
            </Link>
            <NotificationBell />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border">
        <div className="grid grid-cols-5">
          {bottomNav.map((l) => {
            const active = pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className={`grid place-items-center px-4 py-1 rounded-full transition-all duration-300 ${active ? "bg-gradient-to-r from-[var(--caramel)] to-[var(--blush)] text-white shadow-md" : ""}`}>
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span>{t(l.key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <AIChat />
      <RecipeTimerOverlay />
      <BadgeCelebration />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <OfflineBanner />
    </div>
  );
}