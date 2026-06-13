import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';

interface UseLazyLoadOptions {
  threshold?: number; // 提前多少像素开始加载
  rootMargin?: string; // Intersection Observer 的 rootMargin
  triggerOnce?: boolean; // 是否只触发一次
}

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLElement>;
  isInView: boolean;
  isLoaded: boolean;
  hasError: boolean;
  retry: () => void;
}

/**
 * 懒加载自定义Hook
 * 使用 Intersection Observer API 检测元素是否进入视口
 */
export const useLazyLoad = (options: UseLazyLoadOptions = {}): UseLazyLoadReturn => {
  const {
    threshold = 200,
    rootMargin = `${threshold}px`,
    triggerOnce = true
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 重试函数
  const retry = useCallback(() => {
    setHasError(false);
    setIsLoaded(false);
    setIsInView(false);
    
    // 重新开始观察
    if (ref.current && observerRef.current) {
      observerRef.current.observe(ref.current);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // 不支持的情况下直接设置为可见
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // 如果设置为只触发一次，则停止观察
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // 如果不是只触发一次，元素离开视口时重置状态
          setIsInView(false);
        }
      },
      {
        rootMargin,
        threshold: 0.1 // 当元素10%可见时触发
      }
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [rootMargin, triggerOnce]);

  // 当进入视口时，标记为已加载（用于外部资源加载完成后调用）
  const markAsLoaded = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  // 标记为加载错误
  const markAsError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref,
    isInView,
    isLoaded,
    hasError,
    retry,
    // 提供给外部使用的标记函数
    markAsLoaded,
    markAsError
  } as UseLazyLoadReturn & {
    markAsLoaded: () => void;
    markAsError: () => void;
  };
};

/**
 * 预加载图片的工具函数
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
};

/**
 * 预加载视频的工具函数
 */
export const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
    
    // 只预加载元数据，不下载整个视频
    video.preload = 'metadata';
    video.src = src;
  });
};