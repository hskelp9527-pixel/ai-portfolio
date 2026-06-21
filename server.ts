/**
 * 本地开发服务器 - 提供前端 + API
 *
 * 集成 vite dev middleware，4001 端口同时提供：
 *   - /api/* 路由（聊天 + 健康检查）
 *   - 其他所有路由走 vite dev（HMR + TSX 编译）
 *
 * 这样访问 http://localhost:4001 既能用前端 dev，又能调 /api/chat。
 */

import dotenv from 'dotenv';
// 首先加载环境变量（必须在所有其他导入之前）
dotenv.config({ path: '.env.local' });
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001; // API 服务器端口（改到 4001 避免冲突）

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件（跳过 vite 自己的 HMR 资源，避免日志噪音）
app.use((req, res, next) => {
  if (req.url.startsWith('/@') || req.url.includes('?hmr=') || req.url.includes('.hot-update.')) {
    return next();
  }
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// API 路由：健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    rag: fs.existsSync(path.join(__dirname, 'public', 'vector-index.json'))
      ? '向量索引已加载'
      : '向量索引不存在'
  });
});

// API 路由：聊天（RAG）
app.post('/api/chat', async (req, res) => {
  try {
    // 直接调用 API 逻辑
    const chatModule = await import('./api/chat.ts');
    const handler = chatModule.default;

    // 模拟 Vercel 的 req/res 对象
    const vercelReq = {
      method: 'POST',
      body: req.body
    };

    const vercelRes = {
      status: (code: number) => {
        res.status(code);
        return vercelRes;
      },
      setHeader: (name: string, value: string | number | readonly string[]) => {
        res.setHeader(name, value);
        return vercelRes;
      },
      json: (data: any) => {
        res.json(data);
      }
    };

    await handler(vercelReq, vercelRes);
  } catch (error) {
    console.error('API 错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 静态资源（images / videos / vector-index.json）从 public/ 服务
app.use(express.static(path.join(__dirname, 'public')));

// Vite dev middleware（HMR + TSX 编译 + SPA HTML 入口兜底）
const vite = await createViteServer({
  server: { middlewareMode: true },
  root: __dirname,
});
app.use(vite.middlewares);

// 启动服务器
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  🚀 本地开发服务器已启动');
  console.log('========================================');
  console.log(`  📍 前端地址: http://localhost:${PORT}`);
  console.log(`  🔧 API 端点: http://localhost:${PORT}/api`);
  console.log(`  ❤️  健康检查: http://localhost:${PORT}/api/health`);
  console.log('========================================\n');
  console.log('✅ 服务器就绪（vite middleware 已集成），可以开始测试了！\n');
});
