# AGENTS.md — AIJianLi Neural Canvas

## 项目概述

任泓雨的个人作品集 + AI 简历。**Neural Canvas** 形态：节点图谱首屏 + AI 主动导览 + 传统简历详情。

- **仓库**：https://github.com/hskelp9527-pixel/ai-portfolio
- **分支**：main / 开发分支 `codex/*`
- **线上**：Vercel 部署

## 项目级协作规则

- 每次对话必须运行 `$ponytail`，优先采用能工作的最小方案，避免不必要抽象和依赖。
- 用户允许在完成验证后 push；commit 信息使用中文，方便回滚。

## 技术栈

### 前端
- React 19 + TypeScript 5.8 + Vite 6
- **three.js + @react-three/fiber**（深空粒子背景，lazy chunk）
- **d3-force**（节点力导向布局）
- framer-motion（节点动画 + 玻璃态过渡）
- Tailwind v3（OKLCH 色板 + 自定义 token）
- html2canvas（截图导出）

### 后端
- Express 5（本地 4001）+ Vercel Serverless（`/api/chat`）
- 智谱 GLM-4.5-air（对话）+ embedding-3（RAG 向量化）

### 测试
- Vitest 4 + Testing Library + fast-check

## 项目结构（Neural Canvas 重构后）

```
AIJianLi/
├── components/
│   ├── NeuralCanvas.tsx       # 节点图谱首屏（desktop, hidden md:block no-print）
│   ├── MobileTimeline.tsx     # 移动端纵向时间线（md:hidden）
│   ├── NodeCluster.tsx        # 节点 DOM 渲染（d3-force 位置 + hover/active/dim）
│   ├── GlassCard.tsx          # HoverCard + DetailPanel
│   ├── AIGuideBubble.tsx      # 右下角 AI 主动导览气泡
│   ├── AIConversationPanel.tsx # 360px 右侧 dock 对话面板（替换 AIChatDrawer）
│   ├── AIChatDrawer.tsx       # 旧抽屉，保留为备份不引用
│   ├── FloatingNavigation.tsx
│   ├── IdentitySection / Resume / Gallery / Theater  # 传统简历详情（滚动后展示）
├── three/ParticleField.tsx    # 深空粒子（lazy chunk）
├── hooks/
│   ├── useNodeGraph.ts        # d3-force 力导向布局（500 tick 同步）
│   ├── useVisitorType.ts      # 访客类型判定（scroll/hr · hover/peer · chat/conversational）
│   ├── useAIGuide.ts          # AI 气泡触发（5s 首访 + 3s 同节点 hover，session 上限 2 次）
├── api/chat.ts                # Vercel Serverless：AI 对话 + RAG
├── data.ts                    # 简历数据 + GRAPH_NODES (21) + GRAPH_EDGES
├── types.ts                   # GraphNode / GraphEdge / VisitorType / NodeAccent 等
├── utils/pdfExporter.ts       # html2canvas 导出（NeuralCanvas no-print 不参与）
└── App.tsx                    # 顶层：根据 isMobile 切换 NeuralCanvas / MobileTimeline
```

## 设计语言

- **色板**（OKLCH）：
  - 矿物青 `oklch(0.78 0.18 165)` — signature-teal
  - 暖琥珀 `oklch(0.75 0.20 50)` — signature-amber
  - 墨蓝黑 `oklch(0.12 0.02 250)` — ink-deep（dark theme 背景）
- **字体**：
  - 阿里巴巴普惠体（CDN: puhuiti.oss-cn-hangzhou.aliyuncs.com）
  - Geist + JetBrains Mono（Google Fonts）
- **缓动曲线**：`cubic-bezier(0.16, 1, 0.3, 1)`（neural） / `cubic-bezier(0.4, 0, 0.2, 1)`（neural-out）

## 开发命令

```bash
npm install
cp .env.example .env.local   # 填入 GLM_API_KEY

npm run dev:api    # 终端 1：Express API（端口 4001）
npm run dev:vite   # 终端 2：Vite 前端（端口 3001，代理 /api 到 4001）
```

⚠️ `dev:all` 用 Unix `&` 语法，Windows 不工作。同时跑请开两个终端。

## 媒体存储

腾讯云 COS（公有读私有写），桶名 `aicunchu-1394039784`，区域 `ap-guangzhou`。
URL 不带签名参数。

## 环境变量

| 变量名 | 用途 | 在哪用 |
|---|---|---|
| `GLM_API_KEY` | 智谱 API Key（对话 + Embedding） | server.ts / Vercel |
| `ZHIPU_API_KEY` | 同上（fallback 名） | vite.config.ts |
| `GLM_CHAT_API_BASE` | GLM Coding Plan 聊天端点，建议 `https://open.bigmodel.cn/api/coding/paas/v4` | api/chat.ts / Vercel |

## 主题策略

- 默认 **dark**（App.tsx `useState<Theme>('dark')`）
- light 模式可用（FloatingNavigation 切换），所有自定义组件用 token（`text-fg-primary` 等）自动适配
- PDF 导出时强制 light 主题（pdfExporter.ts），NeuralCanvas `no-print` 不参与截图

## 性能策略

- three.js 用 React.lazy + Suspense 独立 chunk（gzip 240KB），不阻塞首屏
- d3-force 用 500 次同步 tick 计算位置（避免运行时持续 simulation 开销）
- 移动端不渲染 NeuralCanvas，改用 MobileTimeline（无 three.js，无 d3-force）
- AI 流式是 UI 模拟（chatService 后端不支持真流式），用 setInterval 18ms 渲染 chunk

## 已知问题

### Phase 4+ 待处理
1. **`api/chat.ts:273` userQuery 未定义** — F009 范畴（Phase 5）
2. **FloatingNavigation.test.tsx 用旧 prop `onExportPDF`** — 已废弃，需更新测试或删除
3. **pdfExporter.test.ts 引用已删除的 `quality`/`scale` 字段** — 需更新或删除
4. **AIConversationPanel 没有展开/收起动画**（PRD 280→450）— 当前单一 360px 宽度，可作为后续 polish

### Phase B 已修复（保留为历史）
- F001-F004：RAG 索引路径、PDF 命令、AIChatDrawer 流式、server.ts 路由顺序（详见 `docs/tasks/aijianli-bug-fix-20260614/`）

### 数据
- `data.ts` 含 `PERSONAL_PROJECTS` + `GRAPH_NODES`（21 节点）+ `GRAPH_EDGES`
- pp4（个人数字化简历网站）已删，因循环引用简历本身
- 项目顺序按 importance 倒序：pp8 → pp7 → pp3 → pp1 → pp6 → pp2 → pp5

## 下一任务建议

1. F005-F011 Phase 5 收尾（GLM 版本统一 + 类型修复 + 错误日志简化 + 外脑路径替换）
2. 浏览器实测 NeuralCanvas 视觉效果（粒子、节点布局、hover/dim 透明度）
3. AIConversationPanel 展开/收起动画 polish（可选）
