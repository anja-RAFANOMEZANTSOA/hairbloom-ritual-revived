import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, FlaskConical, HelpCircle, ChevronDown, Trash2, History as HistoryIcon } from "lucide-react";
import { useHistory, removeHistory, clearHistory, type HistoryEntry } from "@/lib/history";
import { toast } from "sonner";

export const Route = createFileRoute("/historique")({ component: HistoriquePage });

const META: Record<HistoryEntry["type"], { label: string; Icon: any; color: string }> = {
  photo: { label: "Photo IA", Icon: Camera, color: "var(--caramel)" },
  diagnostic: { label: "Diagnostic", Icon: FlaskConical, color: "var(--accent-pink)" },
  quiz: { label: "Quiz", Icon: HelpCircle, color: "var(--muted-brown)" },
};

function HistoriquePage() {
  const items = useHistory();
  const [filter, setFilter] = useState<"all" | HistoryEntry["type"]>("all");
  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Historique</h1>
          <p className="text-muted-foreground text-sm">Toutes vos analyses passées</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => { clearHistory(); toast.success("Historique effacé"); }}
            className="px-3 py-2 rounded-xl border border-destructive/40 text-destructive text-xs flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" /> Tout effacer
          </button>
        )}
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "photo", "diagnostic", "quiz"] as const).map((f) => {
          const active = filter === f;
          const label = f === "all" ? "Tout" : META[f].label;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                active ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-10 text-center">
          <HistoryIcon className="size-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Aucun historique pour le moment.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Vos analyses Photo IA, Diagnostics et Quiz apparaîtront ici.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => <Item key={e.id} entry={e} />)}
        </ul>
      )}
    </div>
  );
}

function Item({ entry }: { entry: HistoryEntry }) {
  const [open, setOpen] = useState(false);
  const meta = META[entry.type];
  const Icon = meta.Icon;
  const date = new Date(entry.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <li className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full p-4 flex items-center gap-3 text-left">
        <div className="size-10 rounded-xl grid place-items-center shrink-0" style={{ background: meta.color, color: "white" }}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-sm">{meta.label}</span>
            <span className="text-[11px] text-muted-foreground shrink-0">{date}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.summary}</p>
        </div>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 bg-secondary/40 space-y-2">
              {entry.type === "photo" && <PhotoDetail data={entry.data} />}
              {entry.type === "diagnostic" && <DiagDetail data={entry.data} />}
              {entry.type === "quiz" && <QuizDetail data={entry.data} />}
              <button
                onClick={() => { removeHistory(entry.id); toast.success("Entrée supprimée"); }}
                className="mt-3 text-xs text-destructive flex items-center gap-1.5 hover:underline"
              >
                <Trash2 className="size-3.5" /> Supprimer cette entrée
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div className="text-sm"><span className="text-muted-foreground">{label}: </span><span className="font-medium">{value}</span></div>;
}

function PhotoDetail({ data }: { data: any }) {
  return (
    <>
      <Row label="Type" value={data?.hairType} />
      <Row label="Texture" value={data?.texture} />
      <Row label="Porosité" value={data?.porosity} />
      <Row label="État" value={data?.condition} />
      {data?.mainProblems?.length > 0 && (
        <div className="text-sm"><span className="text-muted-foreground">Problèmes: </span>{data.mainProblems.join(", ")}</div>
      )}
    </>
  );
}
function DiagDetail({ data }: { data: any }) {
  return (
    <>
      {data?.problems?.length > 0 && (
        <div className="text-sm"><span className="text-muted-foreground">Problèmes: </span>{data.problems.join(", ")}</div>
      )}
      <Row label="Cause" value={data?.result?.cause} />
      <Row label="Sévérité" value={data?.result?.severity} />
      {data?.result?.routine && (
        <div className="text-sm mt-2">
          <div className="text-muted-foreground mb-1">Routine générée:</div>
          <ul className="space-y-0.5">
            {Object.entries(data.result.routine).map(([k, v]) => (
              <li key={k} className="text-xs"><span className="capitalize font-medium">{k}</span> — {String(v)}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
function QuizDetail({ data }: { data: any }) {
  return (
    <>
      <Row label="Type détecté" value={data?.hairType} />
      <Row label="Porosité" value={data?.porosity} />
      <Row label="Texture" value={data?.texture} />
      <Row label="Objectif" value={data?.goal} />
    </>
  );
}