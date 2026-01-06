/**
 * 本地开发服务器 - 提供前端 + API
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002; // API 服务器端口

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件
app.use((req, res, next) => {
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
    console.log('收到聊天请求');

    // 动态导入 API handler
    const apiModule = await import('./api/index.js');
    const apiHandler = apiModule.default;

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
      json: (data: any) => {
        res.json(data);
      }
    };

    await apiHandler(vercelReq, vercelRes);
  } catch (error) {
    console.error('API 错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 所有其他路由返回 index.html（SPA）
app.use((req, res, next) => {
  // 如果是 API 请求，继续传递
  if (req.path.startsWith('/api')) {
    return next();
  }
  // 否则返回 index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 前端静态文件（放最后）
app.use(express.static(path.join(__dirname, 'public')));

// 启动服务器
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  🚀 本地开发服务器已启动');
  console.log('========================================');
  console.log(`  📍 前端地址: http://localhost:${PORT}`);
  console.log(`  🔧 API 端点: http://localhost:${PORT}/api`);
  console.log(`  ❤️  健康检查: http://localhost:${PORT}/api/health`);
  console.log('========================================\n');
  console.log('✅ 服务器就绪，可以开始测试了！\n');
});
