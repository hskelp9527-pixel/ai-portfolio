import { GLMChatRequest, GLMChatResponse } from '../types';

const API_ENDPOINT = '/api/chat';

export class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const request: GLMChatRequest = {
        model: 'glm-4.5-air',
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        max_tokens: 4096,
        temperature: 0.7
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        // 解析错误响应体获取详细错误信息
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `API 请求失败 (${response.status})`;
        throw new Error(errorMessage);
      }

      const data: GLMChatResponse = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }

      throw new Error('API 返回数据格式错误');
    } catch (error) {
      console.error('ChatService error:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();
