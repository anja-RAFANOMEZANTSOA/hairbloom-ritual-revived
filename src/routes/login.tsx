import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { loginUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = loginUser(email, password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`Bienvenue ${res.user.firstName} 🌸`);
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
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size={72} />
          <h1 className="font-display text-4xl mt-5 text-foreground">HairBloom</h1>
          <p className="text-muted-foreground mt-2 italic">Your hair. Your ritual.</p>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-display text-2xl text-center mb-2">Se connecter</h2>

          <div className="relative">
            <Mail className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-background border border-border outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Cacher" : "Afficher"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Contactez le support pour réinitialiser.")}
            className="text-xs text-muted-foreground hover:text-primary ml-1"
          >
            Mot de passe oublié ?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition disabled:opacity-50"
          >
            Se connecter <ArrowRight className="size-4" />
          </button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}