import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, Share2 } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/avant-apres")({ component: AvantApres });

type Item = { before: string; after: string; dateBefore: string; dateAfter: string; notes: string };

function AvantApres() {
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [dateB, setDateB] = useState("");
  const [dateA, setDateA] = useState("");
  const [notes, setNotes] = useState("");
  const [gallery, setGallery] = useLocalStorage<Item[]>("hairbloom_ba_gallery", []);
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const onFile = (f: File, set: (s: string) => void) => {
    const r = new FileReader();
    r.onload = () => set(r.result as string);
    r.readAsDataURL(f);
  };

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setPos(Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100)));
  };

  const save = () => {
    if (!before || !after) return toast.error("Ajoutez les deux photos");
    setGallery([{ before, after, dateBefore: dateB, dateAfter: dateA, notes }, ...gallery]);
    toast.success("Transformation sauvegardée");
    setBefore(null); setAfter(null); setNotes("");
  };

  const days = dateB && dateA ? Math.round((new Date(dateA).getTime() - new Date(dateB).getTime()) / 86400000) : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Avant / Après</h1>
        <p className="text-muted-foreground text-sm">Visualisez votre transformation</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <UploadBox label="Avant" img={before} onFile={(f) => onFile(f, setBefore)} date={dateB} setDate={setDateB} />
        <UploadBox label="Après" img={after} onFile={(f) => onFile(f, setAfter)} date={dateA} setDate={setDateA} />
      </div>

      {before && after && (
        <div
          ref={ref}
          className="relative aspect-square rounded-3xl overflow-hidden border border-border select-none"
          onMouseMove={(e) => e.buttons === 1 && onDrag(e)}
          onTouchMove={onDrag}
        >
          <img src={before} className="absolute inset-0 w-full h-full object-cover" alt="avant" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <img src={after} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / pos}%` }} alt="après" />
          </div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-primary" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold cursor-ew-resize">↔</div>
          </div>
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 text-xs">Avant</span>
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-xs">Après</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        {days > 0 && <div className="text-sm"><strong>{days} jours</strong> de progression</div>}
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes sur cette transformation…" className="w-full px-3 py-2 rounded-xl bg-secondary border border-border outline-none text-sm" />
        <button onClick={save} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"><Share2 className="size-4" />Sauvegarder</button>
      </div>

      {gallery.length > 0 && (
        <div>
          <h2 className="font-display text-xl mb-3">Mes transformations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                <div className="grid grid-cols-2"><img src={g.before} className="aspect-square object-cover" alt="" /><img src={g.after} className="aspect-square object-cover" alt="" /></div>
                {g.notes && <p className="p-2 text-xs">{g.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UploadBox({ label, img, onFile, date, setDate }: { label: string; img: string | null; onFile: (f: File) => void; date: string; setDate: (s: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="block aspect-square rounded-2xl border-2 border-dashed border-border bg-card cursor-pointer overflow-hidden">
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        {img ? <img src={img} alt={label} className="w-full h-full object-cover" /> : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2"><Upload className="size-6" /><span className="text-sm">{label}</span></div>
        )}
      </label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm outline-none" />
    </div>
  );
}