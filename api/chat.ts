/**
 * Vercel Serverless Function - AI Chat API with RAG
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

// 智谱 API 配置
const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const EMBEDDING_MODEL = 'embedding-3';

// 系统提示词
const RAG_SYSTEM_PROMPT = `你是任泓雨的 AI 助手，负责介绍任泓雨的个人背景、经历和项目经验。

**回答规则：**
1. 优先基于【参考资料】回答问题
2. 如果【参考资料】包含相关信息，直接引用并准确回答
3. 如果【参考资料】不包含相关信息，诚实说明"资料中没有提到"
4. 回答要简洁、专业，尽量使用要点列表`;

const GENERAL_SYSTEM_PROMPT = `你是一个友好、专业的 AI 智能助手，可以帮助用户解答各种问题。

你可以回答的问题类型：
- 科技知识（编程、人工智能、软件使用等）
- 生活常识
- 历史文化
- 学习建议
- 日常对话

请像一个正常的智能助手一样，自由地回答用户的问题。`;

/**
 * 计算余弦相似度
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
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

/**
 * 获取文本的 embedding
 */
async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await axios.post(
    `${GLM_API_BASE}/embeddings`,
    {
      model: EMBEDDING_MODEL,
      input: text
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (response.data?.data?.[0]?.embedding) {
    return response.data.data[0].embedding;
  }

  throw new Error('Embedding API 返回数据格式错误');
}

/**
 * RAG 检索
 */
async function searchRelevantChunks(query: string, apiKey: string): Promise<string> {
  try {
    // 尝试多个路径
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'vector-index.json'),
      path.join(process.cwd(), '..', 'public', 'vector-index.json'),
      '/var/task/public/vector-index.json',
      './public/vector-index.json'
    ];

    let indexPath = '';
    for (const p of possiblePaths) {
      console.log('检查路径:', p);
      if (fs.existsSync(p)) {
        indexPath = p;
        console.log('找到索引文件:', indexPath);
        break;
      }
    }

    if (!indexPath) {
      console.log('向量索引不存在，尝试的路径:', possiblePaths);
      return '';
    }

    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const { chunks, embeddings } = indexData;

    if (!chunks || !embeddings || chunks.length === 0) {
      console.log('向量索引为空');
      return '';
    }

    // 获取查询的 embedding
    const queryEmbedding = await getEmbedding(query, apiKey);

    // 计算相似度
    const scores = embeddings.map((embedding: number[], index: number) => ({
      chunk: chunks[index],
      score: cosineSimilarity(queryEmbedding, embedding)
    }));

    // 排序并取 top-5
    const results = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .filter(result => result.score > 0.2); // 降低阈值

    if (results.length === 0) {
      console.log('未找到相关片段');
      return '';
    }

    // 格式化上下文
    let context = '\n【参考资料】\n\n';
    results.forEach((result, index) => {
      context += `--- 资料 ${index + 1} ---\n`;
      context += `${result.chunk.content}\n\n`;
    });
    context += '--- 参考资料结束 ---\n\n';

    console.log(`RAG 检索到 ${results.length} 个相关片段`);
    return context;

  } catch (error) {
    console.error('RAG 检索失败:', error);
    return '';
  }
}

/**
 * 主处理函数
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const apiKey = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API 配置错误' });
    }

    // 获取用户问题
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || '';

    console.log('用户提问:', userQuery);

    // 执行 RAG 检索
    let ragContext = '';
    let useRAG = false;

    // 判断是否与任泓雨相关
    const relevantKeywords = ['任泓雨', '你的', '他的', '项目', '工作', '经历', '简历', '经验', '技能', '产品', '你是谁'];
    const isRelevantQuestion = relevantKeywords.some(keyword => userQuery.includes(keyword));

    if (isRelevantQuestion) {
      try {
        ragContext = await searchRelevantChunks(userQuery, apiKey);
        if (ragContext) {
          useRAG = true;
        }
      } catch (error) {
        console.log('RAG 失败，使用通用对话模式');
      }
    }

    // 选择系统提示词
    const systemPrompt = useRAG ? RAG_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;
    console.log('模式:', useRAG ? 'RAG' : '通用', '问题类型:', isRelevantQuestion ? '相关' : '无关');

    // 构建消息
    const apiMessages = [
      { role: 'system', content: systemPrompt }
    ];

    if (ragContext) {
      apiMessages[0].content += '\n\n' + ragContext;
    }

    // 添加历史对话
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // 调用智谱 API
    const response = await axios.post(
      `${GLM_API_BASE}/chat/completions`,
      {
        model: 'glm-4.5-air',
        messages: apiMessages,
        max_tokens: 4096,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      const aiMessage = response.data.choices[0].message.content;
      return res.status(200).json({
        success: true,
        content: aiMessage
      });
    }

    throw new Error('API 返回数据格式错误');

  } catch (error: any) {
    console.error('API 请求失败:', error);

    let errorMessage = '请求失败，请重试';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 401) {
        errorMessage = 'API 密钥无效';
      } else if (statusCode === 429) {
        errorMessage = '请求过于频繁';
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时';
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
}
