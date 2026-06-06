# Premium HairBloom Upgrades

This is a very large request touching 6 major areas. To keep quality high and avoid breaking existing flows, I'll ship it in 3 sequential batches (each batch is one apply turn). All caramel/cream tokens, Playfair Display headings, Framer Motion, light + dark mode.

## Batch 1 — Quiz + Onboarding (most user-visible first-run polish)

**Quiz visuel (`src/routes/quiz.tsx`)**
- Each answer rendered as a card with an Unsplash background image + dark gradient + label (curated per-question photos).
- Slide transition between questions (`AnimatePresence` x-axis).
- Progress as text "Question X sur 12" + percentage bar.
- "Précédent" back button (pops last answer).
- Micro-copy under each question ("Pas de bonne ou mauvaise réponse", rotating motivational lines).
- Final reveal: confetti burst (`canvas-confetti`), animated hair-type illustration, personalized message "Vous avez les cheveux Bouclés 3b — voici votre rituel personnalisé".

**Onboarding (`src/components/Onboarding.tsx` + new `src/components/SplashScreen.tsx`)**
- 2-second splash with bloom animation (petal SVG opening + logo scale-in), shown only on first launch.
- Swipe-like horizontal transitions between steps.
- New Step 4: 3 feature preview cards inside a phone-mockup frame.
- Confetti on completion.
- "Bienvenue dans HairBloom [name]!" celebration screen.

## Batch 2 — Recipes + Shop (content depth)

**Recipes (`src/routes/recipes.tsx` + new `src/routes/recipe.$id.tsx`)**
- "Recette de la semaine" hero (deterministic weekly pick).
- "Recettes rapides" section (filter time < 20 min).
- "Coup de cœur communauté" badge on most-saved recipe.
- Difficulty badge (Facile/Moyen/Avancé) inferred from steps count.
- "J'ai essayé cette recette" button → history + unlocks recipe badge.
- Detail page: ingredients w/ quantities, numbered steps, "Le saviez-vous?" tips, share-to-Instagram card (html2canvas), related recipes.

**Shop (`src/routes/shop.tsx` + new `ProductModal` + `CompareDrawer`)**
- "Nos coups de cœur" top section (3 large cards).
- Product detail modal: large photo, description, key ingredients, target audience, usage, pros/cons, similar products.
- "Comparer" — pick up to 2 products, side-by-side drawer.
- "Nouveauté" / "Best-seller" badges (data field).
- Price filter (€ / €€ / €€€) added to existing filters.
- Review snippet on each card (sample reviews in data).

## Batch 3 — Diagnostic + Profile (analytics + sharing)

**Diagnostic (`src/routes/diagnostic.tsx`)**
- Animated health score gauge (0-100) using SVG circle + Framer Motion `animate`.
- PDF export of personalized care plan (jsPDF, caramel-themed layout).
- "Partager mon diagnostic" Instagram card (html2canvas).
- "Consulter un professionnel" section with red-flag guidance (dermatologist / trichologist).

**Profile (`src/routes/profil.tsx`)**
- Editable cover photo (file input → localStorage data URL).
- "Mon parcours capillaire" timeline (derived from history + badges).
- "Mes mensurations" Recharts `LineChart` (monthly length entries; add input).
- "Partager mon profil" Instagram card (html2canvas).
- "Exporter mes données" → downloads `hairbloom-data.json` with all localStorage namespaced keys.

## Technical Notes
- Add deps: `canvas-confetti`, `html2canvas`, `jspdf`. `recharts` already present.
- New helper `src/lib/share-card.ts` for html2canvas → PNG download.
- New helper `src/lib/measurements.ts` for hair-length entries (localStorage).
- All new images use existing `unsplash()` helper with `#F5C4B3` fallback.
- Translation keys added to `src/lib/i18n.ts` for new UI strings (FR primary, EN/AR/MG fall back to FR if missing).
- No backend / DB changes; everything stays client-side via localStorage.

## Out of scope (will not change)
- Auth, AI server functions, routing tree beyond the one new recipe detail route.
- Existing color tokens — only additive CSS if needed.

After you approve, I'll ship Batch 1, then Batch 2, then Batch 3 in subsequent turns.
