# AIJianLi Bug 修复 Progress

用途：让下一轮 agent 不问人也能继续。

## Current State

- Status: planning（Phase A 进行中）
- Active branch: `main`（本地，不上传仓库）
- Latest commit: 无（Phase A 只建文档，未提交）
- Feature list: `feature_list.json`
- PRD: `prd.md`

## Round 0 - 2026-06-14 准备阶段

### 本轮完成了什么

- 扫描 AIJianLi 全目录，识别 14 个 bug（详见 `prd.md` § 4.3）
- 扫描外挂大脑，识别 4 个含 macOS 路径的文件
- 与用户完成需求确认（API key 不动 / 删 server/ 子目录 / PDF 保留 / Tailwind 改 PostCSS / main 分支本地做 / 不 push）
- 创建任务文件骨架：
  - `prd.md`
  - `feature_list.json`（11 个 feature，全部 `passes: false`）
  - `progress.md`（本文件）
  - `evidence/`（空目录，待填）

### 修改了哪些文件

- 新建：`docs/tasks/aijianli-bug-fix-20260614/prd.md`
- 新建：`docs/tasks/aijianli-bug-fix-20260614/feature_list.json`
- 新建：`docs/tasks/aijianli-bug-fix-20260614/progress.md`
- 新建：`docs/tasks/aijianli-bug-fix-20260614/evidence/`（空目录）

### 测试了什么

无（准备阶段不涉及代码改动）。

### 证据在哪里

无。

### 还剩什么

- Phase B：F001-F004（让项目能跑）
- Phase C：F005-F007（代码质量）
- Phase D：F008-F010（清理）
- Phase E：F011（外脑路径）

### 未说明 / 未解决的失败项

无。

### 下轮建议从哪里继续

**Phase B 开始**：

1. F001 修 server.ts:73-84 路由顺序（最简单，先做）
2. F002 修 server.ts:47 + 移动 tsx 到 dependencies
3. F003 Tailwind 改 PostCSS（最复杂，独立 commit）
4. F004 删 server/ 目录

每个 feature 完成后：
- 跑 `feature_list.json` 里写的 `user_steps` 验证
- 验证通过 → 把 `passes` 改为 `true`，填 `evidence` 路径
- 在本文件追加 Round N 节，记录改动 + 证据 + 剩余工作
- `git add` 相关文件 + `git commit`（**不 push**）
- `git status` 确认干净

### Git 状态

- Commit: 无
- git status: docs/tasks/ 下有新增未跟踪文件

## Round 1 - 2026-06-14 Phase B 完成

### 本轮完成了什么

Phase B 全部 4 个 feature：

- **F001** 修 server.ts 路由顺序：express.static 提前到 SPA 兜底之前
- **F002** 修 server.ts:47 import 路径：`'./api/chat.js'` → `'./api/chat'`
- **F003** Tailwind CDN → PostCSS：装依赖 + 配置文件 + 改 index.html / index.tsx
- **F004** 删除 server/ 子目录

PRD 修正：F002 原方案要求 tsx 移到 dependencies，实际分析后发现 server.ts 仅本地用（生产用 Vercel Serverless），tsx 留在 devDependencies 即可。

### 修改了哪些文件

修改：
- `server.ts`（F001 + F002）
- `index.html`（F003 删除 CDN script）
- `index.tsx`（F003 加 CSS import）
- `package.json` + `package-lock.json`（F003 安装 tailwindcss + postcss + autoprefixer）

新建：
- `tailwind.config.ts`
- `postcss.config.js`
- `src/index.css`
- `docs/tasks/aijianli-bug-fix-20260614/evidence/phase-b-verification.md`

删除：
- `server/`（整个目录，含 .env / index.js / package.json / node_modules）

### 测试了什么

- 静态：grep 验证 server.ts 路由顺序 + import 路径
- 动态：`npm run dev:api` 启动 → curl /api/health（200 OK）+ curl /vector-index.json（Accept-Ranges: bytes 静态服务）
- 构建：`npm run build` 成功，CSS 输出 45.55 kB（Tailwind PostCSS 编译通过）

### 证据在哪里

- `evidence/phase-b-verification.md`（含 server.ts boot log + curl 输出 + build 输出）

### 还剩什么

- Phase C：F005（统一模型）+ F006（useLazyLoad 类型）+ F007（删重复 setup）
- Phase D：F008（email 统一）+ F009（错误日志）+ F010（csv 注释）
- Phase E：F011（外脑 macOS 路径）

### 未说明 / 未解决的失败项

- F003 浏览器 console 手测留待用户启动 `npm run dev:vite` 后确认（build 验证已通过）

### 下轮建议从哪里继续

**Phase C 开始**：

1. F005 统一模型 glm-4.5-air（改 api/chat.ts:241 + types.ts:92）
2. F006 useLazyLoad 接口补 markAsLoaded/markAsError
3. F007 删 src/test-setup.ts + 改 vitest.config.ts:8

Phase C 完成后跑 `npx tsc --noEmit` + `npm test` 双重验证。

### Git 状态

- Commit: 待提交
- git status: 多处改动（server.ts / index.html / index.tsx / package.json / package-lock.json / 新文件 / 删除 server/）

