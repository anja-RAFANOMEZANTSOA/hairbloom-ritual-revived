import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications, markAllRead, removeNotification, timeAgo } from "@/lib/notifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { items, unread } = useNotifications();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-5 text-foreground" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-semibold grid place-items-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 z-[60]"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-[61] flex flex-col shadow-2xl"
            >
              <header className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl">Notifications</h2>
                  <p className="text-xs text-muted-foreground">{items.length} au total · {unread} non lues</p>
                </div>
                <button onClick={() => setOpen(false)} className="size-8 grid place-items-center rounded-full hover:bg-secondary">
                  <X className="size-4" />
                </button>
              </header>

              {items.length > 0 && (
                <div className="px-4 py-2 border-b border-border">
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary font-medium flex items-center gap-1.5 hover:underline"
                  >
                    <CheckCheck className="size-3.5" /> Tout marquer comme lu
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground text-sm">
                    <Bell className="size-10 mx-auto mb-3 opacity-30" />
                    Aucune notification pour le moment.
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {items.map((n) => (
                      <li key={n.id} className={`p-4 flex gap-3 group ${!n.read ? "bg-primary/5" : ""}`}>
                        <div className="text-2xl shrink-0">{n.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-medium text-sm truncate">{n.title}</h3>
                            {!n.read && <span className="size-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                          <div className="text-[10px] text-muted-foreground mt-1.5">{timeAgo(n.createdAt)}</div>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity size-7 grid place-items-center text-muted-foreground hover:text-destructive"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}