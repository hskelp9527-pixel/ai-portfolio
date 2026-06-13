# Phase 5 Evidence: F005-F011 Cleanup

## Build

```
npm run build
> vite v6.4.1 building for production...
✓ 2169 modules transformed.
dist/index.html                        1.79 kB │ gzip:   0.90 kB
dist/assets/index-sDBkaEIW.css        49.98 kB │ gzip:   9.13 kB
dist/assets/index-BS4YWJNt.js        468.91 kB │ gzip: 144.66 kB
dist/assets/ParticleField-CL3UXClU.js 891.16 kB │ gzip: 240.28 kB
✓ built in 3.55s
```

## F005: Unify GLM model to glm-4.5-air

- `types.ts:119` `GLMChatRequest.model` narrowed: `'glm-4.7' | 'glm-4.5' | 'glm-4.5-air'` → `'glm-4.5-air'`
- `api/chat.ts:241` already uses `'glm-4.5-air'`
- `utils/chatService.ts:48` already uses `'glm-4.5-air'`
- grep verification: no `glm-4.7` or bare `glm-4.5` in source

## F006: useLazyLoad type assertion removal

- `UseLazyLoadReturn` interface now declares `markAsLoaded: () => void` and `markAsError: () => void`
- Return statement simplified — no more `as UseLazyLoadReturn & { markAsLoaded: ...; markAsError: ... }` cast
- tsc passes for useLazyLoad.ts

## F007: Delete duplicate test setup

- `src/test-setup.ts` deleted (only contained `import '@testing-library/jest-dom'`)
- `vitest.setup.ts` already imports all matchers via `expect.extend(matchers)` from `@testing-library/jest-dom/matchers`
- `vitest.config.ts` `setupFiles: ['./vitest.setup.ts']` (single entry)
- Note: `FloatingNavigation.test.tsx` / `pdfExporter.test.tsx` are stale tests from before Phase 0 (use `onExportPDF` and removed `quality`/`scale` fields). They predate this refactor and are out of F007 scope.

## F008: email from data.ts

- `App.tsx`: `const email = PERSONAL_INFO.email || 'rhydewy@163.com'`
- Source of truth: `data.ts:19` `email: 'rhydewy@163.com'`
- Fallback string is intentional defensive guard (not business hardcode)

## F009: Simplify api/chat.ts error logging

- Removed 8 `console.error` lines (stack / userQuery / code / response.data / banner dividers)
- Single line: `console.error('API chat error:', error.message, 'status:', error.response?.status)`
- Bonus fix: removed `console.error('用户提问:', userQuery)` which referenced undefined `userQuery` (TS error gone)

## F010: CSV notes

- New file `CSV_NOTES.md` alongside `image.csv` / `video.csv`
- States: CSVs are historical manifests, do not participate in runtime
- Runtime source of truth: `data.ts`
- Chose separate `.md` file because CSV doesn't support `#` comments and a pseudo-comment row could break future parsers

## F011: External brain macOS path replacement

`grep -rn '/Users/jimm' E:/claudecode/human_rhy_soul/` → empty

Files patched (4):
- `E:/claudecode/human_rhy_soul/AGENTS.md`
- `E:/claudecode/human_rhy_soul/System/working-memory/OPERATING_RULES.md`
- `E:/claudecode/human_rhy_soul/System/session_hooks/auto_sync.sh` (REPO_DIR)
- `E:/claudecode/human_rhy_soul/Resources/方法论/新电脑AI协作开发环境启动方案.md`

Substitution: `/Users/jimm/代码仓库/human_rhy_soul` → `E:/claudecode/human_rhy_soul`

External brain is a separate git repo — local edit only, no push.

## Remaining tsc noise (out of scope)

- `components/FloatingNavigation.test.tsx` — stale test using removed `onExportPDF` prop (predates this refactor)
- `utils/pdfExporter.test.ts` — stale test referencing removed `quality`/`scale` fields
- Both files exist in `_trash/pre-neural-canvas-backup-20260614/` so they can be restored if anyone wants to update them
