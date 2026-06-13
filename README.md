# AIJianLi — AIGC 沉浸式个人履历门户

任泓雨的个人作品集与动态简历网站，集成 AI 对话（RAG）能力。

线上：通过 Vercel 部署，仓库 https://github.com/hskelp9527-pixel/ai-portfolio

## 技术栈

- **前端**：React 19 + TypeScript + Vite 6
- **动画**：Framer Motion
- **图标**：lucide-react
- **PDF 导出**：jsPDF + html2canvas + Playwright（脚本）
- **后端**：Express 5（本地开发）+ Vercel Serverless Functions（线上）
- **AI**：智谱 GLM-4.5-air + embedding-3（RAG 检索）
- **测试**：Vitest + Testing Library + fast-check

## 项目结构

```
AIJianLi/
├── components/         # React 组件
├── api/chat.ts         # Vercel Serverless: AI 对话 + RAG
├── server.ts           # 本地开发服务器（Express，端口 4001）
├── Rag/                # RAG 源文档（5 个 .md，构建 vector-index 用）
├── scripts/
│   ├── build-knowledge-base.ts   # 构建 public/vector-index.json
│   └── export-pdf.ts             # Playwright 导出 PDF
├── data.ts             # 简历数据（个人信息、经历、项目、媒体 URL）
├── types.ts            # TypeScript 类型
├── public/             # 静态资源 + vector-index.json
└── index.html / index.tsx / App.tsx
```

## 开发

```bash
npm install
cp .env.example .env.local   # 填入 GLM_API_KEY
npm run dev:api               # 终端 1：Express API（4001）
npm run dev:vite              # 终端 2：Vite 前端（3001）
```

注意：`npm run dev` 当前只启动 API，前端需单独 `npm run dev:vite`。

## 媒体存储

腾讯云 COS（公有读私有写），桶名 `aicunchu-1394039784`，区域 `ap-guangzhou`。
URL 不带签名参数（旧版签名 URL 已废弃，见 `memory.md`）。

## 已知问题

详见 `AGENTS.md` 的 "Known Issues" 章节。
