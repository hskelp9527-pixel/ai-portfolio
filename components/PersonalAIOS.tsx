import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Bot,
  CheckCircle2,
  Compass,
  ExternalLink,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CAPABILITY_EVIDENCE,
  CAREER_TRAJECTORY,
  PERSONAL_INFO,
  PRINCIPLES_IN_PRACTICE,
  SELECTED_SYSTEMS,
} from '../data';
import { chatService } from '../utils/chatService';
import { Theme } from '../types';

interface PersonalAIOSProps {
  theme: Theme;
  onOpenDockChat: (question?: string) => void;
}

const SUGGESTIONS = [
  '你现在在新公司负责什么？',
  'ChinaB2C 平台做了什么？',
  '为什么适合 AI 应用工程师？',
  '复杂交付经历如何迁移到 AI？',
];

type TourMode = 'recruiter' | 'tech' | 'product' | 'explore';

const TOUR_COPY: Record<TourMode, { label: string; title: string; body: string; cards: string[]; question: string }> = {
  recruiter: {
    label: '招聘者',
    title: '证据路径：岗位匹配 -> 真实项目 -> 结果 -> 联系',
    body: '优先看当前公司 AI 平台、三个代表系统、复杂交付背景和最终联系入口，用 60 秒判断是否值得继续聊。',
    cards: ['ChinaB2C 当前职责', '三个代表系统', '复杂交付背景'],
    question: '请按招聘者视角，用 60 秒介绍任泓雨的岗位匹配度和关键证据。',
  },
  tech: {
    label: '技术负责人',
    title: '证据路径：系统边界 -> 数据流 -> 诊断 -> 可验证性',
    body: '优先看 Agent 编排、RAG 证据、数据接入和失败处理，判断 AI 能力是否能进入稳定产品。',
    cards: ['Agent 编排边界', 'RAG 证据链', '数据接入诊断'],
    question: '请按技术负责人视角，解释任泓雨做过哪些可验证的 AI 系统能力。',
  },
  product: {
    label: '产品负责人',
    title: '证据路径：用户问题 -> 流程设计 -> 上线推广 -> 业务价值',
    body: '优先看运营、设计、电商同事的实际任务，如何从输入、生成、预览、反馈走到可用工作台。',
    cards: ['用户任务路径', 'A+ / Listing 流程', '内部推广闭环'],
    question: '请按产品负责人视角，说明任泓雨如何把用户问题拆成可落地 AI 工作流。',
  },
  explore: {
    label: '自由探索',
    title: '证据路径：线性扫读 -> 能力证据 -> 图谱追问',
    body: '先用页面看清主线，再进入节点图谱和媒体作品，适合沿项目、能力和经历关系继续探索。',
    cards: ['能力证据地图', 'AIGC 图片', 'Neural Canvas'],
    question: '请按自由探索路径，带我理解任泓雨的项目、能力、经历之间怎么关联。',
  },
};

const SELF_INTRO = [
  {
    title: '当前定位',
    body: 'AI 应用工程师，正在推进 ChinaB2C 跨境电商 AI 效能平台，把运营、设计和电商内容生产流程拆成可运行工作流。',
  },
  {
    title: '交付背景',
    body: '经历过大型信息化项目的多方协同、文档审计、节点推进和验收答疑，知道系统从需求到交付中间会卡在哪里。',
  },
  {
    title: '方法特点',
    body: '先拆清楚输入、生成、预览、追踪和反馈，再决定模型、Agent、RAG 或自动化放在哪个环节。',
  },
];

function SectionTitle({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-signature-teal">
          {kicker}
        </div>
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-fg-primary sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
      {body && <p className="max-w-md text-sm leading-7 text-fg-secondary">{body}</p>}
    </div>
  );
}

export const PersonalAIOS: React.FC<PersonalAIOSProps> = ({ onOpenDockChat }) => {
  const [mode, setMode] = useState<TourMode>('recruiter');
  const [askInput, setAskInput] = useState(SUGGESTIONS[0]);
  const [answer, setAnswer] = useState(
    '你好，我是任泓雨的 Resume Agent。可以问我新公司经历、ChinaB2C 平台、代表项目或岗位匹配度。'
  );
  const [model, setModel] = useState('GLM-5.2');
  const [ragText, setRagText] = useState('RAG ready');
  const [isAsking, setIsAsking] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const askResume = useCallback(async (question = askInput) => {
    const text = question.trim();
    if (!text || isAsking) return;

    setAskInput(text);
    setIsAsking(true);
    setAnswer('正在检索履历证据...');
    setRagText('Retrieving');

    try {
      const response = await chatService.sendMessage([{ role: 'user', content: text }]);
      setAnswer(response.content);
      setModel(response.model || 'GLM-5.2');
      setRagText(response.rag?.enabled ? `${response.rag.matches} 条证据` : '未触发 RAG');
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : '发送失败，请稍后再试。');
      setRagText('Error');
    } finally {
      setIsAsking(false);
    }
  }, [askInput, isAsking]);

  useEffect(() => {
    if (sheetOpen) inputRef.current?.focus();
  }, [sheetOpen]);

  const activeTour = TOUR_COPY[mode];

  const agentPanel = (
    <div className="overflow-hidden rounded-[22px] border border-glass-border bg-ink-mid/80 shadow-glass">
      <div className="flex h-12 items-center justify-between border-b border-glass-border px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-tertiary">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signature-teal shadow-glow-teal" />
          Resume Agent / Ready
        </span>
        <span>{model}</span>
      </div>
      <div className="space-y-4 p-5">
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-fg-tertiary">
          Ask Resume
        </label>
        <div className="flex min-h-[52px] items-center gap-2 rounded-xl border border-glass-borderBright bg-ink-black/40 px-3">
          <Sparkles size={16} className="shrink-0 text-signature-teal" />
          <input
            ref={inputRef}
            value={askInput}
            onChange={(event) => setAskInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') askResume();
            }}
            className="min-w-0 flex-1 bg-transparent text-sm text-fg-primary outline-none placeholder:text-fg-faint"
            placeholder="问一个关于任泓雨履历的问题"
          />
          <button
            type="button"
            onClick={() => askResume()}
            disabled={isAsking || !askInput.trim()}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-signature-teal text-ink-black disabled:opacity-50"
            aria-label="发送问题"
          >
            <Send size={15} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((question) => (
            <button
              type="button"
              key={question}
              onClick={() => askResume(question)}
              disabled={isAsking}
              className="rounded-full border border-glass-border px-3 py-1.5 text-[11px] text-fg-secondary hover:border-signature-teal/50 hover:text-signature-teal disabled:opacity-60"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border-l border-signature-teal/50 bg-glass-light/30 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-signature-teal">
            <Bot size={13} />
            {isAsking ? 'Retrieving -> Matching -> Answering' : `Evidence: ${ragText}`}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-fg-secondary">{answer}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-glass-border bg-ink-black/80 backdrop-blur-2xl no-print">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-3 font-semibold text-fg-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-glass-border bg-glass-light">
              <span className="h-2 w-2 rounded-full bg-signature-teal" />
            </span>
            <span>AIRAINYU</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-fg-tertiary sm:inline">
              / Personal AI OS
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-fg-secondary md:flex">
            <a href="#systems" className="hover:text-fg-primary">代表系统</a>
            <a href="#trajectory" className="hover:text-fg-primary">经历迁移</a>
            <a href="#capabilities" className="hover:text-fg-primary">能力证据</a>
            <a href="#media" className="hover:text-fg-primary">媒体作品</a>
            <a href="#explore" className="hover:text-fg-primary">Explore</a>
          </nav>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hidden items-center gap-2 rounded-full border border-signature-teal/40 px-3 py-2 text-xs text-signature-teal sm:flex"
          >
            <Mail size={14} />
            联系
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="relative overflow-hidden px-5 py-16 sm:py-20 lg:min-h-[760px] lg:py-24">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-signature-teal">
                <span className="h-px w-8 bg-signature-teal" />
                AI Application Engineer · 2026
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-normal text-fg-primary sm:text-6xl lg:text-7xl">
                任泓雨
                <span className="mt-3 block text-signature-teal">Personal AI OS</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-fg-secondary">
                把跨境电商与内容生产流程变成可运行的 AI 工作流。当前推进 ChinaB2C AI 效能平台，覆盖 Listing、A+ 页面、ASIN/链接调研、eBay 数据接入和平台治理。
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onOpenDockChat('请先用一段话做任泓雨的自我介绍，并说明他适合什么岗位。')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-signature-teal px-5 text-sm font-semibold text-ink-black"
                >
                  <MessageSquare size={17} />
                  问我的履历
                </button>
                <a
                  href="#systems"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-glass-border px-5 text-sm font-semibold text-fg-primary hover:border-glass-borderBright"
                >
                  查看代表系统
                  <ArrowDown size={17} />
                </a>
              </div>
              <div className="mt-10 grid gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-tertiary sm:grid-cols-3">
                <span>Agent Systems</span>
                <span>Workflow Automation</span>
                <span>Complex Delivery</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block"
            >
              {agentPanel}
            </motion.div>
          </div>
        </section>

        <section className="border-y border-glass-border px-5 py-12">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_260px]">
            <div className="overflow-hidden rounded-3xl border border-glass-border bg-ink-mid/70 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signature-teal">Evidence Path</div>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-fg-primary">{activeTour.title}</h2>
                </div>
                <div>
                  <p className="max-w-3xl text-sm leading-7 text-fg-secondary">{activeTour.body}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {activeTour.cards.map((card, index) => (
                      <a
                        key={card}
                        href={index === 0 ? '#systems' : index === 1 ? '#capabilities' : '#trajectory'}
                        className="rounded-2xl border border-glass-border bg-glass-light/30 p-4 transition-colors hover:border-signature-teal/40"
                      >
                        <div className="font-mono text-[10px] text-signature-teal">0{index + 1}</div>
                        <div className="mt-5 text-sm font-semibold text-fg-primary">{card}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 grid gap-4 border-t border-glass-border pt-6 md:grid-cols-3">
                {SELF_INTRO.map((item, index) => (
                  <article key={item.title} className="rounded-2xl border border-glass-border bg-ink-black/25 p-5">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-signature-teal">0{index + 1}</span>
                      <span className="h-px w-10 bg-glass-border" />
                    </div>
                    <h3 className="text-base font-semibold text-fg-primary">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-fg-secondary">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="rounded-3xl border border-glass-border bg-ink-mid/80 p-2 no-print lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-1">
                {(Object.keys(TOUR_COPY) as TourMode[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-sm transition-colors ${mode === key ? 'bg-glass-mid text-fg-primary' : 'text-fg-tertiary hover:text-fg-primary'}`}
                  >
                    <span>{TOUR_COPY[key].label}</span>
                    {mode === key && <span className="h-2 w-2 rounded-full bg-signature-teal" />}
                  </button>
                ))}
              </div>
              <div className="mt-2 rounded-2xl border border-glass-border bg-ink-black/30 p-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-signature-teal">
                  <Compass size={13} />
                  当前导览
                </div>
                <p className="mt-3 text-xs leading-6 text-fg-secondary">{activeTour.body}</p>
                <button
                  type="button"
                  onClick={() => onOpenDockChat(activeTour.question)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-signature-teal/40 px-3 py-2 text-xs font-semibold text-signature-teal hover:bg-signature-teal hover:text-ink-black"
                >
                  让 AI 按此路径介绍
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section id="systems" className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-5">
              {SELECTED_SYSTEMS.map((system, index) => (
                <article
                  key={system.id}
                  className="grid overflow-hidden rounded-[24px] border border-glass-border bg-ink-mid/70 lg:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="border-b border-glass-border p-6 lg:border-b-0 lg:border-r lg:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">{system.index}</span>
                      <span className="rounded-full border border-signature-teal/30 bg-signature-teal/10 px-3 py-1 font-mono text-[10px] text-signature-teal">
                        {system.status}
                      </span>
                    </div>
                    <h3 className="mt-10 text-3xl font-semibold text-fg-primary">{system.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-fg-secondary">{system.problem}</p>
                    <div className="mt-6 space-y-4 rounded-2xl border border-glass-border bg-ink-black/25 p-4 text-sm leading-7 text-fg-secondary">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-signature-teal">Previous Workflow</div>
                        <p className="mt-1">{system.previous}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-signature-teal">My Work</div>
                        <p className="mt-1">{system.action}</p>
                      </div>
                    </div>
                    <dl className="mt-6 grid gap-3 text-sm">
                      <div className="grid grid-cols-[76px_1fr] gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-tertiary">Role</dt>
                        <dd className="text-fg-secondary">{system.role}</dd>
                      </div>
                      <div className="grid grid-cols-[76px_1fr] gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-tertiary">Result</dt>
                        <dd className="text-fg-secondary">{system.result}</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {system.tags.map((tag) => (
                        <span key={tag} className="rounded-lg border border-glass-border px-2.5 py-1 font-mono text-[10px] text-fg-tertiary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {system.url && (
                      <a href={system.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-signature-teal">
                        访问应用 <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div className="relative min-h-[360px] bg-ink-black/30 p-6 lg:p-8">
                    <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {system.system.map((step, stepIndex) => (
                        <article key={`${system.id}-${step.title}`} className="relative rounded-2xl border border-glass-border bg-ink-mid/80 p-5">
                          <div className="flex min-h-[56px] items-start gap-4">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-glass-border bg-ink-black/30 font-mono text-sm text-signature-teal">
                              {stepIndex + 1}
                            </div>
                            <h4 className="pt-1 text-sm font-semibold leading-6 text-fg-primary">{step.title}</h4>
                          </div>
                          <p className="mt-8 text-xs leading-6 text-fg-secondary">{step.detail}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trajectory" className="border-y border-glass-border bg-ink-mid/30 px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              kicker="02 / Career Trajectory"
              title="从复杂项目交付，走向 AI 系统构建。"
              body="流程拆解、节点控制和协同交付，是把 AI 从 Demo 推向可运行系统的底层能力。"
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {CAREER_TRAJECTORY.map((item, index) => (
                <article key={item.title} className="rounded-3xl border border-glass-border bg-ink-black/30 p-6">
                  <div className="mb-10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-tertiary">{item.label}</span>
                    <span className="text-signature-teal">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-fg-primary">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-fg-secondary">{item.body}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-glass-light/40 px-2.5 py-1 font-mono text-[10px] text-fg-tertiary">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              kicker="03 / Capability Evidence"
              title="没有虚构百分比，只有可打开的能力证据。"
            />
            <div className="grid overflow-hidden rounded-3xl border border-glass-border md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITY_EVIDENCE.map((capability) => (
                <article key={capability.title} className="border-b border-glass-border bg-ink-mid/50 p-6 md:border-r">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-signature-teal">{capability.count}</span>
                    <CheckCircle2 size={16} className="text-signature-teal" />
                  </div>
                  <h3 className="mt-12 text-xl font-semibold text-fg-primary">{capability.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">{capability.summary}</p>
                  <div className="mt-6 space-y-2 border-t border-glass-border pt-4">
                    {capability.evidence.map((item) => (
                      <div key={item} className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-tertiary">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="border-y border-glass-border bg-ink-mid/30 px-5 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <SectionTitle kicker="04 / Principles" title="让原则进入系统行为。" />
            <div className="divide-y divide-glass-border border-y border-glass-border">
              {PRINCIPLES_IN_PRACTICE.map((principle, index) => (
                <article key={principle.title} className="grid gap-4 py-6 sm:grid-cols-[42px_1fr_150px] sm:items-center">
                  <span className="font-mono text-[11px] text-signature-teal">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-fg-primary">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-fg-secondary">{principle.body}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-tertiary sm:text-right">{principle.case}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-4 left-4 right-20 z-40 flex h-14 items-center justify-between rounded-xl border border-signature-teal/40 bg-ink-mid/95 px-4 text-sm text-fg-primary shadow-glass backdrop-blur-xl md:hidden no-print"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={15} className="text-signature-teal" />
          问我的履历
        </span>
        <Send size={15} className="text-signature-teal" />
      </button>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden no-print">
          <button className="absolute inset-0 bg-black/60" aria-label="关闭问答" onClick={() => setSheetOpen(false)} />
          <aside className="absolute bottom-0 left-0 right-0 max-h-[84vh] overflow-y-auto rounded-t-3xl border border-glass-border bg-ink-black p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-fg-primary">
                <span className="h-2 w-2 rounded-full bg-signature-teal" />
                Resume Agent
              </div>
              <button onClick={() => setSheetOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-glass-border" aria-label="关闭">
                <X size={16} />
              </button>
            </div>
            {agentPanel}
          </aside>
        </div>
      )}
    </>
  );
};
