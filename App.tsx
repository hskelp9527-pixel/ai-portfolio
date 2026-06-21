import { useCallback, useEffect, useRef, useState } from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { FloatingNavigation } from './components/FloatingNavigation';
import { AIConversationPanel } from './components/AIConversationPanel';
import { AIGuideBubble } from './components/AIGuideBubble';
import { NeuralCanvas } from './components/NeuralCanvas';
import { Gallery } from './components/Gallery';
import { PersonalAIOS } from './components/PersonalAIOS';
import { PERSONAL_INFO } from './data';
import { Theme, GraphNode } from './types';
import { useVisitorType } from './hooks/useVisitorType';
import { useAIGuide } from './hooks/useAIGuide';

const FIRST_VISIT_DELAY_MS = 5000;
const SCROLL_SIGNAL_THRESHOLD = 200;
const THEME_STORAGE_KEY = 'ai-resume-theme';

const EXPLORE_LANES = [
  {
    index: '01',
    title: 'Current Platform',
    body: 'ChinaB2C、Listing 诊断、A+ 页面、ASIN/链接调研和 eBay 数据接入。',
  },
  {
    index: '02',
    title: 'System Evidence',
    body: 'Query Auto、Dify RAG、Coze 智能客服，把项目职责映射到可验证系统。',
  },
  {
    index: '03',
    title: 'Delivery Context',
    body: '从需求拆解、任务包、前端实现到内部推广，保留真实交付链路。',
  },
  {
    index: '04',
    title: 'Media Proof',
    body: 'AIGC 图片作为视觉生产证据，连接到电商内容生产和视觉表达能力。',
  },
];

function AppSectionTitle({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-5 px-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-signature-teal">
          {kicker}
        </div>
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-fg-primary sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
      {body && <p className="max-w-md text-sm leading-7 text-fg-secondary">{body}</p>}
    </div>
  );
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    return 'dark';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [injectedQuestion, setInjectedQuestion] = useState<string | null>(null);
  const [hoveredNodeForGuide, setHoveredNodeForGuide] = useState<GraphNode | null>(null);
  const { type: visitorType, signal } = useVisitorType();
  const firstVisitFiredRef = useRef(false);
  const email = PERSONAL_INFO.email || 'rhydewy@163.com';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    try {
      sessionStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleAskQuestion = useCallback((question?: string) => {
    if (question) {
      setInjectedQuestion(question);
    }
    setIsAIChatOpen(true);
    signal('chat');
  }, [signal]);

  const guide = useAIGuide({
    visitorType,
    hoveredNode: hoveredNodeForGuide,
    onAskQuestion: (question) => handleAskQuestion(question),
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleAIChat = () => {
    setIsAIChatOpen((prev) => {
      if (!prev) signal('chat');
      return !prev;
    });
  };

  return (
    <div className="relative min-h-screen bg-ink-black text-fg-primary transition-colors duration-300">
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

      <PersonalAIOS theme={theme} onOpenDockChat={handleAskQuestion} />

      <section id="media" className="pt-20 sm:pt-28">
        <AppSectionTitle
          kicker="05 / Media Evidence"
          title="AIGC 图片保留为内容生产能力证据。"
          body="图片作品继续作为视觉生产证据，避免把不可访问的视频链路放进当前页面。"
        />
      </section>
      <Gallery theme={theme} onModalStateChange={setIsModalOpen} />

      <section id="explore" className="px-5 py-20 sm:py-28">
        <AppSectionTitle
          kicker="06 / Evidence Matrix"
          title="先扫证据链，再进入节点图谱自由探索。"
          body="图谱不再承担首屏解释任务，而是把项目、能力、经历和媒体证据组织成可追问的第二层入口。"
        />
        <div className="mx-auto mb-6 max-w-7xl overflow-hidden rounded-[28px] border border-glass-border bg-ink-mid/70">
          <div className="grid border-b border-glass-border md:grid-cols-[1.2fr_2fr]">
            <div className="border-b border-glass-border p-6 md:border-b-0 md:border-r md:p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signature-teal">Scan Before Graph</div>
              <h3 className="mt-4 text-2xl font-semibold leading-tight text-fg-primary sm:text-3xl">
                图谱矩阵只回答一件事：这些能力证据彼此怎么连起来。
              </h3>
              <p className="mt-4 text-sm leading-7 text-fg-secondary">
                先看四条证据线，再用节点图谱追问细节。这样视觉节奏从简历、作品、媒体自然过渡到关系探索。
              </p>
            </div>
            <div className="grid sm:grid-cols-2">
              {EXPLORE_LANES.map((lane) => (
                <div key={lane.index} className="min-h-[150px] border-b border-glass-border p-6 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-signature-teal">{lane.index}</span>
                    <span className="h-px flex-1 bg-glass-border" />
                  </div>
                  <h4 className="mt-8 text-base font-semibold text-fg-primary">{lane.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-fg-secondary">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-5">
            <p className="text-sm text-fg-secondary">
              节点代表项目、能力、经历和原则；连线代表支撑关系，例如 ChinaB2C 连接 AI 工作流、平台治理和当前公司经历。
            </p>
            <button
              type="button"
              onClick={() => handleAskQuestion('帮我按图谱导览任泓雨的能力证据')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-signature-teal/40 px-4 py-2 text-sm text-signature-teal hover:bg-signature-teal hover:text-ink-black"
            >
              AI 导览图谱
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-glass-border bg-ink-mid/50">
          <NeuralCanvas
            theme={theme}
            onHoverNode={setHoveredNodeForGuide}
            onSpaceTour={() => guide.triggerFirstVisit(true)}
          />
        </div>
      </section>

      <section id="contact" className="px-5 pb-24">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-signature-teal/30 bg-ink-mid/80 p-8 text-center sm:p-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signature-teal">Next Conversation</div>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight text-fg-primary sm:text-5xl">
            有一段值得交给 AI 的流程？从它开始聊。
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-fg-secondary">
            讨论 AI 应用工程岗位、跨境电商 AI 工作流，或拆解一个具体业务流程。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`mailto:${email}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-signature-teal px-5 text-sm font-semibold text-ink-black">
              <Mail size={17} />
              {email}
            </a>
            <button
              type="button"
              onClick={() => handleAskQuestion('请用 60 秒介绍任泓雨为什么适合 AI 应用工程师')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-glass-border px-5 text-sm font-semibold text-fg-primary"
            >
              让 AI 总结匹配度
            </button>
          </div>
        </div>
      </section>

      <AIConversationPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        theme={theme}
        visitorType={visitorType}
        injectedQuestion={injectedQuestion}
        onInjectedConsumed={() => setInjectedQuestion(null)}
      />

      <footer className="relative mt-10 overflow-hidden border-t border-glass-border px-6 py-12 no-print">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-semibold">任泓雨 · Personal AI OS</h2>
            <p className="mt-2 text-sm text-fg-secondary">
              为证据、工作流和真实业务 AI 落地而设计。
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm text-signature-teal">
              <Mail size={16} />
              {email}
            </a>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
              2026 Ren Hong Yu <ExternalLink size={10} />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
