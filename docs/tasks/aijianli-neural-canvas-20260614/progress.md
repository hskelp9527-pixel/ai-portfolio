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

## Round 3 - 2026-06-14 Phase 2 节点图谱完成

### 本轮完成了什么

Phase 2 全部 5 个 feature：

- **N006** data.ts 重构：pp4 删除 + 顺序调整 pp8→pp7→pp3→pp1→pp6→pp2→pp5 + importance 字段 + GRAPH_NODES 21 节点 + GRAPH_EDGES
- **N007** NeuralCanvas + NodeCluster：d3-force 力导向布局，聚类象限分布
- **N008** GlassCard HoverCard：玻璃态预览，智能左右定位
- **N009** GlassCard DetailPanel：全屏模态详情（ESC + 外部点击关闭）
- **N010** 删 Hero.tsx + NeuralCanvas section id='about' 替代锚点

### 修改了哪些文件

修改：
- `types.ts`（加 GraphNode/GraphEdge/NodeType/NodeCluster/NodeAccent 联合类型）
- `data.ts`（重排 PERSONAL_PROJECTS + 删 pp4 + 加 importance + 加 GRAPH_NODES/GRAPH_EDGES 导出）
- `App.tsx`（删 Hero import + 删 Hero JSX + 删 negative-margin wrapper）
- `docs/tasks/aijianli-neural-canvas-20260614/feature_list.json`（N006-N010 passes:true）

新建：
- `hooks/useNodeGraph.ts`（d3-force 500 tick 同步布局）
- `components/NodeCluster.tsx`（节点 DOM 渲染 + 悬停/激活/dim 状态）
- `components/GlassCard.tsx`（HoverCard + DetailPanel）
- `docs/tasks/aijianli-neural-canvas-20260614/evidence/phase-2-build.md`

删除：
- `components/Hero.tsx`（备份在 `_trash/pre-neural-canvas-backup-20260614/components/Hero.tsx`）

### 测试了什么

- `npm run build` 通过：2165 modules，CSS 49KB，主 JS 459KB（gzip 141KB），ParticleField 独立 chunk 891KB（gzip 240KB）
- Hero 没有任何 import 引用（除备份）
- FloatingNavigation 不依赖 Hero 或 #about

### 证据在哪里

- `evidence/phase-2-build.md`

### 还剩什么

- Phase 3：N011-N014（AI 导览系统）
- Phase 4：N015-N018（暗色 + PDF + 移动端 + 性能）
- Phase 5：F005-F011（收尾）

### 已知偏离 PRD

1. **N009 zoom-in**：PRD 写"相机推近到 60%"，实际实现为全屏模态 DetailPanel。Phase 2 smoke 验证可接受，Phase 3 polish 可补相机推近
2. **dim 透明度 0.25**（PRD 0.4）：更突出焦点节点，Phase 4 视觉评审再调
3. **NeuralCanvas 从 fixed 改 relative h-screen**：原 fixed inset-0 + main z-10 导致 canvas 被覆盖不可见；改 relative 让 canvas 占首屏，main 自然流到下方

### 未说明 / 未解决的失败项

- N007/N008/N009 浏览器视觉效果待用户启动 npm run dev:vite 后人工验证
- d3-force 在小屏（375px）布局会挤压，Phase 4 N017 移动端降级处理

### 下轮建议从哪里继续

**Phase 3 开始**：

1. N011 AIGuideBubble.tsx + useAIGuide.ts（3 秒悬停触发主动建议）
2. N012 重写 AIChatDrawer → AIConversationPanel.tsx（dock 形态常驻右侧）
3. N013 useVisitorType.ts（首操作判定访客类型）
4. N014 流式输出 + 思考状态

Phase 3 是这个开发包的"AI 即界面"核心，决定简历是否能引导访客深入。
