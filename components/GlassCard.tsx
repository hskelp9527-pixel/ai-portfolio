import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { GraphNode } from '../types';
import { NodePosition } from '../hooks/useNodeGraph';

interface HoverCardProps {
  node: GraphNode | null;
  position: NodePosition | null;
  canvasWidth?: number;
}

export const HoverCard: React.FC<HoverCardProps> = ({ node, position, canvasWidth = 1920 }) => {
  const showRight = position ? position.x < canvasWidth / 2 : true;
  return (
    <AnimatePresence>
      {node && position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute glass-strong rounded-2xl p-4 pointer-events-none max-w-[260px]"
          style={{
            left: showRight ? position.x + 60 : position.x - 320,
            top: position.y - 20,
            zIndex: 30,
          }}
        >
          <div className="font-display font-semibold text-fg-primary text-sm mb-1.5">
            {node.label}
          </div>
          <div className="font-mono text-[9px] text-signature-teal uppercase tracking-[0.2em] mb-2">
            {node.cluster} · L{node.importance}
          </div>
          <div className="text-xs text-fg-secondary leading-relaxed">
            {node.summary}
          </div>
          {node.tags && node.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {node.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-fg-tertiary border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: 'oklch(0.04 0.01 250 / 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong rounded-3xl p-8 md:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto neural-scrollbar relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-fg-tertiary hover:text-fg-primary hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signature-teal mb-3">
              {node.cluster} · {node.type}
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-fg-primary mb-4 pr-12">
              {node.label}
            </h2>
            <p className="text-sm md:text-base text-fg-secondary leading-relaxed mb-5 whitespace-pre-line">
              {node.detail || node.summary}
            </p>
            {node.tags && node.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-fg-secondary border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {node.url && (
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-signature-teal/15 border border-signature-teal/50 text-signature-teal hover:bg-signature-teal/25 transition-colors text-sm font-mono"
              >
                <ExternalLink size={14} />
                访问项目
              </a>
            )}
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-fg-tertiary">
              ESC 关闭 · 点击空白处关闭
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
