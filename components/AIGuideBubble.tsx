import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface AIGuideBubbleProps {
  visible: boolean;
  message: {
    text: string;
    cta: { label: string; question: string } | null;
  } | null;
  onCta: () => void;
  onDismiss: () => void;
}

export const AIGuideBubble: React.FC<AIGuideBubbleProps> = ({
  visible,
  message,
  onCta,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-6 z-30 max-w-[300px] pointer-events-auto no-print"
        >
          <div className="glass-strong rounded-2xl p-4 border border-signature-teal/30 shadow-glow-teal relative">
            <button
              onClick={onDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-fg-tertiary hover:text-fg-primary hover:bg-white/10 transition-colors"
              aria-label="关闭"
            >
              <X size={12} />
            </button>

            <div className="flex items-center gap-1.5 mb-2 text-signature-teal">
              <Sparkles size={11} />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em]">AI GUIDE</span>
            </div>

            <p className="text-xs text-fg-primary leading-relaxed pr-4 mb-3">
              {message.text}
            </p>

            {message.cta && (
              <button
                onClick={onCta}
                className="group w-full text-left px-3 py-2 rounded-lg bg-signature-teal/10 border border-signature-teal/30 hover:bg-signature-teal/20 transition-colors flex items-center justify-between gap-2"
              >
                <span className="text-xs text-signature-teal font-medium leading-snug">
                  {message.cta.label}
                </span>
                <ArrowRight
                  size={12}
                  className="text-signature-teal flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            )}
          </div>

          <div className="absolute -top-1 right-8 w-2 h-2 rotate-45 bg-glass-mid border-l border-t border-signature-teal/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
