import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Flame, ScanLine, Heart, Ruler, Trophy, FlaskConical, ShoppingBag, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useJournal } from "@/lib/journal";
import { useChallenge, streak } from "@/lib/challenge";
import { usePosts } from "@/lib/community";
import { useBadges } from "@/lib/badges";
import { recipes } from "@/lib/hair-data";
import { useAuth } from "@/lib/auth";
import { useLocalStorage } from "@/lib/storage";

function readInciCount(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem("hairbloom_inci_scans") || "0", 10) || 0; } catch { return 0; }
}

export function StatsDashboard() {
  const journal = useJournal();
  const challenge = useChallenge();
  const posts = usePosts();
  const { unlocked, total } = useBadges();
  const { user } = useAuth();
  const [favs] = useLocalStorage<number[]>("hairbloom_fav_recipes", []);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  const isMaskEntry = (e: typeof journal[number]) =>
    e.products.some((p) => /masque|mask/i.test(p)) || /masque|mask/i.test(e.notes || "");
  const masksThisMonth = journal.filter((e) => new Date(e.date).getTime() >= monthStart && isMaskEntry(e)).length;
  const masksPrev = journal.filter((e) => {
    const t = new Date(e.date).getTime();
    return t >= prevStart && t < monthStart && isMaskEntry(e);
  }).length;
  const trend = masksThisMonth - masksPrev;

  const myPosts = posts.filter((p) => p.mine || p.user === "Vous" || (user?.firstName && p.user === user.firstName));
  const totalLikes = myPosts.reduce((s, p) => s + (p.likes || 0), 0);

  const inciScans = readInciCount();

  const joinDate = user?.createdAt ? new Date(user.createdAt) : null;
  const daysSinceJoin = joinDate ? Math.max(1, Math.floor((Date.now() - joinDate.getTime()) / 86400000)) : 0;
  const growthCm = (daysSinceJoin / 30) * 1.25; // est. ~1.25cm/month

  const completion = total > 0 ? Math.round((unlocked.length / total) * 100) : 0;
  const bestStreak = streak(challenge);

  const favRecipe = favs.length ? recipes.find((r) => r.id === favs[0])?.title || "—" : "—";

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    favs.forEach((id) => {
      const r = recipes.find((x) => x.id === id);
      r?.category.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "—";
  }, [favs]);

  // mini sparkline for masks last 8 weeks
  const series = useMemo(() => {
    const buckets: { v: number }[] = Array.from({ length: 8 }, () => ({ v: 0 }));
    journal.forEach((e) => {
      const t = new Date(e.date).getTime();
      const weeksAgo = Math.floor((Date.now() - t) / (7 * 86400000));
      if (weeksAgo >= 0 && weeksAgo < 8 && isMaskEntry(e)) buckets[7 - weeksAgo].v += 1;
    });
    return buckets;
  }, [journal]);

  const cards = [
    { icon: FlaskConical, label: "Masques ce mois", value: masksThisMonth, trend, sparkline: true },
    { icon: Flame, label: "Meilleure série", value: `${bestStreak}j`, sub: "Record routine" },
    { icon: ScanLine, label: "Produits scannés", value: inciScans, sub: "INCI" },
    { icon: Heart, label: "Likes reçus", value: totalLikes, sub: `${myPosts.length} posts` },
    { icon: Ruler, label: "Repousse", value: `${growthCm.toFixed(1)} cm`, sub: `depuis ${daysSinceJoin}j` },
    { icon: Trophy, label: "Trophées", value: `${completion}%`, sub: `${unlocked.length}/${total}` },
    { icon: BarChart3, label: "Recette favorite", value: favRecipe, isText: true },
    { icon: ShoppingBag, label: "Catégorie préférée", value: categoryCounts, isText: true },
  ];

  return (
    <section aria-labelledby="stats-heading" className="bg-card border border-border rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-full bg-primary/15 grid place-items-center text-primary"><BarChart3 className="size-5" /></div>
        <h2 id="stats-heading" className="font-display text-lg">Mes Statistiques</h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-border p-3 min-h-[88px] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-4 text-primary" aria-hidden />
                {"trend" in c && c.trend !== undefined && c.trend !== 0 && (
                  <span className={`flex items-center gap-0.5 text-[10px] ${c.trend > 0 ? "text-green-600" : "text-destructive"}`}>
                    <TrendingUp className={`size-3 ${c.trend < 0 ? "rotate-180" : ""}`} />
                    {c.trend > 0 ? "+" : ""}{c.trend}
                  </span>
                )}
              </div>
              <div>
                <div className={`font-display text-primary ${c.isText ? "text-sm leading-tight line-clamp-2" : "text-xl"}`}>{c.value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.label}{c.sub ? ` · ${c.sub}` : ""}</div>
              </div>
              {"sparkline" in c && c.sparkline && (
                <div className="h-6 -mx-1 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series}>
                      <Line type="monotone" dataKey="v" stroke="var(--caramel)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}