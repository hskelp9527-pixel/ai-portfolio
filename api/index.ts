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
import fs from 'fs';
import path from 'path';
import type { GLMChatRequest, GLMChatResponse } from '../types';
import { ragService } from '../utils/ragService';

// 智谱 API 配置
const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4';

// 有 RAG 上下文时的系统 prompt
const RAG_SYSTEM_PROMPT = `你是任泓雨的 AI 助手，负责介绍任泓雨的个人背景、经历和项目经验。

**重要规则：**
1. 必须基于下方【参考资料】回答问题
2. 如果【参考资料】中有相关信息，直接引用并准确回答
3. 回答要简洁、专业，尽量使用要点列表

请始终基于【参考资料】回答，不要编造超出资料范围的信息。`;

// 无 RAG 上下文时的系统 prompt（通用对话）
const GENERAL_SYSTEM_PROMPT = `你是一个友好、专业的 AI 智能助手，可以帮助用户解答各种问题。

**你可以回答的问题类型：**
- 科技知识（编程、人工智能、软件使用等）
- 生活常识
- 历史文化
- 学习建议
- 日常对话

**你的特点：**
- 知识丰富，乐于助人
- 回答简洁、准确、有条理
- 如果遇到不确定的问题，诚实说明

请像一个正常的智能助手一样，自由地回答用户的问题。你可以谈论任何话题，不受限制。`;

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

    console.log('='.repeat(50));
    console.log('用户提问:', userQuery);
    console.log('环境变量 GLM_API_KEY:', process.env.GLM_API_KEY ? '已设置' : '未设置');
    console.log('环境变量 ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? '已设置' : '未设置');
    console.log('='.repeat(50));

    // 尝试加载向量索引并进行 RAG 检索
    let ragContext = '';
    try {
      const indexPath = path.join(process.cwd(), 'public', 'vector-index.json');
      console.log('向量索引路径:', indexPath);
      console.log('索引文件存在:', fs.existsSync(indexPath));

      if (fs.existsSync(indexPath)) {
        console.log('开始执行 RAG 检索...');
        const searchResults = await ragService.search(userQuery, 5);
        console.log('RAG 检索完成，结果数:', searchResults.length);

        if (searchResults.length > 0) {
          // 检查最高相似度分数，如果太低则放弃使用 RAG
          const topScore = searchResults[0].score;
          const RAG_THRESHOLD = 0.4; // 相似度阈值

          if (topScore >= RAG_THRESHOLD) {
            ragContext = ragService.formatContext(searchResults);
            console.log(`✓ RAG 检索到 ${searchResults.length} 个相关片段（最高分: ${topScore.toFixed(3)}）`);
          } else {
            console.log(`✗ 最高相似度 ${topScore.toFixed(3)} 低于阈值 ${RAG_THRESHOLD}，切换到通用对话模式`);
          }
        } else {
          console.log('✗ RAG 未检索到相关片段');
        }
      } else {
        console.log('✗ 向量索引文件不存在，跳过 RAG');
      }
    } catch (ragError) {
      console.error('✗ RAG 检索失败，继续使用普通对话:', ragError);
      // RAG 失败不影响正常对话
    }

    // 构建请求消息
    // 根据是否有 RAG 上下文选择不同的系统提示词
    const systemPrompt = ragContext ? RAG_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT;

    console.log('选择的系统提示词类型:', ragContext ? 'RAG模式' : '通用模式');

    const apiMessages: any[] = [
      { role: 'system', content: systemPrompt }
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
