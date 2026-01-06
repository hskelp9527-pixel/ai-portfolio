/**
 * Vercel Serverless Function - AI Chat API with RAG
 *
 * 功能：
 * 1. 接收用户提问
 * 2. 使用 RAG 检索相关知识片段
 * 3. 调用智谱 GLM-4.5 生成回答
 * 4. 返回 AI 回复
 */

import axios from 'axios';
import type { GLMChatRequest, GLMChatResponse } from '../types';

// 智谱 API 配置
const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

// 系统 prompt
const SYSTEM_PROMPT = `你是一位专业的 AI 面试助手，专门帮助用户了解任泓雨（候选人）的背景、经历和项目经验。

你的职责：
1. 基于提供的知识库资料准确回答问题
2. 如果知识库中没有相关信息，明确说明"资料中未包含此信息"
3. 回答要简洁、专业、有条理
4. 尽量使用要点列表形式输出
5. 避免编造或猜测任何信息

请始终保持专业、友好的语气。`;

/**
 * Vercel Serverless Function Handler
 */
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
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) {
      console.error('未设置 GLM_API_KEY 环境变量');
      return res.status(500).json({ error: 'API 配置错误' });
    }

    // 获取用户最新问题
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || '';

    console.log('用户提问:', userQuery);

    // 尝试加载向量索引并进行 RAG 检索
    let ragContext = '';
    try {
      const fs = await import('fs');
      const path = await import('path');

      const indexPath = path.join(process.cwd(), 'public', 'vector-index.json');

      if (fs.existsSync(indexPath)) {
        // 动态导入 RAG 服务
        const { ragService } = await import('../utils/ragService.js');

        // 执行检索
        const searchResults = await ragService.search(userQuery, 5);

        if (searchResults.length > 0) {
          ragContext = ragService.formatContext(searchResults);
          console.log(`RAG 检索到 ${searchResults.length} 个相关片段`);
        } else {
          console.log('RAG 未检索到相关片段');
        }
      } else {
        console.log('向量索引文件不存在，跳过 RAG');
      }
    } catch (ragError) {
      console.error('RAG 检索失败，继续使用普通对话:', ragError);
      // RAG 失败不影响正常对话
    }

    // 构建请求消息
    const apiMessages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // 如果有 RAG 上下文，添加到系统消息中
    if (ragContext) {
      apiMessages[0].content += '\n\n' + ragContext;
    }

    // 添加历史对话（排除系统消息）
    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // 调用智谱 API
    const glmRequest: GLMChatRequest = {
      model: 'glm-4.5-air',
      messages: apiMessages,
      max_tokens: 4096,
      temperature: 0.7
    };

    console.log('调用智谱 API...');

    const response = await axios.post<GLMChatResponse>(
      `${GLM_API_BASE}/chat/completions`,
      glmRequest,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 秒超时
      }
    );

    // 解析响应
    if (response.data?.choices?.[0]?.message?.content) {
      const aiMessage = response.data.choices[0].message.content;

      console.log('AI 回复成功');
      console.log('Token 使用:', response.data.usage);

      return res.status(200).json({
        success: true,
        content: aiMessage,
        usage: response.data.usage
      });
    }

    throw new Error('API 返回数据格式错误');

  } catch (error: any) {
    console.error('API 请求失败:', error);

    // 处理不同类型的错误
    let errorMessage = '请求失败，请重试';
    let statusCode = 500;

    if (error.response) {
      // Axios 错误
      statusCode = error.response.status;
      const errorData = error.response.data;

      if (statusCode === 401) {
        errorMessage = 'API 密钥无效，请检查配置';
      } else if (statusCode === 429) {
        errorMessage = '请求过于频繁，请稍后再试';
      } else if (statusCode === 400) {
        errorMessage = '请求参数错误';
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试';
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
}
