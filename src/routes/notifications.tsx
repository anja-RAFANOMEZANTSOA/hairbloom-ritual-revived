import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowLeft, Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  KIND_COLORS,
  Notification,
  markAllRead,
  markRead,
  removeNotification,
  useNotifications,
} from "@/lib/notifications";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

const DAY = 24 * 60 * 60 * 1000;

function groupByDate(items: Notification[]) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - DAY;
  const startWeek = startToday - 7 * DAY;
  const groups: Record<string, Notification[]> = {
    "Aujourd'hui": [],
    "Hier": [],
    "Cette semaine": [],
    "Plus ancien": [],
  };
  for (const n of items) {
    if (n.createdAt >= startToday) groups["Aujourd'hui"].push(n);
    else if (n.createdAt >= startYesterday) groups["Hier"].push(n);
    else if (n.createdAt >= startWeek) groups["Cette semaine"].push(n);
    else groups["Plus ancien"].push(n);
  }
  return groups;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function NotifCard({ n }: { n: Notification }) {
  const color = KIND_COLORS[n.kind];
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -120) removeNotification(n.id);
  };
  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
      onClick={() => !n.read && markRead(n.id)}
      className={`relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden cursor-pointer group ${
        !n.read ? "" : "opacity-75"
      }`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex gap-3 p-4">
        <div
          className="size-12 shrink-0 rounded-2xl grid place-items-center text-2xl"
          style={{ background: `${color}22` }}
        >
          {n.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug">{n.title}</h3>
            {!n.read && (
              <span
                className="size-2 rounded-full shrink-0 mt-1.5"
                style={{ background: color }}
              />
            )}
          </div>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
          <div className="text-[11px] text-muted-foreground/80 mt-2">{formatTime(n.createdAt)}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(n.id);
          }}
          className="hidden md:grid opacity-0 group-hover:opacity-100 transition-opacity size-8 place-items-center text-muted-foreground hover:text-destructive shrink-0"
          aria-label="Supprimer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}

function NotificationsPage() {
  const { items, unread } = useNotifications();
  const groups = groupByDate(items);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="size-9 grid place-items-center rounded-full bg-card border border-border hover:bg-secondary transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl leading-tight">
              Centre de Notifications 🔔
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {items.length} au total · {unread} non {unread > 1 ? "lues" : "lue"}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
            >
              <CheckCheck className="size-3.5" /> Tout marquer comme lu
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-card border border-border rounded-3xl"
          >
            <div className="text-6xl mb-4">🌸</div>
            <div className="relative inline-block mb-4">
              <Bell className="size-12 text-primary/40" />
            </div>
            <h2 className="font-display text-xl mb-2">Tout est calme par ici</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Vous n'avez aucune notification pour l'instant. Revenez bientôt pour vos rappels et
              conseils du jour.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groups).map(([label, list]) =>
              list.length === 0 ? null : (
                <section key={label}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                    {label}
                  </h2>
                  <div className="space-y-2.5">
                    <AnimatePresence initial={false}>
                      {list.map((n) => (
                        <NotifCard key={n.id} n={n} />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              ),
            )}
            <p className="text-center text-[11px] text-muted-foreground/70 lg:hidden pt-2">
              Glissez vers la gauche pour supprimer
            </p>
          </div>
        )}
    </div>
  );
}