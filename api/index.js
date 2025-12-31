import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// GLM API 代理端点
app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'API 请求失败',
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error('代理服务器错误:', error);
    res.status(500).json({
      error: '服务器内部错误',
      message: error.message
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel 会自动接管，不需要 app.listen()
export default app;
