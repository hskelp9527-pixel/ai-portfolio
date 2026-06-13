import { useState, useEffect, useCallback, useRef } from 'react';
import { FloatingNavigation } from './components/FloatingNavigation';
import { AIConversationPanel } from './components/AIConversationPanel';
import { AIGuideBubble } from './components/AIGuideBubble';
import { NeuralCanvas } from './components/NeuralCanvas';
import { IdentitySection } from './components/IdentitySection';
import { Resume } from './components/Resume';
import { Gallery } from './components/Gallery';
import { Theater } from './components/Theater';
import { Mail, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from './data';
import { Theme, GraphNode } from './types';
import { useVisitorType } from './hooks/useVisitorType';
import { useAIGuide } from './hooks/useAIGuide';

const FIRST_VISIT_DELAY_MS = 5000;
const SCROLL_SIGNAL_THRESHOLD = 200;

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [emailCopied, setEmailCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [injectedQuestion, setInjectedQuestion] = useState<string | null>(null);
  const [hoveredNodeForGuide, setHoveredNodeForGuide] = useState<GraphNode | null>(null);
  const email = PERSONAL_INFO.email || 'rhydewy@163.com';

  const { type: visitorType, signal } = useVisitorType();
  const firstVisitFiredRef = useRef(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleAskQuestion = useCallback((q: string) => {
    setInjectedQuestion(q);
    setIsAIChatOpen(true);
  }, []);

  const guide = useAIGuide({
    visitorType,
    hoveredNode: hoveredNodeForGuide,
    onAskQuestion: handleAskQuestion,
  });

  useEffect(() => {
    if (firstVisitFiredRef.current) return;
    firstVisitFiredRef.current = true;
    const timer = window.setTimeout(() => {
      guide.triggerFirstVisit();
    }, FIRST_VISIT_DELAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      if (window.scrollY > SCROLL_SIGNAL_THRESHOLD) {
        fired = true;
        signal('scroll');
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [signal]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      alert('已复制邮箱');
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAIChat = () => {
    setIsAIChatOpen((prev) => {
      if (!prev) {
        signal('chat');
      }
      return !prev;
    });
  };

  return (
    <div className="relative min-h-screen transition-all duration-300 text-fg-primary">
      <NeuralCanvas theme={theme} onHoverNode={setHoveredNodeForGuide} />

      <FloatingNavigation
        theme={theme}
        onToggleTheme={toggleTheme}
        visible={!isModalOpen}
        onAIChatToggle={toggleAIChat}
        isAIChatOpen={isAIChatOpen}
      />

      <AIGuideBubble
        visible={guide.visible}
        message={guide.message}
        onCta={guide.acceptCta}
        onDismiss={guide.dismiss}
      />

      <main className="relative z-10">
        <IdentitySection theme={theme} />
        <Resume theme={theme} />
        <Gallery theme={theme} onModalStateChange={setIsModalOpen} />
        <Theater theme={theme} onModalStateChange={setIsModalOpen} />
      </main>

      <AIConversationPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        theme={theme}
        visitorType={visitorType}
        injectedQuestion={injectedQuestion}
        onInjectedConsumed={() => setInjectedQuestion(null)}
      />

      <footer className="py-16 px-6 relative overflow-hidden glass border-t transition-colors duration-300 no-print mt-20 border-glass-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">共建 AI 未来</h2>
            <p className="text-lg font-medium leading-relaxed text-fg-secondary">
              致力于探索前沿AI技术转化为实际商业价值<br />持续学习，保持热爱。
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-10">
            <div className="flex gap-6">
              <button
                onClick={handleCopyEmail}
                className="p-5 glass rounded-[2rem] transition-all hover:-translate-y-2 hover:bg-signature-teal/20 hover:text-signature-teal shadow-sm border border-glass-border flex items-center justify-center"
                title="复制邮箱"
              >
                <Mail size={24} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center justify-end gap-2 text-signature-teal/70">
                CRAFTED WITH AI &amp; PASSION <ExternalLink size={10} />
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-fg-tertiary">
                2026 Ren Hong Yu
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
