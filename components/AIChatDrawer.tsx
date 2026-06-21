import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Theme, ChatMessage } from '../types';
import { chatService } from '../utils/chatService';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是 AI 助手，有什么可以帮你的吗？',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canSend, setCanSend] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 发送消息
  const handleSend = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading || !canSend) return;

    // 防抖：立即禁用发送
    setCanSend(false);
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const apiMessages = messages
        .concat(userMessage)
        .map(msg => ({ role: msg.role, content: msg.content }));

      const response = await chatService.sendMessage(apiMessages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      let errorMsg = '发送失败，请重试';

      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('429') || msg.includes('频率') || msg.includes('限流')) {
          errorMsg = '⏱️ 请求过于频繁，请稍后再试（约1分钟）';
        } else if (msg.includes('余额') || msg.includes('1113')) {
          errorMsg = '💰 API 余额不足，请充值后继续使用';
        } else if (msg.includes('401') || msg.includes('令牌')) {
          errorMsg = '🔑 API 密钥无效，请检查配置';
        } else {
          errorMsg = msg;
        }
      }

      setError(errorMsg);
      // 失败时恢复输入内容，允许用户重新发送
      setInputValue(trimmedValue);
      // 移除失败的用户消息
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
      // 延迟恢复发送能力，防止连续点击
      setTimeout(() => {
        setCanSend(true);
        inputRef.current?.focus();
      }, 1000);
    }
  };

  // 键盘发送（Enter 发送，Shift+Enter 换行）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 主题样式
  const drawerStyles = theme === 'dark'
    ? 'bg-[#0d1117]/95 border-white/10 text-white'
    : 'bg-white/95 border-black/5 text-gray-900';

  const inputStyles = theme === 'dark'
    ? 'bg-white/5 border-white/20 text-white placeholder:text-gray-500'
    : 'bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-400';

  const userMessageBg = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';
  const assistantMessageBg = theme === 'dark' ? 'bg-white/10' : 'bg-gray-100';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 no-print"
          />

          {/* 抽屉主体 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full sm:w-[450px] shadow-2xl z-50 flex flex-col border-l no-print ${drawerStyles}`}
          >
            {/* 头部 */}
            <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                  <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">AI 问答助手</h2>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    基于 GLM-5.2 / GLM-5.1
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? userMessageBg : assistantMessageBg}`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? `${userMessageBg} text-white`
                      : `${assistantMessageBg} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-white/60' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* 加载动画 */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${assistantMessageBg}`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${assistantMessageBg}`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <p className="text-red-500 text-sm">{error}</p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLoading ? 'AI 正在思考中...' : '输入问题... (Enter 发送，Shift+Enter 换行)'}
                  rows={1}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-xl border resize-none outline-none transition-all ${
                    isLoading ? 'opacity-60 cursor-not-allowed' : ''
                  } ${inputStyles}`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading || !canSend}
                  className={`px-4 rounded-xl transition-all ${
                    !inputValue.trim() || isLoading || !canSend
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-600 hover:scale-105'
                  } ${userMessageBg} text-white flex items-center justify-center min-w-[48px]`}
                  title={!canSend ? '请稍候...' : ''}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className={`flex justify-between items-center mt-2`}>
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  AI 回复可能存在误差，请核实重要信息
                </p>
                {error && (
                  <button
                    onClick={() => setError(null)}
                    className={`text-[10px] px-2 py-1 rounded transition-colors ${
                      theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-black/5 hover:bg-black/10 text-gray-700'
                    }`}
                  >
                    清除错误
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
