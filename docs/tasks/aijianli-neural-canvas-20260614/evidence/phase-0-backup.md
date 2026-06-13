# Phase 0 备份证据

日期：2026-06-14

## 备份范围（实际比原计划大）

原计划：7 个关键文件
实际：整个前端可重构范围

### 入口和配置文件（12 个）
- App.tsx
- data.ts
- index.html
- index.tsx
- tailwind.config.ts
- postcss.config.js
- vite.config.ts
- tsconfig.json
- vitest.config.ts
- vitest.setup.ts
- types.ts
- package.json

### 整个目录（5 个）
- components/（含 Hero.tsx / AIChatDrawer.tsx / Resume.tsx / Gallery.tsx / Theater.tsx 等 16 个文件）
- hooks/
- utils/
- src/
- api/

## 验证

```
$ ls _trash/pre-neural-canvas-backup-20260614/
AGENTS.md (无)         ← 注意：AGENTS.md 不在备份，因为是新建文件
App.tsx                ✓
api/                   ✓
components/            ✓
data.ts                ✓
hooks/                 ✓
index.html             ✓
index.tsx              ✓
package.json           ✓
postcss.config.js      ✓
src/                   ✓
tailwind.config.ts     ✓
tsconfig.json          ✓
types.ts               ✓
utils/                 ✓
vite.config.ts         ✓
vitest.config.ts       ✓
vitest.setup.ts        ✓
```

## Git 记录

- Commit: `d52e777 phase 0: backup pre-neural-canvas snapshot`
- 备份内容已 commit，可作为回退点
