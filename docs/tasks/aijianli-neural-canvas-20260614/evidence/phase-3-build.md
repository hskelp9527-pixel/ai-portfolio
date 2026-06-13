# Phase 3 Evidence: AI Guide System

## Build

```
npm run build
> vite v6.4.1 building for production...
✓ 2168 modules transformed.
dist/index.html                        1.79 kB │ gzip:   0.90 kB
dist/assets/index-DlXsNF3N.css        49.61 kB │ gzip:   9.01 kB
dist/assets/index-IgY2eEoV.js        464.95 kB │ gzip: 143.60 kB
dist/assets/ParticleField-fzoUZvAC.js 891.16 kB │ gzip: 240.28 kB
✓ built in 3.48s
```

## N011: AIGuideBubble + useAIGuide

- `hooks/useAIGuide.ts`: triggers — first-visit (5s delay) + same-node hover (3s)
- `components/AIGuideBubble.tsx`: bottom-right fixed glass bubble with arrow pointer, AI GUIDE label + Sparkles icon
- Session limits: max 2 proactive talks; dismiss persists via `sessionStorage.ai-resume-guide-dismissed='1'`
- Node suggestion copy generated dynamically by cluster (projects / skills / philosophy / timeline)

## N012: AIConversationPanel (replaces AIChatDrawer)

- 360px fixed right-side dock (between PRD's 280/450)
- Header shows "AI 对话" + visitor-type mode label ("招聘方 模式" / "技术同行 模式" / "对话型访客 模式")
- First message: `buildIntroMessage(visitorType)` returns VISITOR_PROFILES[type].intro instead of generic greeting
- Suggested question chips appear before first interaction (3 chips from profile.suggestedQuestions)
- `AIChatDrawer.tsx` kept as backup, no longer imported anywhere in active code

## N013: useVisitorType

- `hooks/useVisitorType.ts`: state machine driven by first user action
- Signal types: `'scroll' | 'hover' | 'chat'` → visitor type `'hr' | 'peer' | 'conversational'`
- Scroll threshold: `window.scrollY > 200` fires once per session
- Hover signal fires when NeuralCanvas reports a hover (via `onHoverNode` prop wired in App.tsx)
- Chat signal fires when user opens panel via FloatingNavigation toggle
- 5-second lock prevents re-detection after first signal
- Type persisted in `sessionStorage.ai-resume-visitor-type` so refresh doesn't reset
- `VISITOR_PROFILES` exports intro + 4 suggested questions per type

## N014: Streaming output + thinking state

- `chatService` is non-streaming (returns full response), so streaming is UI-simulated
- Algorithm: `setInterval(STREAM_INTERVAL_MS=18)` with chunk size `max(1, ceil(text/200))` — long messages don't take forever
- Thinking state: 3 pulsing dots + `thinking` mono label + JetBrains Mono via `font-mono`
- Cursor: 2px wide × 12px tall pulsing teal block at end of streaming text
- Stream cleanup on unmount: `useEffect` clears interval
- Empty response safety: `messages.filter((m) => m.content.length > 0)` for API payload

## Integration points

- `App.tsx`:
  - Wires `useVisitorType`, `useAIGuide`, hover state, scroll listener
  - First-visit timer (5s) fires `guide.triggerFirstVisit()` once
  - Scroll listener (passive) fires `signal('scroll')` past 200px
  - `NeuralCanvas` receives `onHoverNode` callback
  - `AIGuideBubble` and `AIConversationPanel` mounted alongside FloatingNavigation
  - `AIChatDrawer` no longer imported (kept on disk as backup)
- `NeuralCanvas.tsx`: new optional `onHoverNode?: (node: GraphNode | null) => void` prop, fires on every hover state change

## Known deviations from PRD

1. **Width 360px (PRD 280 default / 450 expanded)**: 360 was chosen as a comfortable single width; no expand/collapse yet. Phase 4 polish can add the 280→450 expand animation.
2. **No dock collapse**: PRD mentioned "默认 dock 在右侧 280px 窄条不收起" — current panel is always 360px when open. To close, user clicks X.
3. **Streaming is UI-simulated, not real-time token streaming**: chatService backend returns full response; we animate the reveal. Acceptable for smoke validation.

## Remaining TypeScript noise (pre-existing, not introduced by Phase 3)

- `api/chat.ts:273` references undefined `userQuery` → F009 (Phase 5)
- `components/FloatingNavigation.test.tsx` tests use stale `onExportPDF` prop → Phase 4 test update
- `utils/pdfExporter.test.ts` tests reference removed `quality`/`scale` fields → Phase 4 test update
- `_trash/...` errors are inside backup directory, ignore
