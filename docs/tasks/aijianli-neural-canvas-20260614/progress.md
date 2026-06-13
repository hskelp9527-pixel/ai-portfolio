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
