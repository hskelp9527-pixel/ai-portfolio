# AIJianLi Neural Canvas 重构 Progress

用途：让下一轮 agent 不问人也能继续。

## Current State

- Status: planning（开发包已就绪，等待用户授权开始 Phase 0）
- Active branch: `main`（本地，不上传仓库）
- Latest commit: 无（本开发包尚未提交）
- Feature list: `feature_list.json`
- PRD: `prd.md`
- Backup target: `_trash/pre-neural-canvas-backup-20260614/`

## 任务概览

| Phase | Feature 数量 | Commit 数 | 状态 |
| --- | --- | --- | --- |
| Phase 0 备份 | N001 | 1 | 待领取 |
| Phase 1 基础层 | N002-N005 | 1 | 待领取 |
| Phase 2 节点图谱 | N006-N010 | 1 | 待领取 |
| Phase 3 AI 导览 | N011-N014 | 1 | 待领取 |
| Phase 4 打磨 | N015-N018 | 1 | 待领取 |
| Phase 5 F005-F011 收尾 | F005-F011 | 1 | 待领取 |

总计：6 phase，25 个 feature（18 个新 + 7 个继承），6 个 commit。

## Round 0 - 2026-06-14 开发包创建

### 本轮完成了什么

- 扫描当前前端代码：App.tsx / Hero.tsx / AIChatDrawer.tsx / data.ts / package.json / AGENTS.md
- 完成需求重述 + 用户确认（4 个待确认项全部 resolved）
- 创建开发包目录：`docs/tasks/aijianli-neural-canvas-20260614/`
- 写 PRD（含 6 段式需求重述、BDD、风险、禁止项）
- 写 feature_list.json（25 个 feature，全部 `passes: false`）
- 创建 evidence/screenshots 和 evidence/logs 子目录
- 预创建 `_trash/pre-neural-canvas-backup-20260614/components/` 待 Phase 0 备份

### 修改了哪些文件

新建：
- `docs/tasks/aijianli-neural-canvas-20260614/prd.md`
- `docs/tasks/aijianli-neural-canvas-20260614/feature_list.json`
- `docs/tasks/aijianli-neural-canvas-20260614/progress.md`（本文件）
- `docs/tasks/aijianli-neural-canvas-20260614/evidence/screenshots/`（空目录）
- `docs/tasks/aijianli-neural-canvas-20260614/evidence/logs/`（空目录）
- `_trash/pre-neural-canvas-backup-20260614/components/`（空目录，待 N001 填充）

### 测试了什么

无（准备阶段不涉及代码改动）。

### 证据在哪里

无。

### 还剩什么

全部 6 个 phase + 25 个 feature。

### 未说明 / 未解决的失败项

无。

### 下轮建议从哪里继续

**Phase 0 开始**：

1. N001：把 7 个前端文件复制到 `_trash/pre-neural-canvas-backup-20260614/`
   - `App.tsx`
   - `data.ts`
   - `index.html`
   - `index.tsx`
   - `tailwind.config.ts`
   - `components/Hero.tsx`
   - `components/AIChatDrawer.tsx`
2. 备份完成后 git commit（commit message: `backup: pre-neural-canvas snapshot`）
3. 进入 Phase 1：N002 装依赖 + N003 色板 + N004 字体 + N005 粒子

每个 feature 完成后：
- 跑 `feature_list.json` 里写的 `user_steps` 做 smoke 验证
- 验证通过 → 把 `passes` 改为 `true`，填 `evidence` 路径
- 在本文件追加 Round N 节
- 每个 phase 完成后 git commit（不 push）
- `git status` 确认干净

### Git 状态

- Commit: 无
- git status: docs/tasks/aijianli-neural-canvas-20260614/ 下有新增未跟踪文件，_trash/pre-neural-canvas-backup-20260614/ 是空目录（git 不跟踪空目录，需 Phase 0 备份后才有内容）

## Round 1 - 2026-06-14 Phase 0 备份完成

### 本轮完成了什么

- 工作目录堆了大量 Phase B + 整理的未提交改动，先 commit 为 baseline
- 把整个前端可重构范围备份到 `_trash/pre-neural-canvas-backup-20260614/`（实际范围比原计划大）
- N001 passes: true

### 修改了哪些文件

新增（备份）：
- `_trash/pre-neural-canvas-backup-20260614/` 含 12 个根配置文件 + components/ + hooks/ + utils/ + src/ + api/ 整个目录

### 测试了什么

- `ls _trash/pre-neural-canvas-backup-20260614/` 确认所有文件存在
- `git status` 确认源文件未被删除（备份是复制）

### 证据在哪里

- `evidence/phase-0-backup.md`

### Git 状态

- Commit baseline: `208b8fa chore: baseline before neural canvas refactor`
- Commit Phase 0: `d52e777 phase 0: backup pre-neural-canvas snapshot`
- git status: clean

## Round 2 - 2026-06-14 Phase 1 基础层完成

### 本轮完成了什么

Phase 1 全部 4 个 feature：

- **N002** 装依赖 three / @react-three/fiber / d3-force / @types/three / @types/d3-force
- **N003** tailwind.config.ts 加 OKLCH 色板（ink/glass/fg/signature 4 色族）+ 字体 stack + neural 缓动曲线 + 自定义动画
- **N004** index.html 改字体（Geist + JetBrains Mono via Google Fonts，普惠体 via 阿里 OSS）+ boot skeleton
- **N005** 新建 three/ParticleField.tsx 粒子背景 + components/NeuralCanvas.tsx 容器（lazy import + 移动端降级）

PRD 调整：去掉 react-force-graph，因为节点用 DOM+framer-motion 渲染（PRD §7.1），不需要 three-based 图谱库。

### 修改了哪些文件

修改：
- `tailwind.config.ts`（加 OKLCH 色板 + 字体 + 动画）
- `src/index.css`（加 @font-face 普惠体 + CSS variables + glass 工具类）
- `index.html`（改字体 link + boot skeleton + 深色背景）
- `package.json` + `package-lock.json`（装 4 个新依赖）
- `App.tsx`（默认 theme 改 'dark' + 挂载 NeuralCanvas）

新建：
- `three/ParticleField.tsx`
- `components/NeuralCanvas.tsx`
- `docs/tasks/aijianli-neural-canvas-20260614/evidence/phase-0-backup.md`
- `docs/tasks/aijianli-neural-canvas-20260614/evidence/phase-1-build.md`

### 测试了什么

- `npm install three @react-three/fiber d3-force @types/three @types/d3-force` 无报错
- `npm run build` 通过：2130 modules，CSS 47KB，主 JS 429KB（gzip 130KB），ParticleField 独立 chunk 891KB（gzip 240KB）

### 证据在哪里

- `evidence/phase-1-build.md`（含 build 输出 + 配置改动）

### 还剩什么

- Phase 2：N006-N010（data.ts 重构 + NeuralCanvas + 节点交互）
- Phase 3：N011-N014（AI 导览系统）
- Phase 4：N015-N018（暗色 + PDF + 移动端 + 性能）
- Phase 5：F005-F011（收尾）

### 未说明 / 未解决的失败项

- N005 浏览器手测粒子视觉效果留待用户启动 npm run dev:vite 后确认（build 通过等价于运行时验证）

### 下轮建议从哪里继续

**Phase 2 开始**：

1. N006 重构 data.ts：加 importance + 删 pp4 + 重排顺序 + 加 GraphNode 类型
2. N007 新建 NeuralCanvas.tsx 节点层（替换 Hero）+ NodeCluster.tsx
3. N008 GlassCard hover 卡
4. N009 点击节点 zoom-in
5. N010 删 Hero.tsx + 修 #about 锚点

Phase 2 完成后跑 `npm run build` + 浏览器验证 5 个核心场景。

### Git 状态

- Commit: 待提交
- git status: tailwind.config.ts / src/index.css / index.html / package.json / package-lock.json / App.tsx 已修改；three/ / components/NeuralCanvas.tsx / docs/.../evidence/* 新增
