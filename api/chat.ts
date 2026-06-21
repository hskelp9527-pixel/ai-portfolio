import axios from 'axios';
import { FALLBACK_CHAT_MODEL, PRIMARY_CHAT_MODEL } from '../utils/aiConfig';
import { ragService } from '../utils/ragService';
import type { RAGSearchResult } from '../types';

const GLM_CHAT_API_BASE =
  process.env.GLM_CHAT_API_BASE ||
  process.env.ZHIPU_CHAT_API_BASE ||
  'https://open.bigmodel.cn/api/coding/paas/v4';
const EMPTY_RAG_CONTEXT = '【参考资料】\n未检索到足够相关的资料。请明确说明资料未包含，不要编造。\n';

const RAG_SYSTEM_PROMPT = `你是任泓雨的 AI 助手，负责介绍任泓雨的个人背景、经历和项目经验。

回答规则：
1. 优先基于【参考资料】回答。
2. 如果资料包含答案，直接给出结论，再用要点补充依据。
3. 如果资料没有覆盖，明确说“资料未包含”，不要编造。
4. 语气专业、简洁，尽量用要点列表。
5. 不要向访客展示 raw log、sync_run_id、NULL_OVERWRITE_BLOCKED 等内部字段名；将它们概括为同步诊断、可追溯日志、空值覆盖防护等成果表达。`;

const GENERAL_SYSTEM_PROMPT = `你是一个友好、专业的 AI 智能助手，可以帮助用户解答一般性问题。

请保持回答简洁、准确；对不确定的内容，直接说明不知道，不要编造。`;

function shouldFallback(error: any): boolean {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.error?.message || error?.message || '').toLowerCase();

  return (
    status === 408 ||
    status === 429 ||
    status >= 500 ||
    error?.code === 'ECONNABORTED' ||
    message.includes('model') ||
    message.includes('not found') ||
    message.includes('unavailable')
  );
}

function getUserQuery(messages: Array<{ role?: string; content?: string }>): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message?.role === 'user' && message.content) {
      return message.content.trim();
    }
  }

  return messages.at(-1)?.content?.trim() || '';
}

function normalizeMessages(messages: Array<{ role?: string; content?: string }>) {
  return messages
    .filter(message => (message.role === 'user' || message.role === 'assistant') && message.content?.trim())
    .map(message => ({
      role: message.role as 'user' | 'assistant',
      content: message.content!.trim(),
    }));
}

function formatRateLimitFallback(results: RAGSearchResult[]): string {
  const cleanExcerpt = (value: string) =>
    value
      .replace(/raw log/gi, '可追溯日志')
      .replace(/sync_run_id/gi, '同步任务标识')
      .replace(/NULL_OVERWRITE_BLOCKED/gi, '空值覆盖防护')
      .replace(/Gallery \/ Theater/g, 'Gallery');

  const blocks = results.slice(0, 3).map((result, index) => {
    const title = result.chunk.metadata?.category || result.chunk.source;
    const content = cleanExcerpt(result.chunk.content.trim());
    const excerpt = content.length > 520 ? `${content.slice(0, 520)}...` : content;

    return [
      `【资料 ${index + 1}】${title}`,
      excerpt,
    ].join('\n\n');
  });

  return [
    '当前模型接口触发免费额度限流，先根据本地知识库给你一个临时回答：',
    '',
    ...blocks,
    '',
    '模型接口恢复后可以继续追问，我会再做完整回答。',
  ].join('\n');
}

async function requestChatCompletion(
  model: string,
  apiKey: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  enableRag: boolean
) {
  const response = await axios.post(
    `${GLM_CHAT_API_BASE.replace(/\/$/, '')}/chat/completions`,
    {
      model,
      messages,
      max_tokens: 2048,
      temperature: enableRag ? 0.2 : 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  const aiMessage = response.data?.choices?.[0]?.message?.content;
  if (typeof aiMessage === 'string' && aiMessage.trim()) {
    return aiMessage;
  }

  throw new Error('Unexpected API response format');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let ragResults: RAGSearchResult[] = [];
  let enableRag = false;

  try {
    const { messages } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const apiKey = process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured' });
    }

    const userQuery = getUserQuery(messages);
    if (!userQuery) {
      return res.status(400).json({ error: 'Missing user query' });
    }

    const useRag = ragService.shouldUseKnowledgeBase(userQuery);
    ragResults = useRag ? await ragService.search(userQuery, 3) : [];
    enableRag = useRag;

    const apiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: enableRag ? RAG_SYSTEM_PROMPT : GENERAL_SYSTEM_PROMPT,
      },
    ];

    if (enableRag) {
      apiMessages.push({
        role: 'system',
        content: ragResults.length > 0 ? ragService.formatContext(ragResults) : EMPTY_RAG_CONTEXT,
      });
    }

    apiMessages.push(...normalizeMessages(messages));

    let usedModel: string = PRIMARY_CHAT_MODEL;
    try {
      const aiMessage = await requestChatCompletion(PRIMARY_CHAT_MODEL, apiKey, apiMessages, enableRag);
      return res.status(200).json({
        success: true,
        content: aiMessage,
        model: usedModel,
        rag: {
          enabled: enableRag,
          matches: ragResults.length,
        },
      });
    } catch (primaryError: any) {
      if (!shouldFallback(primaryError)) {
        throw primaryError;
      }

      console.warn(
        `Primary model ${PRIMARY_CHAT_MODEL} failed, trying ${FALLBACK_CHAT_MODEL}:`,
        primaryError.message,
        'status:',
        primaryError.response?.status
      );
      usedModel = FALLBACK_CHAT_MODEL;
      const aiMessage = await requestChatCompletion(FALLBACK_CHAT_MODEL, apiKey, apiMessages, enableRag);
      return res.status(200).json({
        success: true,
        content: aiMessage,
        model: usedModel,
        fallbackModel: PRIMARY_CHAT_MODEL,
        rag: {
          enabled: enableRag,
          matches: ragResults.length,
        },
      });
    }
  } catch (error: any) {
    console.error('API chat error:', error.message, 'status:', error.response?.status);

    let errorMessage = 'Request failed, please try again';
    let statusCode = 500;
    let retryAfter = 60;

    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 401) {
        errorMessage = 'API key is invalid';
      } else if (statusCode === 429) {
        errorMessage = 'Rate limited';
        retryAfter = Number(error.response.headers?.['retry-after'] ?? retryAfter);
        res.setHeader('Retry-After', String(retryAfter));

        if (enableRag && ragResults.length > 0) {
          return res.status(200).json({
            success: true,
            content: formatRateLimitFallback(ragResults),
            model: 'local-rag-fallback',
            rateLimited: true,
            retryAfter,
            rag: {
              enabled: true,
              matches: ragResults.length,
              fallback: true,
            },
          });
        }
      } else {
        errorMessage = `API error: ${statusCode}`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(statusCode).json({
      error: errorMessage,
      ...(statusCode === 429 ? { retryAfter } : {}),
    });
  }
}
