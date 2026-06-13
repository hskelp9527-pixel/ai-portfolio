import { useState, useRef, useCallback, useEffect } from 'react';
import { VISITOR_PROFILES } from './useVisitorType';
import { VisitorType, GraphNode } from '../types';

const MAX_PROACTIVE_TALKS = 2;
const HOVER_TRIGGER_MS = 3000;
const FIRST_VISIT_DELAY_MS = 5000;
const DISMISS_KEY = 'ai-resume-guide-dismissed';

interface AIGuideMessage {
  text: string;
  cta: { label: string; question: string } | null;
}

interface UseAIGuideOptions {
  visitorType: VisitorType;
  hoveredNode: GraphNode | null;
  onAskQuestion: (question: string) => void;
}

interface UseAIGuideReturn {
  visible: boolean;
  message: AIGuideMessage | null;
  dismiss: () => void;
  triggerFirstVisit: () => void;
  acceptCta: () => void;
}

export function useAIGuide({
  visitorType,
  hoveredNode,
  onAskQuestion,
}: UseAIGuideOptions): UseAIGuideReturn {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<AIGuideMessage | null>(null);
  const proactiveCountRef = useRef(0);
  const dismissedRef = useRef(false);
  const hoverTimerRef = useRef<number | null>(null);
  const lastHoveredIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      dismissedRef.current = sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      // ignore
    }
  }, []);

  const canShow = useCallback(() => {
    if (dismissedRef.current) return false;
    if (proactiveCountRef.current >= MAX_PROACTIVE_TALKS) return false;
    return true;
  }, []);

  const triggerFirstVisit = useCallback(() => {
    if (!canShow()) return;
    const profile = visitorType === 'unknown' ? null : VISITOR_PROFILES[visitorType];
    proactiveCountRef.current += 1;
    setVisible(true);
    setMessage({
      text: profile
        ? profile.intro
        : '想了解我的哪一面？节点图可以悬停，也可以直接问我。',
      cta: profile
        ? { label: profile.suggestedQuestions[0], question: profile.suggestedQuestions[0] }
        : null,
    });
  }, [canShow, visitorType]);

  const triggerNodeSuggestion = useCallback(
    (node: GraphNode) => {
      if (!canShow()) return;
      proactiveCountRef.current += 1;
      setVisible(true);
      const question =
        node.cluster === 'projects'
          ? `${node.label} 的最大技术亮点是什么？`
          : node.cluster === 'skills'
          ? `你在 ${node.label} 上踩过哪些坑？`
          : node.cluster === 'philosophy'
          ? `展开讲讲"${node.label}"这个观点`
          : node.cluster === 'timeline'
          ? `${node.label} 那段经历你学到了什么？`
          : `详细说说 ${node.label}`;
      setMessage({
        text: `聚焦在「${node.label}」。要不要我帮你打开这个节点的细节？`,
        cta: { label: question, question },
      });
    },
    [canShow]
  );

  const dismiss = useCallback(() => {
    setVisible(false);
    setMessage(null);
    dismissedRef.current = true;
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const acceptCta = useCallback(() => {
    if (message?.cta) {
      onAskQuestion(message.cta.question);
    }
    setVisible(false);
    setMessage(null);
  }, [message, onAskQuestion]);

  useEffect(() => {
    if (dismissedRef.current) return;

    if (hoveredNode?.id === lastHoveredIdRef.current) {
      return;
    }
    lastHoveredIdRef.current = hoveredNode?.id || null;

    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (hoveredNode && hoveredNode.type !== 'center') {
      hoverTimerRef.current = window.setTimeout(() => {
        triggerNodeSuggestion(hoveredNode);
      }, HOVER_TRIGGER_MS);
    }

    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
  }, [hoveredNode, triggerNodeSuggestion]);

  return {
    visible,
    message,
    dismiss,
    triggerFirstVisit,
    acceptCta,
  };
}
