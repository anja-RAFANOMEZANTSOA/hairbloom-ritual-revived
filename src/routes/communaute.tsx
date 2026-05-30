import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Plus, Search, Send, Trash2, Trophy, X } from "lucide-react";
import { CommunityPost, TOPICS, TRENDING, addComment, addPost, deletePost, toggleLike, usePosts } from "@/lib/community";
import { unsplash } from "@/lib/hair-data";
import { useProfile } from "@/lib/storage";

export const Route = createFileRoute("/communaute")({ component: Communaute });

const FILTERS = ["Tous", "🌿 Recette DIY", "✨ Transformation", "❓ Question", "💡 Conseil", "Mes posts"];

function Communaute() {
  const posts = usePosts();
  const [profile] = useProfile();
  const [filter, setFilter] = useState("Tous");
  const [q, setQ] = useState("");
  const [openCompose, setOpenCompose] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);

  const filtered = useMemo(() => posts.filter((p) => {
    if (filter === "Mes posts") return p.mine;
    if (filter !== "Tous" && p.topic !== filter) return false;
    if (q && !p.text.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [posts, filter, q]);

  const featured = posts.find((p) => p.featured);
  const top = useMemo(() => {
    const m = new Map<string, number>();
    posts.forEach((p) => m.set(p.user, (m.get(p.user) || 0) + p.likes));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [posts]);

  const activePost = posts.find((p) => p.id === openComments);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-5">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl text-primary">🤝 Communauté</h1>
          <p className="text-sm text-muted-foreground">Partagez votre rituel avec la tribu HairBloom.</p>
        </div>
      </header>

      <div className="flex gap-2 items-center bg-card border border-border rounded-2xl px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un post…" className="flex-1 bg-transparent text-sm outline-none" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TRENDING.map((t) => (
          <button key={t} onClick={() => setQ(t.replace("#", ""))} className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground whitespace-nowrap">{t}</button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{f}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {featured && filter === "Tous" && (
            <div className="glass rounded-3xl p-4 border-2 border-primary/30 relative">
              <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] px-3 py-1 rounded-full flex items-center gap-1"><Trophy className="size-3" /> TRANSFORMATION DE LA SEMAINE</div>
              <PostCard post={featured} onLike={toggleLike} onOpenComments={setOpenComments} onDelete={deletePost} />
            </div>
          )}
          {filtered.filter((p) => !p.featured || filter !== "Tous").map((p) => (
            <PostCard key={p.id} post={p} onLike={toggleLike} onOpenComments={setOpenComments} onDelete={deletePost} />
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-3xl p-10 text-center"><div className="text-5xl mb-2">🌸</div><p className="text-sm text-muted-foreground">Aucun post pour ce filtre.</p></div>
          )}
        </div>
        <aside className="space-y-3">
          <div className="glass rounded-2xl p-4">
            <h3 className="font-display text-lg mb-2">👑 Top Membres</h3>
            <div className="space-y-2">
              {top.map(([name, score], i) => (
                <div key={name} className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-bold w-5">#{i + 1}</span>
                  <span className="flex-1 truncate">{name}</span>
                  <span className="text-xs text-muted-foreground">{score} ❤️</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <button onClick={() => setOpenCompose(true)} className="fixed bottom-24 lg:bottom-8 right-20 lg:right-8 z-30 size-14 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:scale-110 transition-transform"><Plus className="size-6" /></button>

      <AnimatePresence>
        {openCompose && <Compose onClose={() => setOpenCompose(false)} userName={profile.name || "Vous"} hairType={profile.hairType || "—"} />}
        {activePost && <CommentsPanel post={activePost} onClose={() => setOpenComments(null)} />}
      </AnimatePresence>
    </div>
  );
}

function PostCard({ post, onLike, onOpenComments, onDelete }: { post: CommunityPost; onLike: (id: string) => void; onOpenComments: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <motion.article layout className="glass rounded-2xl p-4 space-y-3">
      <header className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-secondary grid place-items-center text-xl">{post.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{post.user}</div>
          <div className="text-[10px] text-muted-foreground">Type {post.hairType} · {new Date(post.date).toLocaleDateString("fr-FR")}</div>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-secondary">{post.topic}</span>
        {post.mine && <button onClick={() => onDelete(post.id)} className="text-destructive"><Trash2 className="size-4" /></button>}
      </header>
      <p className="text-sm leading-relaxed">{post.text}</p>
      {post.photo && <img src={unsplash(post.photo, 800)} alt="" className="w-full max-h-64 object-cover rounded-xl" />}
      <footer className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
        <button onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 ${post.liked ? "text-destructive" : ""}`}>
          <Heart className={`size-4 ${post.liked ? "fill-destructive" : ""}`} /> {post.likes}
        </button>
        <button onClick={() => onOpenComments(post.id)} className="flex items-center gap-1.5"><MessageCircle className="size-4" /> {post.comments.length}</button>
      </footer>
    </motion.article>
  );
}

function Compose({ onClose, userName, hairType }: { onClose: () => void; userName: string; hairType: string }) {
  const [text, setText] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }} className="bg-card rounded-3xl max-w-lg w-full p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl">Nouveau post</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-background border border-border rounded-xl p-2 text-sm">
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Partagez votre expérience…" className="w-full bg-background border border-border rounded-2xl p-3 text-sm" rows={5} />
        <button onClick={() => { if (text.trim()) { addPost({ user: userName, avatar: "👩", hairType, topic, text }); onClose(); } }} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-medium">Publier</button>
      </motion.div>
    </motion.div>
  );
}

function CommentsPanel({ post, onClose }: { post: CommunityPost; onClose: () => void }) {
  const [text, setText] = useState("");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur flex items-end justify-center" onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-card rounded-t-3xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-display text-lg">Commentaires</h3>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {post.comments.length === 0 && <div className="text-center text-sm text-muted-foreground py-6">Soyez la première à commenter 🌸</div>}
          {post.comments.map((c) => (
            <div key={c.id} className="bg-secondary rounded-2xl p-3">
              <div className="text-xs font-medium text-primary">{c.user}</div>
              <div className="text-sm">{c.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { addComment(post.id, text); setText(""); } }} className="p-3 border-t border-border flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Votre commentaire…" className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm" />
          <button className="bg-primary text-primary-foreground size-10 rounded-full grid place-items-center"><Send className="size-4" /></button>
        </form>
      </motion.div>
    </motion.div>
  );
}