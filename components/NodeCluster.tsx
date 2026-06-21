import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Folder, Zap, Lightbulb, Calendar, type LucideIcon } from 'lucide-react';
import { GraphNode, NodeAccent, NodeCluster as ClusterType } from '../types';
import { NodePosition } from '../hooks/useNodeGraph';

interface NodeClusterProps {
  nodes: GraphNode[];
  positions: Map<string, NodePosition>;
  hoveredId: string | null;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}

const accentConfig: Record<NodeAccent, { bg: string; ring: string; text: string }> = {
  teal: {
    bg: 'oklch(var(--color-signature-teal) / 0.18)',
    ring: 'oklch(var(--color-signature-teal) / 0.7)',
    text: 'oklch(var(--color-fg-primary))',
  },
  amber: {
    bg: 'oklch(var(--color-signature-amber) / 0.18)',
    ring: 'oklch(var(--color-signature-amber) / 0.7)',
    text: 'oklch(var(--color-fg-primary))',
  },
  default: {
    bg: 'oklch(var(--color-glass-mid) / 0.5)',
    ring: 'oklch(var(--color-glass-border-bright) / 0.6)',
    text: 'oklch(var(--color-fg-primary))',
  },
};

function nodeSize(importance: number, type: string): number {
  if (type === 'center') return 120;
  return Math.max(44, 28 + importance * 5);
}

function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const SATELLITE_ANGLES = [0, 120, 240];
const SATELLITE_RADIUS = 80;
const SATELLITE_DURATIONS = [8, 10, 12];

const CLUSTER_ICON: Record<ClusterType, LucideIcon | null> = {
  center: null,
  projects: Folder,
  skills: Zap,
  philosophy: Lightbulb,
  timeline: Calendar,
};

export const NodeCluster: React.FC<NodeClusterProps> = ({
  nodes,
  positions,
  hoveredId,
  activeId,
  onHover,
  onClick,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {nodes.map((node) => {
        const pos = positions.get(node.id);
        if (!pos) return null;

        const size = nodeSize(node.importance, node.type);
        const isHovered = hoveredId === node.id;
        const isActive = activeId === node.id;
        const isDimmed = (hoveredId !== null && !isHovered) || (activeId !== null && !isActive);
        const accent = accentConfig[node.accent || 'default'];
        const isCenter = node.type === 'center';

        const seed = hashSeed(node.id);
        const breathDuration = 2 + (seed % 3); // 2-4s 错峰
        const breathDelay = (seed % 2000) / 1000;

        const breathActive = !prefersReducedMotion && !isHovered && !isActive;

        const scaleValue = isHovered
          ? 1.15
          : isActive
          ? 1.25
          : breathActive
          ? [1, 1.04, 1]
          : 1;

        const scaleTransition = breathActive
          ? {
              duration: breathDuration,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: breathDelay,
            }
          : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const };

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: isDimmed ? 0.25 : 1,
              scale: scaleValue,
              x: pos.x - size / 2,
              y: pos.y - size / 2,
            }}
            transition={{
              opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              scale: scaleTransition,
              x: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(node.id)}
            className="absolute cursor-pointer select-none"
            style={{
              width: size,
              height: size,
              zIndex: isHovered || isActive ? 20 : 10,
              willChange: 'transform',
            }}
          >
            <div
              className={`relative w-full h-full rounded-full flex items-center justify-center text-center font-display overflow-visible ${
                isCenter ? 'shadow-glow-teal-strong' : ''
              }`}
              style={{
                background: accent.bg,
                border: `1.5px solid ${accent.ring}`,
                backdropFilter: 'blur(16px) saturate(150%)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                boxShadow: isHovered
                  ? `0 0 30px ${accent.ring}`
                  : isCenter
                  ? '0 0 60px oklch(var(--color-signature-teal) / 0.5)'
                  : 'none',
              }}
            >
              <div
                className={isCenter ? 'font-bold leading-tight px-2 flex flex-col items-center gap-0.5' : 'font-medium leading-tight px-2'}
                style={{
                  fontSize: isCenter ? 16 : Math.max(10, size / 7),
                  color: accent.text,
                }}
              >
                {isCenter ? (
                  <>
                    <span style={{ fontSize: 16, lineHeight: 1.1 }}>{node.label}</span>
                    {node.subtitle && (
                      <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.72, marginTop: 2 }}>
                        {node.subtitle}
                      </span>
                    )}
                    {node.tagline && (
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 400,
                          opacity: 0.55,
                          letterSpacing: '0.08em',
                          marginTop: 1,
                        }}
                      >
                        {node.tagline}
                      </span>
                    )}
                  </>
                ) : (
                  node.label
                )}
              </div>

              {!isCenter && (
                <>
                  <div
                    className="absolute font-mono pointer-events-none transition-opacity duration-200"
                    style={{
                      top: Math.max(2, size * 0.06),
                      right: Math.max(4, size * 0.1),
                      fontSize: 9,
                      fontWeight: 600,
                      opacity: isHovered ? 0 : 0.55,
                      color: accent.text,
                    }}
                  >
                    L{node.importance}
                  </div>
                  {(() => {
                    const Icon = CLUSTER_ICON[node.cluster];
                    if (!Icon) return null;
                    return (
                      <div
                        className="absolute pointer-events-none transition-opacity duration-200"
                        style={{
                          bottom: Math.max(2, size * 0.06),
                          left: Math.max(4, size * 0.1),
                          opacity: isHovered ? 0 : 0.5,
                          color: accent.text,
                        }}
                      >
                        <Icon size={10} />
                      </div>
                    );
                  })()}
                </>
              )}

              {!isCenter && (
                <AnimatePresence>
                  {isHovered && !prefersReducedMotion && (
                    <motion.div
                      key={`ripple-${node.id}`}
                      className="absolute inset-0 rounded-full pointer-events-none"
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{
                        border: `2px solid ${accent.ring}`,
                      }}
                    />
                  )}
                </AnimatePresence>
              )}

              {isCenter && (
                <>
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        inset: -30,
                        border: '1px dashed oklch(var(--color-signature-teal) / 0.25)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    animate={
                      prefersReducedMotion
                        ? { opacity: 0.4 }
                        : { scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    }
                    style={{
                      boxShadow: '0 0 0 2px oklch(var(--color-signature-teal) / 0.4)',
                    }}
                  />

                  {!prefersReducedMotion &&
                    SATELLITE_ANGLES.map((startAngle, i) => (
                      <motion.div
                        key={`satellite-${i}`}
                        className="absolute top-1/2 left-1/2 pointer-events-none"
                        style={{ width: 0, height: 0, willChange: 'transform' }}
                        animate={{ rotate: [startAngle, startAngle + 360] }}
                        transition={{
                          duration: SATELLITE_DURATIONS[i],
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'oklch(var(--color-signature-teal))',
                            boxShadow: '0 0 8px oklch(var(--color-signature-teal) / 0.8)',
                            transform: `translateX(${SATELLITE_RADIUS}px) translateY(-3px)`,
                          }}
                        />
                      </motion.div>
                    ))}
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
