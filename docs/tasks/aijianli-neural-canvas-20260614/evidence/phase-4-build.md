# Phase 4 Evidence: Polish + Mobile + PDF + AGENTS

## Build

```
npm run build
> vite v6.4.1 building for production...
✓ 2169 modules transformed.
dist/index.html                        1.79 kB │ gzip:   0.90 kB
dist/assets/index-sDBkaEIW.css        49.98 kB │ gzip:   9.13 kB
dist/assets/index-BS4YWJNt.js        468.91 kB │ gzip: 144.66 kB
dist/assets/ParticleField-CL3UXClU.js 891.16 kB │ gzip: 240.28 kB
✓ built in 3.50s
```

## N015: Dark theme adaptation

- App.tsx defaults to `Theme='dark'`
- All custom components use semantic tokens (`text-fg-primary`, `bg-glass-mid`, `text-signature-teal`) defined in `tailwind.config.ts`
- ParticleField color: dark `#5eead4` (200 particles) / light `#0d9488` (160 particles)
- Body class `dark-theme` toggled by App-level effect, drives CSS variables

## N016: PDF export compatibility

- `components/NeuralCanvas.tsx` section now has `no-print` class → `html2canvas` skips it via `pdfExporter.ts` default `excludeSelectors=['.no-print', 'nav', '.floating-nav']`
- three.js canvas (inside ParticleField) never reaches html2canvas because parent section is hidden
- AIGuideBubble / AIConversationPanel / FloatingNavigation / footer all already carry `no-print`
- PDF content falls through to `<main>`: IdentitySection + Resume + Gallery + Theater (structured, professional)

## N017: Mobile responsive

- `App.tsx` tracks `isMobile` via `window.matchMedia('(max-width: 768px)')`, re-evaluates on resize
- Mobile path renders `<MobileTimeline>` instead of `<NeuralCanvas>`
- MobileTimeline reuses `GRAPH_NODES` (no three.js, no d3-force), sorts by cluster + importance
- Click on any node triggers AI conversation via `onAskQuestion`
- AIConversationPanel uses `max-w-[90vw]` so it never overflows mobile viewport
- NeuralCanvas section also has `hidden md:block` as belt-and-suspenders (would never mount on mobile because App short-circuits)

## N018: Performance + AGENTS.md

- three.js already code-split via `React.lazy + Suspense` (gzip 240KB chunk separate from main)
- d3-force uses 500 synchronous ticks (no runtime simulation loop)
- `AGENTS.md` rewritten:
  - New component tree documented
  - Design language (OKLCH palette, font stack, easing curves)
  - Performance strategy section
  - Theme strategy section
  - Updated known-issues list (Phase 4+ leftovers + Phase B history)

## Known deviations from PRD

1. **AIConversationPanel mobile bottom-drawer**: PRD wanted bottom-sheet on mobile. Current implementation is still right-side dock with `max-w-[90vw]` cap. Polish item, not blocking smoke validation.
2. **Frame-rate monitoring / auto-downgrade**: PRD wanted `<30fps → static nodes`. Not implemented. The fallback is the mobile path (which doesn't load three at all). Desktop FPS monitor left as future polish.
3. **Particle count tuning by device**: Static 200/160 (dark/light). No `navigator.hardwareConcurrency` based scaling yet.

## Remaining TypeScript noise (pre-existing, deferred to Phase 5)

- `api/chat.ts:273` references undefined `userQuery` → F009
- `components/FloatingNavigation.test.tsx` uses stale `onExportPDF` prop → test update
- `utils/pdfExporter.test.ts` references removed `quality`/`scale` fields → test update
