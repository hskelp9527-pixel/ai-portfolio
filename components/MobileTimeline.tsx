import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GRAPH_NODES } from '../data';
import { Theme, NodeCluster } from '../types';

interface MobileTimelineProps {
  theme: Theme;
  onAskQuestion: (question: string) => void;
}

const CLUSTER_LABEL: Record<NodeCluster, string> = {
  center: '中心',
  projects: '作品',
  skills: '技能',
  philosophy: '理念',
  timeline: '经历',
};

const CLUSTER_COLOR: Record<NodeCluster, string> = {
  center: 'oklch(0.78 0.18 165)',
  projects: 'oklch(0.75 0.20 50)',
  skills: 'oklch(0.78 0.18 165)',
  philosophy: 'oklch(0.70 0.10 250)',
  timeline: 'oklch(0.78 0.18 165)',
};

export const MobileTimeline: React.FC<MobileTimelineProps> = ({
  theme,
  onAskQuestion,
}) => {
  const ordered = [...GRAPH_NODES].sort((a, b) => {
    if (a.type === 'center') return -1;
    if (b.type === 'center') return 1;
    const order: Record<NodeCluster, number> = {
      center: 0,
      projects: 1,
      skills: 2,
      philosophy: 3,
      timeline: 4,
    };
    const c = order[a.cluster] - order[b.cluster];
    if (c !== 0) return c;
    return b.importance - a.importance;
  });

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="md:hidden relative w-full min-h-[80vh] px-5 py-10 no-print"
      style={{
        background:
          theme === 'dark'
            ? 'radial-gradient(circle at 50% 0%, oklch(0.18 0.03 250) 0%, oklch(0.12 0.02 250) 60%)'
            : 'radial-gradient(circle at 50% 0%, oklch(0.96 0.01 250) 0%, oklch(0.92 0.01 250) 60%)',
      }}
      aria-label="Mobile Resume Timeline"
    >
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-signature-teal mb-2"
        >
          NEURAL CANVAS · MOBILE
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-3xl text-fg-primary leading-tight"
        >
          任泓雨
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-fg-secondary mt-1.5"
        >
          AI 应用工程师 · 用 AI 重塑生产力
        </motion.p>
      </div>

      <div className="relative pl-6">
        <div
          className="absolute left-2 top-2 bottom-2 w-px"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.78 0.18 165 / 0.6), oklch(0.78 0.18 165 / 0.1))',
          }}
        />

        <div className="space-y-3">
          {ordered.map((node, i) => {
            if (node.type === 'center') return null;
            const color = CLUSTER_COLOR[node.cluster];
            const isAmber = node.accent === 'amber';
            return (
              <motion.button
                key={node.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.3, duration: 0.4 }}
                onClick={() =>
                  onAskQuestion(
                    node.cluster === 'projects'
                      ? `${node.label} 的最大技术亮点是什么？`
                      : node.cluster === 'skills'
                      ? `你在 ${node.label} 上踩过哪些坑？`
                      : node.cluster === 'philosophy'
                      ? `展开讲讲"${node.label}"`
                      : `${node.label} 这段经历你学到了什么？`
                  )
                }
                className="group relative w-full text-left"
              >
                <div
                  className="absolute -left-[18px] top-3 w-2 h-2 rounded-full"
                  style={{
                    background: isAmber
                      ? 'oklch(0.75 0.20 50)'
                      : color,
                    boxShadow: `0 0 8px ${isAmber ? 'oklch(0.75 0.20 50 / 0.6)' : 'oklch(0.78 0.18 165 / 0.6)'}`,
                  }}
                />
                <div className="glass rounded-xl p-3.5 border border-glass-border group-hover:border-signature-teal/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="font-display font-semibold text-sm text-fg-primary leading-tight">
                      {node.label}
                    </div>
                    <ChevronRight
                      size={12}
                      className="text-fg-tertiary group-hover:text-signature-teal group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5"
                    />
                  </div>
                  <div
                    className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2"
                    style={{ color: isAmber ? 'oklch(0.75 0.20 50)' : color }}
                  >
                    {CLUSTER_LABEL[node.cluster]} · L{node.importance}
                  </div>
                  <p className="text-xs text-fg-secondary leading-relaxed">
                    {node.summary}
                  </p>
                  {node.tags && node.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {node.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-fg-tertiary border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center font-mono text-[10px] text-fg-tertiary">
        <span className="text-signature-teal animate-pulse">●</span>{' '}
        点击任意节点问 AI
      </div>
    </motion.section>
  );
};
