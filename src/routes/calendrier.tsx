import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Trash2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  EVENT_KINDS,
  type CalEvent,
  type EventKind,
  deleteEvent,
  getMonthGrid,
  saveEvent,
  saveManyEvents,
  toggleEventDone,
  useCalendar,
  ymd,
} from "@/lib/calendar";
import { useProfile } from "@/lib/storage";
import { planHairMonth } from "@/lib/calendar-ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/calendrier")({
  head: () => ({
    meta: [
      { title: "Calendrier capillaire — HairBloom" },
      { name: "description", content: "Planifie tes soins capillaires avec un calendrier intelligent et l'IA HairBloom." },
    ],
  }),
  component: CalendarPage,
});

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function uid() { return Math.random().toString(36).slice(2, 10); }

function CalendarPage() {
  const events = useCalendar();
  const [profile] = useProfile();
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(ymd(today));
  const [showAdd, setShowAdd] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const planFn = useServerFn(planHairMonth);

  const grid = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const byDate = useMemo(() => {
    const m: Record<string, CalEvent[]> = {};
    for (const e of events) (m[e.date] ||= []).push(e);
    return m;
  }, [events]);
  const dayEvents = byDate[selectedDate] || [];

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const res = await planFn({
        data: {
          hairType: profile.hairType,
          goal: profile.goal,
          problem: profile.problem,
          startDate: ymd(today),
          weeks: 4,
        },
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      const valid = (res.events || []).filter((e) => e && e.date && e.kind && e.title);
      if (!valid.length) {
        toast.error("Aucun événement généré");
        return;
      }
      const mapped: CalEvent[] = valid.map((e) => ({
        id: uid(),
        date: e.date,
        kind: (EVENT_KINDS.find((k) => k.v === e.kind)?.v || "autre") as EventKind,
        title: e.title,
        notes: e.notes,
      }));
      saveManyEvents(mapped);
      toast.success(`${mapped.length} soins planifiés ✨`);
    } catch (e: any) {
      toast.error(e?.message || "Erreur");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Calendrier capillaire</h1>
          <p className="text-sm text-muted-foreground mt-1">Planifie tes rituels et laisse l'IA t'aider.</p>
        </div>
        <Button onClick={generateAI} disabled={aiLoading} className="gap-2">
          {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Planifier avec l'IA
        </Button>
      </header>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            aria-label="Mois précédent"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="p-2 rounded-full hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="font-display text-xl">{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</div>
          <button
            aria-label="Mois suivant"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="p-2 rounded-full hover:bg-secondary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
          {WEEKDAYS.map((d) => <div key={d} className="text-center py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d) => {
            const key = ymd(d);
            const inMonth = d.getMonth() === cursor.getMonth();
            const isToday = key === ymd(today);
            const isSelected = key === selectedDate;
            const evts = byDate[key] || [];
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedDate(key)}
                className={`relative aspect-square rounded-xl text-xs flex flex-col items-center justify-start p-1.5 transition-colors border ${
                  isSelected ? "bg-primary text-primary-foreground border-primary" :
                  isToday ? "bg-secondary border-primary/40" :
                  inMonth ? "bg-card border-border hover:bg-secondary" :
                  "bg-transparent border-transparent text-muted-foreground/60"
                }`}
              >
                <span className="font-medium">{d.getDate()}</span>
                {evts.length > 0 && (
                  <div className="flex gap-0.5 mt-auto flex-wrap justify-center">
                    {evts.slice(0, 3).map((e) => {
                      const k = EVENT_KINDS.find((x) => x.v === e.kind);
                      return <span key={e.id} className="size-1.5 rounded-full" style={{ background: k?.color || "#888" }} />;
                    })}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg">
            {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowAdd(true)} className="gap-1">
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>

        {dayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Aucun soin prévu ce jour.</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {dayEvents.map((e) => {
                const k = EVENT_KINDS.find((x) => x.v === e.kind);
                return (
                  <motion.li
                    key={e.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${e.done ? "opacity-60 line-through" : ""}`}
                    style={{ borderLeft: `4px solid ${k?.color || "#888"}` }}
                  >
                    <span className="text-xl" aria-hidden>{k?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.title}</div>
                      {e.notes && <div className="text-xs text-muted-foreground truncate">{e.notes}</div>}
                    </div>
                    <button
                      aria-label={e.done ? "Marquer non fait" : "Marquer fait"}
                      onClick={() => toggleEventDone(e.id)}
                      className="p-2 rounded-full hover:bg-secondary"
                    >
                      <Check className={`size-4 ${e.done ? "text-primary" : ""}`} />
                    </button>
                    <button
                      aria-label="Supprimer"
                      onClick={() => deleteEvent(e.id)}
                      className="p-2 rounded-full hover:bg-secondary text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </Card>

      <AnimatePresence>
        {showAdd && (
          <AddEventModal
            date={selectedDate}
            onClose={() => setShowAdd(false)}
            onSave={(ev) => { saveEvent(ev); setShowAdd(false); toast.success("Soin ajouté"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddEventModal({ date, onClose, onSave }: { date: string; onClose: () => void; onSave: (e: CalEvent) => void }) {
  const [kind, setKind] = useState<EventKind>("masque");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 grid place-items-end sm:place-items-center p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-5 space-y-4"
      >
        <h3 className="font-display text-xl">Nouveau soin</h3>
        <div className="grid grid-cols-4 gap-2">
          {EVENT_KINDS.map((k) => (
            <button
              key={k.v}
              onClick={() => { setKind(k.v); if (!title) setTitle(k.label); }}
              className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition ${
                kind === k.v ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
              }`}
            >
              <span className="text-lg">{k.emoji}</span>
              <span className="leading-tight text-center">{k.label}</span>
            </button>
          ))}
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du soin"
          className="w-full bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optionnel)"
          rows={3}
          className="w-full bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button
            onClick={() => {
              if (!title.trim()) return;
              onSave({ id: uid(), date, kind, title: title.trim(), notes: notes.trim() || undefined });
            }}
          >
            Ajouter
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}