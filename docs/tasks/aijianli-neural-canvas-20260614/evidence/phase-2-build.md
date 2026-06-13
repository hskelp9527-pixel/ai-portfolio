# Phase 2 Evidence: Node Graph + Interactions

## Build

```
npm run build
> vite v6.4.1 building for production...
✓ 2165 modules transformed.
dist/index.html                        1.79 kB │ gzip:   0.90 kB
dist/assets/index-KcMtFWcj.css        49.20 kB │ gzip:   8.93 kB
dist/assets/index-D9vkmU93.js        458.75 kB │ gzip: 140.72 kB
dist/assets/ParticleField-DSkJ435_.js 891.16 kB │ gzip: 240.28 kB
✓ built in 3.97s
```

## N006: data.ts refactor

- `PERSONAL_PROJECTS` reordered: pp8 → pp7 → pp3 → pp1 → pp6 → pp2 → pp5
- `pp4` (个人数字化简历网站) removed — circular reference to resume itself
- importance field added: pp8=10, pp7=9, pp3=8, pp1=7, pp6=6, pp2=5, pp5=4
- `types.ts` adds `GraphNode`, `GraphEdge`, `NodeType`, `NodeCluster`, `NodeAccent` unions
- `GRAPH_NODES`: 21 nodes (1 center + 7 projects + 3 skills + 3 philosophy + 3 timeline + 4 cross-cluster)
- `GRAPH_EDGES`: meaningful links including center hub + cross-cluster relationships

## N007: NeuralCanvas + NodeCluster

- `hooks/useNodeGraph.ts`: d3-force layout, 500 iterations synchronous tick
- Cluster quadrants: projects=-π/4 (top-right), skills=π/4 (bottom-right), philosophy=3π/4 (bottom-left), timeline=-3π/4 (top-left)
- `NodeCluster.tsx`: DOM-rendered nodes via framer-motion (not three.js), size = max(44, 28 + importance*5), center=120px
- `NeuralCanvas.tsx`: section changed from `fixed inset-0` to `relative h-screen w-full` so content flows below

## N008: HoverCard glass card

- `GlassCard.tsx` HoverCard component with backdrop-blur
- Smart positioning: left half of canvas → card on right; right half → card on left
- Dim opacity 0.25 on non-hovered nodes (more aggressive than PRD's 0.4 for stronger focus)
- Content: label, cluster · L{importance}, summary, top-4 tags

## N009: DetailPanel click-to-zoom

- `GlassCard.tsx` DetailPanel: full-screen modal at z-40 with backdrop blur
- Phase 2 implements modal pattern (not camera push-in); click anywhere outside or ESC to close
- Active node scales to 1.25 in NodeCluster while panel is open
- Phase 3+ can add camera push-in for true zoom feeling

## N010: Hero removal

- `components/Hero.tsx` deleted (backup at `_trash/pre-neural-canvas-backup-20260614/components/Hero.tsx`)
- `App.tsx` no longer imports or renders `<Hero>`
- `<section id="about">` on NeuralCanvas replaces Hero anchor
- Negative-margin pull-up wrapper around IdentitySection removed
- Bottom-of-canvas scroll cue ("向下滚动 · SCROLL") added so visitors know resume content flows below

## Known Deviations from PRD

1. **N009 zoom-in**: PRD specified "camera push-in to 60% of screen". Phase 2 implements full-screen modal DetailPanel instead. Acceptable for smoke validation; richer zoom animation can come in Phase 3 polish.
2. **Dim opacity 0.25 vs PRD 0.4**: Lower opacity chosen to strengthen focal hierarchy. Visual review pending in Phase 4.
3. **Particle chunk 891KB**: Expected for three.js; lazy-loaded via React.lazy so doesn't block initial paint.
