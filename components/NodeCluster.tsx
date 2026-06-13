import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraphNode, NodeAccent } from '../types';
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
    bg: 'oklch(0.20 0.05 165 / 0.4)',
    ring: 'oklch(0.78 0.18 165 / 0.7)',
    text: 'oklch(0.95 0.05 165)',
  },
  amber: {
    bg: 'oklch(0.22 0.06 50 / 0.4)',
    ring: 'oklch(0.75 0.20 50 / 0.7)',
    text: 'oklch(0.95 0.05 50)',
  },
  default: {
    bg: 'oklch(0.20 0.02 250 / 0.35)',
    ring: 'oklch(0.45 0.02 250 / 0.5)',
    text: 'oklch(0.88 0.01 250)',
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
                  ? '0 0 60px oklch(0.78 0.18 165 / 0.5)'
                  : 'none',
              }}
            >
              <div
                className={isCenter ? 'font-bold leading-tight px-3' : 'font-medium leading-tight px-2'}
                style={{
                  fontSize: isCenter ? 16 : Math.max(10, size / 7),
                  color: accent.text,
                }}
              >
                {node.label}
              </div>

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
                        border: '1px dashed oklch(0.78 0.18 165 / 0.25)',
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
                      boxShadow: '0 0 0 2px oklch(0.78 0.18 165 / 0.4)',
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
                            background: 'oklch(0.78 0.18 165)',
                            boxShadow: '0 0 8px oklch(0.78 0.18 165 / 0.8)',
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
