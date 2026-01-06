/**
 * Vercel Serverless Function - AI Chat API
 */

import axios from 'axios';

// 智谱 API 配置
const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

const SYSTEM_PROMPT = `你是一个友好、专业的 AI 智能助手，可以帮助用户解答各种问题。`;

export default async function handler(req: any, res: any) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages must be an array' });
    }

    // 获取 API Key
    const apiKey = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      console.error('未设置 API Key 环境变量');
      return res.status(500).json({ error: 'API 配置错误，请联系管理员' });
    }

    // 构建请求消息
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
    ];

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

    // 解析响应
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
