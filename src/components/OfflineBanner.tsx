import { AnimatePresence, motion } from "framer-motion";
import { CloudOff } from "lucide-react";
import { useOnline } from "@/lib/offline";

export function OfflineBanner() {
  const online = useOnline();
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          role="status"
          aria-live="polite"
          className="fixed top-0 inset-x-0 z-[60] bg-primary text-primary-foreground text-xs sm:text-sm px-4 py-2 flex items-center justify-center gap-2 shadow-md"
        >
          <CloudOff className="size-4" />
          <span>Mode hors-ligne — les données sont en cache local</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}