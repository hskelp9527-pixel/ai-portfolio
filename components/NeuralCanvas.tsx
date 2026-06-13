import { Suspense, lazy, useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
}

export const NeuralCanvas: React.FC<NeuralCanvasProps> = ({
  theme,
  reducedMotion = false,
  onHoverNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
      if (e.key === 'Escape') setActiveNode(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showParticles = !isMobile && !reducedMotion;
  const particleColor = theme === 'dark' ? '#5eead4' : '#0d9488';

  const hoveredPos = hoveredNode ? positions.get(hoveredNode.id) || null : null;

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full h-screen overflow-hidden"
      aria-label="Neural Canvas"
    >
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Suspense fallback={null}>
            <ParticleField count={theme === 'dark' ? 200 : 160} color={particleColor} />
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
            return (
              <motion.line
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 + strength * 0.25 }}
                transition={{ duration: 0.8, delay: i * 0.02 }}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke={theme === 'dark' ? '#5eead4' : '#0d9488'}
                strokeWidth={0.5 + strength * 1.5}
              />
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
        className="absolute bottom-6 right-6 font-mono text-[10px] text-fg-tertiary pointer-events-none flex items-center gap-2"
        style={{ zIndex: 8 }}
      >
        <span className="text-signature-teal animate-pulse">●</span>
        <span>HOVER · CLICK · ESC</span>
      </motion.div>

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
