import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplet, AlertCircle, Loader2 } from "lucide-react";
import { useProfile } from "@/lib/storage";

export const Route = createFileRoute("/meteo")({ component: Meteo });

function Meteo() {
  const [profile] = useProfile();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const loc = await fetch("https://ipapi.co/json/").then((r) => r.json());
        const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`).then((r) => r.json());
        setData({ city: loc.city, country: loc.country_name, ...w });
      } catch (e) {
        setData({ error: true });
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="p-10 text-center"><Loader2 className="size-6 animate-spin mx-auto text-primary" /></div>;
  if (data?.error) return <div className="p-6 text-center text-muted-foreground">Impossible de récupérer la météo. Vérifiez votre connexion.</div>;

  const c = data.current;
  const humidity = c.relative_humidity_2m;
  const uv = c.uv_index;

  const alerts: { icon: any; text: string; color: string }[] = [];
  if (humidity > 70) alerts.push({ icon: Wind, text: "Humidité élevée — risque de frisottis. Sérum anti-humidité conseillé.", color: "bg-destructive/10 text-destructive" });
  if (humidity < 30) alerts.push({ icon: Droplet, text: "Air sec — intensifiez l'hydratation aujourd'hui.", color: "bg-accent/20" });
  if (uv > 6) alerts.push({ icon: Sun, text: "UV élevé — chapeau ou sérum UV recommandé.", color: "bg-accent/20" });

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <header>
        <h1 className="font-display text-3xl">Météo capillaire</h1>
        <p className="text-muted-foreground text-sm">{data.city}{data.country ? `, ${data.country}` : ""}</p>
      </header>

      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl font-display">{Math.round(c.temperature_2m)}°</div>
            <div className="text-sm text-muted-foreground mt-1">Aujourd'hui</div>
          </div>
          <Cloud className="size-16 text-primary" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat icon={Droplet} label="Humidité" value={`${humidity}%`} />
          <Stat icon={Sun} label="UV" value={uv.toFixed(1)} />
          <Stat icon={Wind} label="Air" value={humidity > 60 ? "Humide" : "Sec"} />
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`p-3 rounded-2xl flex gap-2 text-sm ${a.color}`}>
              <a.icon className="size-4 shrink-0 mt-0.5" /> {a.text}
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-display text-xl mb-3">3 jours à venir</h2>
        <div className="grid grid-cols-3 gap-3">
          {data.daily.time.slice(0, 3).map((d: string, i: number) => (
            <div key={d} className="bg-card border border-border rounded-2xl p-3 text-center">
              <div className="text-xs text-muted-foreground">{new Date(d).toLocaleDateString("fr", { weekday: "short" })}</div>
              <CloudRain className="size-6 mx-auto my-2 text-primary" />
              <div className="text-sm font-medium">{Math.round(data.daily.temperature_2m_max[i])}° / {Math.round(data.daily.temperature_2m_min[i])}°</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-medium mb-2">Routine suggérée</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• {humidity > 70 ? "Évitez le diffuseur — préférez le séchage à l'air." : "Conditions idéales pour le diffuseur."}</li>
          <li>• {profile.hairType?.startsWith("3") || profile.hairType?.startsWith("4") ? "Leave-in crème pour vos boucles." : "Sérum léger sur les pointes."}</li>
          <li>• {uv > 6 ? "Protection UV obligatoire." : "Pas de protection UV nécessaire."}</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white/50 rounded-xl p-3 text-center">
      <Icon className="size-4 mx-auto text-primary mb-1" />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}