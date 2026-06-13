import { GLMChatRequest, GLMChatResponse } from '../types';

const API_ENDPOINT = '/api/chat';

export class ChatService {
  private static instance: ChatService;
  private lastRequestTime = 0;
  private minRequestInterval = 2000; // 最小请求间隔 2 秒
  private isRequestPending = false;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`速率限制：等待 ${waitTime}ms`);
      await this.wait(waitTime);
    }
  }

  async sendMessage(messages: Array<{ role: string; content: string }>): Promise<string> {
    // 防止并发请求
    if (this.isRequestPending) {
      throw new Error('请等待上一个请求完成');
    }

    this.isRequestPending = true;

    try {
      // 等待速率限制
      await this.waitForRateLimit();

      const request: GLMChatRequest = {
        model: 'glm-4.5-air',
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        max_tokens: 4096,
        temperature: 0.7
      };

      // 重试逻辑
      let lastError: Error | null = null;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
          });

          if (response.ok) {
            const data = await response.json();

            // 支持两种返回格式
            if (data.success && data.content) {
              return data.content;
            }

            if (data.choices && data.choices.length > 0) {
              return data.choices[0].message.content;
            }

            throw new Error('API 返回数据格式错误');
          }

          // 处理 429 错误
          if (response.status === 429) {
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(errorData.error || '请求过于频繁');

            if (attempt < maxRetries) {
              const waitTime = attempt * 3000; // 递增等待时间：3s, 6s, 9s
              console.log(`429 错误，第 ${attempt} 次重试，等待 ${waitTime}ms...`);
              await this.wait(waitTime);
              continue;
            }
          }

          // 其他错误
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `API 请求失败 (${response.status})`;
          throw new Error(errorMessage);

        } catch (error: any) {
          if (error.message.includes('429') || error.message.includes('请求过于频繁')) {
            lastError = error;
            if (attempt < maxRetries) {
              const waitTime = attempt * 3000;
              console.log(`请求频繁，第 ${attempt} 次重试，等待 ${waitTime}ms...`);
              await this.wait(waitTime);
              continue;
            }
          }
          throw error;
        }
      }

      throw lastError || new Error('请求失败');

    } finally {
      this.lastRequestTime = Date.now();
      this.isRequestPending = false;
    }
  }
}

export const chatService = ChatService.getInstance();
