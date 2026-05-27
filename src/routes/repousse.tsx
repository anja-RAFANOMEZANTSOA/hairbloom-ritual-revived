import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/repousse")({ component: Repousse });

type Measure = { date: string; cm: number; point: string };

function Repousse() {
  const [entries, setEntries] = useLocalStorage<Measure[]>("hairbloom_growth", []);
  const [cm, setCm] = useState("");
  const [point, setPoint] = useState("Sommet");
  const [goal, setGoal] = useLocalStorage<number>("hairbloom_growth_goal", 40);

  const add = () => {
    const v = parseFloat(cm);
    if (!v) return toast.error("Entrez une longueur");
    setEntries([...entries, { date: new Date().toISOString().slice(0, 10), cm: v, point }]);
    setCm("");
    toast.success("Mesure ajoutée");
  };

  const chartData = entries.map((e) => ({ month: e.date.slice(5), cm: e.cm }));
  const last = entries[entries.length - 1];
  const first = entries[0];
  const avg = entries.length > 1 ? ((last.cm - first.cm) / (entries.length - 1)).toFixed(1) : "—";
  const monthsToGoal = last && Number(avg) > 0 ? Math.ceil((goal - last.cm) / Number(avg)) : "—";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Suivi repousse</h1>
        <p className="text-muted-foreground text-sm">Mesurez votre croissance mois après mois</p>
      </header>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input type="number" step="0.5" placeholder="Longueur (cm)" value={cm} onChange={(e) => setCm(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary border border-border outline-none text-sm" />
          <select value={point} onChange={(e) => setPoint(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary border border-border outline-none text-sm">
            <option>Sommet</option><option>Nuque</option><option>Côté</option>
          </select>
        </div>
        <button onClick={add} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"><Plus className="size-4" />Ajouter une mesure</button>
      </div>

      {entries.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display text-lg">Évolution</h2>
            <span className="text-xs text-primary flex items-center gap-1"><TrendingUp className="size-3" />+{avg} cm/mois</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDD9C8" />
                <XAxis dataKey="month" fontSize={11} stroke="#8B6355" />
                <YAxis fontSize={11} stroke="#8B6355" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDD9C8" }} />
                <Line type="monotone" dataKey="cm" stroke="#C9956A" strokeWidth={3} dot={{ r: 4, fill: "#C9956A" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-primary/15 to-accent/15 rounded-2xl p-4 space-y-3">
        <div className="text-sm">Objectif (cm)</div>
        <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-white/70 border border-border outline-none text-sm" />
        {typeof monthsToGoal === "number" && monthsToGoal > 0 && <div className="text-sm">🎯 Vous atteindrez votre objectif dans <strong>{monthsToGoal} mois</strong></div>}
      </div>
    </div>
  );
}