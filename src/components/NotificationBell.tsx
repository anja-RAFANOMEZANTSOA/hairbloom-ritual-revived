import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/notifications";

export function NotificationBell() {
  const { unread } = useNotifications();
  return (
    <Link
      to="/notifications"
      className="relative size-10 rounded-full grid place-items-center hover:bg-secondary transition-colors"
      aria-label="Notifications"
    >
      <Bell className="size-5 text-foreground" />
      {unread > 0 && (
        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-white text-[10px] font-semibold grid place-items-center animate-pulse">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}