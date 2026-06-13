# AGENTS.md — AIGC 沉浸式个人履历门户

## 项目概述

任泓雨的个人作品集 + 动态简历网站，集成 AI 对话（RAG）。

- **仓库**：https://github.com/hskelp9527-pixel/ai-portfolio
- **分支**：main
- **线上**：Vercel 部署

## 技术栈

### 前端
- React 19 + TypeScript 5.8 + Vite 6
- framer-motion（动画）、lucide-react（图标）
- html2canvas + jspdf（前端截图导出 PDF）

### 后端
- Express 5（本地开发，端口 4001）
- Vercel Serverless Functions（线上 `/api/chat`）
- 智谱 GLM-4.5-air（对话）+ embedding-3（RAG 向量化）

### 测试
- Vitest 4 + Testing Library + fast-check

## 项目结构

```
AIJianLi/
├── components/         # React 组件（Hero/Resume/Gallery/Theater/AIChatDrawer 等）
├── api/chat.ts         # Vercel Serverless：AI 对话 + RAG 检索
├── server.ts           # 本地开发服务器（Express, 4001）
├── Rag/                # RAG 源文档（5 个 .md，用于构建 vector-index）
├── scripts/
│   ├── build-knowledge-base.ts   # 构建 public/vector-index.json
│   └── export-pdf.ts             # Playwright 导出 PDF
├── data.ts             # 简历数据（个人信息、经历、项目、媒体 URL）
├── types.ts            # TypeScript 类型
├── public/             # 静态资源 + vector-index.json
└── index.html / index.tsx / App.tsx
```

## 开发命令

```bash
npm install
cp .env.example .env.local   # 填入 GLM_API_KEY

npm run dev:api    # 终端 1：Express API（端口 4001）
npm run dev:vite   # 终端 2：Vite 前端（端口 3001，代理 /api 到 4001）
```

⚠️ `package.json` 中 `dev` 脚本当前只启动 API（`dev:api`），前端需单独运行 `dev:vite`。同时跑请开两个终端，不要用 `dev:all`（其 `&` 是 Unix 语法，Windows 不工作）。

## 媒体存储

腾讯云 COS（公有读私有写），桶名 `aicunchu-1394039784`，区域 `ap-guangzhou`。
URL 不带签名参数（旧版签名 URL 已废弃，详见 `memory.md`）。

## 环境变量

| 变量名 | 用途 | 在哪用 |
|---|---|---|
| `GLM_API_KEY` | 智谱 API Key（对话 + Embedding） | server.ts / Vercel |
| `ZHIPU_API_KEY` | 同上（fallback 名） | vite.config.ts |

⚠️ 命名不统一，建议统一为 `GLM_API_KEY`。

## 已知问题

按严重程度排序：

### 严重
1. **`server.ts` 路由顺序错误**：SPA 兜底（line 73-81）在 `express.static`（line 84）之前 → 所有静态文件被拦截返回 index.html
2. **`server.ts:47` 引用 `./api/chat.js`**：仓库里只有 `api/chat.ts`，没有 `.js`，也未配置 esbuild 生成 → 本地 chat API 一调用就崩
3. **Tailwind 用 CDN 模式**（`index.html:7`）：生产环境会弹警告，性能差

### 中等
4. **重复的 server 项目**：根目录 `server.ts`（express 5）与独立 `server/` 目录（express 4）功能重叠
5. **RAG 索引路径不稳定**：`api/chat.ts:86-91` 尝试 4 个候选路径查找 `vector-index.json`
6. **RAG 判定逻辑粗糙**：`api/chat.ts:195-201` 用关键词数组判断，含"你的""他的"等高频词 → 误判
7. **tsconfig 太宽松**：未启用 `strict`、`noUnusedLocals`

### 噪声
8. **错误日志过度打印**：`api/chat.ts:270-277` 把 stack/response.data 全打到 console
9. **数据源重复维护**：`data.ts` 硬编码 URL，同时维护 `image.csv` / `video.csv`

## 下一任务建议

优先修严重问题 1-3，再处理中等 4-7。
