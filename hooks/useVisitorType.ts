import { useState, useCallback, useRef, useEffect } from 'react';
import { VisitorType } from '../types';

const VISITOR_TYPE_KEY = 'ai-resume-visitor-type';
const LOCK_DURATION_MS = 5000;

interface VisitorTypeMap {
  type: VisitorType;
  label: string;
  intro: string;
  suggestedQuestions: string[];
}

export const VISITOR_PROFILES: Record<Exclude<VisitorType, 'unknown'>, VisitorTypeMap> = {
  hr: {
    type: 'hr',
    label: '招聘方',
    intro: '我看你在快速扫描。30 秒精华版：我是任泓雨，AI 应用工程师，5+ 年把 LLM 落地为真实业务。最值得看的是 Query Auto 和宠物健康 AI。',
    suggestedQuestions: [
      '30 秒了解你的核心能力',
      '你做过最有商业价值的项目？',
      '为什么适合 AI 应用工程师岗位？',
      '你的薪资期望和到岗时间？',
    ],
  },
  peer: {
    type: 'peer',
    label: '技术同行',
    intro: '同道中人。我在 RAG / Agent / 评估链路有较深的实战踩坑，节点图里那几个琥珀色的项目藏了挺多技术细节。',
    suggestedQuestions: [
      'Query Auto 的 RAG 架构怎么设计的？',
      '怎么评估 LLM 应用的真实效果？',
      'Agent 多步规划你怎么处理的？',
      '用的什么 embedding 和向量库？',
    ],
  },
  conversational: {
    type: 'conversational',
    label: '对话型访客',
    intro: '直接问吧。我对自己的项目、技术栈、协作方式都很熟，问什么答什么。',
    suggestedQuestions: [
      '你最得意的设计决策是什么？',
      'AI 应用工程师和算法工程师的区别？',
      '平时怎么用 AI 做产品？',
      '你怎么持续学习 AI 的？',
    ],
  },
};

export function useVisitorType() {
  const [type, setType] = useState<VisitorType>('unknown');
  const lockedAtRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(VISITOR_TYPE_KEY);
      if (stored && stored !== 'unknown') {
        setType(stored as VisitorType);
        lockedAtRef.current = Date.now();
      }
    } catch {
      // sessionStorage may be unavailable (private mode)
    }
  }, []);

  const signal = useCallback((action: 'scroll' | 'hover' | 'chat') => {
    if (lockedAtRef.current && Date.now() - lockedAtRef.current < LOCK_DURATION_MS) {
      return;
    }

    const nextType: VisitorType =
      action === 'scroll' ? 'hr' : action === 'hover' ? 'peer' : 'conversational';

    setType(nextType);
    lockedAtRef.current = Date.now();

    try {
      sessionStorage.setItem(VISITOR_TYPE_KEY, nextType);
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setType('unknown');
    lockedAtRef.current = null;
    try {
      sessionStorage.removeItem(VISITOR_TYPE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { type, signal, reset };
}
