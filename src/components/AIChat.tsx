import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askBloom, type ChatMsg } from "@/lib/chat.functions";
import { useProfile } from "@/lib/storage";

const KEY = "hairbloom_chat_history";

const SUGGESTED = [
  "Quel masque pour mes cheveux ?",
  "Comment réduire les frisottis ?",
  "Quelle huile pour la croissance ?",
  "Quel est mon type de cheveux ?",
];

function load(): ChatMsg[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(m: ChatMsg[]) { localStorage.setItem(KEY, JSON.stringify(m.slice(-40))); }

export function AIChat() {
  const ask = useServerFn(askBloom);
  const [profile] = useProfile();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages(load()); }, []);
  useEffect(() => { save(messages); }, [messages]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading, open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await ask({ data: { messages: next, profile } });
      if (r.error) setMessages([...next, { role: "assistant", content: `Désolée 🌸 ${r.error}` }]);
      else setMessages([...next, { role: "assistant", content: r.reply || "…" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        aria-label="Discuter avec Bloom"
        onClick={() => setOpen(true)}
        className="fixed z-40 right-4 bottom-24 lg:bottom-6 size-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <span className="text-2xl leading-none">💬</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center sm:justify-end"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[420px] sm:m-6 h-[80vh] sm:h-[600px] sm:max-h-[85vh] bg-background sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col border border-border shadow-2xl"
            >
              <header className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/15 grid place-items-center text-xl">🌸</div>
                  <div>
                    <div className="font-display text-lg leading-none">Bloom</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1"><Sparkles className="size-3" />Assistante capillaire IA</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="size-9 rounded-full hover:bg-secondary grid place-items-center"><X className="size-4" /></button>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🌸</div>
                    <div className="font-display text-lg">Bonjour ! Je suis Bloom.</div>
                    <p className="text-sm text-muted-foreground mt-1">Posez-moi toutes vos questions capillaires ✨</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary px-3.5 py-2.5 rounded-2xl rounded-bl-md text-sm flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" /> Bloom réfléchit…
                    </div>
                  </div>
                )}
              </div>

              {messages.length === 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {SUGGESTED.map((s) => (
                    <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs hover:bg-primary/10">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-border flex gap-2 bg-card"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez à Bloom…"
                  className="flex-1 px-4 py-2.5 rounded-full bg-secondary border border-border outline-none text-sm focus:border-primary"
                />
                <button type="submit" disabled={loading || !input.trim()} className="size-11 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center disabled:opacity-40">
                  <Send className="size-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}