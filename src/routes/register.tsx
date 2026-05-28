import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { registerUser, type AgeRange, type ProfileType } from "@/lib/auth";
import { saveProfile } from "@/lib/storage";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const PROFILE_TYPES: { value: ProfileType; emoji: string }[] = [
  { value: "Femme", emoji: "👩" },
  { value: "Homme", emoji: "👨" },
  { value: "Enfant", emoji: "🧒" },
];

const AGE_RANGES: { value: AgeRange; label: string; range: string; emoji: string }[] = [
  { value: "Enfant", label: "Enfant", range: "0-12 ans", emoji: "🧒" },
  { value: "Adolescent", label: "Adolescent", range: "13-17 ans", emoji: "🧑" },
  { value: "Adulte", label: "Adulte", range: "18-45 ans", emoji: "👩" },
  { value: "Senior", label: "Senior", range: "46-65 ans", emoji: "🧓" },
  { value: "Âgé", label: "Âgé", range: "65+ ans", emoji: "👴" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profileType, setProfileType] = useState<ProfileType | "">("");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [show, setShow] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Mot de passe : 6 caractères min.");
    if (password !== confirm) return toast.error("Les mots de passe ne correspondent pas.");
    if (!profileType) return toast.error("Choisissez un profil.");
    if (!ageRange) return toast.error("Choisissez une tranche d'âge.");

    const res = registerUser({ firstName, email, password, profileType, ageRange });
    if (!res.ok) return toast.error(res.error);

    saveProfile({ name: firstName, profileType });
    toast.success("Compte créé. Bienvenue ! 🌸");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-10" style={{ background: "var(--cream)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={56} />
          <h1 className="font-display text-3xl mt-4">Créer un compte</h1>
          <p className="text-muted-foreground mt-1 italic text-sm">Your hair. Your ritual.</p>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <Field icon={<User className="size-4" />}>
            <input
              type="text" required placeholder="Prénom" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary"
            />
          </Field>

          <Field icon={<Mail className="size-4" />}>
            <input
              type="email" required placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary"
            />
          </Field>

          <Field icon={<Lock className="size-4" />}>
            <input
              type={show ? "text" : "password"} required placeholder="Mot de passe" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary"
            />
            <button type="button" onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Field>

          <Field icon={<Lock className="size-4" />}>
            <input
              type={show ? "text" : "password"} required placeholder="Confirmer le mot de passe" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary"
            />
          </Field>

          <div>
            <div className="text-sm font-medium mb-2">Profil</div>
            <div className="grid grid-cols-3 gap-2">
              {PROFILE_TYPES.map((p) => {
                const active = profileType === p.value;
                return (
                  <button key={p.value} type="button" onClick={() => setProfileType(p.value)}
                    className={`p-3 rounded-2xl border-2 transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    <div className="text-2xl">{p.emoji}</div>
                    <div className="text-xs mt-1">{p.value}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Tranche d'âge</div>
            <div className="grid grid-cols-2 gap-2">
              {AGE_RANGES.map((a) => {
                const active = ageRange === a.value;
                return (
                  <button key={a.value} type="button" onClick={() => setAgeRange(a.value)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-2 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    <div className="text-2xl">{a.emoji}</div>
                    <div>
                      <div className="text-sm font-medium leading-tight">{a.label}</div>
                      <div className="text-[11px] text-muted-foreground">{a.range}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit"
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition">
            Créer mon compte <ArrowRight className="size-4" />
          </button>

          <p className="text-center text-sm text-muted-foreground pt-1">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-[1.15rem] text-muted-foreground">{icon}</div>
      {children}
    </div>
  );
}