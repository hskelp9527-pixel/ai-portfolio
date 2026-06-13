# AIJianLi Bug 修复开发包

日期：2026-06-14
状态：需求已确认，待开发
分支：main（本地开发，不上传仓库）
执行者：本会话 agent

---

## 1. 需求输入、Agent 反馈与换路思考

### 1.1 用户原始描述

- 修 AIJianLi 已识别的 bug，顺便修扫描中新发现的 bug
- 已确认决策：
  - API key 先不管（用户接受暴露风险）
  - 删 `server/` 子目录（不是项目根目录）
  - `任泓雨_个人简历.pdf` 保留
  - Tailwind CDN → PostCSS 可以做
- 直接在 main 分支做，**只本地，不上传仓库**
- 让 agent 出开发包计划

### 1.2 Agent 理解

- 把 14 个代码 bug + 4 个外脑路径文件，按依赖关系做成 5 阶段（A→E）开发包
- 每阶段独立 commit、独立可回滚
- 产出标准四件套：`prd.md` / `feature_list.json` / `progress.md` / `evidence/`
- 质量模式：轻量验证（bug 修复非新功能，跑 `npm test` + 浏览器手测即可）

### 1.3 Agent 反馈

| 类型 | 反馈内容 | 对用户的影响 | 状态 |
|---|---|---|---|
| 风险 | Tailwind 改 PostCSS 后，`<script src="cdn.tailwindcss.com">` 必须删，否则双重加载 | 部署后样式错乱 | 已采纳 |
| 提醒 | `server.ts:47` 改用 tsx 动态 import chat.ts 后，`tsx` 要从 devDependencies 移到 dependencies | 影响生产运行 | 已采纳 |
| 风险 | 删 `server/` 会同时删 `server/.env`（含同一份 GLM_API_KEY 副本） | 暴露面减小 | 已采纳 |
| 待确认 | `index.html` 内联的 `dark-theme` 样式 | 保留内联（简单方案） | 已采纳 |

### 1.4 换路思考

| 路径 | 思路 | 取舍 |
|---|---|---|
| **原始：5 阶段顺序做** | A→B→C→D→E，每阶段独立 commit | 回滚粒度细，依赖清晰 |
| 换路 A：按严重度合并 | P1 一次 + P2/P3 一次 | 2 commit，但回滚粒度粗 |
| 换路 B：每 bug 一个 PR | 14 个 PR | review 细，token 消耗大 |

**采纳原始路径**：bug 之间有依赖（B2 依赖 server.ts 结构；C 模型统一要在 B 之后），按阶段做最稳。

### 1.5 用户决定记录

- 已采纳：删 server/ 目录、PDF 保留、Tailwind 改 PostCSS、保留 dark-theme 内联样式、main 分支本地做、不上传仓库
- 暂不采纳：撤销 API key（用户自行决定）
- 待确认：无

---

## 2. 背景与目标

### 背景

AIJianLi 是任泓雨的个人作品集 + 简历网站，React 19 + Vite 6 + Express 5 + Vercel Serverless。项目长期未维护，累积了多个层级的问题：路由错误导致静态资源加载失败、引用不存在的文件、Tailwind 用 CDN 模式、模型版本混用、类型断言绕过接口等。

### 目标

修复影响功能和代码质量的 bug，让项目能在本地正常启动并通过基础验证。不重构、不加新功能。

---

## 3. 当前项目事实

接手 agent 必须先扫描这些文件，不允许只读本文档就开始实现：

- `E:/claudecode/AIJianLi/server.ts` — 后端入口，路由顺序错误
- `E:/claudecode/AIJianLi/api/chat.ts` — Vercel Serverless，模型版本 + RAG 判定 + 错误日志
- `E:/claudecode/AIJianLi/index.html` — Tailwind CDN + 内联样式
- `E:/claudecode/AIJianLi/package.json` — scripts + dependencies
- `E:/claudecode/AIJianLi/vite.config.ts` — 端口与代理
- `E:/claudecode/AIJianLi/hooks/useLazyLoad.ts` — 类型断言问题
- `E:/claudecode/AIJianLi/vitest.config.ts` — 重复 setup 文件
- `E:/claudecode/AIJianLi/App.tsx` 与 `data.ts` — email 重复
- `E:/claudecode/AIJianLi/types.ts` — 模型联合类型
- `E:/claudecode/human_rhy_soul/` 4 个含 `/Users/jimm` 路径的文件

---

## 4. PRD

### 4.1 范围

修 14 个 bug + 4 个外脑 macOS 路径文件，分 5 阶段执行。

### 4.2 非目标

- 不撤销 / 修改 API key
- 不重写 RAG 检索算法（结构性改动）
- 不启用 tsconfig strict（连锁报错多）
- 不重构 `data.ts` 数据结构
- 不删 `任泓雨_个人简历.pdf`
- 不 `git push`
- 不动 `_trash/` 已分类内容
- 不修外脑里非 macOS 路径的其他内容

### 4.3 功能需求（按 Phase 分）

#### Phase B — 让项目能跑（P1 严重）

- **F001** 修 `server.ts` 路由顺序：`express.static` 提前到 SPA 兜底之前
- **F002** 修 `server.ts:47` 引用 `./api/chat.js`：改用 `tsx` 动态加载 `chat.ts`，同时把 `tsx` 从 devDependencies 移到 dependencies
- **F003** Tailwind CDN → PostCSS：
  - 装 `tailwindcss` + `postcss` + `autoprefixer`
  - 新建 `tailwind.config.ts` + `postcss.config.js`
  - 删 `index.html:7` 的 `<script src="cdn.tailwindcss.com">`
  - 新建 `src/index.css`（含 `@tailwind` 三行 + 暗色主题样式）
  - 保留 `index.html` 内联 `<style>` 里的 `dark-theme` + glass 样式
- **F004** 删 `server/` 整个目录（含 `server/.env`、`server/index.js`、`server/package.json`、`server/package-lock.json`、`server/node_modules`）

#### Phase C — 代码质量（P2）

- **F005** 统一模型为 `glm-4.5-air`：改 `api/chat.ts:241`，`types.ts:92` 收窄类型
- **F006** `hooks/useLazyLoad.ts`：把 `markAsLoaded` / `markAsError` 加进 `UseLazyLoadReturn` 接口，去掉 line 110 的 `as` 断言
- **F007** 删 `src/test-setup.ts`（内容与 `vitest.setup.ts` 完全重复），更新 `vitest.config.ts:8` 的 `setupFiles` 数组

#### Phase D — 清理（P3）

- **F008** `App.tsx:18` 改为从 `data.ts` 的 `PERSONAL_INFO.email` 引入，去掉硬编码
- **F009** `api/chat.ts:270-277` 简化错误日志：只保留 `error.message` + `error.response?.status`，删 stack 与 response.data
- **F010** `image.csv` / `video.csv` 文件头加注释，说明用途："用于批量生成 data.ts 的 URL 映射，不参与运行时"

#### Phase E — 外脑路径

- **F011** 批量替换 4 个文件的 macOS 路径：
  - `E:/claudecode/human_rhy_soul/AGENTS.md`
  - `E:/claudecode/human_rhy_soul/System/working-memory/OPERATING_RULES.md`
  - `E:/claudecode/human_rhy_soul/System/session_hooks/auto_sync.sh`
  - `E:/claudecode/human_rhy_soul/Resources/方法论/新电脑AI协作开发环境启动方案.md`
  - 替换规则：`/Users/jimm/代码仓库/human_rhy_soul/` → `E:/claudecode/human_rhy_soul/`

---

## 5. BDD 验收场景

```gherkin
Feature: 项目本地能正常启动

Scenario: 前端静态资源加载
  Given 同时运行 npm run dev:api 和 npm run dev:vite
  When 访问 http://localhost:3001
  Then 浏览器 console 不出现 "Failed to load module" 错误
  And 浏览器 console 不出现 Tailwind CDN 警告
  And CSS/JS 请求返回正确 MIME 类型

Scenario: AI 对话可用
  Given 服务器在运行，GLM_API_KEY 已配置
  When 用户在 AIChatDrawer 发送 "你是谁"
  Then /api/chat 返回 200
  And 响应 body 含非空 content 字段
  And 服务器日志不出现 "Cannot find module './api/chat.js'"

Scenario: server/ 目录已清理
  When 检查项目根目录
  Then server/ 目录不存在

Feature: 代码质量

Scenario: 模型版本统一
  When grep -r "glm-4" --include="*.ts" --include="*.tsx"
  Then 只出现 "glm-4.5-air"，不出现 "glm-4.7"

Scenario: useLazyLoad 类型正确
  When npx tsc --noEmit
  Then 无类型错误

Scenario: 测试 setup 不重复
  When 检查 vitest.config.ts setupFiles
  Then 数组只有一项 './vitest.setup.ts'

Feature: 外脑路径 Windows 化

Scenario: 无残留 macOS 路径
  When grep -r "/Users/jimm" E:/claudecode/human_rhy_soul/
  Then 输出为空
```

---

## 6. 质量模式建议

| 模式 | 推荐 | 原因 | 用户确认状态 |
|---|---|---|---|
| **轻量验证** | ✅ | bug 修复，非新功能；改完跑 `npm test` + 浏览器手测即可 | 已确认 |
| 关键路径 TDD | ❌ | 无关键业务路径 | 不采用 |
| 完整 TDD | ❌ | 14 个 bug 全 TDD，token 爆炸 | 不采用 |

---

## 7. 验收标准

- `npm run dev:api` + `npm run dev:vite` 同时跑，前端正常加载
- 前端 CSS/JS 请求不再返回 `text/html`
- `/api/chat` 能正常响应（不再因 chat.js 缺失崩）
- 浏览器 console 不再有 Tailwind CDN 警告
- `npm test` 通过
- `npx tsc --noEmit` 无类型错误
- `grep -r "/Users/jimm" E:/claudecode/human_rhy_soul/` 为空
- `feature_list.json` 中对应 feature 的 `passes` 真实反映测试结果

---

## 8. 禁止执行项

- 不撤销 / 修改 API key
- 不重写 RAG 检索算法
- 不启用 tsconfig strict
- 不重构 `data.ts` 数据结构
- 不删 `任泓雨_个人简历.pdf`
- 不 `git push`
- 不动 `_trash/` 已分类内容
- 不修外脑里非 macOS 路径的其他内容
- 不为「让代码跑起来」注释掉报错
- 不顺手重构无关代码

---

## 9. 任务领取与完成记录

| 任务 | 领取 agent | 分支 | 领取时间 | 完成时间 | 状态 | 备注 |
|---|---|---|---|---|---|---|
| Phase A：任务文件骨架 | 本会话 | main | 2026-06-14 | 2026-06-14 | 进行中 | 创建 prd/feature_list/progress/evidence |
| Phase B：让项目能跑（F001-F004） | 本会话 | main | 待领取 | — | 待领取 | — |
| Phase C：代码质量（F005-F007） | 本会话 | main | 待领取 | — | 待领取 | — |
| Phase D：清理（F008-F010） | 本会话 | main | 待领取 | — | 待领取 | — |
| Phase E：外脑路径（F011） | 本会话 | main | 待领取 | — | 待领取 | — |

---

## 10. 风险与取舍

- **F002 风险**：tsx 作为 runtime 依赖会增加生产 bundle，但比预构建 .js 更可靠
- **F003 风险**：Tailwind 改 PostCSS 后，原来 CDN 模式自动注入的 class 可能失效，需要扫一遍组件确认没有动态拼接 class 名（grep `className={` 检查）
- **F004 风险**：删 server/ 后失去独立的 chat proxy 备份（但功能跟 server.ts 重叠，删除是收益大于风险）
- **F011 风险**：外脑是独立 git repo，改了路径后本地 git diff 会显示一堆改动。不提交到外脑的 remote，只本地保留

---

## 11. 结果定义

每个 Phase 完成后：

1. 跑该 Phase 涉及的用户路径测试或验证命令
2. 在 `progress.md` 追加一节，记录：完成了什么、改了哪些文件、测试结果、证据路径、剩余工作
3. `feature_list.json` 中对应 feature 的 `passes` 状态更新为真实值（只有验证通过才改 `true`）
4. `git add` + `git commit`（**不 push**）
5. `git status` 干净

如果某项无法完成，必须在 `progress.md` 写明原因、剩余风险、下一轮处理建议，并保持未验证 feature 的 `passes: false`。
