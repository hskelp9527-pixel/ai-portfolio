import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { Theme, ChatMessage, VisitorType } from '../types';
import { chatService } from '../utils/chatService';
import { VISITOR_PROFILES } from '../hooks/useVisitorType';

interface AIConversationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onExpand?: () => void;
  theme: Theme;
  visitorType: VisitorType;
  injectedQuestion: string | null;
  onInjectedConsumed: () => void;
}

const STREAM_INTERVAL_MS = 18;

function buildIntroMessage(visitorType: VisitorType): ChatMessage {
  const profile =
    visitorType === 'unknown' ? null : VISITOR_PROFILES[visitorType];
  const text = profile
    ? profile.intro
    : '你好。这是任泓雨的 AI 简历。节点图可以悬停、点击，也可以直接问我问题。';
  return {
    id: `intro-${visitorType}`,
    role: 'assistant',
    content: text,
    timestamp: Date.now(),
  };
}

export const AIConversationPanel: React.FC<AIConversationPanelProps> = ({
  isOpen,
  onClose,
  theme,
  visitorType,
  injectedQuestion,
  onInjectedConsumed,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([buildIntroMessage(visitorType)]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canSend, setCanSend] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasInteracted) {
      setMessages([buildIntroMessage(visitorType)]);
    }
  }, [visitorType, hasInteracted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingId]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const streamText = useCallback((fullText: string, messageId: string) => {
    setStreamingId(messageId);
    let i = 0;
    const step = Math.max(1, Math.ceil(fullText.length / 200));
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
    }
    streamTimerRef.current = window.setInterval(() => {
      i += step;
      if (i >= fullText.length) {
        const final = fullText.length;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: fullText.slice(0, final) } : m
          )
        );
        if (streamTimerRef.current) {
          window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setStreamingId(null);
        return;
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: fullText.slice(0, i) } : m
        )
      );
    }, STREAM_INTERVAL_MS);
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoading || !canSend) return;

      setHasInteracted(true);
      setCanSend(false);
      setIsLoading(true);
      setError(null);

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      const assistantId = `a-${Date.now() + 1}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        },
      ]);

      try {
        const apiMessages = [...messages, userMessage]
          .filter((m) => m.content.length > 0)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await chatService.sendMessage(apiMessages);
        streamText(response, assistantId);
      } catch (err) {
        let errorMsg = '发送失败，请重试';
        if (err instanceof Error) {
          const msg = err.message;
          if (msg.includes('429') || msg.includes('频率') || msg.includes('限流')) {
            errorMsg = '请求过于频繁，请稍后再试';
          } else if (msg.includes('余额') || msg.includes('1113')) {
            errorMsg = 'API 余额不足，请稍后再试';
          } else if (msg.includes('401') || msg.includes('令牌')) {
            errorMsg = 'API 密钥无效，请联系站长';
          } else {
            errorMsg = msg;
          }
        }
        setError(errorMsg);
        setInputValue(text);
        setMessages((prev) =>
          prev.filter((m) => m.id !== userMessage.id && m.id !== assistantId)
        );
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setCanSend(true);
          inputRef.current?.focus();
        }, 600);
      }
    },
    [messages, isLoading, canSend, streamText]
  );

  useEffect(() => {
    if (injectedQuestion && isOpen && !isLoading) {
      sendMessage(injectedQuestion);
      onInjectedConsumed();
    }
  }, [injectedQuestion, isOpen, isLoading, sendMessage, onInjectedConsumed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const profile =
    visitorType === 'unknown' ? null : VISITOR_PROFILES[visitorType];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 right-0 h-full w-[360px] max-w-[90vw] z-40 flex flex-col border-l border-glass-border no-print"
          style={{
            background: 'oklch(0.12 0.02 250 / 0.78)',
            backdropFilter: 'blur(28px) saturate(150%)',
            WebkitBackdropFilter: 'blur(28px) saturate(150%)',
          }}
          aria-label="AI 对话面板"
        >
          <header className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-signature-teal/15 border border-signature-teal/40 flex items-center justify-center">
                <Sparkles size={15} className="text-signature-teal" />
              </div>
              <div>
                <div className="font-display font-semibold text-sm text-fg-primary">
                  AI 对话
                </div>
                {profile && (
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-signature-teal">
                    {profile.label} 模式
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-fg-tertiary hover:text-fg-primary hover:bg-white/10 transition-colors"
              aria-label="关闭对话"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 neural-scrollbar">
            {messages.map((message) => {
              const isStreaming = streamingId === message.id;
              const isPending = isStreaming && message.content.length === 0;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.role === 'user' ? 'flex justify-end' : 'flex'}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                      message.role === 'user'
                        ? 'bg-signature-teal/20 border border-signature-teal/40 text-fg-primary rounded-br-sm'
                        : 'glass border border-glass-border text-fg-primary rounded-bl-sm'
                    }`}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-signature-teal animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-signature-teal animate-pulse [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-signature-teal animate-pulse [animation-delay:0.4s]" />
                        <span className="font-mono text-[9px] text-fg-tertiary ml-1">
                          thinking
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        {isStreaming && (
                          <span className="inline-block w-[2px] h-3 bg-signature-teal ml-0.5 align-middle animate-pulse" />
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {profile && !hasInteracted && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {profile.suggestedQuestions.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="text-[10px] px-2.5 py-1 rounded-full glass border border-glass-border text-fg-secondary hover:border-signature-teal/40 hover:text-signature-teal transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {q}
                  <ChevronRight size={10} />
                </button>
              ))}
            </div>
          )}

          <div className="px-4 pb-4 pt-2 border-t border-glass-border">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading
                    ? 'AI 正在思考...'
                    : '问点什么... (Enter 发送 · Shift+Enter 换行)'
                }
                rows={1}
                disabled={isLoading}
                className="flex-1 px-3 py-2.5 rounded-xl glass border border-glass-border text-xs text-fg-primary placeholder:text-fg-tertiary resize-none outline-none focus:border-signature-teal/50 transition-colors disabled:opacity-60 neural-scrollbar"
                style={{ minHeight: '42px', maxHeight: '100px' }}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading || !canSend}
                className="w-10 h-10 rounded-xl bg-signature-teal/20 border border-signature-teal/40 text-signature-teal flex items-center justify-center hover:bg-signature-teal/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="发送"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
            {error && (
              <p className="text-[10px] text-amber mt-2 px-1">{error}</p>
            )}
            <p className="text-[9px] text-fg-faint mt-2 px-1 font-mono">
              GLM-4.5-AIR · 回复可能存在误差
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
