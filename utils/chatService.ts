const API_ENDPOINT = '/api/chat';
const MIN_REQUEST_INTERVAL_MS = 5000;
const DEFAULT_COOLDOWN_SECONDS = 60;

export interface ChatServiceResponse {
  content: string;
  model?: string;
  rag?: {
    enabled: boolean;
    matches: number;
    fallback?: boolean;
  };
}

export class ChatService {
  private static instance: ChatService;
  private lastRequestTime = 0;
  private isRequestPending = false;
  private cooldownUntil = 0;

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
    const cooldownRemaining = this.cooldownUntil - Date.now();
    if (cooldownRemaining > 0) {
      const seconds = Math.ceil(cooldownRemaining / 1000);
      throw new Error(`429 限流：免费接口冷却中，请 ${seconds} 秒后再试`);
    }

    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
      await this.wait(MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest);
    }
  }

  async sendMessage(messages: Array<{ role: string; content: string }>): Promise<ChatServiceResponse> {
    if (this.isRequestPending) {
      throw new Error('请等待上一条请求完成');
    }

    this.isRequestPending = true;

    try {
      await this.waitForRateLimit();

      const request = {
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.success && data.content) {
          return {
            content: data.content,
            model: data.model,
            rag: data.rag,
          };
        }

        if (data.choices && data.choices.length > 0) {
          return {
            content: data.choices[0].message.content,
            model: data.model,
            rag: data.rag,
          };
        }

        throw new Error('API 返回数据格式错误');
      }

      if (response.status === 429) {
        const retryAfter = Number(
          response.headers.get('Retry-After') || data.retryAfter || DEFAULT_COOLDOWN_SECONDS
        );
        this.cooldownUntil = Date.now() + retryAfter * 1000;
        throw new Error(`429 限流：免费接口请求过快，请 ${retryAfter} 秒后再试`);
      }

      throw new Error(data.error || `API 请求失败 (${response.status})`);
    } finally {
      this.lastRequestTime = Date.now();
      this.isRequestPending = false;
    }
  }
}

export const chatService = ChatService.getInstance();
