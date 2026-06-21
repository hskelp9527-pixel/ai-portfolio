import { Suspense, lazy, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GRAPH_NODES, GRAPH_EDGES } from '../data';
import { Theme, GraphNode } from '../types';
import { useNodeGraph } from '../hooks/useNodeGraph';
import { NodeCluster } from './NodeCluster';
import { HoverCard, DetailPanel } from './GlassCard';

const ParticleField = lazy(() => import('../three/ParticleField'));

interface NeuralCanvasProps {
  theme: Theme;
  reducedMotion?: boolean;
  onHoverNode?: (node: GraphNode | null) => void;
  onSpaceTour?: () => void;
}

export const NeuralCanvas: React.FC<NeuralCanvasProps> = ({
  theme,
  reducedMotion = false,
  onHoverNode,
  onSpaceTour,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const positions = useNodeGraph(GRAPH_NODES, GRAPH_EDGES, dimensions.width, dimensions.height);

  const handleHover = useCallback(
    (id: string | null) => {
      if (!id) {
        setHoveredNode(null);
        onHoverNode?.(null);
        return;
      }
      const node = GRAPH_NODES.find((n) => n.id === id) || null;
      setHoveredNode(node);
      onHoverNode?.(node);
    },
    [onHoverNode]
  );

  const handleClick = useCallback((id: string) => {
    const node = GRAPH_NODES.find((n) => n.id === id) || null;
    setActiveNode(node);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveNode(null);
        setShowHelp(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (inEditable) return;
      if (e.code === 'Space') {
        e.preventDefault();
        onSpaceTour?.();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowHelp(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSpaceTour]);

  const showParticles = !isMobile && !reducedMotion;
  const particleColor = theme === 'dark' ? '#5eead4' : '#0d9488';

  const hoveredPos = hoveredNode ? positions.get(hoveredNode.id) || null : null;

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full h-screen overflow-hidden no-print hidden md:block"
      aria-label="Neural Canvas"
    >
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Suspense fallback={null}>
            <ParticleField color={particleColor} />
          </Suspense>
          <div
            className="absolute inset-0"
            style={{
              background:
                theme === 'dark'
                  ? 'radial-gradient(circle at 50% 50%, transparent 0%, oklch(0.04 0.01 250 / 0.5) 80%)'
                  : 'radial-gradient(circle at 50% 50%, transparent 0%, oklch(0.12 0.02 250 / 0.4) 80%)',
            }}
          />
        </div>
      )}

      {dimensions.width > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width}
          height={dimensions.height}
          style={{ zIndex: 5 }}
          aria-hidden="true"
        >
          {GRAPH_EDGES.map((edge, i) => {
            const s = positions.get(edge.source);
            const t = positions.get(edge.target);
            if (!s || !t) return null;
            const strength = edge.strength ?? 0.5;
            const lineColor = theme === 'dark' ? '#5eead4' : '#0d9488';
            const dots = strength >= 0.7 ? 2 : 1;
            const dotDuration = 5 - strength * 2;
            const dotRadius = strength >= 0.9 ? 3 : 2;
            return (
              <g key={`edge-${i}`}>
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 + strength * 0.25 }}
                  transition={{ duration: 0.8, delay: i * 0.02 }}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={lineColor}
                  strokeWidth={0.5 + strength * 1.5}
                />
                {!reducedMotion &&
                  Array.from({ length: dots }).map((_, di) => (
                    <motion.circle
                      key={`dot-${i}-${di}`}
                      r={dotRadius}
                      fill={lineColor}
                      initial={{ cx: s.x, cy: s.y, opacity: 0 }}
                      animate={{
                        cx: [s.x, t.x],
                        cy: [s.y, t.y],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: dotDuration,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear',
                        delay: (di / dots) * dotDuration + (i % 7) * 0.3,
                      }}
                      style={{ filter: `drop-shadow(0 0 4px ${lineColor})` }}
                    />
                  ))}
              </g>
            );
          })}
        </svg>
      )}

      {dimensions.width > 0 && (
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          <NodeCluster
            nodes={GRAPH_NODES}
            positions={positions}
            hoveredId={hoveredNode?.id || null}
            activeId={activeNode?.id || null}
            onHover={handleHover}
            onClick={handleClick}
          />
        </div>
      )}

      <HoverCard node={hoveredNode} position={hoveredPos} canvasWidth={dimensions.width} />

      <DetailPanel node={activeNode} onClose={() => setActiveNode(null)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 right-6 font-mono text-[10px] text-fg-tertiary pointer-events-none flex flex-col items-end gap-1.5"
        style={{ zIndex: 8 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-signature-teal animate-pulse">●</span>
          <span>HOVER · CLICK · ESC</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-glass-mid border border-glass-border text-fg-secondary">Space</kbd>
          <span className="opacity-70">自动导览</span>
          <span className="opacity-40 mx-0.5">·</span>
          <kbd className="px-1.5 py-0.5 rounded bg-glass-mid border border-glass-border text-fg-secondary">?</kbd>
          <span className="opacity-70">帮助</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            style={{
              zIndex: 50,
              background: theme === 'dark' ? 'oklch(0.04 0.01 250 / 0.7)' : 'oklch(0.96 0.01 80 / 0.7)',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-md border border-glass-borderBright shadow-glass cursor-auto"
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-fg-primary">节点图操作说明</h3>
                <button
                  className="text-fg-tertiary hover:text-fg-primary text-lg leading-none"
                  onClick={() => setShowHelp(false)}
                  aria-label="关闭"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5 text-sm">
                <div>
                  <div className="text-signature-teal font-semibold mb-2 uppercase tracking-[0.2em] text-[10px]">
                    节点交互
                  </div>
                  <ul className="space-y-1.5 text-fg-secondary">
                    <li>· 悬停节点：预览信息卡片</li>
                    <li>· 点击节点：查看完整详情</li>
                    <li>· 同节点悬停 3 秒：AI 主动建议</li>
                  </ul>
                </div>

                <div>
                  <div className="text-signature-teal font-semibold mb-2 uppercase tracking-[0.2em] text-[10px]">
                    快捷键
                  </div>
                  <ul className="space-y-1.5 text-fg-secondary">
                    <li className="flex items-center gap-2">
                      <kbd className="px-1.5 py-0.5 rounded bg-glass-mid border border-glass-border font-mono text-[10px]">Space</kbd>
                      <span>触发 AI 自动导览</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-1.5 py-0.5 rounded bg-glass-mid border border-glass-border font-mono text-[10px]">?</kbd>
                      <span>打开本面板</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <kbd className="px-1.5 py-0.5 rounded bg-glass-mid border border-glass-border font-mono text-[10px]">ESC</kbd>
                      <span>关闭面板 / 详情</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-signature-teal font-semibold mb-2 uppercase tracking-[0.2em] text-[10px]">
                    AI 对话
                  </div>
                  <ul className="space-y-1.5 text-fg-secondary">
                    <li>· 右侧 dock：输入问题 + 回车</li>
                    <li>· 首访 5 秒：AI 主动问候</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-6 left-6 font-mono text-[10px] text-fg-tertiary pointer-events-none"
        style={{ zIndex: 8 }}
      >
        <div className="text-signature-teal mb-1">NEURAL CANVAS</div>
        <div>v2.0 · {GRAPH_NODES.length} NODES · {GRAPH_EDGES.length} EDGES</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-fg-tertiary pointer-events-none flex flex-col items-center gap-2"
        style={{ zIndex: 8 }}
      >
        <span className="uppercase tracking-[0.3em]">向下滚动 · SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-6 bg-gradient-to-b from-signature-teal to-transparent"
        />
      </motion.div>
    </section>
  );
};
