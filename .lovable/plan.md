## HairBloom — Icons + Post-Analysis Results Overhaul

This is a large two-part upgrade. Here's the breakdown before I build.

---

### Part 1 — Icon system (Lucide outline, no emojis)

Create a single `src/components/icons.ts` exporting the icon set as named aliases mapped to the closest Lucide equivalents (Tabler-style icons aren't in `lucide-react`, so I use the closest outline match):

```
Home2 → Home  /  CameraSelfie → Camera  /  Droplet → Droplet
Stethoscope → Stethoscope  /  Sparkles → Sparkles  /  CloudRain → CloudRain
ShoppingBag → ShoppingBag  /  CalendarCheck → CalendarCheck
RulerMeasure → Ruler  /  Scan → ScanLine  /  UsersRound → Users
Notebook → Notebook  /  BellRinging → BellRing  /  History → History
MessageCircle → MessageCircle  /  UserCircle → UserCircle2
Plant2 → Sprout  /  Heart → Heart  /  Trophy → Trophy
Flask → FlaskConical  /  Flame → Flame  /  Leaf → Leaf
ShoppingCart → ShoppingCart
```

Sizes: 20 nav, 18 cards, 24 headers. Active color `#C9956A` (token already in theme), inactive `var(--muted-foreground)`. Sweep these files and replace emoji-as-icon usage with `<Icon className="size-X" />`: `Layout.tsx`, `index.tsx`, `profil.tsx`, `notifications.tsx`, `historique.tsx`, `shop.tsx`, `recipes.tsx`, `panier.tsx`, `wishlist.tsx`, `communaute.tsx`, `journal.tsx`, `meteo.tsx`, `plan.tsx`, `repousse.tsx`, `aura.tsx`, `conseils.tsx`, `inci.tsx`, `analyse-initiale.tsx`. Emojis inside user-facing prose (titles like "Découvrons vos cheveux ✨", notification descriptions) stay — only emojis that act as UI icons are removed.

---

### Part 2 — Post-analysis Results screen with 5 tabs

New route `src/routes/resultats.tsx` (auto-registered by TanStack file routing). Both `photo.tsx` and `quiz.tsx` push their result into `localStorage["hairbloom_last_analysis"]` then navigate to `/resultats`. The `initial=1` flow keeps working (marks analysis done first).

New lib `src/lib/recommendations.ts`:
- `matchRecipes(profile) → Recipe[4]` from existing `hair-data.ts` recipes scored by hair type + problems.
- `matchProducts(profile) → Product[5]` from existing shop catalog scored similarly.
- `buildRoutine(profile) → { Lundi…Dimanche }` deterministic week plan from hair type / porosity.
- `buildChallenge(profile) → 21 days` grouped in 3 phases as specified.

New lib `src/lib/challenge.ts`:
- Stores challenge start date, per-day completion in `localStorage["hairbloom_challenge"]`.
- Helpers: `startChallenge()`, `toggleDay(n)`, `getProgress()`, `getStreak()`, `getDailyPhrase()`.

#### Tabs (Framer Motion `AnimatePresence mode="wait"`)

1. **Mon Bilan** — curl spectrum strip (1a→4c) with animated dot at detected type; porosity = 3 dots filled; condition + scalp badges; top 3 problems each with animated severity bar; circular SVG progress ring for hair-health score /100 (computed from condition + problem count).
2. **Mes Recettes** — 4 recipe cards (cover 100px, name, benefit badge, 4 ingredient circles 35px, prep time, "Voir la recette complète" → `/recipes?id=…`).
3. **Mes Produits** — 5 product cards (70×70 image, brand caps, name, "Pourquoi" line, stars, price range, "Voir le produit" external link, `rel="noopener sponsored"`).
4. **Ma Routine** — 7 day cards Lun→Dim with day name, Lucide icon, task, product/recipe, est. time, tip.
5. **Mon Défi** — hero card (name + start date + animated ring + daily phrase). Three collapsed phase sections, each expanding to its 7 day cards with: number, title, Lucide icon, instructions, time, checkbox (persisted), optional link to recipe/product. Streak counter + per-week progress bars. Day 21 completion triggers a confetti screen (CSS-only particles) + achievements list + share button.

Bottom action bar: `Sauvegarder mon profil` / `Commencer le défi` / `Aller à l'accueil`.

#### Home + flow integration

- "Rejoindre le défi" caramel button on home dashboard linking to `/resultats?tab=defi`.
- `photo.tsx` and `quiz.tsx`: on success → save snapshot → `navigate({ to: '/resultats' })` (or stay in initial flow → mark done → go to `/resultats`).

#### Styling

All headings use existing `font-display` (Playfair Display already configured). Caramel/cream tokens already in `styles.css`. No new tokens needed.

---

### Out of scope (to keep this shippable)

- I will not touch backend AI prompts.
- Emojis inside user-written content/copy stay; only emoji-as-icon get replaced.
- Pull-to-refresh and confetti library — I'll use a lightweight CSS confetti, no new dep.

Reply "go" to build, or tell me what to trim.