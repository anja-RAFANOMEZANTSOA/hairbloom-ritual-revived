## HairBloom — Premium Hair Care Web App

Build the complete 14-screen app on TanStack Start with Tailwind, Framer Motion, Recharts, Lucide, sonner, and Lovable AI Gateway (replacing direct Gemini calls — no client-side API keys).

### Architecture

- **Routing**: `src/routes/` with bottom nav (mobile) + sidebar (desktop) in `__root.tsx`
- **State**: localStorage hook `useHairProfile` for name, profile type, hairType, porosity, problems, goal, saved recipes, completed days, before/after gallery
- **Design system**: extend `src/styles.css` with HairBloom tokens (caramel, dark brown, muted, bg, card, border, accent pink) in oklch; import Playfair Display + Poppins from Google Fonts
- **AI**: TanStack `createServerFn` calling Lovable AI Gateway (`google/gemini-2.5-flash` for text, `google/gemini-2.5-flash-image` for vision) — server keeps `LOVABLE_API_KEY`. Three functions: `analyzeHairPhoto`, `diagnoseHair`, `scanINCI`.
- **External APIs** (client, no key): `ipapi.co/json/` + `api.open-meteo.com/v1/forecast`
- **Onboarding**: full-screen overlay component shown when `localStorage.hairbloom_onboarded !== "true"`

### Files to create

```
src/styles.css                          (update tokens + fonts)
src/lib/storage.ts                      (typed localStorage helpers)
src/lib/hair-data.ts                    (recipes, products, auras, plan, tips)
src/lib/ai.functions.ts                 (createServerFn → Lovable AI Gateway)
src/components/Layout.tsx               (sidebar + bottom nav)
src/components/Logo.tsx                 (SVG bloom logo)
src/components/Onboarding.tsx           (3 steps)
src/components/AuraCard.tsx
src/components/RecipeCard.tsx
src/components/ProductCard.tsx
src/components/BeforeAfterSlider.tsx
src/routes/__root.tsx                   (wrap Layout + Onboarding)
src/routes/index.tsx                    (Home dashboard)
src/routes/photo.tsx                    (Photo IA)
src/routes/quiz.tsx                     (12-question quiz)
src/routes/diagnostic.tsx
src/routes/recipes.tsx                  (25 recipes + filter chips)
src/routes/shop.tsx                     (35 products + filters)
src/routes/avant-apres.tsx
src/routes/meteo.tsx
src/routes/repousse.tsx                 (Recharts)
src/routes/inci.tsx
src/routes/aura.tsx
src/routes/plan.tsx                     (30-day plan)
src/routes/conseils.tsx
src/routes/profil.tsx
```

### AI integration (replaces VITE_GEMINI_API_KEY)

User asked for Gemini with `VITE_GEMINI_API_KEY` on the client. I'll route through Lovable AI Gateway server functions instead — secure (no exposed key), same Gemini models, no setup needed.

### Scope notes

- Mobile-first with bottom nav (5 tabs: Accueil/Photo IA/Recettes/Shop/Profil), sidebar for desktop lists all 14 screens
- All 25 recipes + 35 products in `hair-data.ts` exactly as specified
- Framer Motion page transitions + card hover
- PWA manifest with `theme_color #C9956A`
- Toast confirmations via sonner
- French copy throughout

After approval I'll install `framer-motion`, `recharts`, `sonner` and build everything.
