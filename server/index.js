import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 系统 prompt
const SYSTEM_PROMPT = `你是一位专业的 AI 面试助手，专门帮助用户了解任泓雨（候选人）的背景、经历和项目经验。

【候选人核心信息】
- 姓名：任泓雨
- 年龄：26岁
- 求职方向：AI 产品助理
- 工作地点：深圳
- 期望行业：工具/电商
- 优势关键词：执行力强、能快速交付、结构化表达、热爱探索AI前沿工具

【已上线产品】
1. 个人简历门户网站（https://airainyu.xyz/）
   - 接入大模型问答并增加 RAG 回答相关问题
   - 前端：Gemini，后端：Kiro/Claude Code
   - 部署：Vercel

2. 桌面清理工具（本地应用/桌面端）
   - 自动归类桌面文件并清理
   - 技术栈：Python + tkinter + Claude Code

【工作经历】
公司A：2023-2025，信息化项目交付专员
- 参与深圳市交通某信息化集成项目
- 负责约 7-8 个子项目，总项目规模约 10 亿元
- 完成材料合规性审查，推动项目节点支付和验收支付，回款三千万

你的职责：
1. 优先基于以上核心信息回答问题
2. 如果有知识库资料，优先使用知识库
3. 如果信息不足，明确说明"资料中未包含此信息"
4. 回答要简洁、专业、有条理，使用要点列表形式
5. 避免编造或猜测任何信息

请始终保持专业、友好的语气。`;

// 加载向量索引
let vectorIndex = null;
function loadVectorIndex() {
  try {
    const indexPath = path.join(__dirname, '..', 'public', 'vector-index.json');
    if (fs.existsSync(indexPath)) {
      const data = fs.readFileSync(indexPath, 'utf-8');
      vectorIndex = JSON.parse(data);
      console.log(`已加载向量索引，包含 ${vectorIndex.chunks.length} 个片段`);
    } else {
      console.log('向量索引文件不存在，RAG 功能将被禁用');
    }
  } catch (error) {
    console.error('加载向量索引失败:', error);
  }
}

// 启动时加载向量索引
loadVectorIndex();

// 计算余弦相似度
function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('向量维度不匹配');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// 获取 embedding
async function getEmbedding(text) {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY}`
    },
    body: JSON.stringify({
      model: 'embedding-3',
      input: text
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Embedding API 请求失败');
  }

  return data.data[0].embedding;
}

// RAG 检索
async function searchWithRAG(query, topK = 5) {
  if (!vectorIndex || vectorIndex.chunks.length === 0) {
    return [];
  }

  try {
    const queryEmbedding = await getEmbedding(query);

    const scores = vectorIndex.embeddings.map((embedding, index) => ({
      chunk: vectorIndex.chunks[index],
      score: cosineSimilarity(queryEmbedding, embedding)
    }));

    const results = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(result => result.score > 0.3);

    console.log(`RAG 检索到 ${results.length} 个相关片段`);
    return results;
  } catch (error) {
    console.error('RAG 检索失败:', error);
    return [];
  }
}

// 格式化 RAG 上下文
function formatRAGContext(results) {
  if (results.length === 0) {
    return '';
  }

  let context = '以下是相关参考资料：\n\n';

  results.forEach((result, index) => {
    context += `【资料 ${index + 1}】（相似度: ${result.score.toFixed(3)}，来源: ${result.chunk.source}）\n`;
    context += `${result.chunk.content}\n\n`;
  });

  context += '请基于以上资料回答用户的问题。如果资料中没有相关信息，请明确说明"资料中未包含此信息"。';

  return context;
}

// GLM API 代理端点（支持 RAG）
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages must be an array' });
    }

    const apiKey = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API 配置错误：未设置 GLM_API_KEY' });
    }

    // 获取用户最新问题
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || '';

    console.log('用户提问:', userQuery);

    // RAG 检索
    let ragContext = '';
    const searchResults = await searchWithRAG(userQuery, 5);

    if (searchResults.length > 0) {
      ragContext = formatRAGContext(searchResults);
    }

    // 构建请求消息
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (ragContext) {
      apiMessages[0].content += '\n\n' + ragContext;
    }

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // 调用智谱 API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4.5-air',
        messages: apiMessages,
        max_tokens: 4096,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'API 请求失败',
        details: data
      });
    }

    if (data.choices?.[0]?.message?.content) {
      console.log('AI 回复成功');
      res.json({
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage
      });
    } else {
      throw new Error('API 返回数据格式错误');
    }
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
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    rag: vectorIndex ? 'enabled' : 'disabled'
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  代理服务器运行在 http://localhost:${PORT}`);
  console.log(`  RAG 功能: ${vectorIndex ? '已启用' : '未启用'}`);
  console.log(`========================================`);
});
